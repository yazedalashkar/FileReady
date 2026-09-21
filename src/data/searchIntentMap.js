/**
 * Search Intent Content Map for FileReady
 * Defines user query patterns, underlying problems, technical tradeoffs,
 * and routing destinations without keyword stuffing or speculative volumes.
 */

export const SEARCH_INTENT_GROUPS = {
  GROUP_A_EXACT_PDF_TARGETS: {
    name: 'Group A: Exact PDF Targets',
    description:
      'Users facing explicit file size caps on upload portals (e.g. 2MB, 1MB, 500KB) needing a precise byte budget.',
    queries: [
      'compress PDF to 2MB',
      'compress PDF to 1MB',
      'compress PDF to 500KB',
      'reduce PDF size to 2MB online',
      'compress PDF under 1MB',
      'make PDF less than 500KB',
    ],
    targetPages: [
      '/compress-pdf-to-2mb',
      '/compress-pdf-to-1mb',
      '/compress-pdf-to-500kb',
    ],
    technicalTradeoff:
      'Requires iterative scale and JPEG quality adjustments per page, balanced against text readability floors.',
  },

  GROUP_B_EXACT_IMAGE_TARGETS: {
    name: 'Group B: Exact Image Targets',
    description:
      'Users needing photos, scans, IDs, or transparent graphics under strict image upload size limits.',
    queries: [
      'compress image to 500KB',
      'compress image to 1MB',
      'reduce JPG size to 500KB',
      'compress PNG to 500KB',
      'make photo under 1MB',
    ],
    targetPages: [
      '/compress-image-to-500kb',
      '/compress-image-to-1mb',
    ],
    technicalTradeoff:
      'Prioritizes 100% original dimensions via JPEG quantization before downscaling; respects PNG alpha transparency.',
  },

  GROUP_C_PROBLEM_INTENT: {
    name: 'Group C: Problem-Driven Upload Limit Intent',
    description:
      'Users who encountered an upload rejection on a portal and need troubleshooting and a step-by-step resolution.',
    queries: [
      'PDF too large to upload',
      'PDF upload size limit',
      'reduce PDF size for upload',
      'how to make a PDF smaller for upload',
      'PDF is too large for online form',
      'website says PDF exceeds maximum size',
    ],
    targetPages: [
      '/pdf-too-large-to-upload',
    ],
    technicalTradeoff:
      'Focuses on identifying portal constraints, setting an exact target, verifying output Blobs, and distinguishing size rejections from non-size portal errors.',
  },

  GROUP_D_DIFFICULT_PDF_TYPES: {
    name: 'Group D: Difficult File Types (Scanned & Raster PDFs)',
    description:
      'Users dealing with physical documents scanned to PDF that take up tens of megabytes due to bitmap image payloads.',
    queries: [
      'compress scanned PDF',
      'reduce scanned PDF size',
      'compress image-heavy PDF',
      'reduce PDF without making text unreadable',
      'make scanned document smaller',
    ],
    targetPages: [
      '/compress-scanned-pdf',
    ],
    technicalTradeoff:
      'Addresses canvas rasterization, DPI and canvas scale reduction, JPEG compression on page bitmaps, and honest quality floors to prevent illegible signatures/stamps.',
  },

  GROUP_E_TARGET_QUALITY_QUESTIONS: {
    name: 'Group E: Target and Quality Considerations',
    description:
      'Users asking whether specific compression goals are technically feasible and why certain files resist reduction.',
    queries: [
      'can a PDF be compressed to 1MB',
      'why is my PDF still larger after compression',
      'will compressing PDF reduce quality',
      'why does a scanned PDF stay large',
      'how to reduce PDF to a specific size',
    ],
    targetPages: [
      '/reduce-pdf-size',
      '/compress-pdf-to-1mb',
    ],
    technicalTradeoff:
      'Clarifies differences between vector/text PDF components and raster image payloads, explaining why arbitrary percentage sliders fail and why Blob verification matters.',
  },
};
