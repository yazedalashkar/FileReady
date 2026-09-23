import { PDFDocument, PageSizes } from 'pdf-lib';

/**
 * Standard dimension constants in PostScript points (72 points/inch)
 */
export const TARGET_PAGE_DIMENSIONS = {
  A4: {
    portrait: { width: 595.28, height: 841.89 },
    landscape: { width: 841.89, height: 595.28 },
  },
  'US Letter': {
    portrait: { width: 612.00, height: 792.00 },
    landscape: { width: 792.00, height: 612.00 },
  },
};

/**
 * Parses user page range input string (e.g. "1-10", "1, 3, 5-8") into zero-based page indices.
 * Strictly clamps within [0, totalPages - 1].
 */
export function parsePageRange(rangeStr, totalPages) {
  if (!rangeStr || !totalPages || totalPages <= 0) return [];
  const cleaned = rangeStr.replace(/[^0-9,-]/g, '');
  const parts = cleaned.split(',');
  const indices = new Set();

  for (const part of parts) {
    if (!part) continue;
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const minP = Math.max(1, Math.min(start, end));
        const maxP = Math.min(totalPages, Math.max(start, end));
        for (let p = minP; p <= maxP; p++) {
          indices.add(p - 1);
        }
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        indices.add(p - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

/**
 * Trims a PDF to only keep selected zero-based page indices using pdf-lib.
 * Returns Uint8Array of the new trimmed PDF.
 */
export async function trimPdfPages(fileOrBytes, selectedIndices, onProgress) {
  if (!selectedIndices || selectedIndices.length === 0) {
    throw new Error('No pages selected for trimming.');
  }

  onProgress?.({
    stage: 'Selecting requested pages...',
    percent: 15,
  });

  const arrayBuffer = fileOrBytes instanceof Uint8Array
    ? fileOrBytes.buffer
    : (fileOrBytes instanceof ArrayBuffer ? fileOrBytes : await fileOrBytes.arrayBuffer());

  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  // Validate indices
  const validIndices = selectedIndices.filter(i => i >= 0 && i < totalPages);
  if (validIndices.length === 0) {
    throw new Error('Selected pages are outside valid document bounds.');
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, validIndices);
  copiedPages.forEach(page => newDoc.addPage(page));

  const resultBytes = await newDoc.save();
  return resultBytes;
}

/**
 * Normalizes PDF page dimensions and orientation using pdf-lib.
 * Embeds each source page scaled and centered into the target page dimensions.
 * Preserves all visual content without clipping or metadata-only rotation.
 */
export async function normalizePdfPages(fileOrBytes, options = {}, onProgress) {
  const { pageSize = 'ANY', orientation = 'ANY' } = options;

  if (pageSize === 'ANY' && orientation === 'ANY') {
    return fileOrBytes instanceof Uint8Array ? fileOrBytes : new Uint8Array(await fileOrBytes.arrayBuffer());
  }

  onProgress?.({
    stage: 'Analyzing page dimensions...',
    percent: 20,
  });

  const arrayBuffer = fileOrBytes instanceof Uint8Array
    ? fileOrBytes.buffer
    : (fileOrBytes instanceof ArrayBuffer ? fileOrBytes : await fileOrBytes.arrayBuffer());

  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  if (totalPages === 0) {
    throw new Error('PDF contains no pages to normalize.');
  }

  const newDoc = await PDFDocument.create();

  for (let i = 0; i < totalPages; i++) {
    const pageNum = i + 1;
    onProgress?.({
      stage: ,
      percent: Math.round(20 + ((i) / totalPages) * 60),
      current: pageNum,
      total: totalPages,
    });

    const srcPage = srcDoc.getPage(i);
    const origSize = srcPage.getSize();
    const origW = origSize.width;
    const origH = origSize.height;

    // Determine target width & height
    let targetW = origW;
    let targetH = origH;

    if (pageSize === 'A4') {
      if (orientation === 'landscape') {
        targetW = TARGET_PAGE_DIMENSIONS.A4.landscape.width;
        targetH = TARGET_PAGE_DIMENSIONS.A4.landscape.height;
      } else {
        // default to portrait for A4
        targetW = TARGET_PAGE_DIMENSIONS.A4.portrait.width;
        targetH = TARGET_PAGE_DIMENSIONS.A4.portrait.height;
      }
    } else if (pageSize === 'US Letter') {
      if (orientation === 'landscape') {
        targetW = TARGET_PAGE_DIMENSIONS['US Letter'].landscape.width;
        targetH = TARGET_PAGE_DIMENSIONS['US Letter'].landscape.height;
      } else {
        targetW = TARGET_PAGE_DIMENSIONS['US Letter'].portrait.width;
        targetH = TARGET_PAGE_DIMENSIONS['US Letter'].portrait.height;
      }
    } else {
      // pageSize is ANY, but orientation is specified
      if (orientation === 'portrait' && origW > origH) {
        // swap to portrait
        targetW = Math.min(origW, origH);
        targetH = Math.max(origW, origH);
      } else if (orientation === 'landscape' && origH > origW) {
        // swap to landscape
        targetW = Math.max(origW, origH);
        targetH = Math.min(origW, origH);
      }
    }

    // Embed source page
    const embeddedPage = await newDoc.embedPage(srcPage);
    const embW = embeddedPage.width;
    const embH = embeddedPage.height;

    // Scale to fit while maintaining aspect ratio
    const scale = Math.min(targetW / embW, targetH / embH);
    const scaledW = embW * scale;
    const scaledH = embH * scale;

    // Center on target page
    const x = (targetW - scaledW) / 2;
    const y = (targetH - scaledH) / 2;

    const newPage = newDoc.addPage([targetW, targetH]);
    newPage.drawPage(embeddedPage, {
      x,
      y,
      width: scaledW,
      height: scaledH,
    });
  }

  onProgress?.({
    stage: 'Finalizing page dimensions...',
    percent: 85,
  });

  const normalizedBytes = await newDoc.save();
  return normalizedBytes;
}
