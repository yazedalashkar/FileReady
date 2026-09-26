import { PDFDocument } from 'pdf-lib';
import { formatBytes } from './fileUtils.js';

// Standard A4 dimensions in PDF points (72 points per inch)
const A4_PORTRAIT = [595.28, 841.89];
const A4_LANDSCAPE = [841.89, 595.28];

/**
 * Loads an image file into an HTMLImageElement to read true dimensions and orientation.
 */
function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    img.src = objectUrl;
  });
}

/**
 * Renders an image to an offscreen canvas and returns JPEG bytes and dimensions.
 * This guarantees proper orientation, color flattening, and universal embedding into PDF.
 */
async function processImageToJpegBytes(file, optimize = true) {
  const img = await loadImageElement(file);
  const origWidth = img.naturalWidth || img.width;
  const origHeight = img.naturalHeight || img.height;

  // Max dimension bound to prevent memory exhaustion and excessive PDF size
  const maxDim = optimize ? 2400 : 3600;
  let renderWidth = origWidth;
  let renderHeight = origHeight;

  if (origWidth > maxDim || origHeight > maxDim) {
    if (origWidth >= origHeight) {
      renderWidth = maxDim;
      renderHeight = Math.round((origHeight / origWidth) * maxDim);
    } else {
      renderHeight = maxDim;
      renderWidth = Math.round((origWidth / origHeight) * maxDim);
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = renderWidth;
  canvas.height = renderHeight;

  const ctx = canvas.getContext('2d', { alpha: false });
  // Clean white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, renderWidth, renderHeight);
  ctx.drawImage(img, 0, 0, renderWidth, renderHeight);

  // JPEG compression: 0.88 for optimized, 0.94 for high quality
  const quality = optimize ? 0.86 : 0.94;
  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', quality);
  });

  canvas.width = 0;
  canvas.height = 0;

  if (!blob) {
    throw new Error(`Failed to convert image ${file.name} to JPEG`);
  }

  const arrayBuffer = await blob.arrayBuffer();
  return {
    bytes: new Uint8Array(arrayBuffer),
    width: renderWidth,
    height: renderHeight,
  };
}

/**
 * Combines an array of image files into a single unified PDF document.
 * 
 * @param {File[]} imageFiles - Ordered array of image files
 * @param {Object} options - Configuration options
 * @param {Function} onProgress - Progress reporting callback
 */
export async function convertImagesToPdf(imageFiles, options = {}, onProgress) {
  if (!imageFiles || imageFiles.length === 0) {
    throw new Error('No images provided for PDF conversion.');
  }

  const {
    pageSize = 'a4', // 'a4' | 'fit'
    orientation = 'auto', // 'auto' | 'portrait' | 'landscape'
    margin = 15, // Margin in points: 0, 15, 30
    optimize = true, // Whether to optimize dimensions and compression for portal upload
  } = options;

  onProgress?.({
    stage: 'Initializing document...',
    percent: 5,
    current: 0,
    total: imageFiles.length,
  });

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setProducer('FileReady Client-Side Engine');
  pdfDoc.setCreator('FileReady');

  let totalOriginalSize = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    totalOriginalSize += file.size;

    const percent = Math.round(10 + (i / imageFiles.length) * 80);
    onProgress?.({
      stage: `Processing image ${i + 1} of ${imageFiles.length}: ${file.name}...`,
      percent,
      current: i + 1,
      total: imageFiles.length,
    });

    const { bytes, width: imgW, height: imgH } = await processImageToJpegBytes(file, optimize);
    const embeddedImage = await pdfDoc.embedJpg(bytes);

    let pageWidth, pageHeight;

    if (pageSize === 'fit') {
      // Page size exactly matches image dimensions
      pageWidth = imgW;
      pageHeight = imgH;
      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
      });
    } else {
      // Standard A4 Page
      let isLandscape = false;
      if (orientation === 'landscape') {
        isLandscape = true;
      } else if (orientation === 'portrait') {
        isLandscape = false;
      } else {
        // Auto: match image aspect ratio
        isLandscape = imgW > imgH;
      }

      pageWidth = isLandscape ? A4_LANDSCAPE[0] : A4_PORTRAIT[0];
      pageHeight = isLandscape ? A4_LANDSCAPE[1] : A4_PORTRAIT[1];

      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      // Scale image to fit within available page area while preserving aspect ratio
      const scaleX = availableWidth / imgW;
      const scaleY = availableHeight / imgH;
      const scale = Math.min(scaleX, scaleY);

      const drawW = imgW * scale;
      const drawH = imgH * scale;

      // Center the image on the page
      const posX = margin + (availableWidth - drawW) / 2;
      const posY = margin + (availableHeight - drawH) / 2;

      page.drawImage(embeddedImage, {
        x: posX,
        y: posY,
        width: drawW,
        height: drawH,
      });
    }
  }

  onProgress?.({
    stage: 'Finalizing PDF document...',
    percent: 92,
  });

  const pdfBytes = await pdfDoc.save();
  const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
  const downloadUrl = URL.createObjectURL(pdfBlob);

  onProgress?.({
    stage: 'PDF created successfully!',
    percent: 100,
  });

  return {
    blob: pdfBlob,
    fileName: `FileReady-Images-Combined-${imageFiles.length}pages.pdf`,
    downloadUrl,
    pageCount: imageFiles.length,
    totalOriginalSize,
    totalOriginalSizeFormatted: formatBytes(totalOriginalSize),
    finalSize: pdfBlob.size,
    finalSizeFormatted: formatBytes(pdfBlob.size),
  };
}
