/**
 * SEO metadata, structural copy, and FAQs for FileReady routes.
 * Strictly adheres to truthful, verified product behavior with no fake statistics,
 * no unverified ranking claims, and honest technical tradeoff disclosures.
 */

export const SITE_URL = 'https://fileready.vercel.app';

export const ROUTES_DATA = {
  '/': {
    path: '/',
    canonical: `${SITE_URL}/`,
    title: 'FileReady — Compress PDF & Images to the Size You Need',
    metaDescription:
      'Compress PDFs and images to a specific target size. Prepare files for strict upload limits like 2MB, 1MB, or 500KB with client-side processing.',
    h1: 'Make your file ready to upload.',
    subheading: 'Compress PDFs and images to the exact size you need.',
    defaultTargetValue: 2,
    defaultTargetUnit: 'MB',
    targetBadge: 'Adaptive Size Target',
    targetSummary:
      'Set your exact threshold—such as 2MB, 1MB, or 500KB—and FileReady optimizes your document directly in your browser without uploading your files.',
    realisticConstraints: [
      'Checks actual output file size instead of estimating.',
      'Prioritizes original dimensions where feasible, reducing image quality first.',
      'Warns before applying strong compression to protect text readability.',
      'Files are processed 100% locally in your browser for privacy.',
    ],
    howTo: [
      {
        step: 1,
        title: 'Choose your file',
        description: 'Select a PDF document or an image (JPG, JPEG, PNG).',
      },
      {
        step: 2,
        title: 'Specify your upload limit',
        description: 'Set the maximum file size required by the website (e.g. 2 MB or 500 KB).',
      },
      {
        step: 3,
        title: 'Review severity and prepare',
        description: 'FileReady analyzes the file structure and applies target-driven compression.',
      },
      {
        step: 4,
        title: 'Verify and download',
        description: 'FileReady measures the actual final Blob size before declaring success.',
      },
    ],
    faqs: [
      {
        question: 'How does FileReady differ from generic file compressors?',
        answer:
          'Most compressors apply a generic low, medium, or high preset and leave you guessing what the final size will be. FileReady lets you enter your upload limit upfront (such as 2MB or 500KB) and iteratively finds settings to fit under that threshold while checking the real output Blob size.',
      },
      {
        question: 'Are my confidential documents uploaded to a remote server?',
        answer:
          'No. All rendering, image downsampling, and PDF reconstruction occur strictly within your local browser using HTML5 Canvas and JavaScript. Files are never transmitted to any external server.',
      },
      {
        question: 'What happens if a file cannot reach the target size?',
        answer:
          'If a document contains too many high-resolution scanned pages to reach your target without making text illegible, FileReady stops at a defined readability floor. It reports the smallest size achieved rather than producing an unreadable file.',
      },
      {
        question: 'Which file formats are supported?',
        answer:
          'FileReady currently supports PDF documents and image formats including JPG, JPEG, and PNG (with alpha transparency support).',
      },
    ],
    relatedPages: [
      {
        path: '/compress-pdf-to-2mb',
        title: 'Compress PDF to 2MB',
        badge: 'PDF • 2 MB',
        description: 'Prepare resumes, university applications, and forms for standard 2MB portal limits.',
      },
      {
        path: '/compress-pdf-to-1mb',
        title: 'Compress PDF to 1MB',
        badge: 'PDF • 1 MB',
        description: 'Strict 1MB thresholds for government forms and official administrative portals.',
      },
      {
        path: '/compress-pdf-to-500kb',
        title: 'Compress PDF to 500KB',
        badge: 'PDF • 500 KB',
        description: 'Compact file budgets for single-page documents and older portal forms.',
      },
      {
        path: '/pdf-too-large-to-upload',
        title: 'PDF Too Large to Upload?',
        badge: 'Guide • Portal Help',
        description: 'Step-by-step workflow to fix upload rejection errors on online portals.',
      },
      {
        path: '/compress-scanned-pdf',
        title: 'Compress Scanned PDF',
        badge: 'Scanned • OCR/Images',
        description: 'Optimize image-heavy and scanned documents while keeping text and stamps legible.',
      },
      {
        path: '/compress-image-to-500kb',
        title: 'Compress Image to 500KB',
        badge: 'Image • 500 KB',
        description: 'Photos, passport scans, and ID images optimized under 500KB limits.',
      },
    ],
  },

  '/compress-pdf-to-2mb': {
    path: '/compress-pdf-to-2mb',
    canonical: `${SITE_URL}/compress-pdf-to-2mb`,
    title: 'Compress PDF to 2MB Online — Free | FileReady',
    metaDescription:
      'Compress your PDF under 2MB for university portals, job applications, and government forms. Browser-based processing with verified output size.',
    h1: 'Compress PDF to 2MB',
    subheading:
      'Reduce PDF file size to fit standard 2MB upload limits while keeping text and documents clear.',
    defaultTargetValue: 2,
    defaultTargetUnit: 'MB',
    targetBadge: 'Target: Under 2 MB',
    targetSummary:
      'A 2MB ceiling is common for job application portals, scholarship systems, and visa submissions. FileReady tests progressive compression tiers directly in your browser to meet this constraint.',
    realisticConstraints: [
      'Documents under 2MB are typically accepted by most enterprise and academic portals.',
      'Multi-page text documents generally reach 2MB with minimal change to visual quality.',
      'Scanned documents with dozens of high-DPI color pages may require downsampling.',
      'If 2MB cannot be reached without significant degradation, FileReady reports the exact achieved size.',
    ],
    howTo: [
      {
        step: 1,
        title: 'Upload your PDF',
        description: 'Select your PDF document (e.g. CV, portfolio, or application packet).',
      },
      {
        step: 2,
        title: 'Target pre-set to 2MB',
        description: 'The target is pre-configured to 2 MB. You can adjust it if your portal requires less.',
      },
      {
        step: 3,
        title: 'Sequential page processing',
        description: 'FileReady analyzes each page locally and balances resolution and compression.',
      },
      {
        step: 4,
        title: 'Verified download',
        description: 'The output is measured to verify it is under 2MB before download.',
      },
    ],
    faqs: [
      {
        question: 'How do I compress a PDF to 2MB?',
        answer:
          'Select your PDF on this page where the 2MB limit is preconfigured, then tap "Fix & Prepare File". FileReady processes each page sequentially and verifies the final file is under 2MB before presenting the download.',
      },
      {
        question: 'Can every PDF be compressed under 2MB?',
        answer:
          'Most typical documents fit under 2MB. However, very long documents (such as a 40-page high-resolution color catalogue) contain substantial data that may require downsampling or splitting to fit comfortably.',
      },
      {
        question: 'Why is my PDF rejected by portals even after compression?',
        answer:
          'Many online compressors use rough approximations that produce files just slightly over the threshold (e.g. 2.05MB or 2.1MB). FileReady checks the actual output Blob bytes to verify compliance with your 2MB limit.',
      },
      {
        question: 'Can scanned certificates and IDs be compressed to 2MB?',
        answer:
          'Yes. Scanned pages are rendered to canvas and re-encoded using balanced JPEG compression to reduce file size while preserving essential details like stamps and signatures.',
      },
      {
        question: 'Does FileReady upload my PDF to a server?',
        answer:
          'No. All processing happens in your browser’s JavaScript engine. Your personal information, grades, or identity records never leave your device.',
      },
      {
        question: 'What happens if FileReady cannot reach 2MB?',
        answer:
          'FileReady halts at an established readability floor, displays a clear "Target size not reached" notice, and gives you the smallest safely achievable file.',
      },
    ],
    relatedPages: [
      {
        path: '/compress-pdf-to-1mb',
        title: 'Compress PDF to 1MB',
        badge: 'PDF • 1 MB',
        description: 'For portals with a stricter 1MB file limit.',
      },
      {
        path: '/compress-pdf-to-500kb',
        title: 'Compress PDF to 500KB',
        badge: 'PDF • 500 KB',
        description: 'Strict 500KB budget for single-page documents and legacy systems.',
      },
      {
        path: '/pdf-too-large-to-upload',
        title: 'PDF Too Large to Upload?',
        badge: 'Portal Guide',
        description: 'How to troubleshoot portal rejection errors and set correct upload targets.',
      },
      {
        path: '/compress-scanned-pdf',
        title: 'Compress Scanned PDF',
        badge: 'Scanned Documents',
        description: 'Handle image-heavy scans without making text unreadable.',
      },
    ],
  },

  '/compress-pdf-to-1mb': {
    path: '/compress-pdf-to-1mb',
    canonical: `${SITE_URL}/compress-pdf-to-1mb`,
    title: 'Compress PDF to 1MB Online — Free | FileReady',
    metaDescription:
      'Compress PDF files under 1MB for strict online forms and government portals. Client-side processing with honest size verification.',
    h1: 'Compress PDF to 1MB',
    subheading:
      'Prepare PDFs for strict 1MB upload limits while keeping text and important details legible.',
    defaultTargetValue: 1,
    defaultTargetUnit: 'MB',
    targetBadge: 'Target: Under 1 MB',
    targetSummary:
      'A 1MB limit leaves little room for uncompressed images. FileReady applies adaptive compression to fit under 1,000,000 bytes with realistic quality safeguards.',
    realisticConstraints: [
      '1MB is a strict ceiling often used on government and official intake forms.',
      'Single-page and short scanned PDFs are generally easier to fit within a 1MB limit while maintaining readability.',
      'Documents with extensive high-resolution color photographs may require higher compression tiers.',
      'FileReady avoids excessive compression when reaching the target would significantly reduce readability.',
    ],
    howTo: [
      {
        step: 1,
        title: 'Select your PDF',
        description: 'Choose your document from your phone, tablet, or desktop.',
      },
      {
        step: 2,
        title: '1MB target active',
        description: 'The target size is locked to 1 MB (1,000,000 bytes).',
      },
      {
        step: 3,
        title: 'Adaptive quality search',
        description: 'FileReady tests progressive compression tiers to find the cleanest fit.',
      },
      {
        step: 4,
        title: 'Download verified PDF',
        description: 'Once verified under 1MB, download your ready-to-upload file.',
      },
    ],
    faqs: [
      {
        question: 'How do I reduce a PDF to 1MB?',
        answer:
          'Upload your file on this page with the 1MB target active. FileReady will sequentially process pages, balance image quality against file size, and verify the final byte count before offering the download.',
      },
      {
        question: 'Can every PDF be compressed to 1MB?',
        answer:
          'No. A 15-page color brochure or high-DPI legal document contains too much raw data to fit into 1MB without severe visual degradation. When a document cannot safely reach 1MB, FileReady provides the smallest legible result and notifies you.',
      },
      {
        question: 'Why is my PDF still larger than 1MB on other tools?',
        answer:
          'Generic compressors use fixed percentage presets that cannot adjust to your document’s specific page count. FileReady works backward from the 1MB target to find the right compression level.',
      },
      {
        question: 'How can I reduce a scanned PDF to 1MB?',
        answer:
          'FileReady renders each scanned page to canvas, flattens layers, and applies balanced JPEG compression. For short documents (1 to 4 pages), 1MB is often achievable with good readability.',
      },
      {
        question: 'Will compressing a PDF to 1MB make it blurry?',
        answer:
          'FileReady starts at higher resolution and quality settings for the 1MB budget and only reduces scale if necessary, helping prevent unnecessary blurriness.',
      },
      {
        question: 'What happens if FileReady cannot reach 1MB?',
        answer:
          'When a target cannot be reached without significant degradation, FileReady stops at a defined readability floor and reports the best achievable result.',
      },
    ],
    relatedPages: [
      {
        path: '/compress-pdf-to-2mb',
        title: 'Compress PDF to 2MB',
        badge: 'PDF • 2 MB',
        description: 'If your portal allows a more flexible 2MB file size.',
      },
      {
        path: '/compress-pdf-to-500kb',
        title: 'Compress PDF to 500KB',
        badge: 'PDF • 500 KB',
        description: 'Tighter limit for simple 1-page documents.',
      },
      {
        path: '/compress-scanned-pdf',
        title: 'Compress Scanned PDF',
        badge: 'Scanned Documents',
        description: 'Techniques and tradeoffs when reducing scanned paper documents.',
      },
      {
        path: '/pdf-too-large-to-upload',
        title: 'PDF Too Large to Upload?',
        badge: 'Troubleshooting',
        description: 'What to do when an online form rejects your PDF file.',
      },
    ],
  },

  '/compress-pdf-to-500kb': {
    path: '/compress-pdf-to-500kb',
    canonical: `${SITE_URL}/compress-pdf-to-500kb`,
    title: 'Compress PDF to 500KB Online — Free | FileReady',
    metaDescription:
      'Compress PDF documents under 500KB. Ideal for single-page forms, receipts, and certificates with strict portal limits.',
    h1: 'Compress PDF to 500KB',
    subheading:
      'Optimize small documents, certificates, and forms to fit tight 500KB size constraints.',
    defaultTargetValue: 500,
    defaultTargetUnit: 'KB',
    targetBadge: 'Target: Under 500 KB',
    targetSummary:
      'A 500KB limit is one of the most restrictive thresholds online. FileReady optimizes page streams and image compression to reach 500KB without dropping below essential readability floors.',
    realisticConstraints: [
      'Best suited for single-page forms, resumes, bank receipts, and brief certificates.',
      'Documents with more than 4 scanned pages may struggle to fit into 500KB while remaining legible.',
      'FileReady tests lower resolution tiers only when higher tiers exceed 500KB.',
      'If the document cannot fit under 500KB safely, FileReady reports the closest safe size.',
    ],
    howTo: [
      {
        step: 1,
        title: 'Upload compact document',
        description: 'Select your single-page or brief PDF file.',
      },
      {
        step: 2,
        title: 'Target locked to 500KB',
        description: 'FileReady sets the budget to 500,000 bytes.',
      },
      {
        step: 3,
        title: 'Adaptive tier evaluation',
        description: 'Iterates through compression settings to find the cleanest fit.',
      },
      {
        step: 4,
        title: 'Verified result',
        description: 'Downloads your file once the Blob size is confirmed under 500KB.',
      },
    ],
    faqs: [
      {
        question: 'Can a multi-page PDF reach 500KB?',
        answer:
          'Yes, if the document contains primarily vector text or is limited to 1 to 3 pages. For multi-page color scans, fitting into 500KB while keeping fine text readable can be challenging.',
      },
      {
        question: 'How does FileReady verify the 500KB limit?',
        answer:
          'After generating the PDF in memory, FileReady inspects the real Blob byte count. It will only display success if the actual file is strictly under 500KB (500,000 bytes).',
      },
      {
        question: 'Why do some compressors produce blurry 500KB PDFs?',
        answer:
          'Many tools apply an aggressive low resolution across all files. FileReady steps progressively through scale and quality combinations to retain as much sharpness as the 500KB budget allows.',
      },
      {
        question: 'What happens if a scanned PDF cannot reach 500KB?',
        answer:
          'FileReady stops at its established readability floor rather than generating unreadable output, and shows the smallest size it could achieve.',
      },
      {
        question: 'Is my confidential document secure?',
        answer:
          'Yes. All processing runs in your browser tab. Your document is never transmitted across the network.',
      },
    ],
    relatedPages: [
      {
        path: '/compress-pdf-to-1mb',
        title: 'Compress PDF to 1MB',
        badge: 'PDF • 1 MB',
        description: 'If 500KB is too tight for multi-page scanned paperwork.',
      },
      {
        path: '/compress-pdf-to-2mb',
        title: 'Compress PDF to 2MB',
        badge: 'PDF • 2 MB',
        description: 'Standard limit for longer documents and multi-page portfolios.',
      },
      {
        path: '/compress-scanned-pdf',
        title: 'Compress Scanned PDF',
        badge: 'Scanned Help',
        description: 'Why scanned PDFs are large and how resolution tradeoffs work.',
      },
      {
        path: '/compress-image-to-500kb',
        title: 'Compress Image to 500KB',
        badge: 'Image • 500 KB',
        description: 'If your file is an image (JPG or PNG) rather than a PDF.',
      },
    ],
  },

  '/pdf-too-large-to-upload': {
    path: '/pdf-too-large-to-upload',
    canonical: `${SITE_URL}/pdf-too-large-to-upload`,
    title: 'PDF Too Large to Upload? How to Fix File Size Errors | FileReady',
    metaDescription:
      'Fix "file exceeds maximum size" errors on job portals, universities, and government forms. Step-by-step workflow to compress and verify your PDF.',
    h1: 'PDF Too Large to Upload?',
    subheading:
      'Prepare your document to meet online portal upload limits with verified client-side compression.',
    defaultTargetValue: 2,
    defaultTargetUnit: 'MB',
    targetBadge: 'Portal Troubleshooting',
    targetSummary:
      'Online application forms, university admission portals, job boards, visa registries, and public services often reject PDFs that exceed strict upload limits. FileReady provides a clear workflow to reduce your file to the required size.',
    realisticConstraints: [
      'File size is the most common reason for upload rejections, but not the only one.',
      'Portals may also reject files due to unsupported characters in filenames, password protection, or network timeouts.',
      'Always check the portal’s stated limit (e.g. 2MB, 1MB, or 500KB) and aim slightly below it.',
      'FileReady verifies the actual output byte count before you download, reducing repeated rejection attempts.',
    ],
    howTo: [
      {
        step: 1,
        title: 'Check the portal limit',
        description: 'Identify the exact maximum file size stated by the website (e.g., 2MB, 1MB, or 500KB).',
      },
      {
        step: 2,
        title: 'Set target in FileReady',
        description: 'Enter the portal’s limit (or slightly less, such as 1.9MB for a 2MB cap).',
      },
      {
        step: 3,
        title: 'Upload and optimize',
        description: 'FileReady processes your document locally and verifies the output size.',
      },
      {
        step: 4,
        title: 'Inspect before submitting',
        description: 'Download the file and open it to verify text, numbers, and signatures are legible before submitting.',
      },
    ],
    faqs: [
      {
        question: 'Why did the website reject my PDF file?',
        answer:
          'Websites commonly reject PDFs because their file size exceeds the server’s configured limit. Other frequent causes include filenames with special symbols, password-protected files, or server request timeouts during slow uploads.',
      },
      {
        question: 'What target size should I choose if the portal limit is 2MB?',
        answer:
          'Setting your target to 2MB works in most cases. If a portal has an unusually strict threshold, setting 1.9MB or 1.8MB provides a comfortable safety margin.',
      },
      {
        question: 'Can FileReady fix all portal upload errors?',
        answer:
          'FileReady resolves file-size related errors. However, if a portal rejects your file because it requires a specific PDF/A format, disallows certain characters in the filename, or requires unencrypted pages, those requirements must be addressed separately.',
      },
      {
        question: 'How do I know the compressed file is actually under the limit?',
        answer:
          'FileReady directly queries the JavaScript Blob size in bytes after compiling the PDF. It only marks the process successful if the output is strictly within your requested limit.',
      },
      {
        question: 'Should I check the PDF before uploading it to an official portal?',
        answer:
          'Yes. We always recommend opening the downloaded PDF to confirm that small numbers, signatures, and stamps remain clearly legible before completing your submission.',
      },
    ],
    relatedPages: [
      {
        path: '/compress-pdf-to-2mb',
        title: 'Compress PDF to 2MB',
        badge: 'PDF • 2 MB',
        description: 'Direct tool preset for 2MB portal requirements.',
      },
      {
        path: '/compress-pdf-to-1mb',
        title: 'Compress PDF to 1MB',
        badge: 'PDF • 1 MB',
        description: 'Direct tool preset for 1MB government and academic forms.',
      },
      {
        path: '/compress-pdf-to-500kb',
        title: 'Compress PDF to 500KB',
        badge: 'PDF • 500 KB',
        description: 'Direct tool preset for strict 500KB submission caps.',
      },
      {
        path: '/compress-scanned-pdf',
        title: 'Compress Scanned PDF',
        badge: 'Scanned Help',
        description: 'Special considerations for scanned paper documents and photo attachments.',
      },
    ],
  },

  '/compress-scanned-pdf': {
    path: '/compress-scanned-pdf',
    canonical: `${SITE_URL}/compress-scanned-pdf`,
    title: 'Compress a Scanned PDF Online — Keep Text Legible | FileReady',
    metaDescription:
      'Reduce scanned PDF size without making fine print or signatures unreadable. Explains resolution tradeoffs with client-side verification.',
    h1: 'Compress a Scanned PDF',
    subheading:
      'Reduce large scanned documents while maintaining legible text, official stamps, and signatures.',
    defaultTargetValue: 2,
    defaultTargetUnit: 'MB',
    targetBadge: 'Scanned & Image PDFs',
    targetSummary:
      'Scanned PDFs are typically large because each page is a full-resolution bitmap image rather than lightweight text. FileReady balances canvas resolution and JPEG compression to reduce size while respecting text readability.',
    realisticConstraints: [
      'Scanned pages consist of pixel grids, which naturally require much more storage than digital vector text.',
      'Aggressive resolution downsampling can make small footnote text, official stamps, and fine signatures hard to read.',
      'FileReady stops at an established readability floor to avoid producing unreadable blur.',
      'For scans with many pages, consider setting a realistic target such as 2MB or 3MB rather than 500KB.',
    ],
    howTo: [
      {
        step: 1,
        title: 'Select scanned document',
        description: 'Choose your scanned contract, transcript, deed, or certificate.',
      },
      {
        step: 2,
        title: 'Choose a realistic target',
        description: 'Select an appropriate target based on your page count (e.g. 2MB for multi-page scans).',
      },
      {
        step: 3,
        title: 'Sequential page re-encoding',
        description: 'FileReady renders pages to canvas and optimizes image layers locally.',
      },
      {
        step: 4,
        title: 'Review and download',
        description: 'Inspect the resulting document to confirm all critical details remain clear.',
      },
    ],
    faqs: [
      {
        question: 'Why are scanned PDFs so much larger than regular PDFs?',
        answer:
          'Regular PDFs created in Word or Google Docs contain text instructions that take very few bytes. Scanned PDFs, by contrast, contain full-page raster photos of paper, storing millions of individual pixels per page.',
      },
      {
        question: 'Will compressing a scanned PDF make the text blurry?',
        answer:
          'Any raster compression involves some tradeoff between file size and sharpness. FileReady minimizes blur by testing higher resolution tiers first, and stops reducing quality if it reaches a predefined readability threshold.',
      },
      {
        question: 'Can I compress a 10-page scanned document under 1MB?',
        answer:
          'Fitting 10 full-color scanned pages under 1MB requires heavy compression (roughly 100KB per page), which can make fine text difficult to read. If possible, choose a 2MB target or scan in grayscale to preserve legibility.',
      },
      {
        question: 'Does FileReady use OCR or change document text?',
        answer:
          'No. FileReady does not perform OCR or alter text layers. It optimizes the resolution and image compression of the rendered page images.',
      },
      {
        question: 'What if FileReady cannot reach my target size?',
        answer:
          'If reaching your target would require dropping below our minimum safe quality floor, FileReady halts and presents the smallest safe file achieved, clearly stating that the target was not reached.',
      },
    ],
    relatedPages: [
      {
        path: '/compress-pdf-to-2mb',
        title: 'Compress PDF to 2MB',
        badge: 'PDF • 2 MB',
        description: 'Recommended size target for multi-page scanned documents.',
      },
      {
        path: '/compress-pdf-to-1mb',
        title: 'Compress PDF to 1MB',
        badge: 'PDF • 1 MB',
        description: 'Target for 1-to-3 page scans and official submissions.',
      },
      {
        path: '/pdf-too-large-to-upload',
        title: 'PDF Too Large to Upload?',
        badge: 'Portal Guide',
        description: 'Troubleshooting file size errors on application websites.',
      },
      {
        path: '/reduce-pdf-size',
        title: 'Reduce PDF Size Online',
        badge: 'General Guide',
        description: 'Understanding PDF components, vector streams, and compression methods.',
      },
    ],
  },

  '/reduce-pdf-size': {
    path: '/reduce-pdf-size',
    canonical: `${SITE_URL}/reduce-pdf-size`,
    title: 'Reduce PDF File Size Online — Free & Private | FileReady',
    metaDescription:
      'Learn why PDFs become large and reduce your file size online to meet specific limits. Client-side processing with honest size verification.',
    h1: 'Reduce PDF File Size Online',
    subheading:
      'Target-driven, browser-based PDF optimization designed to satisfy strict document upload requirements.',
    defaultTargetValue: 2,
    defaultTargetUnit: 'MB',
    targetBadge: 'PDF Optimization',
    targetSummary:
      'PDF file size depends on whether the document contains digital vector text, embedded font packages, or high-resolution raster images. FileReady helps you set a clear target and verifies the real output size.',
    realisticConstraints: [
      'Digital PDFs with text and vector charts compress differently than image-based scans.',
      'Target-based compression provides predictability that arbitrary percentage sliders cannot match.',
      'If a PDF contains embedded attachments or 3D assets, standard image compression may not reduce those elements.',
      'Output size is always verified against actual Blob byte count.',
    ],
    howTo: [
      {
        step: 1,
        title: 'Upload your document',
        description: 'Drop your PDF into FileReady directly in your browser.',
      },
      {
        step: 2,
        title: 'Set your size target',
        description: 'Choose a target size based on your specific upload or email requirements.',
      },
      {
        step: 3,
        title: 'Iterative optimization',
        description: 'FileReady balances resolution and compression to fit within the specified byte budget.',
      },
      {
        step: 4,
        title: 'Download verified result',
        description: 'Check your verified file size and download immediately.',
      },
    ],
    faqs: [
      {
        question: 'Why are some PDFs very large?',
        answer:
          'PDFs become large mainly due to high-resolution embedded images, uncompressed graphic streams, or scanned pages saved as raw bitmaps. Documents containing only digital text and standard fonts are usually much smaller.',
      },
      {
        question: 'Why is target-based compression better than percentage sliders?',
        answer:
          'Percentage sliders (e.g. "reduce by 50%") force you into trial-and-error because you cannot predict the resulting megabytes. With FileReady, you specify the exact limit needed (e.g. 2MB) and the tool calculates the right compression tier.',
      },
      {
        question: 'Why do some compressors report success when the file is still too big?',
        answer:
          'Many online tools estimate file sizes using rough mathematical formulas rather than measuring the generated binary file. FileReady directly measures the actual Blob byte count in memory before confirming success.',
      },
      {
        question: 'What should I do if my PDF still cannot reach the target?',
        answer:
          'If a multi-page scan cannot safely reach your target without illegible text, consider splitting the document into two parts, scanning in grayscale instead of color, or requesting a higher upload limit from the receiving portal.',
      },
      {
        question: 'Are my files kept private during compression?',
        answer:
          'Yes. FileReady runs entirely inside your browser using client-side JavaScript. Your files are not uploaded to our servers or stored anywhere.',
      },
    ],
    relatedPages: [
      {
        path: '/compress-pdf-to-2mb',
        title: 'Compress PDF to 2MB',
        badge: 'PDF • 2 MB',
        description: 'Most popular preset for online job and university applications.',
      },
      {
        path: '/compress-pdf-to-1mb',
        title: 'Compress PDF to 1MB',
        badge: 'PDF • 1 MB',
        description: 'Target for strict administrative portals.',
      },
      {
        path: '/compress-pdf-to-500kb',
        title: 'Compress PDF to 500KB',
        badge: 'PDF • 500 KB',
        description: 'Tight budget for receipts, certificates, and single-page forms.',
      },
      {
        path: '/compress-scanned-pdf',
        title: 'Compress Scanned PDF',
        badge: 'Scanned Documents',
        description: 'Detailed guide on raster image tradeoffs in scanned documents.',
      },
      {
        path: '/pdf-too-large-to-upload',
        title: 'PDF Too Large to Upload?',
        badge: 'Upload Troubleshooting',
        description: 'Step-by-step guidance when facing portal file rejection.',
      },
    ],
  },

  '/compress-image-to-500kb': {
    path: '/compress-image-to-500kb',
    canonical: `${SITE_URL}/compress-image-to-500kb`,
    title: 'Compress Image to 500KB Online — Free JPG & PNG | FileReady',
    metaDescription:
      'Compress JPG, JPEG, and PNG images under 500KB. Maintains dimensions first and preserves PNG transparency when feasible. Free and private.',
    h1: 'Compress Image to 500KB',
    subheading:
      'Reduce photo and image file size under 500KB while preserving dimensions and clarity.',
    defaultTargetValue: 500,
    defaultTargetUnit: 'KB',
    targetBadge: 'Target: Under 500 KB',
    targetSummary:
      '500KB is the standard maximum size for profile photos, ID uploads, and application images. FileReady tests quantization levels at full dimensions before resizing.',
    realisticConstraints: [
      'Prioritizes 100% original dimensions first, reducing JPEG quality before scaling down.',
      'Preserves PNG transparency whenever the image can fit within 500KB.',
      'If a transparent PNG cannot reach 500KB, offers optional JPG conversion with a clean white background.',
      'Processes files locally on an HTML5 canvas without cloud uploads.',
    ],
    howTo: [
      {
        step: 1,
        title: 'Upload your image',
        description: 'Choose any JPG, JPEG, or PNG image from your device.',
      },
      {
        step: 2,
        title: 'Target pre-set to 500KB',
        description: 'The target size is locked to 500 KB (500,000 bytes).',
      },
      {
        step: 3,
        title: 'Quality-first optimization',
        description: 'Tests quality levels at full resolution before reducing dimensions.',
      },
      {
        step: 4,
        title: 'Instant download',
        description: 'Download the verified image file directly from your browser.',
      },
    ],
    faqs: [
      {
        question: 'How do I reduce an image size to under 500KB?',
        answer:
          'Select your photo on this page. FileReady tests JPEG quantization levels at 100% original dimensions first. If the file is still above 500KB, it gently adjusts dimensions until the target is satisfied.',
      },
      {
        question: 'What happens to transparent PNG images at 500KB?',
        answer:
          'FileReady preserves alpha transparency by downscaling dimensions in native PNG format. If 500KB cannot be reached while keeping transparency, it offers an optional conversion to JPG with a white background.',
      },
      {
        question: 'Will my image dimensions change?',
        answer:
          'Not unless necessary. FileReady tests quality reduction at 100% original width and height first, and only reduces dimensions if quality adjustments alone cannot meet 500KB.',
      },
      {
        question: 'Can I compress both JPG and PNG images here?',
        answer:
          'Yes. FileReady supports JPG, JPEG, and PNG files. Opaque PNGs are automatically converted to efficient JPG format to achieve significant size reduction.',
      },
      {
        question: 'Are image files uploaded to any server?',
        answer:
          'No. All processing happens on an HTML5 canvas directly inside your device’s browser. Your personal photos remain private.',
      },
    ],
    relatedPages: [
      {
        path: '/compress-image-to-1mb',
        title: 'Compress Image to 1MB',
        badge: 'Image • 1 MB',
        description: 'Higher quality retention for high-resolution graphics and photography.',
      },
      {
        path: '/compress-pdf-to-500kb',
        title: 'Compress PDF to 500KB',
        badge: 'PDF • 500 KB',
        description: 'For document scans or multi-page certificates under 500KB.',
      },
      {
        path: '/pdf-too-large-to-upload',
        title: 'PDF Too Large to Upload?',
        badge: 'Portal Guide',
        description: 'Troubleshooting upload errors on websites and portal forms.',
      },
    ],
  },

  '/compress-image-to-1mb': {
    path: '/compress-image-to-1mb',
    canonical: `${SITE_URL}/compress-image-to-1mb`,
    title: 'Compress Image to 1MB Online — Free JPG & PNG | FileReady',
    metaDescription:
      'Compress high-resolution photos and PNG graphics under 1MB. Retain crisp details and original dimensions with browser-based processing.',
    h1: 'Compress Image to 1MB',
    subheading:
      'Optimize large smartphone photos and high-resolution images under 1MB with minimal quality loss.',
    defaultTargetValue: 1,
    defaultTargetUnit: 'MB',
    targetBadge: 'Target: Under 1 MB',
    targetSummary:
      'Modern smartphones produce photos between 4MB and 15MB. A 1MB limit provides ample headroom to retain sharp details while satisfying web and email limits.',
    realisticConstraints: [
      'Allows high JPEG quality retention (typically 75% to 85%) at 100% original dimensions.',
      'Handles high-resolution mobile photos sequentially to preserve device responsiveness.',
      'Maintains transparent PNG format for graphics that fit within the 1MB budget.',
      'All image processing occurs strictly in your browser session.',
    ],
    howTo: [
      {
        step: 1,
        title: 'Select your photo',
        description: 'Choose a high-resolution JPG or PNG file.',
      },
      {
        step: 2,
        title: '1MB target pre-selected',
        description: 'Target is pre-configured to 1 MB (1,000,000 bytes).',
      },
      {
        step: 3,
        title: 'Balanced compression',
        description: 'Tests quality levels to preserve sharpness at full pixel dimensions.',
      },
      {
        step: 4,
        title: 'Download verified image',
        description: 'Save your optimized image ready for submission.',
      },
    ],
    faqs: [
      {
        question: 'Why compress an image to 1MB instead of smaller?',
        answer:
          'If your upload portal allows up to 1MB, targeting 1MB instead of a smaller limit preserves significantly more sharpness and fine detail, especially in high-resolution photography.',
      },
      {
        question: 'How does FileReady prioritize image quality at 1MB?',
        answer:
          'Unlike generic tools that shrink image width and height immediately, FileReady tests quality reduction at full resolution first. Dimensions are only adjusted if necessary.',
      },
      {
        question: 'Can I compress large mobile camera photos to 1MB?',
        answer:
          'Yes. FileReady handles high-resolution smartphone photos on canvas, respecting mobile memory limits by managing image resources efficiently.',
      },
      {
        question: 'What is the difference between compressing to 1MB vs 500KB?',
        answer:
          '1MB allows higher JPEG quality retention at 100% dimensions. 500KB is stricter and may require moderate dimension scaling if the image has intricate details.',
      },
      {
        question: 'How does transparency work for PNG at 1MB?',
        answer:
          'At 1MB, many transparent illustrations and graphics fit comfortably without losing transparency. FileReady only suggests JPG conversion if a transparent PNG cannot reach the target in native PNG format.',
      },
    ],
    relatedPages: [
      {
        path: '/compress-image-to-500kb',
        title: 'Compress Image to 500KB',
        badge: 'Image • 500 KB',
        description: 'For stricter upload limits on profile photos and identification documents.',
      },
      {
        path: '/compress-pdf-to-1mb',
        title: 'Compress PDF to 1MB',
        badge: 'PDF • 1 MB',
        description: 'If you need to compress a PDF document under 1MB instead of an image.',
      },
      {
        path: '/compress-pdf-to-2mb',
        title: 'Compress PDF to 2MB',
        badge: 'PDF • 2 MB',
        description: 'Standard document limit for academic and job portals.',
      },
    ],
  },
};
