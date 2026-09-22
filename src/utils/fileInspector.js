import { PDFDocument } from 'pdf-lib';
import { getFileType, formatBytes } from './fileUtils.js';

/**
 * Standard page dimensions in points (72 points = 1 inch, 1 pt = 0.352778 mm).
 * Supported standard international and US formats.
 */
const STANDARD_PAGE_SIZES = [
  { name: 'A4', width: 595.28, height: 841.89 },
  { name: 'US Letter', width: 612.0, height: 792.0 },
  { name: 'US Legal', width: 612.0, height: 1008.0 },
  { name: 'A3', width: 841.89, height: 1190.55 },
  { name: 'A5', width: 419.53, height: 595.28 },
  { name: 'Executive', width: 522.0, height: 756.0 },
];

/**
 * Identifies standard paper size by width and height in points.
 */
export function identifyPageSize(widthPts, heightPts) {
  const shortSide = Math.min(widthPts, heightPts);
  const longSide = Math.max(widthPts, heightPts);
  const tolerance = 8.0;

  for (const std of STANDARD_PAGE_SIZES) {
    const stdShort = Math.min(std.width, std.height);
    const stdLong = Math.max(std.width, std.height);

    if (
      Math.abs(shortSide - stdShort) <= tolerance &&
      Math.abs(longSide - stdLong) <= tolerance
    ) {
      return std.name;
    }
  }

  const mmW = Math.round(widthPts * 0.352778);
  const mmH = Math.round(heightPts * 0.352778);
  return `${mmW} × ${mmH} mm`;
}

/**
 * Inspects a PDF file client-side using pdf-lib and binary header inspection.
 */
export async function inspectPdf(file, arrayBuffer) {
  // Extract PDF version from raw header bytes (%PDF-1.x)
  let pdfVersion = null;
  try {
    const headerBytes = new Uint8Array(arrayBuffer, 0, Math.min(64, arrayBuffer.byteLength));
    const headerStr = new TextDecoder('utf-8', { fatal: false }).decode(headerBytes);
    const match = headerStr.match(/%PDF-(\d+\.\d+)/);
    if (match) {
      pdfVersion = match[1];
    }
  } catch {
    pdfVersion = null;
  }

  let isEncrypted = false;
  let pdfDoc = null;
  let isOpenable = false;

  try {
    pdfDoc = await PDFDocument.load(arrayBuffer);
    isOpenable = true;
    isEncrypted = false;
  } catch (loadErr) {
    const msg = (loadErr?.message || '').toLowerCase();
    if (msg.includes('password') || msg.includes('encrypt')) {
      isEncrypted = true;
      try {
        pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        isOpenable = true;
      } catch {
        isOpenable = false;
      }
    } else {
      isOpenable = false;
      throw loadErr;
    }
  }

  if (!isOpenable || !pdfDoc) {
    return {
      isOpenable: false,
      isEncrypted,
      pdfVersion,
      pageCount: 0,
      pageSizes: [],
      dominantPageSize: '—',
      orientations: [],
      dominantOrientation: '—',
      hasMixedPageSizes: false,
      hasMixedOrientation: false,
      hasRotation: false,
      hasForms: false,
      hasAnnotations: false,
    };
  }

  const pageCount = pdfDoc.getPageCount();
  const pages = pdfDoc.getPages();
  const pageSizes = [];
  const orientations = [];
  let hasRotation = false;

  const sizeCounts = {};
  const orientationCounts = { portrait: 0, landscape: 0, square: 0 };

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const rotation = (page.getRotation()?.angle || 0) % 360;

    if (rotation !== 0) {
      hasRotation = true;
    }

    let orientation = 'portrait';
    if (Math.abs(width - height) < 4) {
      orientation = 'square';
    } else if (width > height) {
      orientation = 'landscape';
    }
    orientations.push(orientation);
    orientationCounts[orientation] = (orientationCounts[orientation] || 0) + 1;

    const sizeName = identifyPageSize(width, height);
    pageSizes.push(sizeName);
    sizeCounts[sizeName] = (sizeCounts[sizeName] || 0) + 1;
  }

  // Dominant page size & orientation
  let dominantPageSize = pageSizes[0] || 'A4';
  let maxCount = 0;
  for (const [sz, count] of Object.entries(sizeCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantPageSize = sz;
    }
  }

  let dominantOrientation = 'portrait';
  let maxOrientCount = 0;
  for (const [orient, count] of Object.entries(orientationCounts)) {
    if (count > maxOrientCount) {
      maxOrientCount = count;
      dominantOrientation = orient;
    }
  }

  const uniqueSizes = new Set(pageSizes);
  const hasMixedPageSizes = uniqueSizes.size > 1;

  const uniqueOrientations = new Set(orientations);
  const hasMixedOrientation = uniqueOrientations.size > 1;

  // Form fields detection
  let hasForms = false;
  try {
    const form = pdfDoc.getForm?.();
    if (form && form.getFields().length > 0) {
      hasForms = true;
    }
  } catch {
    hasForms = false;
  }

  // Annotations detection
  let hasAnnotations = false;
  try {
    for (const page of pages) {
      if (
        page.node?.Annots?.() ||
        (typeof page.node?.get === 'function' && page.node.get('Annots'))
      ) {
        hasAnnotations = true;
        break;
      }
    }
  } catch {
    hasAnnotations = false;
  }

  return {
    isOpenable: true,
    isEncrypted,
    pdfVersion,
    pageCount,
    pageSizes,
    dominantPageSize,
    orientations,
    dominantOrientation,
    hasMixedPageSizes,
    hasMixedOrientation,
    hasRotation,
    hasForms,
    hasAnnotations,
  };
}

/**
 * Inspects an image file client-side using browser Image decoding.
 */
export async function inspectImage(file, detectedFormat) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      resolve({
        isOpenable: true,
        width: 0,
        height: 0,
        aspectRatio: '—',
        megapixels: 0,
        hasTransparency: false,
      });
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      URL.revokeObjectURL(objectUrl);

      // Aspect ratio calculation
      let aspectRatio = '—';
      if (width && height) {
        const ratio = width / height;
        if (Math.abs(ratio - 16 / 9) < 0.05) aspectRatio = '16:9';
        else if (Math.abs(ratio - 9 / 16) < 0.05) aspectRatio = '9:16';
        else if (Math.abs(ratio - 4 / 3) < 0.05) aspectRatio = '4:3';
        else if (Math.abs(ratio - 3 / 4) < 0.05) aspectRatio = '3:4';
        else if (Math.abs(ratio - 1) < 0.03) aspectRatio = '1:1';
        else if (Math.abs(ratio - 3 / 2) < 0.05) aspectRatio = '3:2';
        else if (Math.abs(ratio - 2 / 3) < 0.05) aspectRatio = '2:3';
        else aspectRatio = `${ratio.toFixed(2)}:1`;
      }

      const megapixels =
        width && height ? parseFloat(((width * height) / 1000000).toFixed(1)) : 0;

      // Transparency sampling for PNG / WEBP
      let hasTransparency = false;
      if (detectedFormat === 'PNG' || detectedFormat === 'WEBP') {
        try {
          const sampleCanvas = document.createElement('canvas');
          const maxDim = 200;
          const scale = Math.min(1, maxDim / Math.max(width, height));
          sampleCanvas.width = Math.max(1, Math.round(width * scale));
          sampleCanvas.height = Math.max(1, Math.round(height * scale));
          const ctx = sampleCanvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(img, 0, 0, sampleCanvas.width, sampleCanvas.height);
            const imgData = ctx.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height).data;
            for (let i = 3; i < imgData.length; i += 4) {
              if (imgData[i] < 250) {
                hasTransparency = true;
                break;
              }
            }
          }
          sampleCanvas.width = 0;
          sampleCanvas.height = 0;
        } catch {
          hasTransparency = false;
        }
      }

      resolve({
        isOpenable: true,
        width,
        height,
        aspectRatio,
        megapixels,
        hasTransparency,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('CANNOT_DECODE_IMAGE'));
    };

    img.src = objectUrl;
  });
}

/**
 * Master client-side inspection function.
 * Evaluates the file, inspects container and content structure, and builds the readiness checks.
 */
export async function inspectFile(file, options = {}) {
  if (!file) return null;

  const detectedFormat = getFileType(file);
  if (detectedFormat === 'UNSUPPORTED') {
    return {
      file: {
        name: file.name,
        size: file.size,
        sizeFormatted: formatBytes(file.size),
        type: file.type || 'application/octet-stream',
        format: 'UNSUPPORTED',
      },
      pdf: null,
      image: null,
      checks: [
        {
          id: 'file_format',
          status: 'FAIL',
          labelKey: 'checkFormat',
          valueKey: 'errUnsupported',
        },
      ],
      overallStatus: 'NOT_READY',
      timestamp: Date.now(),
    };
  }

  let pdfInfo = null;
  let imageInfo = null;

  if (detectedFormat === 'PDF') {
    const arrayBuffer = await file.arrayBuffer();
    pdfInfo = await inspectPdf(file, arrayBuffer);
  } else {
    imageInfo = await inspectImage(file, detectedFormat);
  }

  const targetBytes = options.targetBytes || null;
  const targetFormatted = options.targetFormatted || (targetBytes ? formatBytes(targetBytes) : null);

  // Generate structured checks
  const checks = [];

  // Check 1: Format
  if (detectedFormat === 'PDF') {
    checks.push({
      id: 'file_format',
      status: 'PASS',
      labelKey: 'checkFormat',
      valueKey: pdfInfo.pdfVersion ? 'checkFormatPdfVersion' : 'checkFormatPdf',
      params: { version: pdfInfo.pdfVersion || '' },
    });
  } else {
    checks.push({
      id: 'file_format',
      status: 'PASS',
      labelKey: 'checkFormat',
      valueKey: 'checkFormatImage',
      params: { format: detectedFormat },
    });
  }

  // Check 2: Parseability / Readability
  const isOpenable = detectedFormat === 'PDF' ? pdfInfo.isOpenable : imageInfo.isOpenable;
  checks.push({
    id: 'file_readability',
    status: isOpenable ? 'PASS' : 'FAIL',
    labelKey: 'checkOpensCorrectly',
    valueKey: isOpenable ? 'checkOpensSuccess' : 'checkOpensError',
  });

  // Check 3: Encryption (PDF only)
  if (detectedFormat === 'PDF') {
    checks.push({
      id: 'file_password',
      status: pdfInfo.isEncrypted ? 'FAIL' : 'PASS',
      labelKey: 'checkPassword',
      valueKey: pdfInfo.isEncrypted ? 'checkIsEncrypted' : 'checkNotEncrypted',
    });
  }

  // Check 4: Page Count / Dimensions
  if (detectedFormat === 'PDF') {
    checks.push({
      id: 'page_count',
      status: 'PASS',
      labelKey: 'checkPageCount',
      valueKey: pdfInfo.pageCount === 1 ? 'checkPageCountSingle' : 'checkPageCountVal',
      params: { count: pdfInfo.pageCount },
    });

    // Check 5: Page Uniformity
    checks.push({
      id: 'page_sizes',
      status: pdfInfo.hasMixedPageSizes ? 'WARN' : 'PASS',
      labelKey: 'checkPageSizes',
      valueKey: pdfInfo.hasMixedPageSizes ? 'checkPageSizesMixed' : 'checkPageSizesUniform',
      params: { size: pdfInfo.dominantPageSize },
    });

    // Check 6: Orientation
    checks.push({
      id: 'page_orientation',
      status: 'INFO',
      labelKey: 'checkPageOrientation',
      valueKey: pdfInfo.hasMixedOrientation
        ? 'checkOrientationMixed'
        : pdfInfo.dominantOrientation === 'landscape'
        ? 'checkOrientationLandscape'
        : 'checkOrientationPortrait',
    });
  } else {
    // Image Dimensions
    checks.push({
      id: 'image_dimensions',
      status: 'PASS',
      labelKey: 'checkDimensions',
      valueKey: 'checkDimensionsVal',
      params: {
        width: imageInfo.width,
        height: imageInfo.height,
        aspectRatio: imageInfo.aspectRatio,
        megapixels: imageInfo.megapixels,
      },
    });

    // Image Transparency
    checks.push({
      id: 'image_transparency',
      status: 'INFO',
      labelKey: 'checkTransparency',
      valueKey: imageInfo.hasTransparency ? 'checkHasTransparency' : 'checkNoTransparency',
    });
  }

  // Check: File Size vs Target Limit
  if (targetBytes && targetBytes > 0) {
    const isExceeding = file.size > targetBytes;
    checks.push({
      id: 'file_size',
      status: isExceeding ? 'WARN' : 'PASS',
      labelKey: 'checkFileSize',
      valueKey: isExceeding ? 'checkFileSizeExceeds' : 'checkFileSizeOk',
      params: {
        size: formatBytes(file.size),
        target: targetFormatted || formatBytes(targetBytes),
      },
    });
  } else {
    checks.push({
      id: 'file_size',
      status: 'INFO',
      labelKey: 'checkFileSize',
      valueKey: 'checkFileSizeNoTarget',
      params: {
        size: formatBytes(file.size),
      },
    });
  }

  // Determine Overall Status
  let overallStatus = 'READY';
  if (!isOpenable || pdfInfo?.isEncrypted) {
    overallStatus = 'NOT_READY';
  } else if (targetBytes && file.size > targetBytes) {
    overallStatus = 'NEEDS_ATTENTION';
  } else if (pdfInfo?.hasMixedPageSizes) {
    overallStatus = 'NEEDS_ATTENTION';
  }

  return {
    file: {
      name: file.name,
      size: file.size,
      sizeFormatted: formatBytes(file.size),
      type: file.type || (detectedFormat === 'PDF' ? 'application/pdf' : `image/${detectedFormat.toLowerCase()}`),
      format: detectedFormat,
    },
    pdf: pdfInfo,
    image: imageInfo,
    checks,
    overallStatus,
    targetBytes,
    timestamp: Date.now(),
  };
}

/**
 * Requirements evaluation foundation (Phase 9 extensible architecture).
 * Allows future comparison: Requirements -> Compare -> Fix -> Verify.
 */
export function evaluateRequirements(inspection, requirements = {}) {
  if (!inspection) return { isCompliant: false, checks: [] };

  const results = [];

  // Max size check
  if (requirements.maxSizeBytes) {
    const pass = inspection.file.size <= requirements.maxSizeBytes;
    results.push({
      id: 'req_max_size',
      type: 'MAX_SIZE',
      passed: pass,
      actual: inspection.file.size,
      required: requirements.maxSizeBytes,
    });
  }

  // Min size check
  if (requirements.minSizeBytes) {
    const pass = inspection.file.size >= requirements.minSizeBytes;
    results.push({
      id: 'req_min_size',
      type: 'MIN_SIZE',
      passed: pass,
      actual: inspection.file.size,
      required: requirements.minSizeBytes,
    });
  }

  // Allowed formats
  if (requirements.allowedFormats && requirements.allowedFormats.length > 0) {
    const pass = requirements.allowedFormats.includes(inspection.file.format);
    results.push({
      id: 'req_format',
      type: 'FORMAT',
      passed: pass,
      actual: inspection.file.format,
      required: requirements.allowedFormats,
    });
  }

  // Page count checks (PDF)
  if (inspection.pdf && inspection.pdf.isOpenable) {
    if (requirements.maxPages) {
      const pass = inspection.pdf.pageCount <= requirements.maxPages;
      results.push({
        id: 'req_max_pages',
        type: 'MAX_PAGES',
        passed: pass,
        actual: inspection.pdf.pageCount,
        required: requirements.maxPages,
      });
    }
    if (requirements.minPages) {
      const pass = inspection.pdf.pageCount >= requirements.minPages;
      results.push({
        id: 'req_min_pages',
        type: 'MIN_PAGES',
        passed: pass,
        actual: inspection.pdf.pageCount,
        required: requirements.minPages,
      });
    }
  }

  const isCompliant = results.every((r) => r.passed);
  return {
    isCompliant,
    requirementsChecks: results,
  };
}
