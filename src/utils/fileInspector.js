import { PDFDocument } from 'pdf-lib';
import { getFileType, formatBytes } from './fileUtils.js';

/**
 * Standard page dimensions in points (72 points = 1 inch, 1 pt = 0.352778 mm).
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
 * Common submission size presets.
 */
export const COMMON_SIZE_PRESETS = [
  { id: '500kb', label: '500 KB', bytes: 500 * 1000, value: 500, unit: 'KB' },
  { id: '1mb', label: '1 MB', bytes: 1 * 1000 * 1000, value: 1, unit: 'MB' },
  { id: '2mb', label: '2 MB', bytes: 2 * 1000 * 1000, value: 2, unit: 'MB' },
  { id: '5mb', label: '5 MB', bytes: 5 * 1000 * 1000, value: 5, unit: 'MB' },
  { id: '10mb', label: '10 MB', bytes: 10 * 1000 * 1000, value: 10, unit: 'MB' },
];

/**
 * Default initial requirements.
 */
export const DEFAULT_REQUIREMENTS = {
  maxSizeBytes: 2 * 1000 * 1000, // 2 MB default
  minSizeBytes: null,
  format: 'ANY', // 'ANY' | 'PDF' | 'JPG' | 'PNG'
  maxPages: null,
  minPages: null,
  pageSize: 'ANY', // 'ANY' | 'A4' | 'US Letter'
  orientation: 'ANY', // 'ANY' | 'portrait' | 'landscape'
  maxWidth: null,
  maxHeight: null,
};

/**
 * Identifies standard paper size by width and height in points.
 */
export function identifyPageSize(widthPts, heightPts) {
  if (!widthPts || !heightPts) return '—';
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
 * SAFE: Never throws. Falls back gracefully if specific features fail to parse.
 */
export async function inspectPdf(file, arrayBuffer, fallbackMeta = null) {
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

  // Safe load attempt
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
      // Non-password parsing error in pdf-lib (e.g. non-standard stream).
      // File may still open fine in PDF.js or browser viewers!
      // DO NOT THROW!
      isOpenable = true;
      pdfDoc = null;
    }
  }

  // If pdf-lib could not parse the document structure, use fallback metadata from PDF.js
  if (!pdfDoc) {
    const pageCount = fallbackMeta?.numPages || 1;
    return {
      isOpenable,
      isEncrypted,
      pdfVersion,
      pageCount,
      pageSizes: [],
      dominantPageSize: null, // Unable to determine
      orientations: [],
      dominantOrientation: null, // Unable to determine
      hasMixedPageSizes: null,
      hasMixedOrientation: null,
      hasRotation: null,
      hasForms: null,
      hasAnnotations: null,
      isPartial: true,
    };
  }

  try {
    const pageCount = pdfDoc.getPageCount();
    const pages = pdfDoc.getPages();
    const pageSizes = [];
    const orientations = [];
    let hasRotation = false;

    const sizeCounts = {};
    const orientationCounts = { portrait: 0, landscape: 0, square: 0 };

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      let width = 0;
      let height = 0;
      let rotation = 0;

      try {
        const sz = page.getSize();
        width = sz.width;
        height = sz.height;
      } catch {
        width = 0;
        height = 0;
      }

      try {
        rotation = (page.getRotation()?.angle || 0) % 360;
      } catch {
        rotation = 0;
      }

      if (rotation !== 0) {
        hasRotation = true;
      }

      let orientation = 'portrait';
      if (width && height) {
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
    const hasMixedPageSizes = pageSizes.length > 1 ? uniqueSizes.size > 1 : false;

    const uniqueOrientations = new Set(orientations);
    const hasMixedOrientation = orientations.length > 1 ? uniqueOrientations.size > 1 : false;

    // Form fields detection
    let hasForms = false;
    try {
      const form = pdfDoc.getForm?.();
      if (form && form.getFields().length > 0) {
        hasForms = true;
      }
    } catch {
      hasForms = null;
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
      hasAnnotations = null;
    }

    return {
      isOpenable: true,
      isEncrypted,
      pdfVersion,
      pageCount: pageCount || fallbackMeta?.numPages || 1,
      pageSizes,
      dominantPageSize,
      orientations,
      dominantOrientation,
      hasMixedPageSizes,
      hasMixedOrientation,
      hasRotation,
      hasForms,
      hasAnnotations,
      isPartial: false,
    };
  } catch (err) {
    console.warn('PDF detail extraction notice:', err);
    return {
      isOpenable: true,
      isEncrypted,
      pdfVersion,
      pageCount: fallbackMeta?.numPages || 1,
      pageSizes: [],
      dominantPageSize: null,
      orientations: [],
      dominantOrientation: null,
      hasMixedPageSizes: null,
      hasMixedOrientation: null,
      hasRotation: null,
      hasForms: null,
      hasAnnotations: null,
      isPartial: true,
    };
  }
}

/**
 * Inspects an image file client-side using browser Image decoding.
 * SAFE: Never throws.
 */
export async function inspectImage(file, detectedFormat, fallbackMeta = null) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      resolve({
        isOpenable: true,
        width: fallbackMeta?.width || 0,
        height: fallbackMeta?.height || 0,
        aspectRatio: '—',
        megapixels: 0,
        hasTransparency: false,
      });
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const width = img.naturalWidth || img.width || fallbackMeta?.width || 0;
      const height = img.naturalHeight || img.height || fallbackMeta?.height || 0;
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
      resolve({
        isOpenable: true,
        width: fallbackMeta?.width || 0,
        height: fallbackMeta?.height || 0,
        aspectRatio: '—',
        megapixels: 0,
        hasTransparency: false,
        isUndetermined: true,
      });
    };

    img.src = objectUrl;
  });
}

/**
 * Master client-side inspection function.
 * Evaluates the file, inspects container and content structure, and builds the readiness checks.
 * SAFE: Never throws unhandled exceptions.
 */
export async function inspectFile(file, options = {}) {
  if (!file) return null;

  try {
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
      pdfInfo = await inspectPdf(file, arrayBuffer, options.metadata);
    } else {
      imageInfo = await inspectImage(file, detectedFormat, options.metadata);
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
      if (pdfInfo.pageCount) {
        checks.push({
          id: 'page_count',
          status: 'PASS',
          labelKey: 'checkPageCount',
          valueKey: pdfInfo.pageCount === 1 ? 'checkPageCountSingle' : 'checkPageCountVal',
          params: { count: pdfInfo.pageCount },
        });
      } else {
        checks.push({
          id: 'page_count',
          status: 'INFO',
          labelKey: 'checkPageCount',
          valueKey: 'unableToDetermine',
        });
      }

      // Check 5: Page Uniformity
      if (pdfInfo.hasMixedPageSizes !== null && pdfInfo.dominantPageSize) {
        checks.push({
          id: 'page_sizes',
          status: pdfInfo.hasMixedPageSizes ? 'WARN' : 'PASS',
          labelKey: 'checkPageSizes',
          valueKey: pdfInfo.hasMixedPageSizes ? 'checkPageSizesMixed' : 'checkPageSizesUniform',
          params: { size: pdfInfo.dominantPageSize },
        });
      } else {
        checks.push({
          id: 'page_sizes',
          status: 'INFO',
          labelKey: 'checkPageSizes',
          valueKey: 'unableToDetermine',
        });
      }

      // Check 6: Orientation
      if (pdfInfo.dominantOrientation) {
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
        checks.push({
          id: 'page_orientation',
          status: 'INFO',
          labelKey: 'checkPageOrientation',
          valueKey: 'unableToDetermine',
        });
      }
    } else {
      // Image Dimensions
      if (imageInfo.width && imageInfo.height) {
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
      } else {
        checks.push({
          id: 'image_dimensions',
          status: 'INFO',
          labelKey: 'checkDimensions',
          valueKey: 'unableToDetermine',
        });
      }

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
  } catch (outerErr) {
    console.warn('Safe inspection error fallback:', outerErr);
    return {
      file: {
        name: file.name,
        size: file.size,
        sizeFormatted: formatBytes(file.size),
        type: file.type || 'application/octet-stream',
        format: getFileType(file) || 'UNKNOWN',
      },
      pdf: null,
      image: null,
      checks: [
        {
          id: 'file_readability',
          status: 'INFO',
          labelKey: 'checkOpensCorrectly',
          valueKey: 'unableToDetermine',
        },
      ],
      overallStatus: 'READY',
      timestamp: Date.now(),
    };
  }
}

/**
 * Evaluates a file's inspection result against customizable submission requirements.
 * Returns structured rules with PASSED, FAILED, or UNDETERMINED status, plus fixability info.
 */
export function evaluateRequirements(inspection, requirements = {}) {
  if (!inspection || !inspection.file) {
    return { isCompliant: false, hasFailures: false, rules: [], fixableRules: [], unfixableRules: [] };
  }

  const file = inspection.file;
  const pdf = inspection.pdf;
  const image = inspection.image;
  const rules = [];

  // Rule 1: Maximum File Size
  if (requirements.maxSizeBytes && requirements.maxSizeBytes > 0) {
    const passed = file.size <= requirements.maxSizeBytes;
    rules.push({
      id: 'max_size',
      labelKey: 'reqMaxSize',
      conditionText: `≤ ${formatBytes(requirements.maxSizeBytes)}`,
      actualText: formatBytes(file.size),
      status: passed ? 'PASSED' : 'FAILED',
      autoFixable: true,
      fixType: 'COMPRESS_SIZE',
      targetBytes: requirements.maxSizeBytes,
    });
  }

  // Rule 2: Minimum File Size
  if (requirements.minSizeBytes && requirements.minSizeBytes > 0) {
    const passed = file.size >= requirements.minSizeBytes;
    rules.push({
      id: 'min_size',
      labelKey: 'reqMinSize',
      conditionText: `≥ ${formatBytes(requirements.minSizeBytes)}`,
      actualText: formatBytes(file.size),
      status: passed ? 'PASSED' : 'FAILED',
      autoFixable: false,
    });
  }

  // Rule 3: Required Format
  if (requirements.format && requirements.format !== 'ANY') {
    const passed = file.format === requirements.format;
    const isPngToJpg = file.format === 'PNG' && requirements.format === 'JPG';
    rules.push({
      id: 'format',
      labelKey: 'reqFormat',
      conditionText: requirements.format,
      actualText: file.format,
      status: passed ? 'PASSED' : 'FAILED',
      autoFixable: isPngToJpg,
      fixType: isPngToJpg ? 'CONVERT_JPG' : null,
    });
  }

  // Rule 4: Maximum Pages (PDF)
  if (requirements.maxPages && requirements.maxPages > 0) {
    if (file.format === 'PDF') {
      if (pdf && pdf.pageCount !== undefined && pdf.pageCount !== null) {
        const passed = pdf.pageCount <= requirements.maxPages;
        rules.push({
          id: 'max_pages',
          labelKey: 'reqMaxPages',
          conditionText: `≤ ${requirements.maxPages}`,
          actualText: `${pdf.pageCount}`,
          status: passed ? 'PASSED' : 'FAILED',
          autoFixable: true,
          fixType: 'TRIM_PAGES',
        });
      } else {
        rules.push({
          id: 'max_pages',
          labelKey: 'reqMaxPages',
          conditionText: `≤ ${requirements.maxPages}`,
          actualText: '—',
          status: 'UNDETERMINED',
          autoFixable: false,
        });
      }
    }
  }

  // Rule 5: Minimum Pages (PDF)
  if (requirements.minPages && requirements.minPages > 0) {
    if (file.format === 'PDF') {
      if (pdf && pdf.pageCount !== undefined && pdf.pageCount !== null) {
        const passed = pdf.pageCount >= requirements.minPages;
        rules.push({
          id: 'min_pages',
          labelKey: 'reqMinPages',
          conditionText: `≥ ${requirements.minPages}`,
          actualText: `${pdf.pageCount}`,
          status: passed ? 'PASSED' : 'FAILED',
          autoFixable: false,
        });
      } else {
        rules.push({
          id: 'min_pages',
          labelKey: 'reqMinPages',
          conditionText: `≥ ${requirements.minPages}`,
          actualText: '—',
          status: 'UNDETERMINED',
          autoFixable: false,
        });
      }
    }
  }

  // Rule 6: PDF Page Size (e.g. A4)
  if (requirements.pageSize && requirements.pageSize !== 'ANY') {
    if (file.format === 'PDF') {
      if (pdf && pdf.dominantPageSize) {
        const matches = pdf.dominantPageSize === requirements.pageSize;
        const notMixed = !pdf.hasMixedPageSizes;
        const passed = matches && notMixed;
        rules.push({
          id: 'page_size',
          labelKey: 'reqPageSize',
          conditionText: requirements.pageSize,
          actualText: pdf.hasMixedPageSizes ? `${pdf.dominantPageSize} (Mixed)` : pdf.dominantPageSize,
          status: passed ? 'PASSED' : 'FAILED',
          autoFixable: true,
          fixType: 'NORMALIZE_PAGE_SIZE',
        });
      } else {
        rules.push({
          id: 'page_size',
          labelKey: 'reqPageSize',
          conditionText: requirements.pageSize,
          actualText: '—',
          status: 'UNDETERMINED',
          autoFixable: false,
        });
      }
    }
  }

  // Rule 7: Orientation
  if (requirements.orientation && requirements.orientation !== 'ANY') {
    const orientation = pdf?.dominantOrientation || (image?.height && image?.width ? (image.height > image.width ? 'portrait' : 'landscape') : null);
    if (orientation) {
      const passed = orientation === requirements.orientation && !pdf?.hasMixedOrientation;
      rules.push({
        id: 'orientation',
        labelKey: 'reqOrientation',
        conditionText: requirements.orientation === 'portrait' ? 'reqOrientationPortrait' : 'reqOrientationLandscape',
        actualText: orientation === 'portrait' ? 'reqOrientationPortrait' : 'reqOrientationLandscape',
        status: passed ? 'PASSED' : 'FAILED',
        isTranslationKey: true,
        autoFixable: file.format === 'PDF',
        fixType: file.format === 'PDF' ? 'NORMALIZE_ORIENTATION' : null,
      });
    } else {
      rules.push({
        id: 'orientation',
        labelKey: 'reqOrientation',
        conditionText: requirements.orientation === 'portrait' ? 'reqOrientationPortrait' : 'reqOrientationLandscape',
        actualText: '—',
        status: 'UNDETERMINED',
        isTranslationKey: true,
        autoFixable: false,
      });
    }
  }

  // Rule 8: Image Dimensions (maxWidth / maxHeight)
  if (file.format !== 'PDF' && (requirements.maxWidth || requirements.maxHeight)) {
    if (image && image.width && image.height) {
      let passed = true;
      if (requirements.maxWidth && image.width > requirements.maxWidth) passed = false;
      if (requirements.maxHeight && image.height > requirements.maxHeight) passed = false;
      const reqParts = [];
      if (requirements.maxWidth) reqParts.push(`W ≤ ${requirements.maxWidth}px`);
      if (requirements.maxHeight) reqParts.push(`H ≤ ${requirements.maxHeight}px`);
      rules.push({
        id: 'max_dimensions',
        labelKey: 'reqMaxDimensions',
        conditionText: reqParts.join(', '),
        actualText: `${image.width} × ${image.height} px`,
        status: passed ? 'PASSED' : 'FAILED',
        autoFixable: true,
        fixType: 'COMPRESS_SIZE',
      });
    } else {
      rules.push({
        id: 'max_dimensions',
        labelKey: 'reqMaxDimensions',
        conditionText: '—',
        actualText: '—',
        status: 'UNDETERMINED',
        autoFixable: false,
      });
    }
  }

  const isCompliant = rules.length > 0 && rules.every((r) => r.status === 'PASSED');
  const hasFailures = rules.some((r) => r.status === 'FAILED');
  const fixableRules = rules.filter((r) => r.status === 'FAILED' && r.autoFixable);
  const unfixableRules = rules.filter((r) => r.status === 'FAILED' && !r.autoFixable);

  return {
    isCompliant,
    hasFailures,
    rules,
    fixableRules,
    unfixableRules,
  };
}
