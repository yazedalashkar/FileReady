import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';

// Initialize PDF.js worker using Vite asset URL with CDN fallback
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  } catch {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
}

/**
 * Fine-grained 16-level compression spectrum.
 * Spans from maximum clarity down to the minimum safe readability floor.
 * Boundaries: scale 0.58–1.80, JPEG quality 0.30–0.85
 */
export const COMPRESSION_TIERS = [
  { scale: 1.80, quality: 0.85, label: 'Tier 0 (1.80x / Q85 — Ultra)' },
  { scale: 1.65, quality: 0.82, label: 'Tier 1 (1.65x / Q82 — Very High)' },
  { scale: 1.50, quality: 0.78, label: 'Tier 2 (1.50x / Q78 — High)' },
  { scale: 1.40, quality: 0.74, label: 'Tier 3 (1.40x / Q74 — High)' },
  { scale: 1.30, quality: 0.70, label: 'Tier 4 (1.30x / Q70 — Medium High)' },
  { scale: 1.20, quality: 0.66, label: 'Tier 5 (1.20x / Q66 — Medium High)' },
  { scale: 1.10, quality: 0.62, label: 'Tier 6 (1.10x / Q62 — Medium)' },
  { scale: 1.00, quality: 0.58, label: 'Tier 7 (1.00x / Q58 — Medium)' },
  { scale: 0.92, quality: 0.54, label: 'Tier 8 (0.92x / Q54 — Medium Low)' },
  { scale: 0.85, quality: 0.50, label: 'Tier 9 (0.85x / Q50 — Medium Low)' },
  { scale: 0.80, quality: 0.45, label: 'Tier 10 (0.80x / Q45 — Economy)' },
  { scale: 0.75, quality: 0.42, label: 'Tier 11 (0.75x / Q42 — Economy)' },
  { scale: 0.70, quality: 0.38, label: 'Tier 12 (0.70x / Q38 — Compact)' },
  { scale: 0.66, quality: 0.35, label: 'Tier 13 (0.66x / Q35 — Compact)' },
  { scale: 0.62, quality: 0.32, label: 'Tier 14 (0.62x / Q32 — Max Safe)' },
  { scale: 0.58, quality: 0.30, label: 'Tier 15 (0.58x / Q30 — Readability Floor)' },
];

/**
 * Analyzes compression severity based on required reduction ratio
 */
export function calculateSeverity(fileSize, targetMB) {
  if (!fileSize || !targetMB || targetMB <= 0) {
    return { level: 'UNKNOWN', label: '—', reductionPercent: 0, isRequired: false };
  }

  const targetBytes = targetMB * 1024 * 1024;
  if (fileSize <= targetBytes) {
    return { level: 'NONE', label: 'Already compliant', reductionPercent: 0, isRequired: false };
  }

  const reductionPercent = Math.min(99, Math.round(((fileSize - targetBytes) / fileSize) * 100));

  if (reductionPercent <= 35) {
    return { level: 'LIGHT', label: 'Light', reductionPercent, isRequired: true };
  } else if (reductionPercent <= 65) {
    return { level: 'MEDIUM', label: 'Medium', reductionPercent, isRequired: true };
  } else {
    return { level: 'STRONG', label: 'Strong', reductionPercent, isRequired: true };
  }
}

/**
 * Reads basic PDF metadata (page count)
 */
export async function getPdfInfo(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });
  const pdfDoc = await loadingTask.promise;
  return {
    numPages: pdfDoc.numPages,
  };
}

/**
 * Maps available budget per page (in bytes) to an optimal starting tier index.
 * Ensures that 11 MB -> 2 MB and 11 MB -> 1 MB start at distinctly different tiers.
 */
export function getInitialTierIndex(budgetPerPageBytes) {
  const kb = budgetPerPageBytes / 1024;
  if (kb >= 900) return 0;
  if (kb >= 700) return 1;
  if (kb >= 550) return 2;
  if (kb >= 420) return 3; // e.g. 2 MB / 4 pages (~470 KB) starts here
  if (kb >= 320) return 4;
  if (kb >= 240) return 5;
  if (kb >= 180) return 6; // e.g. 1 MB / 4 pages (~235 KB) starts here
  if (kb >= 130) return 7;
  if (kb >= 95) return 8;
  if (kb >= 70) return 9;
  if (kb >= 50) return 10;
  if (kb >= 38) return 11;
  if (kb >= 28) return 12;
  if (kb >= 20) return 13;
  if (kb >= 14) return 14;
  return 15;
}

/**
 * Adaptive, target-driven PDF compression engine.
 * Searches for the highest-quality candidate satisfying: outputSize <= targetBytes
 */
export async function compressPdf(file, targetMB, onProgress) {
  const targetBytes = Math.round(targetMB * 1024 * 1024);

  if (file.size <= targetBytes) {
    throw new Error('This file is already within the requested target size.');
  }

  onProgress?.({
    stage: 'Analyzing document structure...',
    percent: 5,
    attempt: 1,
    totalAttempts: 4,
  });

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  if (numPages === 0) {
    throw new Error('The selected PDF contains no readable pages.');
  }

  // Account for PDF structure overhead (~10 KB + ~1.5 KB per page)
  const overhead = 10240 + numPages * 1536;
  const usableTargetBytes = Math.max(targetBytes * 0.90, targetBytes - overhead);
  const budgetPerPage = usableTargetBytes / numPages;

  const MAX_CANVAS_DIM = 2048;

  // Renders all pages sequentially and packages them into a clean PDF via pdf-lib
  async function renderAndAssemble(scale, quality, attemptNumber, totalAttempts) {
    const newPdf = await PDFDocument.create();

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const pagePercent = Math.round(
        10 + ((pageNum - 1) / numPages) * 75
      );
      onProgress?.({
        stage: `Rendering page ${pageNum} of ${numPages} (Attempt ${attemptNumber})...`,
        percent: pagePercent,
        attempt: attemptNumber,
        totalAttempts,
      });

      const page = await pdf.getPage(pageNum);
      const origViewport = page.getViewport({ scale: 1.0 });
      const origWidth = origViewport.width;
      const origHeight = origViewport.height;

      // Cap dimensions to prevent mobile RAM crashes
      let effectiveScale = scale;
      if (origWidth * effectiveScale > MAX_CANVAS_DIM || origHeight * effectiveScale > MAX_CANVAS_DIM) {
        effectiveScale = Math.min(MAX_CANVAS_DIM / origWidth, MAX_CANVAS_DIM / origHeight);
      }

      const viewport = page.getViewport({ scale: effectiveScale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      const ctx = canvas.getContext('2d', { alpha: false });
      // White background prevents transparent scans turning solid black in JPEG
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;

      // Encode page to JPEG
      const jpegBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', quality);
      });

      // Free mobile canvas memory immediately
      canvas.width = 0;
      canvas.height = 0;

      // Clean up PDF.js page operator cache
      if (typeof page.cleanup === 'function') {
        page.cleanup();
      }

      if (!jpegBlob) {
        throw new Error(`Failed to encode page ${pageNum} to JPEG.`);
      }

      const jpegBytes = await jpegBlob.arrayBuffer();
      const embeddedImage = await newPdf.embedJpg(jpegBytes);
      const newPage = newPdf.addPage([origWidth, origHeight]);
      newPage.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: origWidth,
        height: origHeight,
      });
    }

    onProgress?.({
      stage: `Verifying file size (Attempt ${attemptNumber})...`,
      percent: 92,
      attempt: attemptNumber,
      totalAttempts,
    });

    return await newPdf.save();
  }

  // --- TARGET-DRIVEN ADAPTIVE SEARCH ---
  const MAX_ATTEMPTS = 4;
  let currentTierIndex = getInitialTierIndex(budgetPerPage);

  let bestCompliantBytes = null;
  let bestCompliantSize = 0;
  let bestCompliantTier = null;

  let smallestBytes = null;
  let smallestSize = Infinity;
  let smallestTier = null;

  let attemptsExecuted = 0;
  const evaluatedTiers = new Set();

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    attemptsExecuted = attempt;
    evaluatedTiers.add(currentTierIndex);
    const tier = COMPRESSION_TIERS[currentTierIndex];

    onProgress?.({
      stage: `Optimizing candidate ${tier.label}...`,
      percent: 8,
      attempt,
      totalAttempts: MAX_ATTEMPTS,
    });

    const pdfBytes = await renderAndAssemble(tier.scale, tier.quality, attempt, MAX_ATTEMPTS);
    const actualSize = pdfBytes.length;

    // Track the absolute smallest candidate (fallback if target cannot be achieved)
    if (actualSize < smallestSize) {
      smallestSize = actualSize;
      smallestBytes = pdfBytes;
      smallestTier = tier;
    }

    if (actualSize <= targetBytes) {
      // Constraint satisfied!
      // Keep this as best compliant candidate if larger/better quality than previous compliant candidate
      if (bestCompliantBytes === null || actualSize > bestCompliantSize) {
        bestCompliantBytes = pdfBytes;
        bestCompliantSize = actualSize;
        bestCompliantTier = tier;
      }

      // Check if we have substantial headroom to try one step higher quality
      // Only do this on attempt 1 if headroom > 25% and we aren't already at tier 0
      if (attempt === 1 && actualSize < targetBytes * 0.75 && currentTierIndex > 0) {
        const higherTierIndex = Math.max(0, currentTierIndex - 2);
        if (!evaluatedTiers.has(higherTierIndex)) {
          currentTierIndex = higherTierIndex;
          continue;
        }
      }

      // We have found a candidate that satisfies targetBytes
      break;
    } else {
      // actualSize > targetBytes: We need more compression
      if (currentTierIndex >= COMPRESSION_TIERS.length - 1) {
        // Already at the minimum safe quality floor (Tier 15)
        break;
      }

      // Calculate overshoot factor to determine next tier jump
      const overshootRatio = actualSize / targetBytes;
      let stepDown = 1;
      if (overshootRatio > 2.2) {
        stepDown = 4;
      } else if (overshootRatio > 1.6) {
        stepDown = 3;
      } else if (overshootRatio > 1.25) {
        stepDown = 2;
      }

      let nextIndex = Math.min(COMPRESSION_TIERS.length - 1, currentTierIndex + stepDown);
      if (evaluatedTiers.has(nextIndex)) {
        nextIndex = Math.min(COMPRESSION_TIERS.length - 1, nextIndex + 1);
      }

      if (evaluatedTiers.has(nextIndex)) {
        // No unvisited tighter tiers available
        break;
      }

      currentTierIndex = nextIndex;
    }
  }

  onProgress?.({
    stage: 'Finalizing document...',
    percent: 100,
    attempt: attemptsExecuted,
    totalAttempts: MAX_ATTEMPTS,
  });

  const isTargetAchieved = bestCompliantBytes !== null;
  const chosenBytes = isTargetAchieved ? bestCompliantBytes : smallestBytes;
  const chosenTier = isTargetAchieved ? bestCompliantTier : smallestTier;

  const finalBlob = new Blob([chosenBytes], { type: 'application/pdf' });
  const finalSizeMB = (finalBlob.size / (1024 * 1024)).toFixed(2);
  const downloadUrl = URL.createObjectURL(finalBlob);

  const cleanBaseName = file.name
    .replace(/\.pdf$/i, '')
    .replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_');
  const fileName = `${cleanBaseName}-fileready.pdf`;

  const savedPercent = Math.max(
    0,
    Math.min(99.9, (((file.size - finalBlob.size) / file.size) * 100))
  ).toFixed(1);

  return {
    blob: finalBlob,
    finalSizeBytes: finalBlob.size,
    finalSizeMB,
    targetMB: parseFloat(targetMB).toFixed(2),
    originalSizeMB: (file.size / (1024 * 1024)).toFixed(2),
    savedPercent,
    isTargetAchieved,
    tierUsed: chosenTier?.label || 'Custom',
    attemptsExecuted,
    numPages,
    downloadUrl,
    fileName,
  };
}
