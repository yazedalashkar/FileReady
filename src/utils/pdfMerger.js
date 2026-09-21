import { PDFDocument } from 'pdf-lib';

/**
 * Validates whether a file is a PDF.
 */
export function isPdfFile(file) {
  if (!file) return false;
  const name = (file.name || '').toLowerCase();
  const type = (file.type || '').toLowerCase();
  return type === 'application/pdf' || name.endsWith('.pdf');
}

/**
 * Attempts to inspect the page count of a PDF file using pdf-lib.
 * Returns null if inspection fails (e.g. encrypted or corrupted).
 */
export async function getPdfPageCount(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    return pdfDoc.getPageCount();
  } catch (err) {
    return null;
  }
}

/**
 * Merges multiple PDF files in the exact provided order using pdf-lib.
 * Returns real Blob, real Blob size, total page count, and download URL.
 */
export async function mergePdfFiles(files, onProgress) {
  if (!files || files.length < 2) {
    const err = new Error('PLEASE_SELECT_AT_LEAST_TWO');
    err.code = 'PLEASE_SELECT_AT_LEAST_TWO';
    throw err;
  }

  // 1. Validate all files
  for (const file of files) {
    if (!isPdfFile(file)) {
      const err = new Error('INVALID_FILE_TYPE');
      err.code = 'INVALID_FILE_TYPE';
      err.fileName = file.name;
      throw err;
    }
  }

  onProgress?.({
    stage: 'STARTING',
    current: 0,
    total: files.length,
  });

  try {
    const mergedPdf = await PDFDocument.create();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      onProgress?.({
        stage: 'READING',
        current: i + 1,
        total: files.length,
        fileName: file.name,
      });

      let arrayBuffer;
      try {
        arrayBuffer = await file.arrayBuffer();
      } catch (readErr) {
        const err = new Error('CANT_READ_FILE');
        err.code = 'CANT_READ_FILE';
        err.fileName = file.name;
        throw err;
      }

      let srcDoc;
      try {
        srcDoc = await PDFDocument.load(arrayBuffer);
      } catch (loadErr) {
        const msg = (loadErr?.message || '').toLowerCase();
        if (msg.includes('password') || msg.includes('encrypt')) {
          const err = new Error('PASSWORD_PROTECTED');
          err.code = 'PASSWORD_PROTECTED';
          err.fileName = file.name;
          throw err;
        }
        const err = new Error('CORRUPTED_FILE');
        err.code = 'CORRUPTED_FILE';
        err.fileName = file.name;
        throw err;
      }

      const pageIndices = srcDoc.getPageIndices();
      if (pageIndices.length === 0) {
        continue;
      }

      const copiedPages = await mergedPdf.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const totalPages = mergedPdf.getPageCount();
    if (totalPages === 0) {
      const err = new Error('EMPTY_DOCUMENT');
      err.code = 'EMPTY_DOCUMENT';
      throw err;
    }

    onProgress?.({
      stage: 'SAVING',
      current: files.length,
      total: files.length,
    });

    const pdfBytes = await mergedPdf.save();
    const finalBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const downloadUrl = URL.createObjectURL(finalBlob);

    return {
      blob: finalBlob,
      finalSizeBytes: finalBlob.size,
      totalPages,
      fileCount: files.length,
      downloadUrl,
      fileName: 'fileready-merged.pdf',
    };
  } catch (err) {
    if (err.code) throw err;
    const msg = (err?.message || '').toLowerCase();
    if (msg.includes('memory') || msg.includes('quota') || msg.includes('maximum call')) {
      const e = new Error('MEMORY_LIMIT');
      e.code = 'MEMORY_LIMIT';
      throw e;
    }
    const e = new Error('GENERIC_MERGE_ERROR');
    e.code = 'GENERIC_MERGE_ERROR';
    throw e;
  }
}
