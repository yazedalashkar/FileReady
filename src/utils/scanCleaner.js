import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';
import { inspectPdf } from './fileInspector.js';
import { formatBytes } from './fileUtils.js';

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
 * Calculates pixel luminance: 0.299R + 0.587G + 0.114B
 */
function getLuminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Fast projection-profile skew detection on a binary downscaled thumbnail
 * Tests trial angles in [-3.0°, +3.0°] in 0.5° increments.
 * Returns estimated skew angle in degrees (or 0 if straight).
 */
function detectPageSkewAngle(imgData, width, height) {
  const data = imgData.data;
  // Extract black pixel coordinates (ink pixels with luminance < 180)
  const inkPoints = [];
  const step = 2; // sample every 2nd pixel for rapid mobile performance
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const lum = getLuminance(data[idx], data[idx + 1], data[idx + 2]);
      if (lum < 180) {
        inkPoints.push([x, y]);
      }
    }
  }

  if (inkPoints.length < 100) {
    return 0; // Not enough text to measure skew reliably
  }

  const trialAngles = [-3.0, -2.5, -2.0, -1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
  let maxVariance = -1;
  let bestAngle = 0;

  for (const angle of trialAngles) {
    const rad = (angle * Math.PI) / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);

    // Bin projected heights
    const binCount = Math.floor(height / step);
    const bins = new Uint32Array(binCount);

    for (let i = 0; i < inkPoints.length; i++) {
      const [x, y] = inkPoints[i];
      // Rotated y coordinate
      const rotY = Math.floor((-x * sinA + y * cosA) / step);
      if (rotY >= 0 && rotY < binCount) {
        bins[rotY]++;
      }
    }

    // Calculate variance of the projection profile
    let sum = 0;
    let sumSq = 0;
    for (let b = 0; b < binCount; b++) {
      sum += bins[b];
      sumSq += bins[b] * bins[b];
    }
    const mean = sum / binCount;
    const variance = sumSq / binCount - mean * mean;

    if (variance > maxVariance) {
      maxVariance = variance;
      bestAngle = angle;
    }
  }

  return Math.abs(bestAngle) >= 0.5 ? bestAngle : 0;
}

/**
 * Analyzes an individual rendered PDF page canvas for scan flaws.
 */
function analyzePageCanvas(canvas, origWidth, origHeight, dominantDocOrientation) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const totalPixels = width * height;

  let darkPixelCount = 0;
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;

  // Track background statistics in margins (outer 8% borders)
  const borderPixels = [];

  for (let y = 0; y < height; y++) {
    const isBorderY = y < height * 0.08 || y > height * 0.92;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const lum = getLuminance(data[idx], data[idx + 1], data[idx + 2]);

      // Detect ink/text markings (luminance < 225)
      if (lum < 225) {
        darkPixelCount++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }

      // Sample border areas for uneven/gray background analysis
      if (isBorderY || x < width * 0.08 || x > width * 0.92) {
        if (lum > 140) {
          borderPixels.push(lum);
        }
      }
    }
  }

  // 1. Blank Page Detection
  // If dark pixels represent less than 0.15% of the page
  const darkRatio = darkPixelCount / totalPixels;
  const isBlank = darkRatio < 0.0015 || darkPixelCount < 120;

  // 2. Excessive Margins Detection
  let hasExcessiveMargins = false;
  let marginDetails = { top: 0, bottom: 0, left: 0, right: 0 };
  let contentBox = { x: 0, y: 0, width, height };

  if (!isBlank && minX < maxX && minY < maxY) {
    const topMargin = minY / height;
    const bottomMargin = (height - maxY) / height;
    const leftMargin = minX / width;
    const rightMargin = (width - maxX) / width;

    marginDetails = {
      top: Math.round(topMargin * 100),
      bottom: Math.round(bottomMargin * 100),
      left: Math.round(leftMargin * 100),
      right: Math.round(rightMargin * 100),
    };

    contentBox = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };

    // Flag excessive if total horizontal margins > 28% or vertical > 28%
    if (leftMargin + rightMargin > 0.28 || topMargin + bottomMargin > 0.28) {
      hasExcessiveMargins = true;
    }
  }

  // 3. Uneven / Gray Background Detection
  let hasUnevenBackground = false;
  let avgBgLuminance = 255;
  if (borderPixels.length > 50) {
    let bgSum = 0;
    for (let i = 0; i < borderPixels.length; i++) {
      bgSum += borderPixels[i];
    }
    avgBgLuminance = bgSum / borderPixels.length;

    let bgVarSum = 0;
    for (let i = 0; i < borderPixels.length; i++) {
      const diff = borderPixels[i] - avgBgLuminance;
      bgVarSum += diff * diff;
    }
    const bgStdDev = Math.sqrt(bgVarSum / borderPixels.length);

    // Uneven/gray background if average is off-white (<242) and has variance (>3.5)
    if (avgBgLuminance < 242 && bgStdDev > 3.5) {
      hasUnevenBackground = true;
    }
  }

  // 4. Orientation Detection
  const pageOrientation = origWidth > origHeight ? 'landscape' : 'portrait';
  const hasDifferentOrientation =
    dominantDocOrientation && pageOrientation !== dominantDocOrientation;

  // 5. Skew Detection
  let isSkewed = false;
  let skewAngle = 0;
  if (!isBlank) {
    skewAngle = detectPageSkewAngle(imgData, width, height);
    isSkewed = Math.abs(skewAngle) >= 0.5;
  }

  return {
    isBlank,
    darkPixelCount,
    hasExcessiveMargins,
    marginDetails,
    contentBox,
    hasUnevenBackground,
    avgBgLuminance: Math.round(avgBgLuminance),
    pageOrientation,
    hasDifferentOrientation,
    isSkewed,
    skewAngle,
  };
}

/**
 * Stage 1: Thoroughly inspects a scanned PDF page-by-page.
 * Returns aggregated findings and per-page flaw metadata.
 */
export async function analyzeScannedPdf(file, onProgress) {
  onProgress?.({
    stage: 'Analyzing document structure...',
    percent: 5,
    current: 0,
    total: 0,
  });

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  if (numPages === 0) {
    throw new Error('This PDF contains no readable pages.');
  }

  // First pass: identify page dimensions and dominant orientation
  const pageSizes = [];
  let portraitCount = 0;
  let landscapeCount = 0;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const vp = page.getViewport({ scale: 1.0 });
    pageSizes.push({ width: vp.width, height: vp.height });
    if (vp.width > vp.height) {
      landscapeCount++;
    } else {
      portraitCount++;
    }
    if (typeof page.cleanup === 'function') page.cleanup();
  }

  const dominantDocOrientation = landscapeCount > portraitCount ? 'landscape' : 'portrait';

  // Second pass: analyze each page canvas independently
  const pageAnalyses = [];
  const blankPageNumbers = [];
  let skewedCount = 0;
  let marginsCount = 0;
  let backgroundCount = 0;
  let differentOrientationCount = 0;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const percent = Math.round(10 + ((pageNum - 1) / numPages) * 75);
    onProgress?.({
      stage: `Detecting scan problems (Page ${pageNum} of ${numPages})...`,
      percent,
      current: pageNum,
      total: numPages,
    });

    const page = await pdf.getPage(pageNum);
    const origSize = pageSizes[pageNum - 1];

    // Thumbnail scale for fast and reliable flaw detection (max dimension 600px)
    const maxThumbDim = 600;
    const thumbScale = Math.min(
      1.0,
      maxThumbDim / Math.max(origSize.width, origSize.height)
    );
    const vp = page.getViewport({ scale: thumbScale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(vp.width);
    canvas.height = Math.floor(vp.height);
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport: vp,
    }).promise;

    const analysis = analyzePageCanvas(
      canvas,
      origSize.width,
      origSize.height,
      dominantDocOrientation
    );

    // Free canvas memory immediately
    canvas.width = 0;
    canvas.height = 0;
    if (typeof page.cleanup === 'function') page.cleanup();

    if (analysis.isBlank) blankPageNumbers.push(pageNum);
    if (analysis.isSkewed) skewedCount++;
    if (analysis.hasExcessiveMargins) marginsCount++;
    if (analysis.hasUnevenBackground) backgroundCount++;
    if (analysis.hasDifferentOrientation) differentOrientationCount++;

    pageAnalyses.push({
      pageNum,
      origWidth: origSize.width,
      origHeight: origSize.height,
      ...analysis,
    });
  }

  onProgress?.({
    stage: 'Analysis complete',
    percent: 100,
    current: numPages,
    total: numPages,
  });

  return {
    totalPages: numPages,
    dominantDocOrientation,
    findings: {
      skewedPagesCount: skewedCount,
      marginPagesCount: marginsCount,
      backgroundPagesCount: backgroundCount,
      blankPagesCount: blankPageNumbers.length,
      blankPageNumbers,
      orientationPagesCount: differentOrientationCount,
    },
    pageAnalyses,
  };
}

/**
 * Cleans image pixel data: removes background yellowing/gray noise while enhancing text.
 */
function cleanBackgroundInPlace(imgData) {
  const data = imgData.data;
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // Whitening threshold: off-white paper noise (>200) becomes pure white
    if (lum > 200) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    } else if (lum < 140) {
      // Dark ink: enhance contrast slightly
      data[i] = Math.max(0, Math.floor(r * 0.88));
      data[i + 1] = Math.max(0, Math.floor(g * 0.88));
      data[i + 2] = Math.max(0, Math.floor(b * 0.88));
    } else {
      // Smooth anti-aliased gradient
      const factor = (lum - 140) / 60; // 0 to 1
      data[i] = Math.min(255, Math.floor(r + (255 - r) * factor));
      data[i + 1] = Math.min(255, Math.floor(g + (255 - g) * factor));
      data[i + 2] = Math.min(255, Math.floor(b + (255 - b) * factor));
    }
  }
}

/**
 * Stage 2: Executes selected scan cleanup operations page by page.
 * Rebuilds a clean PDF and verifies the result.
 */
export async function cleanScannedPdf(file, options, onProgress) {
  const {
    deskew = true,
    cropMargins = true,
    cleanBackground = true,
    removeBlankPages = false,
    normalizeOrientation = true,
    pageAnalyses = [],
  } = options || {};

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const newPdf = await PDFDocument.create();

  let deskewedCount = 0;
  let croppedCount = 0;
  let cleanedBgCount = 0;
  let blankRemovedCount = 0;
  let normalizedCount = 0;

  const MAX_CANVAS_DIM = 2400; // High clarity limit

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const analysis = pageAnalyses[pageNum - 1] || {};

    // Check if user confirmed removing this blank page
    if (removeBlankPages && analysis.isBlank) {
      blankRemovedCount++;
      continue; // Skip blank page
    }

    const currentPercent = Math.round(15 + ((pageNum - 1) / numPages) * 70);
    onProgress?.({
      stage: `Cleaning page ${pageNum} of ${numPages}...`,
      percent: currentPercent,
      current: pageNum,
      total: numPages,
    });

    const page = await pdf.getPage(pageNum);
    const origVp = page.getViewport({ scale: 1.0 });
    let origWidth = origVp.width;
    let origHeight = origVp.height;

    // Normal resolution scale (up to 1.5x, bounded by MAX_CANVAS_DIM)
    let renderScale = 1.5;
    if (
      origWidth * renderScale > MAX_CANVAS_DIM ||
      origHeight * renderScale > MAX_CANVAS_DIM
    ) {
      renderScale = Math.min(
        MAX_CANVAS_DIM / origWidth,
        MAX_CANVAS_DIM / origHeight
      );
    }

    const vp = page.getViewport({ scale: renderScale });
    const rawCanvas = document.createElement('canvas');
    rawCanvas.width = Math.floor(vp.width);
    rawCanvas.height = Math.floor(vp.height);

    const rawCtx = rawCanvas.getContext('2d', { alpha: false });
    rawCtx.fillStyle = '#ffffff';
    rawCtx.fillRect(0, 0, rawCanvas.width, rawCanvas.height);

    await page.render({
      canvasContext: rawCtx,
      viewport: vp,
    }).promise;

    if (typeof page.cleanup === 'function') page.cleanup();

    let processedCanvas = rawCanvas;

    // A. DESKEW (Rotate slightly crooked page)
    if (deskew && analysis.isSkewed && analysis.skewAngle) {
      const angleRad = (-analysis.skewAngle * Math.PI) / 180;
      const deskewCanvas = document.createElement('canvas');
      deskewCanvas.width = rawCanvas.width;
      deskewCanvas.height = rawCanvas.height;
      const dCtx = deskewCanvas.getContext('2d', { alpha: false });
      dCtx.fillStyle = '#ffffff';
      dCtx.fillRect(0, 0, deskewCanvas.width, deskewCanvas.height);

      dCtx.save();
      dCtx.translate(deskewCanvas.width / 2, deskewCanvas.height / 2);
      dCtx.rotate(angleRad);
      dCtx.drawImage(
        rawCanvas,
        -deskewCanvas.width / 2,
        -deskewCanvas.height / 2
      );
      dCtx.restore();

      processedCanvas.width = 0;
      processedCanvas.height = 0;
      processedCanvas = deskewCanvas;
      deskewedCount++;
    }

    // B. AUTO-CROP MARGINS
    if (cropMargins && analysis.hasExcessiveMargins && analysis.contentBox) {
      // Scale content box to processed canvas resolution
      const scaleX = processedCanvas.width / origWidth;
      const scaleY = processedCanvas.height / origHeight;

      // Add 4% clean margin breathing room around content
      const padX = processedCanvas.width * 0.04;
      const padY = processedCanvas.height * 0.04;

      const sx = Math.max(0, analysis.contentBox.x * scaleX - padX);
      const sy = Math.max(0, analysis.contentBox.y * scaleY - padY);
      const sw = Math.min(
        processedCanvas.width - sx,
        analysis.contentBox.width * scaleX + padX * 2
      );
      const sh = Math.min(
        processedCanvas.height - sy,
        analysis.contentBox.height * scaleY + padY * 2
      );

      if (sw > 100 && sh > 100) {
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = Math.floor(sw);
        cropCanvas.height = Math.floor(sh);
        const cCtx = cropCanvas.getContext('2d', { alpha: false });
        cCtx.fillStyle = '#ffffff';
        cCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);
        cCtx.drawImage(processedCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

        processedCanvas.width = 0;
        processedCanvas.height = 0;
        processedCanvas = cropCanvas;
        croppedCount++;
      }
    }

    // C. BACKGROUND CLEANUP (Whiten gray paper noise & enhance contrast)
    if (cleanBackground && analysis.hasUnevenBackground) {
      const pCtx = processedCanvas.getContext('2d', { willReadFrequently: true });
      const imgData = pCtx.getImageData(
        0,
        0,
        processedCanvas.width,
        processedCanvas.height
      );
      cleanBackgroundInPlace(imgData);
      pCtx.putImageData(imgData, 0, 0);
      cleanedBgCount++;
    }

    // D. NORMALIZE ORIENTATION (Landscape page in mostly portrait document)
    let finalPageWidth = (processedCanvas.width / renderScale);
    let finalPageHeight = (processedCanvas.height / renderScale);

    if (normalizeOrientation && analysis.hasDifferentOrientation) {
      // Rotate 90 degrees clockwise to match dominant orientation
      const orientCanvas = document.createElement('canvas');
      orientCanvas.width = processedCanvas.height;
      orientCanvas.height = processedCanvas.width;
      const oCtx = orientCanvas.getContext('2d', { alpha: false });
      oCtx.fillStyle = '#ffffff';
      oCtx.fillRect(0, 0, orientCanvas.width, orientCanvas.height);

      oCtx.save();
      oCtx.translate(orientCanvas.width / 2, orientCanvas.height / 2);
      oCtx.rotate(Math.PI / 2);
      oCtx.drawImage(
        processedCanvas,
        -processedCanvas.width / 2,
        -processedCanvas.height / 2
      );
      oCtx.restore();

      processedCanvas.width = 0;
      processedCanvas.height = 0;
      processedCanvas = orientCanvas;

      const tempW = finalPageWidth;
      finalPageWidth = finalPageHeight;
      finalPageHeight = tempW;
      normalizedCount++;
    }

    // Encode to high-quality JPEG
    const jpegBlob = await new Promise((resolve) => {
      processedCanvas.toBlob(resolve, 'image/jpeg', 0.88);
    });

    processedCanvas.width = 0;
    processedCanvas.height = 0;

    if (!jpegBlob) {
      throw new Error(`Failed to encode page ${pageNum} after cleanup.`);
    }

    const jpegBytes = await jpegBlob.arrayBuffer();
    const embeddedImage = await newPdf.embedJpg(jpegBytes);
    const newPage = newPdf.addPage([finalPageWidth, finalPageHeight]);
    newPage.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: finalPageWidth,
      height: finalPageHeight,
    });
  }

  onProgress?.({
    stage: 'Rebuilding PDF document...',
    percent: 90,
  });

  const cleanedBytes = await newPdf.save();
  const finalBlob = new Blob([cleanedBytes], { type: 'application/pdf' });

  onProgress?.({
    stage: 'Verifying result...',
    percent: 96,
  });

  // Verified Inspection of before and after
  const beforeInspection = await inspectPdf(file, arrayBuffer);
  const afterInspection = await inspectPdf(
    new File([finalBlob], 'cleaned.pdf', { type: 'application/pdf' }),
    cleanedBytes.buffer
  );

  const cleanBaseName = file.name
    .replace(/\.pdf$/i, '')
    .replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_');
  const fileName = `${cleanBaseName}-cleaned.pdf`;
  const downloadUrl = URL.createObjectURL(finalBlob);

  onProgress?.({
    stage: 'Cleanup complete',
    percent: 100,
  });

  return {
    blob: finalBlob,
    fileName,
    downloadUrl,
    before: {
      pageCount: beforeInspection.pageCount || numPages,
      fileSize: file.size,
      fileSizeFormatted: formatBytes(file.size),
      pageSize: beforeInspection.dominantPageSize || 'Custom',
      orientation: beforeInspection.dominantOrientation || 'portrait',
    },
    after: {
      pageCount: afterInspection.pageCount || newPdf.getPageCount(),
      fileSize: finalBlob.size,
      fileSizeFormatted: formatBytes(finalBlob.size),
      pageSize: afterInspection.dominantPageSize || 'Custom',
      orientation: afterInspection.dominantOrientation || 'portrait',
    },
    appliedOperations: {
      deskewedCount,
      croppedCount,
      cleanedBgCount,
      blankRemovedCount,
      normalizedCount,
    },
  };
}
