import { formatBytes } from './fileUtils.js';

/**
 * Loads an image file into an HTMLImageElement safely.
 */
export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Unable to process this file. The image may be corrupted.'));
    };
    img.src = url;
  });
}

/**
 * Checks if a canvas / image contains meaningful alpha transparency.
 */
export function checkTransparency(img) {
  try {
    const canvas = document.createElement('canvas');
    // Sample up to 400x400 for precision across icons, graphics, and full photos
    const maxSample = 400;
    const scale = Math.min(1, maxSample / Math.max(img.width, img.height));
    const w = Math.max(1, Math.floor(img.width * scale));
    const h = Math.max(1, Math.floor(img.height * scale));
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.drawImage(img, 0, 0, w, h);

    const data = ctx.getImageData(0, 0, w, h).data;
    canvas.width = 0;
    canvas.height = 0;

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 250) {
        return true; // Meaningful transparent or semi-transparent pixel found
      }
    }
    return false;
  } catch (err) {
    console.warn('Transparency check fallback:', err);
    return false;
  }
}

/**
 * Reads image dimensions and format info.
 */
export async function getImageInfo(file) {
  const img = await loadImage(file);
  const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
  const hasTransparency = isPng ? checkTransparency(img) : false;

  return {
    width: img.naturalWidth || img.width,
    height: img.naturalHeight || img.height,
    hasTransparency,
  };
}

/**
 * Helper to render an image onto an offscreen Canvas and encode to Blob.
 * Cleans up canvas dimensions immediately to protect mobile browser memory.
 */
async function renderCanvasToBlob(img, scale, mimeType, quality, fillWhite = true) {
  const canvas = document.createElement('canvas');
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (fillWhite && mimeType === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
  }

  ctx.drawImage(img, 0, 0, w, h);

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, mimeType, quality);
  });

  // Free memory immediately
  canvas.width = 0;
  canvas.height = 0;

  return blob;
}

/**
 * Phase 1 JPEG Tiers:
 * Strictly 100% original dimensions (scale 1.0).
 * Tests JPEG quality from maximum visual clarity (0.92) down to 0.35.
 * Used FIRST so dimensions are NEVER reduced if quality tuning alone reaches the target!
 */
const JPEG_PHASE1_FULL_RES_TIERS = [
  { scale: 1.00, quality: 0.92, label: '100% / Q92 (Ultra)' },
  { scale: 1.00, quality: 0.88, label: '100% / Q88 (Ultra)' },
  { scale: 1.00, quality: 0.85, label: '100% / Q85 (Very High)' },
  { scale: 1.00, quality: 0.82, label: '100% / Q82 (High)' },
  { scale: 1.00, quality: 0.78, label: '100% / Q78 (High)' },
  { scale: 1.00, quality: 0.74, label: '100% / Q74 (Medium High)' },
  { scale: 1.00, quality: 0.70, label: '100% / Q70 (Medium High)' },
  { scale: 1.00, quality: 0.65, label: '100% / Q65 (Medium)' },
  { scale: 1.00, quality: 0.60, label: '100% / Q60 (Medium)' },
  { scale: 1.00, quality: 0.55, label: '100% / Q55 (Medium Low)' },
  { scale: 1.00, quality: 0.50, label: '100% / Q50 (Medium Low)' },
  { scale: 1.00, quality: 0.45, label: '100% / Q45 (Economy)' },
  { scale: 1.00, quality: 0.40, label: '100% / Q40 (Economy)' },
  { scale: 1.00, quality: 0.35, label: '100% / Q35 (Readability Floor @ 100%)' },
];

/**
 * Phase 2 JPEG Tiers:
 * Used ONLY when 100% dimensions cannot reach target size even at Q0.35.
 * Strictly ordered by visual quality: higher scale with balanced quality is prioritized
 * over extreme downscaling.
 */
const JPEG_PHASE2_DOWNSCALE_TIERS = [
  // 90% Dimensions
  { scale: 0.90, quality: 0.82, label: '90% / Q82' },
  { scale: 0.90, quality: 0.74, label: '90% / Q74' },
  { scale: 0.90, quality: 0.65, label: '90% / Q65' },
  { scale: 0.90, quality: 0.55, label: '90% / Q55' },
  { scale: 0.90, quality: 0.45, label: '90% / Q45' },

  // 80% Dimensions
  { scale: 0.80, quality: 0.80, label: '80% / Q80' },
  { scale: 0.80, quality: 0.72, label: '80% / Q72' },
  { scale: 0.80, quality: 0.62, label: '80% / Q62' },
  { scale: 0.80, quality: 0.52, label: '80% / Q52' },
  { scale: 0.80, quality: 0.42, label: '80% / Q42' },

  // 70% Dimensions
  { scale: 0.70, quality: 0.78, label: '70% / Q78' },
  { scale: 0.70, quality: 0.68, label: '70% / Q68' },
  { scale: 0.70, quality: 0.58, label: '70% / Q58' },
  { scale: 0.70, quality: 0.48, label: '70% / Q48' },
  { scale: 0.70, quality: 0.38, label: '70% / Q38' },

  // 60% Dimensions
  { scale: 0.60, quality: 0.75, label: '60% / Q75' },
  { scale: 0.60, quality: 0.65, label: '60% / Q65' },
  { scale: 0.60, quality: 0.52, label: '60% / Q52' },
  { scale: 0.60, quality: 0.40, label: '60% / Q40' },

  // 50% Dimensions
  { scale: 0.50, quality: 0.70, label: '50% / Q70' },
  { scale: 0.50, quality: 0.58, label: '50% / Q58' },
  { scale: 0.50, quality: 0.45, label: '50% / Q45' },
  { scale: 0.50, quality: 0.35, label: '50% / Q35' },

  // 40% Dimensions (Last resort)
  { scale: 0.40, quality: 0.65, label: '40% / Q65' },
  { scale: 0.40, quality: 0.50, label: '40% / Q50' },
  { scale: 0.40, quality: 0.35, label: '40% / Q35' },
  { scale: 0.40, quality: 0.28, label: '40% / Q28 (Absolute Floor)' },
];

/**
 * Fine-grained adaptive scales for transparent PNG compression.
 * Starts with small gradual steps (1.00, 0.98, 0.96, 0.94, 0.92, 0.90...) to protect
 * original resolution whenever the required reduction is small (e.g. 18 KB -> 15 KB).
 */
const PNG_FINE_SCALES = [
  1.00, 0.98, 0.96, 0.94, 0.92, 0.90, 0.88, 0.86, 0.84, 0.82, 0.80,
  0.76, 0.72, 0.68, 0.64, 0.60, 0.55, 0.50, 0.45, 0.40, 0.35, 0.30
];

/**
 * Helper: Runs a binary search over a candidate tier array to find the
 * HIGHEST quality tier that satisfies outputSize <= targetBytes.
 */
async function searchTiers(img, tiers, mimeType, fillWhite, targetBytes, onProgress, startPct, endPct) {
  let low = 0;
  let high = tiers.length - 1;
  let iterations = 0;

  let bestCompliantBlob = null;
  let bestCompliantTier = null;
  let smallestBlob = null;
  let smallestSize = Infinity;
  let smallestTier = null;

  while (low <= high && iterations < 6) {
    iterations++;
    const mid = Math.floor((low + high) / 2);
    const tier = tiers[mid];

    const currentPct = Math.round(startPct + (iterations / 6) * (endPct - startPct));
    onProgress?.({
      stage: `Evaluating ${tier.label}...`,
      percent: currentPct,
      attempt: iterations,
      totalAttempts: 6,
    });

    const blob = await renderCanvasToBlob(img, tier.scale, mimeType, tier.quality, fillWhite);
    if (blob) {
      const size = blob.size;

      // Track smallest overall candidate for honest fallback
      if (size < smallestSize) {
        smallestSize = size;
        smallestBlob = blob;
        smallestTier = tier;
      }

      if (size <= targetBytes) {
        // Compliant candidate found!
        // Because tiers are sorted from highest quality (index 0) to lowest,
        // any compliant candidate at a lower index is higher visual quality.
        if (bestCompliantBlob === null || mid < bestCompliantTier.index) {
          bestCompliantBlob = blob;
          bestCompliantTier = { ...tier, index: mid };
        }
        // Search higher quality (lower indices)
        high = mid - 1;
      } else {
        // Output too large: search lower quality (higher indices)
        low = mid + 1;
      }
    } else {
      low = mid + 1;
    }
  }

  return {
    bestCompliantBlob,
    bestCompliantTier,
    smallestBlob,
    smallestTier,
  };
}

/**
 * Main adaptive client-side image compressor.
 * Implements: Quality First, Size Second.
 * Priority order:
 * 1. Maintain 100% dimensions.
 * 2. Tune compression quality gradually.
 * 3. Downscale dimensions only when strictly necessary.
 */
export async function compressImage(file, targetBytes, onProgress, options = {}) {
  const { forceJpgConversion = false } = options;

  if (file.size <= targetBytes) {
    throw new Error('This file already meets your requested target size.');
  }

  onProgress?.({
    stage: 'Loading image...',
    percent: 10,
    attempt: 1,
    totalAttempts: 1,
  });

  const img = await loadImage(file);
  const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
  const hasTransparency = isPng ? checkTransparency(img) : false;

  let chosenBlob = null;
  let isTargetAchieved = false;
  let transparencyPreserved = false;
  let transparencyFallbackAvailable = false;
  let formatConverted = false;
  let conversionNote = '';
  let outputExtension = '.jpg';

  // =========================================================================
  // PATH A: TRANSPARENT PNG (When JPG conversion is NOT explicitly forced)
  // =========================================================================
  if (isPng && hasTransparency && !forceJpgConversion) {
    onProgress?.({
      stage: 'Optimizing PNG with transparency preserved...',
      percent: 20,
      attempt: 1,
      totalAttempts: 1,
    });

    outputExtension = '.png';

    // Map PNG_FINE_SCALES to tier objects for binary search
    const pngTiers = PNG_FINE_SCALES.map((scale, idx) => ({
      scale,
      quality: undefined,
      label: `${Math.round(scale * 100)}% dimensions (PNG)`,
      index: idx,
    }));

    const searchResult = await searchTiers(
      img,
      pngTiers,
      'image/png',
      false, // Never fill white; preserve alpha channel!
      targetBytes,
      onProgress,
      25,
      90
    );

    if (searchResult.bestCompliantBlob) {
      // Constraint successfully met as PNG while keeping 100% transparency!
      chosenBlob = searchResult.bestCompliantBlob;
      isTargetAchieved = true;
      transparencyPreserved = true;
      formatConverted = false;
      conversionNote = 'PNG transparency preserved ✓';
    } else {
      // Target could NOT be reached as PNG without excessive downscaling
      // DO NOT silently convert to JPG!
      // Return the best PNG candidate and offer JPG conversion as an optional choice.
      chosenBlob = searchResult.smallestBlob;
      isTargetAchieved = false;
      transparencyPreserved = true;
      formatConverted = false;
      transparencyFallbackAvailable = true;
      conversionNote = 'Unable to reach target size while preserving PNG transparency. You can keep this transparent PNG or convert to JPG.';
    }
  } else {
    // =========================================================================
    // PATH B: JPG / JPEG, NON-TRANSPARENT PNG, OR USER-ACCEPTED JPG FALLBACK
    // =========================================================================
    if (isPng) {
      formatConverted = true;
      transparencyPreserved = false;
      conversionNote = hasTransparency
        ? 'PNG converted to JPG — transparency removed'
        : 'PNG converted to JPG for optimal size reduction';
      outputExtension = '.jpg';
    }

    // -----------------------------------------------------------------------
    // STEP 1: PRIORITIZE 100% ORIGINAL DIMENSIONS FIRST!
    // -----------------------------------------------------------------------
    onProgress?.({
      stage: 'Evaluating quality at 100% dimensions...',
      percent: 20,
      attempt: 1,
      totalAttempts: 2,
    });

    const phase1Result = await searchTiers(
      img,
      JPEG_PHASE1_FULL_RES_TIERS.map((t, idx) => ({ ...t, index: idx })),
      'image/jpeg',
      true,
      targetBytes,
      onProgress,
      25,
      65
    );

    if (phase1Result.bestCompliantBlob) {
      // TARGET ACHIEVED AT 100% ORIGINAL DIMENSIONS!
      // Image resolution and sharpness are completely untouched!
      chosenBlob = phase1Result.bestCompliantBlob;
      isTargetAchieved = true;
    } else {
      // ---------------------------------------------------------------------
      // STEP 2: DOWNSCALE DIMENSIONS ONLY WHEN STRICTLY NECESSARY
      // ---------------------------------------------------------------------
      onProgress?.({
        stage: 'Adapting dimensions to satisfy target limit...',
        percent: 68,
        attempt: 2,
        totalAttempts: 2,
      });

      const phase2Result = await searchTiers(
        img,
        JPEG_PHASE2_DOWNSCALE_TIERS.map((t, idx) => ({ ...t, index: idx })),
        'image/jpeg',
        true,
        targetBytes,
        onProgress,
        70,
        95
      );

      if (phase2Result.bestCompliantBlob) {
        // Target achieved at highest possible scale & quality combination
        chosenBlob = phase2Result.bestCompliantBlob;
        isTargetAchieved = true;
      } else {
        // Target could not be achieved even at the maximum compression floor
        chosenBlob = phase2Result.smallestBlob || phase1Result.smallestBlob;
        isTargetAchieved = false;
      }
    }
  }

  onProgress?.({
    stage: 'Finalizing image...',
    percent: 100,
    attempt: 1,
    totalAttempts: 1,
  });

  if (!chosenBlob) {
    throw new Error('Failed to compress image.');
  }

  const downloadUrl = URL.createObjectURL(chosenBlob);
  const cleanBaseName = file.name
    .replace(/\.(jpe?g|png)$/i, '')
    .replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_');
  const fileName = `${cleanBaseName}-fileready${outputExtension}`;

  const savedPercent = Math.max(
    0,
    Math.min(99.9, (((file.size - chosenBlob.size) / file.size) * 100))
  ).toFixed(1);

  return {
    blob: chosenBlob,
    finalSizeBytes: chosenBlob.size,
    finalSizeFormatted: formatBytes(chosenBlob.size),
    targetBytes,
    targetFormatted: formatBytes(targetBytes),
    originalSizeBytes: file.size,
    originalSizeFormatted: formatBytes(file.size),
    savedPercent,
    isTargetAchieved,
    downloadUrl,
    fileName,
    transparencyPreserved,
    transparencyFallbackAvailable,
    formatConverted,
    conversionNote,
  };
}
