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
  const usableTargetBytes = Math.max(targetBytes * 0.95, targetBytes - overhead);
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
        stage: `Compressing page ${pageNum} of ${numPages}...`,
        current: pageNum,
        total: numPages,
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
      stage: 'Verifying final size...',
      percent: 92,
      attempt: attemptNumber,
      totalAttempts,
    });

    return await newPdf.save();
  }

  // --- TARGET-DRIVEN ADAPTIVE SEARCH ---
  // Searches for the HIGHEST QUALITY / LARGEST FILE candidate that satisfies: outputSize <= targetBytes.
  // Never chooses a much smaller file when a larger valid candidate exists.
  // If multiple candidates are <= targetBytes, select the largest one.
  // If all candidates are below target, select the largest/highest-quality candidate.
  const MAX_ATTEMPTS = 4;
  let lowTier = 0; // Highest quality candidate (Tier 0: 1.80x / Q85)
  let highTier = COMPRESSION_TIERS.length - 1; // Minimum safe quality floor (Tier 15: 0.58x / Q30)

  // Starting tier:
  // If target is generous (>= 5 MB) or reduction is gentle (< 45%),
  // test Tier 0 first to check if the highest quality output already satisfies targetBytes.
  // Otherwise, use budget-per-page heuristic bounded within [lowTier, highTier].
  const reductionPercent = Math.round(((file.size - targetBytes) / file.size) * 100);
  let currentTierIndex = 0;
  if (targetBytes < 5 * 1024 * 1024 && reductionPercent > 45) {
    currentTierIndex = Math.max(lowTier, Math.min(highTier, getInitialTierIndex(budgetPerPage)));
  }

  const evaluatedCandidates = [];
  const evaluatedTiers = new Set();
  let attemptsExecuted = 0;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    attemptsExecuted = attempt;
    evaluatedTiers.add(currentTierIndex);
    const tier = COMPRESSION_TIERS[currentTierIndex];

    onProgress?.({
      stage: `Optimizing candidate ${tier.label}...`,
      percent: Math.round(5 + (attempt / MAX_ATTEMPTS) * 15),
      attempt,
      totalAttempts: MAX_ATTEMPTS,
    });

    const pdfBytes = await renderAndAssemble(tier.scale, tier.quality, attempt, MAX_ATTEMPTS);
    const actualSize = pdfBytes.length;

    evaluatedCandidates.push({
      bytes: pdfBytes,
      size: actualSize,
      tier,
      tierIndex: currentTierIndex,
      attempt,
    });

    if (actualSize <= targetBytes) {
      // Constraint satisfied!
      // If we are already at Tier 0 (highest possible quality tier), no better candidate exists.
      if (currentTierIndex === 0) {
        break;
      }
      // To search for an even HIGHER quality / LARGER file that is still <= targetBytes,
      // search lower tier indices (higher visual quality).
      highTier = currentTierIndex - 1;
    } else {
      // actualSize > targetBytes: We need more compression (higher tier index).
      lowTier = currentTierIndex + 1;
    }

    if (lowTier > highTier) {
      // Search space exhausted — converged!
      break;
    }

    // Pick next midpoint between lowTier and highTier
    let nextIndex = Math.floor((lowTier + highTier) / 2);

    // If already evaluated, find nearest unevaluated tier within [lowTier, highTier]
    if (evaluatedTiers.has(nextIndex)) {
      let found = false;
      for (let offset = 1; offset <= highTier - lowTier; offset++) {
        if (nextIndex - offset >= lowTier && !evaluatedTiers.has(nextIndex - offset)) {
          nextIndex = nextIndex - offset;
          found = true;
          break;
        }
        if (nextIndex + offset <= highTier && !evaluatedTiers.has(nextIndex + offset)) {
          nextIndex = nextIndex + offset;
          found = true;
          break;
        }
      }
      if (!found) {
        break; // All tiers in current range evaluated
      }
    }

    currentTierIndex = nextIndex;
  }

  onProgress?.({
    stage: 'Finalizing document...',
    percent: 100,
    attempt: attemptsExecuted,
    totalAttempts: MAX_ATTEMPTS,
  });

  // --- SELECTION OF THE OPTIMAL CANDIDATE ---
  // 1. Filter candidates that satisfy: actualSize <= targetBytes
  // 2. If multiple candidates are <= targetBytes, select the LARGEST one.
  // 3. If all candidates are below target, select the LARGEST / HIGHEST-QUALITY candidate.
  // 4. If all candidates exceeded target, select the SMALLEST candidate (closest to target).
  const compliantCandidates = evaluatedCandidates.filter((c) => c.size <= targetBytes);

  let chosenCandidate = null;

  if (compliantCandidates.length > 0) {
    // Sort descending by size (largest file <= targetBytes first)
    // Secondary sort: lowest tierIndex (highest quality)
    compliantCandidates.sort((a, b) => {
      if (b.size !== a.size) return b.size - a.size;
      return a.tierIndex - b.tierIndex;
    });
    chosenCandidate = compliantCandidates[0];
  } else {
    // None was <= targetBytes: pick the smallest overall candidate
    evaluatedCandidates.sort((a, b) => a.size - b.size);
    chosenCandidate = evaluatedCandidates[0];
  }

  const isTargetAchieved = chosenCandidate ? chosenCandidate.size <= targetBytes : false;
  const chosenBytes = chosenCandidate.bytes;
  const chosenTier = chosenCandidate.tier;

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
