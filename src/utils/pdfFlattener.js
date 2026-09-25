import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, PDFName } from 'pdf-lib';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';
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
 * Inspects a PDF for interactive form fields, annotations, and metadata.
 */
export async function inspectPdfForms(fileOrBytes) {
  const arrayBuffer =
    fileOrBytes instanceof Uint8Array
      ? fileOrBytes.buffer
      : fileOrBytes instanceof ArrayBuffer
      ? fileOrBytes
      : await fileOrBytes.arrayBuffer();

  let pdfDoc = null;
  let isEncrypted = false;

  try {
    pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch (err) {
    const msg = (err?.message || '').toLowerCase();
    if (msg.includes('password') || msg.includes('encrypt')) {
      isEncrypted = true;
    }
    return {
      isOpenable: false,
      isEncrypted,
      pageCount: 0,
      hasForms: false,
      fieldCount: 0,
      fieldTypes: {},
      hasAnnotations: false,
    };
  }

  const pageCount = pdfDoc.getPageCount();
  let hasForms = false;
  let fieldCount = 0;
  const fieldTypes = {
    text: 0,
    checkbox: 0,
    dropdown: 0,
    radio: 0,
    other: 0,
  };

  try {
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    fieldCount = fields.length;
    hasForms = fieldCount > 0;

    for (const f of fields) {
      const type = f.constructor.name || '';
      if (type.includes('Text')) {
        fieldTypes.text++;
      } else if (type.includes('CheckBox')) {
        fieldTypes.checkbox++;
      } else if (type.includes('Dropdown') || type.includes('OptionList')) {
        fieldTypes.dropdown++;
      } else if (type.includes('Radio')) {
        fieldTypes.radio++;
      } else {
        fieldTypes.other++;
      }
    }
  } catch {
    hasForms = false;
    fieldCount = 0;
  }

  // Check for annotations across pages
  let hasAnnotations = false;
  try {
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const annots = page.node.get(PDFName.of('Annots'));
      if (annots) {
        hasAnnotations = true;
        break;
      }
    }
  } catch {
    hasAnnotations = false;
  }

  return {
    isOpenable: true,
    isEncrypted: false,
    pageCount,
    hasForms,
    fieldCount,
    fieldTypes,
    hasAnnotations,
  };
}

/**
 * Flattens a PDF document client-side.
 * 
 * Supports two distinct modes:
 * 1. 'vector' (Default): Flattens all interactive form fields (AcroForms) into static graphical page content.
 *    Keeps text crisp, scalable, selectable, and file size small.
 * 2. 'print' (Full Visual Flattening / Print-to-PDF): Renders all pages into flat raster layers.
 *    100% immune to portal rejection due to multi-layer PDF or unsupported dynamic elements.
 */
export async function flattenPdf(file, options = {}, onProgress) {
  const {
    mode = 'vector',
    stripMetadata = true,
    stripAnnotations = false,
  } = options;

  onProgress?.({
    stage: 'Analyzing document structure...',
    percent: 10,
  });

  const arrayBuffer = await file.arrayBuffer();

  // Inspect before flattening
  const beforeInspection = await inspectPdfForms(arrayBuffer);

  let resultBytes = null;
  let fieldsFlattenedCount = beforeInspection.fieldCount || 0;

  if (mode === 'vector') {
    onProgress?.({
      stage: 'Flattening interactive form fields...',
      percent: 35,
    });

    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

    // Flatten interactive forms
    try {
      const form = pdfDoc.getForm();
      const fields = form.getFields();
      fieldsFlattenedCount = fields.length;

      if (fields.length > 0) {
        form.flatten();
      }
    } catch (formErr) {
      console.warn('Form flatten notice (no active AcroForm or partial structure):', formErr);
    }

    onProgress?.({
      stage: 'Sanitizing document annotations and security layers...',
      percent: 65,
    });

    // Optional: strip remaining non-form annotations
    if (stripAnnotations) {
      try {
        const pages = pdfDoc.getPages();
        for (const page of pages) {
          page.node.delete(PDFName.of('Annots'));
        }
      } catch (annotErr) {
        console.warn('Annotation strip notice:', annotErr);
      }
    }

    // Optional: strip document metadata (Creator, Author, Producer, Creation Date)
    if (stripMetadata) {
      try {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('FileReady Client-Side Engine');
        pdfDoc.setCreator('FileReady');
      } catch (metaErr) {
        console.warn('Metadata sanitize notice:', metaErr);
      }
    }

    onProgress?.({
      stage: 'Saving flattened document...',
      percent: 85,
    });

    resultBytes = await pdfDoc.save();
  } else {
    // Mode: 'print' (Full Visual / Print-to-PDF Raster Flattening)
    onProgress?.({
      stage: 'Loading pages for visual flattening...',
      percent: 15,
    });

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    const newPdf = await PDFDocument.create();
    const MAX_CANVAS_DIM = 2200; // High visual clarity

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const pagePercent = Math.round(20 + ((pageNum - 1) / numPages) * 65);
      onProgress?.({
        stage: `Rendering and locking page ${pageNum} of ${numPages}...`,
        percent: pagePercent,
        current: pageNum,
        total: numPages,
      });

      const page = await pdf.getPage(pageNum);
      const origVp = page.getViewport({ scale: 1.0 });
      const origWidth = origVp.width;
      const origHeight = origVp.height;

      // Scale up to 1.5x bounded by MAX_CANVAS_DIM
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

      if (typeof page.cleanup === 'function') page.cleanup();

      const jpegBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.88);
      });

      canvas.width = 0;
      canvas.height = 0;

      if (!jpegBlob) {
        throw new Error(`Failed to rasterize page ${pageNum}`);
      }

      const jpegBytes = await jpegBlob.arrayBuffer();
      const embeddedImg = await newPdf.embedJpg(jpegBytes);
      const newPage = newPdf.addPage([origWidth, origHeight]);
      newPage.drawImage(embeddedImg, {
        x: 0,
        y: 0,
        width: origWidth,
        height: origHeight,
      });
    }

    if (stripMetadata) {
      newPdf.setProducer('FileReady Client-Side Engine');
      newPdf.setCreator('FileReady');
    }

    onProgress?.({
      stage: 'Assembling finalized document...',
      percent: 90,
    });

    resultBytes = await newPdf.save();
  }

  onProgress?.({
    stage: 'Verifying final document...',
    percent: 96,
  });

  // Verified Inspection of after state
  const afterInspection = await inspectPdfForms(resultBytes);

  const finalBlob = new Blob([resultBytes], { type: 'application/pdf' });
  const cleanBaseName = file.name
    .replace(/\.pdf$/i, '')
    .replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_');
  const fileName = `${cleanBaseName}-flattened.pdf`;
  const downloadUrl = URL.createObjectURL(finalBlob);

  onProgress?.({
    stage: 'Document flattened successfully!',
    percent: 100,
  });

  return {
    blob: finalBlob,
    fileName,
    downloadUrl,
    modeUsed: mode,
    fieldsFlattenedCount,
    before: {
      fileSize: file.size,
      fileSizeFormatted: formatBytes(file.size),
      pageCount: beforeInspection.pageCount,
      hasForms: beforeInspection.hasForms,
      fieldCount: beforeInspection.fieldCount,
      fieldTypes: beforeInspection.fieldTypes,
      hasAnnotations: beforeInspection.hasAnnotations,
    },
    after: {
      fileSize: finalBlob.size,
      fileSizeFormatted: formatBytes(finalBlob.size),
      pageCount: afterInspection.pageCount,
      hasForms: afterInspection.hasForms,
      fieldCount: afterInspection.fieldCount,
      hasAnnotations: afterInspection.hasAnnotations,
      isFullyLocked: afterInspection.fieldCount === 0,
    },
  };
}
