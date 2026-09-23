/**
 * Professional localization dictionary for FileReady (English & Arabic).
 * Adheres to natural Arabic phrasing for web apps, strictly avoids machine-literal translations,
 * and keeps technical brand names (FileReady, PDF, JPG, PNG, etc.) in their original Latin forms.
 */

export const UI_TRANSLATIONS = {
  en: {
    // Header & Meta
    brandSlogan: 'File size, ready.',
    clientSideBadge: '100% Client-Side',
    switchThemeLight: 'Switch to light mode',
    switchThemeDark: 'Switch to dark mode',
    themeLightLabel: 'Light',
    themeDarkLabel: 'Dark',
    langEn: 'English',
    langAr: 'العربية',
    installApp: 'Install App',
    installShort: 'Install',

    // Target Size Input
    targetLabel: 'Target Maximum Size',
    maxLimit: 'Maximum limit',
    commonLimits: 'Common portal limits:',
    quickSelectAria: 'Quick select {value} {unit}',
    unitMb: 'MB',
    unitKb: 'KB',

    // Dropzone
    chooseFile: 'Choose a file',
    orDragDrop: 'or drag and drop here',
    supportedFormats: 'Supports PDF, JPG, JPEG, and PNG',
    clientSideNotice: 'All processing happens locally in your browser',

    // Analysis & States
    analyzingTitle: 'Analyzing your file...',
    preparingTitle: 'Preparing your file...',
    compressingTitle: 'Compressing file...',
    verifyingTitle: 'Verifying final size...',
    optimizingStep: 'Optimizing page {current} of {total}...',
    analyzingImage: 'Testing compression levels at full dimensions...',
    downscalingImage: 'Adjusting image resolution to fit target...',
    processingImage: 'Processing image...',

    // Metadata details
    originalSize: 'Original size:',
    targetLimit: 'Target limit:',
    finalSize: 'Final size:',
    pagesLabel: 'Pages:',
    dimensionsLabel: 'Dimensions:',
    fileComplies: 'Your file already complies with this limit!',
    noCompressionNeeded: 'No compression needed. You can upload this file as is.',
    exceedsBy: 'Exceeds limit by',
    reductionNeeded: 'reduction needed',

    // Severity badges & texts
    severityGentle: 'Gentle',
    severityModerate: 'Moderate',
    severityStrong: 'Strong',
    severityGentleText: 'Minimal reduction needed. High visual quality will be preserved.',
    severityModerateText: 'Moderate compression. Text and details should remain clean and readable.',
    severityStrongText: 'Substantial compression required to meet this target size.',

    // Actions
    btnPrepare: 'Fix & Prepare File',
    btnCancel: 'Cancel',
    btnDownloadReady: 'Download Ready File',
    btnCompressAnother: 'Compress Another File',
    btnConvertJpg: 'Convert to JPG',
    btnKeepPng: 'Keep PNG transparency',

    // Results & Honest feedback
    resultAchievedTitle: 'Target size reached',
    resultAchievedSub: 'File is verified under your target limit and ready to upload.',
    resultNotAchievedTitle: 'Target size not reached',
    resultNotAchievedSub:
      'We reached a safe readability floor. Further compression would make text unreadable.',
    pngTransparencyWarning:
      'This image has transparency. We reduced it as much as possible while keeping transparency, but it is still above your target.',
    pngConvertSuggestion:
      'Converting to JPG will remove transparency and use a clean white background to reach your target size.',

    // Modal
    modalStrongTitle: 'Strong compression required',
    modalStrongPdfMsg:
      'To reduce this PDF to your target, FileReady will need to significantly compress page images. Scanned text may become less sharp. Do you want to continue?',
    modalStrongImgMsg:
      'To reach your requested limit, FileReady may need to reduce image dimensions and quality. Do you want to continue?',
    modalConvertTitle: 'Convert transparent PNG to JPG?',
    modalConvertMsg:
      'This PNG contains transparency. Converting it to JPG will remove transparency and replace transparent areas with a solid white background to satisfy your target size. Do you want to convert to JPG?',
    modalContinueBtn: 'Continue compression',
    modalCancelBtn: 'Cancel',

    // Section Titles
    howItWorksTitle: 'How FileReady prepares your file',
    realisticTitle: 'Realistic constraints & safeguards',
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Clear answers regarding file size constraints and client-side processing.',
    relatedToolsTitle: 'Related Target Limits',
    relatedToolsSubtitle: 'Need a different file size or format? Select another targeted tool:',

    // Footer
    footerSlogan: 'Make your file ready to upload.',
    footerCreatedBy: 'Created by',
    footerFollow: 'Follow FileReady',
    footerLocal1: '🔒 Your files are processed locally in your browser.',
    footerLocal2: 'Files are not uploaded to a server.',

    // Errors
    errUnsupported: 'FileReady currently supports PDF, JPG, JPEG, and PNG files.',
    errPassword: 'This PDF is password-protected and cannot be processed.',
    errCantRead: "We couldn't read this file. Please try another file.",
    errTooLarge: 'The file is too large for this device/browser to process safely.',
    errGeneric: 'Unable to complete file optimization. Please try another target size.',
    // Tools Hub & Navigation
    toolsNav: 'Tools',
    toolsNavTitle: 'FileReady Tools',
    toolsHubTitle: 'FileReady Tools',
    toolsHubSubtitle: 'Explore free, 100% client-side tools for compressing, merging, and preparing PDFs and images.',
    toolsHubBadge: 'Free & Client-Side',
    toolsCategoryPdf: 'PDF Tools',
    toolsCategoryImages: 'Image Tools',

    // Tool Cards Descriptions
    toolTitleMergePdf: 'Merge PDF',
    toolDescMergePdf: 'Combine multiple PDF files into one clean document.',
    toolDescPdf2Mb: 'Prepare PDFs for common 2MB upload limits.',
    toolDescPdf1Mb: 'Reduce PDF to fit strict 1MB portal limits.',
    toolDescPdf500Kb: 'Compact size for single-page documents and forms.',
    toolDescPdfTooLarge: 'Step-by-step fix for upload portal rejections.',
    toolDescPdfScanned: 'Optimize image-heavy scans while keeping text legible.',
    toolDescPdfReduce: 'General PDF compression for any custom size limit.',
    toolDescImage500Kb: 'Photos and ID scans under 500KB limits.',
    toolDescImage1Mb: 'High-resolution smartphone photos and graphics.',

    // Merge PDF Tool
    mergePdfTitle: 'Merge PDF',
    mergePdfSubtitle: 'Combine multiple PDF files into one clean document directly in your browser.',
    selectPdfFiles: 'Select PDF files',
    orDragDropPdfs: 'or drag and drop PDFs here',
    mergePdfs: 'Merge PDFs',
    remove: 'Remove',
    moveUp: 'Move up',
    moveDown: 'Move down',
    filesMergedSuccessfully: 'Files merged successfully',
    filesLabel: 'Files',
    downloadMergedPdf: 'Download Merged PDF',
    mergeAnotherSet: 'Merge Another Set',
    addMorePdfs: 'Add more PDFs',
    reorderHint: 'Use the arrows to arrange the files in your desired order before merging.',
    errMergeSelectTwo: 'Please select at least two PDF files to merge.',
    errMergeOnlyPdf: 'Please select PDF files only.',
    errMergePassword: 'This PDF may be password-protected or encrypted.',
    errMergeCorrupted: 'Unable to read this PDF file. It may be corrupted.',
    errMergeEmpty: 'The selected files do not contain any readable pages.',
    errMergeMemory: 'Unable to merge these files in your browser. Try fewer or smaller files.',
    errMergeGeneric: 'Unable to merge these files. Please try another set of files.',
    mergingStageReading: 'Reading file {current} of {total}...',
    mergingStageSaving: 'Building and verifying merged document...',

    // Additional Tools Hub Items
    toolBadgeMergePdf: 'New • Merge',
    toolTitlePdf2Mb: 'Compress PDF to 2MB',
    toolBadgePdf2Mb: 'PDF • 2 MB',
    toolTitlePdf1Mb: 'Compress PDF to 1MB',
    toolBadgePdf1Mb: 'PDF • 1 MB',
    toolTitlePdf500Kb: 'Compress PDF to 500KB',
    toolBadgePdf500Kb: 'PDF • 500 KB',
    toolTitlePdfTooLarge: 'PDF Too Large to Upload?',
    toolBadgePdfTooLarge: 'Portal Guide',
    toolTitlePdfScanned: 'Compress Scanned PDF',
    toolBadgePdfScanned: 'Scanned Docs',
    toolTitlePdfReduce: 'Reduce PDF Size',
    toolBadgePdfReduce: 'Adaptive',
    toolTitleImage500Kb: 'Compress Image to 500KB',
    toolBadgeImage500Kb: 'Image • 500 KB',
    toolTitleImage1Mb: 'Compress Image to 1MB',
    toolBadgeImage1Mb: 'Image • 1 MB',
    returnToCompressor: 'Return to FileReady Compressor',
    exploreAllTools: 'Explore all FileReady Tools',

    // Merge PDF Details & Dynamic Labels
    mergePdfBadge: 'PDF Tool • 100% Client-Side',
    selectTwoOrMorePdfs: 'Select two or more files to combine them',
    clientSideNotice: 'All processing happens locally in your browser',
    selectedFilesCount: 'Selected Files ({count})',
    clearAll: 'Clear all',
    pageCountSingle: '{count} page',
    pageCountMultiple: '{count} pages',
    ariaMoveUp: 'Move up',
    ariaMoveDown: 'Move down',
    ariaRemoveFile: 'Remove file',
    mergingPdfs: 'Merging PDFs...',
    mergingStagePreparing: 'Preparing files...',
    filesMergedDesc: 'Combined {count} PDF files into a single unified document.',
    pagesLabel: 'Pages',
    finalSize: 'Final size',
    // Phase 9: File Readiness Inspector
    inspectorTitle: 'File Readiness Check',
    inspectorSubtitle: 'Pre-flight check for upload requirements',
    inspectorBadge: 'Pre-Submission Check',
    inspectorStatusLabel: 'Readiness Status',
    statusReady: 'Ready for Submission',
    statusNeedsAttention: 'Needs Preparation',
    statusNotReady: 'Not Ready',
    statusAnalyzing: 'Inspecting file...',

    checkFormat: 'Format',
    checkFormatPdf: 'PDF Document',
    checkFormatPdfVersion: 'PDF Document (v{version})',
    checkFormatImage: '{format} Image',
    checkOpensCorrectly: 'Parseability',
    checkOpensSuccess: 'Opens correctly',
    checkOpensError: 'Unable to parse file',
    checkPassword: 'Password Protection',
    checkNotEncrypted: 'Not password protected',
    checkIsEncrypted: 'Password protected / Encrypted',
    checkPageCount: 'Pages',
    checkPageCountVal: '{count} pages',
    checkPageCountSingle: '1 page',
    checkDimensions: 'Dimensions',
    checkDimensionsVal: '{width} × {height} px ({aspectRatio})',
    checkPageSizes: 'Page Uniformity',
    checkPageSizesUniform: 'Uniform ({size})',
    checkPageSizesMixed: 'Mixed page sizes detected',
    checkPageOrientation: 'Orientation',
    checkOrientationPortrait: 'Portrait',
    checkOrientationLandscape: 'Landscape',
    checkOrientationMixed: 'Mixed orientations',
    checkTransparency: 'Transparency',
    checkHasTransparency: 'Transparent areas detected (alpha)',
    checkNoTransparency: 'No transparency',
    checkRotation: 'Rotation',
    checkRotationDetected: 'Rotated pages detected',
    checkRotationNone: 'Standard 0° rotation',
    checkForms: 'Interactive Forms',
    checkFormsDetected: 'Contains form fields',
    checkFormsNone: 'No form fields',
    checkAnnotations: 'Annotations',
    checkAnnotationsDetected: 'Contains annotations / comments',
    checkAnnotationsNone: 'No annotations',
    checkFileSize: 'File Size',
    checkFileSizeOk: '{size} (Within target {target})',
    checkFileSizeExceeds: '{size} (Exceeds target {target})',
    checkFileSizeNoTarget: '{size}',

    inspectorDetailsToggle: 'Technical Specifications',
    inspectorDetailsHide: 'Hide Specifications',
    inspectorFixSuggestion: 'FileReady can optimize this file below to make it compliant with your upload limit.',
    inspectorReadyMessage: 'File meets standard formatting and size criteria for submission.',
    inspectorEncryptedMessage: 'Password-protected files are rejected by submission portals. Please remove the password.',
    ariaInspectorCheck: 'File check result',
    ariaToggleDetails: 'Toggle technical specifications',
    // Phase 10: Smart Requirements & Inspector Fix
    unableToDetermine: 'Unable to determine',
    valUndetermined: '— Unable to determine',
    requirementsTitle: 'Submission Requirements',
    requirementsSubtitle: 'Define portal rules to test file compliance',
    requirementsBadge: 'Portal Rules',
    presetSizeLabel: 'Target Size Presets',
    presetCustom: 'Custom',
    reqRulePassed: 'Passed',
    reqRuleFailed: 'Failed',
    reqRuleUndetermined: 'Unable to determine',
    reqMaxSize: 'Maximum File Size',
    reqMinSize: 'Minimum File Size',
    reqFormat: 'Required Format',
    reqMaxPages: 'Maximum Pages',
    reqMinPages: 'Minimum Pages',
    reqPageSize: 'Page Size',
    reqOrientation: 'Orientation',
    reqMaxDimensions: 'Maximum Dimensions',
    reqAnyFormat: 'Any supported format',
    reqAnyPageSize: 'Any page size',
    reqAnyOrientation: 'Any orientation',
    reqOrientationPortrait: 'Portrait',
    reqOrientationLandscape: 'Landscape',
    reqPageSizeA4: 'A4',
    reqPageSizeLetter: 'US Letter',
    reqActual: 'Actual',
    reqRequired: 'Required',
    reqStatus: 'Status',
    reqAllPassedTitle: 'Compliant with all requirements',
    reqAllPassedDesc: 'This file satisfies all specified portal rules and is ready to submit.',
    reqFailedTitle: 'File needs preparation',
    reqFailedDesc: 'One or more portal requirements are not met. Make your file ready below.',
    btnMakeFileReady: 'Make File Ready',
    btnMakeFileReadyFixing: 'Preparing file...',
    btnCustomizeRules: 'Customize Rules',
    btnHideCustomRules: 'Hide Rules',
    ariaRequirementsTable: 'Requirements compliance comparison',
    ariaMakeReady: 'Make file ready for submission',
    ariaPresetBtn: 'Select size preset {size}',
    // Consolidated Primary Tools
    toolTitleCompressPdf: 'Compress PDF',
    toolDescCompressPdf: 'Compress any PDF to exact portal limits (500 KB, 1 MB, 2 MB, 5 MB, 10 MB, or custom).',
    toolBadgeCompressPdf: '500 KB – 10 MB',
    toolTitleCompressImage: 'Compress Image',
    toolDescCompressImage: 'Reduce JPG and PNG image files to exact target sizes without visible quality loss.',
    toolBadgeCompressImage: 'JPG • PNG',

    // Smart Requirements Real Interaction
    reqFixableViaCompression: 'Fixable via compression',
    reqCannotFixAutomatically: 'Cannot fix automatically',
    reqUnfixableWarning: 'Note: {items} cannot be changed automatically and require editing the original document.',
    reqMaxWidth: 'Max Width (px)',
    reqMaxHeight: 'Max Height (px)',
    // Phase 11: File Readiness 2.0 & Navigation
    navHome: 'Home',
    fileReadinessTitle: 'File Readiness',
    fileReadinessSubtitle: 'Inspect, set destination rules, and prepare your file for submission',
    fileInfoTitle: 'File Information',
    destRequirementsTitle: 'Destination Requirements',
    complianceTitle: 'Requirements Compliance',
    downloadReadyFile: 'Download Ready File',
    reqRequiresPageEditing: 'Requires page editing',
    reqRequiresManualEditing: 'Requires manual/document editing',
    reqMaxPagesPresets: 'Page Presets',
    reqNoPageLimit: 'No limit',
    reqPagesPreset1: '≤ 1 page',
    reqPagesPreset2: '≤ 2 pages',
    reqPagesPreset5: '≤ 5 pages',
    reqPagesPreset10: '≤ 10 pages',
    reqStatusPassed: 'Passed',
    reqStatusFailed: 'Failed',
    reqStatusUndetermined: 'Unable to determine',
    statusReadyAllPassed: 'All requirements satisfied',
    statusReadyDesc: 'This file satisfies all destination requirements and is ready for submission.',
    statusNeedsAttention: 'Some requirements remain unsatisfied',
    statusFailed: 'Optimization failed',
    ariaReadyFileDownload: 'Download ready file',
    pageSelectModalTitle: 'Confirm Page Selection',
    pageSelectModalDesc: 'Your document contains {current} pages, but the target limit is ≤ {max} pages. Select which pages to keep ({excess} pages will be excluded):',
    pageSelectKeepFirst: 'Keep first {max} pages (Pages 1–{max})',
    pageSelectCustomRange: 'Custom page range:',
    pageSelectCustomPlaceholder: 'e.g. 1-10 or 1, 3, 5-8',
    pageSelectExceedsMax: 'Selected {count} pages, which exceeds the limit of {max} pages.',
    pageSelectEmptyError: 'Please enter at least one valid page number.',
    btnApplyAndContinue: 'Apply & Make Ready',
    trimmingPages: 'Extracting selected pages...',
    normalizingPages: 'Normalizing page size and orientation...',
    ariaResetFile: 'Remove file and start over',
  },

  ar: {
    // Header & Meta
    brandSlogan: 'حجم ملفك، جاهز للرفع.',
    clientSideBadge: 'معالجة محلية 100%',
    switchThemeLight: 'التبديل إلى الوضع الفاتح',
    switchThemeDark: 'التبديل إلى الوضع الداكن',
    themeLightLabel: 'فاتح',
    themeDarkLabel: 'داكن',
    langEn: 'English',
    langAr: 'العربية',
    installApp: 'تثبيت التطبيق',
    installShort: 'تثبيت',

    // Target Size Input
    targetLabel: 'الحد الأقصى المطلوب للحجم',
    maxLimit: 'الحد الأقصى',
    commonLimits: 'أشهر حدود الرفع في المواقع:',
    quickSelectAria: 'اختيار سريع {value} {unit}',
    unitMb: 'ميغابايت',
    unitKb: 'كيلوبايت',

    // Dropzone
    chooseFile: 'اختر ملفًا',
    orDragDrop: 'أو اسحب الملف وأفلته هنا',
    supportedFormats: 'يدعم ملفات PDF و JPG و JPEG و PNG',
    clientSideNotice: 'تتم كافة العمليات محلياً بالكامل داخل متصفحك',

    // Analysis & States
    analyzingTitle: 'تحليل الملف...',
    preparingTitle: 'جاري تجهيز ملفك...',
    compressingTitle: 'جاري ضغط الملف...',
    verifyingTitle: 'جاري التحقق من الحجم النهائي...',
    optimizingStep: 'تحسين الصفحة {current} من {total}...',
    analyzingImage: 'اختبار مستويات الجودة بالأبعاد الأصلية الكاملة...',
    downscalingImage: 'تعديل أبعاد الصورة لتناسب الحجم المستهدف...',
    processingImage: 'جاري معالجة الصورة...',

    // Metadata details
    originalSize: 'الحجم الأصلي:',
    targetLimit: 'الحد المطلوب:',
    finalSize: 'الحجم النهائي:',
    pagesLabel: 'عدد الصفحات:',
    dimensionsLabel: 'الأبعاد:',
    fileComplies: 'ملفك يفي بالفعل بهذا الحد ولا يحتاج إلى ضغط!',
    noCompressionNeeded: 'لا يحتاج الملف إلى أي ضغط. يمكنك رفعه فوراً كما هو.',
    exceedsBy: 'يتجاوز الحد بمقدار',
    reductionNeeded: 'نسبة التخفيض المطلوبة',

    // Severity badges & texts
    severityGentle: 'خفيف',
    severityModerate: 'متوسط',
    severityStrong: 'مكثف',
    severityGentleText: 'تخفيض طفيف مطلوب. سيتم الحفاظ على أعلى مستويات الجودة البصرية.',
    severityModerateText: 'ضغط متوازن. ستبقى النصوص والتفاصيل واضحة وسهلة القراءة.',
    severityStrongText: 'مطلوب ضغط مكثف للوصول إلى هذا الحجم المستهدف.',

    // Actions
    btnPrepare: 'تجهيز وضغط الملف',
    btnCancel: 'إلغاء',
    btnDownloadReady: 'تنزيل الملف الجاهز',
    btnCompressAnother: 'ضغط ملف آخر',
    btnConvertJpg: 'تحويل إلى JPG',
    btnKeepPng: 'إبقاء الشفافية بصيغة PNG',

    // Results & Honest feedback
    resultAchievedTitle: 'تم الوصول إلى الحجم المطلوب',
    resultAchievedSub: 'تم التحقق من أن حجم الملف أقل من الحد المطلوب وهو جاهز للرفع الآن.',
    resultNotAchievedTitle: 'لم نتمكن من الوصول للحد المطلوب بأمان',
    resultNotAchievedSub:
      'توقفنا عند الحد الأدنى لمقروئية النصوص. أي ضغط إضافي سيجعل النصوص مشوهة وغير مقروءة.',
    pngTransparencyWarning:
      'تحتوي هذه الصورة على خلفية شفافة. قمنا بضغطها لأقصى حد ممكن مع الحفاظ على الشفافية، لكنها ما تزال تتجاوز الحد المطلوب.',
    pngConvertSuggestion:
      'التحويل إلى صيغة JPG سيزيل الشفافية ويضع خلفية بيضاء نظيفة للوصول إلى الحجم المطلوب بنجاح.',

    // Modal
    modalStrongTitle: 'يتطلب ضغطاً مكثفاً',
    modalStrongPdfMsg:
      'لتقليل هذا المستند إلى الحجم المطلوب، سيحتاج FileReady لضغط صور الصفحات بشكل ملحوظ، مما قد يقلل من حدة نصوص الأوراق الممسوحة ضوئياً. هل تريد المتابعة؟',
    modalStrongImgMsg:
      'للوصول إلى الحد المطلوب، قد يحتاج FileReady إلى تقليل أبعاد وجودة الصورة. هل تريد المتابعة؟',
    modalConvertTitle: 'تحويل صورة PNG الشفافة إلى JPG؟',
    modalConvertMsg:
      'تحتوي هذه الصورة على أجزاء شفافة. التحويل إلى JPG سيزيل الشفافية ويستبدلها بخلفية بيضاء نقية لتلبية الحد الأقصى للحجم. هل ترغب بالتحويل إلى JPG؟',
    modalContinueBtn: 'متابعة الضغط',
    modalCancelBtn: 'إلغاء',

    // Section Titles
    howItWorksTitle: 'كيف يجهز FileReady ملفك؟',
    realisticTitle: 'ضمانات وقيود واقعية',
    faqTitle: 'الأسئلة الشائعة',
    faqSubtitle: 'إجابات واضحة حول قيود الحجم وآلية المعالجة المحلية الآمنة داخل المتصفح.',
    relatedToolsTitle: 'أدوات الأحجام والأنواع الأخرى',
    relatedToolsSubtitle: 'هل تحتاج إلى حجم أو صيغة أخرى؟ اختر إحدى الأدوات المتخصصة التالية:',

    // Footer
    footerSlogan: 'اجعل ملفك جاهزًا للرفع.',
    footerCreatedBy: 'تطوير',
    footerFollow: 'تابع FileReady',
    footerLocal1: '🔒 تتم معالجة ملفاتك محلياً داخل متصفحك.',
    footerLocal2: 'لا يتم رفع أي ملف إلى أي خادم خارجي.',

    // Errors
    errUnsupported: 'يدعم FileReady حالياً ملفات PDF و JPG و JPEG و PNG فقط.',
    errPassword: 'ملف PDF هذا محمي بكلمة مرور ولا يمكن معالجته محلياً.',
    errCantRead: 'تعذر قراءة هذا الملف. يرجى تجربة ملف آخر سليم.',
    errTooLarge: 'حجم الملف كبير جداً بالنسبة لذاكرة المتصفح في هذا الجهاز.',
    errGeneric: 'تعذر إتمام معالجة الملف. يرجى تجربة حجم مستهدف آخر.',
    // Tools Hub & Navigation
    toolsNav: 'الأدوات',
    toolsNavTitle: 'أدوات FileReady',
    toolsHubTitle: 'أدوات FileReady',
    toolsHubSubtitle: 'مجموعة أدوات مجانية ومحلية بالكامل لمعالجة وضغط ودمج ملفات PDF والصور.',
    toolsHubBadge: 'أدوات مجانية ومحلية',
    toolsCategoryPdf: 'أدوات PDF',
    toolsCategoryImages: 'أدوات الصور',

    // Tool Cards Descriptions
    toolTitleMergePdf: 'دمج ملفات PDF',
    toolDescMergePdf: 'دمج عدة ملفات PDF في مستند واحد منظم.',
    toolDescPdf2Mb: 'تجهيز ملفات PDF لحد الرفع الشائع 2 ميجابايت.',
    toolDescPdf1Mb: 'ضغط ملفات PDF لحد 1 ميجابايت الصارم.',
    toolDescPdf500Kb: 'حجم مضغوط للمستندات والشهادات حتى 500 كيلوبايت.',
    toolDescPdfTooLarge: 'حلول عملية لمعالجة رفض الملفات في بوابات التقديم.',
    toolDescPdfScanned: 'تحسين الأوراق الممسوحة ضوئياً مع الحفاظ على وضوح النصوص.',
    toolDescPdfReduce: 'تقليل حجم ملفات PDF لأي حد مخصص.',
    toolDescImage500Kb: 'ضغط الصور والبطاقات الشخصية لأقل من 500 كيلوبايت.',
    toolDescImage1Mb: 'تحسين صور الهواتف والرسومات عالية الدقة حتى 1 ميجابايت.',

    // Merge PDF Tool
    mergePdfTitle: 'دمج ملفات PDF',
    mergePdfSubtitle: 'دمج عدة ملفات PDF في مستند واحد منظم بسهولة وأمان تام داخل المتصفح.',
    selectPdfFiles: 'اختر ملفات PDF',
    orDragDropPdfs: 'أو اسحب ملفات PDF وأفلتها هنا',
    mergePdfs: 'دمج ملفات PDF',
    remove: 'إزالة',
    moveUp: 'تحريك للأعلى',
    moveDown: 'تحريك للأسفل',
    filesMergedSuccessfully: 'تم دمج الملفات بنجاح',
    filesLabel: 'الملفات',
    downloadMergedPdf: 'تنزيل ملف PDF المدمج',
    mergeAnotherSet: 'دمج ملفات أخرى',
    addMorePdfs: 'إضافة ملفات PDF أخرى',
    reorderHint: 'استخدم الأسهم لترتيب الملفات بالترتيب المطلوب قبل الدمج.',
    errMergeSelectTwo: 'يرجى اختيار ملفي PDF على الأقل للدمج.',
    errMergeOnlyPdf: 'يرجى اختيار ملفات بصيغة PDF فقط.',
    errMergePassword: 'قد يكون هذا المستند محمياً بكلمة مرور أو مشفراً.',
    errMergeCorrupted: 'تعذر قراءة هذا المستند. قد يكون الملف تالفاً.',
    errMergeEmpty: 'المستند المدمج فارغ ولا يحتوي على أي صفحات.',
    errMergeMemory: 'تعذر دمج هذه الملفات في المتصفح. يرجى تجربة عدد أقل من الملفات أو ملفات أصغر حجماً.',
    errMergeGeneric: 'تعذر إتمام دمج الملفات. يرجى تجربة ملفات أخرى.',
    mergingStageReading: 'جاري قراءة الملف {current} من {total}...',
    mergingStageSaving: 'جاري إنشاء المستند المدمج والتحقق منه...',

    // Additional Tools Hub Items
    toolBadgeMergePdf: 'جديد • دمج',
    toolTitlePdf2Mb: 'اضغط PDF إلى 2MB',
    toolBadgePdf2Mb: 'PDF • 2 MB',
    toolTitlePdf1Mb: 'اضغط PDF إلى 1MB',
    toolBadgePdf1Mb: 'PDF • 1 MB',
    toolTitlePdf500Kb: 'اضغط PDF إلى 500KB',
    toolBadgePdf500Kb: 'PDF • 500 KB',
    toolTitlePdfTooLarge: 'ملف PDF كبير للرفع؟',
    toolBadgePdfTooLarge: 'دليل وبوابات',
    toolTitlePdfScanned: 'ضغط PDF ممسوح ضوئياً',
    toolBadgePdfScanned: 'أوراق ممسوحة',
    toolTitlePdfReduce: 'تقليل حجم PDF',
    toolBadgePdfReduce: 'ضغط متكيف',
    toolTitleImage500Kb: 'اضغط الصورة إلى 500KB',
    toolBadgeImage500Kb: 'Image • 500 KB',
    toolTitleImage1Mb: 'اضغط الصورة إلى 1MB',
    toolBadgeImage1Mb: 'Image • 1 MB',
    returnToCompressor: 'العودة إلى أداة الضغط الرئيسية',
    exploreAllTools: 'استعراض كافة أدوات FileReady',

    // Merge PDF Details & Dynamic Labels
    mergePdfBadge: 'أداة PDF • محلية',
    selectTwoOrMorePdfs: 'اختر ملفين أو أكثر لدمجهما معاً',
    clientSideNotice: 'تتم كافة العمليات محلياً بالكامل داخل متصفحك',
    selectedFilesCount: 'الملفات المحددة ({count})',
    clearAll: 'إفراغ الكل',
    pageCountSingle: '{count} صفحة',
    pageCountMultiple: '{count} صفحات',
    ariaMoveUp: 'تحريك للأعلى',
    ariaMoveDown: 'تحريك للأسفل',
    ariaRemoveFile: 'إزالة الملف',
    mergingPdfs: 'جاري دمج الملفات...',
    mergingStagePreparing: 'جاري تجهيز الملفات...',
    filesMergedDesc: 'تم دمج {count} ملفات في مستند PDF واحد متكامل.',
    pagesLabel: 'الصفحات',
    finalSize: 'الحجم النهائي',
    // Phase 9: File Readiness Inspector
    inspectorTitle: 'فحص جاهزية الملف',
    inspectorSubtitle: 'فحص استباقي لمتطلبات بوابات الرفع والتقديم',
    inspectorBadge: 'فحص ما قبل التقديم',
    inspectorStatusLabel: 'حالة الجاهزية',
    statusReady: 'جاهز للرفع والتقديم',
    statusNeedsAttention: 'يحتاج إلى تجهيز',
    statusNotReady: 'غير جاهز للتقديم',
    statusAnalyzing: 'جاري فحص الملف...',

    checkFormat: 'صيغة الملف',
    checkFormatPdf: 'مستند PDF',
    checkFormatPdfVersion: 'مستند PDF (إصدار {version})',
    checkFormatImage: 'صورة {format}',
    checkOpensCorrectly: 'سلامة القراءة',
    checkOpensSuccess: 'يفتح بشكل سليم',
    checkOpensError: 'تعذر قراءة أو معالجة الملف',
    checkPassword: 'الحماية بكلمة مرور',
    checkNotEncrypted: 'غير محمي بكلمة مرور',
    checkIsEncrypted: 'محمي بكلمة مرور / مشفر',
    checkPageCount: 'عدد الصفحات',
    checkPageCountVal: '{count} صفحات',
    checkPageCountSingle: 'صفحة واحدة',
    checkDimensions: 'الأبعاد',
    checkDimensionsVal: '{width} × {height} بكسل ({aspectRatio})',
    checkPageSizes: 'تناسق أحجام الصفحات',
    checkPageSizesUniform: 'حجم موحد ({size})',
    checkPageSizesMixed: 'تم اكتشاف أحجام صفحات متباينة',
    checkPageOrientation: 'الاتجاه',
    checkOrientationPortrait: 'عمودي',
    checkOrientationLandscape: 'أفقي',
    checkOrientationMixed: 'اتجاهات متباينة',
    checkTransparency: 'الشفافية',
    checkHasTransparency: 'يحتوي على مناطق شفافة',
    checkNoTransparency: 'بدون شفافية',
    checkRotation: 'تدوير الصفحات',
    checkRotationDetected: 'يحتوي على صفحات مدوّرة',
    checkRotationNone: 'تدوير قياسي (0 درجات)',
    checkForms: 'حقول الاستمارات',
    checkFormsDetected: 'يحتوي على حقول استمارات تفاعلية',
    checkFormsNone: 'لا يحتوي على حقول استمارات',
    checkAnnotations: 'الملاحظات والتعليقات',
    checkAnnotationsDetected: 'يحتوي على تعليقات وملاحظات',
    checkAnnotationsNone: 'لا يحتوي على ملاحظات',
    checkFileSize: 'حجم الملف',
    checkFileSizeOk: '{size} (ضمن الحد المستهدف {target})',
    checkFileSizeExceeds: '{size} (يتجاوز الحد المستهدف {target})',
    checkFileSizeNoTarget: '{size}',

    inspectorDetailsToggle: 'المواصفات التقنية للملف',
    inspectorDetailsHide: 'إخفاء المواصفات التقنية',
    inspectorFixSuggestion: 'يمكن لـ FileReady تحسين هذا الملف أدناه ليلائم الحد المستهدف للرفع.',
    inspectorReadyMessage: 'الملف يلبي جميع معايير الصيغة والحجم للتقديم بنجاح.',
    inspectorEncryptedMessage: 'بوابات التقديم ترفض المستندات المشفرة. يرجى إزالة كلمة المرور أولاً.',
    ariaInspectorCheck: 'نتيجة فحص الملف',
    ariaToggleDetails: 'تبديل عرض المواصفات التقنية',
    // Phase 10: Smart Requirements & Inspector Fix
    unableToDetermine: 'تعذر التحديد',
    valUndetermined: '— تعذر التحديد',
    requirementsTitle: 'متطلبات الرفع والتقديم',
    requirementsSubtitle: 'حدد شروط بوابة التقديم للتحقق من توافق الملف',
    requirementsBadge: 'شروط البوابة',
    presetSizeLabel: 'أحجام جاهزة شائعة',
    presetCustom: 'مخصص',
    reqRulePassed: 'مطابق',
    reqRuleFailed: 'غير مطابق',
    reqRuleUndetermined: 'تعذر التحديد',
    reqMaxSize: 'الحد الأقصى للحجم',
    reqMinSize: 'الحد الأدنى للحجم',
    reqFormat: 'الصيغة المطلوبة',
    reqMaxPages: 'الحد الأقصى للصفحات',
    reqMinPages: 'الحد الأدنى للصفحات',
    reqPageSize: 'حجم الصفحة',
    reqOrientation: 'الاتجاه المطلوب',
    reqMaxDimensions: 'الحد الأقصى للأبعاد',
    reqAnyFormat: 'أي صيغة مدعومة',
    reqAnyPageSize: 'أي حجم صفحة',
    reqAnyOrientation: 'أي اتجاه',
    reqOrientationPortrait: 'عمودي',
    reqOrientationLandscape: 'أفقي',
    reqPageSizeA4: 'A4',
    reqPageSizeLetter: 'US Letter',
    reqActual: 'الملف الحالي',
    reqRequired: 'المطلوب',
    reqStatus: 'النتيجة',
    reqAllPassedTitle: 'الملف مطابق لجميع شروط التقديم',
    reqAllPassedDesc: 'الملف يستوفي كافة متطلبات البوابة المحددة وجاهز للرفع مباشرة.',
    reqFailedTitle: 'الملف يحتاج إلى تجهيز',
    reqFailedDesc: 'توجد متطلبات غير مستوفاة في الملف. يمكنك تجهيزه أدناه بنقرة واحدة.',
    btnMakeFileReady: 'تجهيز الملف للتقديم',
    btnMakeFileReadyFixing: 'جاري تجهيز الملف...',
    btnCustomizeRules: 'تخصيص الشروط',
    btnHideCustomRules: 'إخفاء الشروط',
    ariaRequirementsTable: 'مقارنة مطابقة متطلبات الرفع',
    ariaMakeReady: 'تجهيز الملف للتقديم',
    ariaPresetBtn: 'اختيار الحجم المسبق {size}',
    // Consolidated Primary Tools
    toolTitleCompressPdf: 'ضغط ملفات PDF',
    toolDescCompressPdf: 'ضغط ملفات PDF لأي حد مطلوب لبوابات التقديم (500 كيلوبايت، 1 أو 2 أو 5 ميجابايت أو حجم مخصص).',
    toolBadgeCompressPdf: '500 ك.ب – 10 م.ب',
    toolTitleCompressImage: 'ضغط الصور',
    toolDescCompressImage: 'تقليل حجم صور JPG و PNG لحدود الرفع المطلوبة مع الحفاظ على الوضوح.',
    toolBadgeCompressImage: 'JPG • PNG',

    // Smart Requirements Real Interaction
    reqFixableViaCompression: 'قابل للإصلاح عبر الضغط',
    reqCannotFixAutomatically: 'غير قابل للإصلاح التلقائي',
    reqUnfixableWarning: 'ملاحظة: {items} لا يمكن تعديلها تلقائياً وتتطلب تعديل المستند الأصلي.',
    reqMaxWidth: 'أقصى عرض (بكسل)',
    reqMaxHeight: 'أقصى ارتفاع (بكسل)',
    // Phase 11: File Readiness 2.0 & Navigation
    navHome: 'الرئيسية',
    fileReadinessTitle: 'جاهزية الملف للتقديم',
    fileReadinessSubtitle: 'فحص ومطابقة وتجهيز الملف لمتطلبات بوابات الرفع',
    fileInfoTitle: 'بيانات الملف الحالي',
    destRequirementsTitle: 'شروط جهة التقديم',
    complianceTitle: 'مطابقة الشروط',
    downloadReadyFile: 'تنزيل الملف الجاهز',
    reqRequiresPageEditing: 'يتطلب تعديل الصفحات',
    reqRequiresManualEditing: 'يتطلب تعديل المستند الأصلي',
    reqMaxPagesPresets: 'حدود صفحات جاهزة',
    reqNoPageLimit: 'بدون حد',
    reqPagesPreset1: '≤ صفحة واحدة',
    reqPagesPreset2: '≤ صفحتين',
    reqPagesPreset5: '≤ 5 صفحات',
    reqPagesPreset10: '≤ 10 صفحات',
    reqStatusPassed: 'مطابق',
    reqStatusFailed: 'غير مطابق',
    reqStatusUndetermined: 'تعذر التحديد',
    statusReadyAllPassed: 'تم استيفاء جميع المتطلبات',
    statusReadyDesc: 'الملف يلبي جميع شروط وجهة الرفع وهو جاهز للتقديم بنجاح.',
    statusNeedsAttention: 'توجد متطلبات لم يتم استيفاؤها بعد',
    statusFailed: 'تعذر إتمام المعالجة',
    ariaReadyFileDownload: 'تنزيل الملف الجاهز',
    pageSelectModalTitle: 'تأكيد تحديد الصفحات',
    pageSelectModalDesc: 'يحتوي مستندك على {current} صفحة، لكن شرط الوجهة هو ≤ {max} صفحة. حدد الصفحات التي تريد الاحتفاظ بها (سيتم استبعاد {excess} صفحة):',
    pageSelectKeepFirst: 'الاحتفاظ بأول {max} صفحة (الصفحات 1–{max})',
    pageSelectCustomRange: 'نطاق صفحات مخصص:',
    pageSelectCustomPlaceholder: 'مثال: 1-10 أو 1، 3، 5-8',
    pageSelectExceedsMax: 'تم تحديد {count} صفحة، وهو ما يتجاوز الحد الأقصى البالغ {max} صفحة.',
    pageSelectEmptyError: 'يرجى إدخال رقم صفحة صالح واحد على الأقل.',
    btnApplyAndContinue: 'تطبيق وجعل الملف جاهزاً',
    trimmingPages: 'جاري استخراج الصفحات المحددة...',
    normalizingPages: 'جاري ضبط مقاس واتجاه الصفحات...',
    ariaResetFile: 'إزالة الملف والبدء من جديد',
  },
};

/**
 * Route-specific Arabic content overrides.
 * Ensures the landing pages deliver naturally phrased Arabic copy while keeping
 * exact technical facts and constraints identical.
 */
export const ARABIC_ROUTES_CONTENT = {
  '/': {
    h1: 'اجعل ملفك جاهزًا للرفع.',
    subheading: 'اضغط ملفات PDF والصور إلى الحجم الذي تحتاجه بالضبط.',
    targetBadge: 'حجم مستهدف مرن',
    targetSummary:
      'حدد الحد الأقصى المسموح به للرفع—مثل 2 ميجابايت أو 1 ميجابايت أو 500 كيلوبايت—وسيقوم FileReady بتحسين ملفك مباشرة داخل متصفحك دون رفع ملفاتك إلى أي خادم.',
    realisticConstraints: [
      'فحص حقيقي لحجم الملف النهائي بالبايت بدلاً من التخمين التقريبي.',
      'الحفاظ على الأبعاد الأصلية أولاً، وتجربة تقليل جودة الضغط قبل تصغير المقاس.',
      'تنبيه المستخدم قبل تطبيق الضغط المكثف لحماية وضوح ونقاء النصوص.',
      'تتم معالجة كافة الملفات محلياً 100% داخل جهازك لضمان الخصوصية التامة.',
    ],
    howTo: [
      {
        step: 1,
        title: 'اختر ملفك',
        description: 'حدد مستند PDF أو صورة بصيغة JPG أو JPEG أو PNG.',
      },
      {
        step: 2,
        title: 'حدد الحد المطلوب',
        description: 'اكتب الحد الأقصى المسموح به في الموقع (مثل 2 ميجابايت أو 500 كيلوبايت).',
      },
      {
        step: 3,
        title: 'معالجة متكيفة وذكية',
        description: 'يحلل FileReady تركيبة الملف ويطبق مستويات ضغط دقيقة للوصول للحد المطلوب.',
      },
      {
        step: 4,
        title: 'تحقق وتنزيل فوري',
        description: 'يقيس FileReady الحجم النهائي الفعلي قبل تأكيد النجاح وتجهيز التنزيل.',
      },
    ],
    faqs: [
      {
        question: 'ما الفرق بين FileReady وبرامج الضغط التقليدية؟',
        answer:
          'معظم المواقع تطلب منك اختيار "ضغط منخفض أو متوسط أو عالٍ" وتتركك تخمن الحجم النهائي. في FileReady تحدد بالضبط الحد المطلوب لموقع الرفع (مثل 2MB أو 500KB)، ويبحث النظام برمجياً عن الإعداد الأمثل الذي يحقق هذا الحد مع فحص الحجم الفعلي.',
      },
      {
        question: 'هل يتم رفع مستنداتي الحساسة أو الشخصية إلى أي خادم؟',
        answer:
          'أبداً. تتم جميع مراحل المعالجة، وإعادة تشكيل الصفحات، وتعديل الصور محلياً بالكامل داخل متصفحك عبر لغة JavaScript. لا تغادر بياناتك جهازك على الإطلاق.',
      },
      {
        question: 'ماذا يحدث إذا تعذر الوصول للحجم المطلوب؟',
        answer:
          'إذا كان المستند يحتوي على صفحات ممسوحة ضوئياً كثيرة بدقة فائقة ويتعذر تقليصه دون جعل الخطوط غير مقروءة، يتوقف FileReady عند حد الأمان الأخير ويزودك بأصغر حجم ممكن تمكن من الوصول إليه بوضوح.',
      },
      {
        question: 'ما هي صيغ الملفات المدعومة؟',
        answer:
          'يدعم FileReady حالياً مستندات PDF والصور بصيغ JPG و JPEG و PNG (مع دعم الشفافية).',
      },
    ],
  },

  '/compress-pdf-to-2mb': {
    h1: 'اضغط ملف PDF إلى 2 ميجابايت',
    subheading: 'تقليل حجم ملف PDF ليلائم حد 2MB الشائع في بوابات التوظيف والجامعات مع وضوح تام.',
    targetBadge: 'الهدف: أقل من 2 ميجابايت',
    targetSummary:
      'حد 2 ميجابايت هو المعيار الأكثر انتشاراً في بوابات الوظائف واستمارات الهجرة وتقديم الجامعات. يختبر FileReady درجات الضغط المناسبة مباشرة في متصفحك.',
    realisticConstraints: [
      'الملفات التي يقل حجمها عن 2MB تكون مقبولة في معظم البوابات الحكومية والأكاديمية.',
      'تصل مستندات النصوص متعددة الصفحات عادة إلى 2MB دون أي تأثير يذكر على جودتها البصرية.',
      'المستندات الورقية الممسوحة ضوئياً ذات الصفحات الكثيرة جداً قد تحتاج لتقليل دقة العرض.',
      'إذا تعذر الوصول إلى 2MB دون تشويه النص، يوضح FileReady الحجم الأصغر الفعلي المحقق.',
    ],
    howTo: [
      {
        step: 1,
        title: 'اختر ملف PDF',
        description: 'حدد ملف السيرة الذاتية أو الشهادة أو الاستمارة من جهازك.',
      },
      {
        step: 2,
        title: 'الحد معد مسبقاً على 2MB',
        description: 'تم ضبط الحجم تلقائياً على 2 ميجابايت، ويمكنك تعديله متى شئت.',
      },
      {
        step: 3,
        title: 'معالجة الصفحات محلياً',
        description: 'يعالج FileReady كل صفحة بالتسلسل ويوازن بين الحجم ومقروئية النصوص.',
      },
      {
        step: 4,
        title: 'تنزيل موثوق',
        description: 'يتم قياس البايتات الحقيقية للتأكد من أنها تحت 2MB قبل بدء التنزيل.',
      },
    ],
    faqs: [
      {
        question: 'كيف اضغط ملف PDF إلى 2 ميجابايت؟',
        answer:
          'اختر ملفك في هذه الصفحة حيث تم ضبط الهدف مسبقاً على 2 ميجابايت، ثم اضغط "تجهيز وضغط الملف". تتم المعالجة في ثوانٍ ويتم تنزيل الملف فور التأكد من وصوله للحجم المطلوب.',
      },
      {
        question: 'هل يمكن ضغط أي مستند PDF إلى أقل من 2 ميجابايت؟',
        answer:
          'تصل معظم المستندات العادية إلى 2MB بكل سلاسة. ولكن إذا كان المستند كتيباً ضخماً يحتوي 40 صفحة ملونة بدقة طباعة فائقة، فقد يتطلب الأمر تخفيضاً أكبر للأبعاد أو تجزئة الملف.',
      },
      {
        question: 'لماذا ترفض بعض المواقع ملفي حتى بعد ضغطه في أدوات أخرى؟',
        answer:
          'تعتمد بعض الأدوات على تقديرات تقريبية تنتج ملفاً بحجم 2.1MB بدلاً من 2.0MB. في FileReady نقيس البايتات الحقيقية في الذاكرة لنضمن التزامه الصارم بحد 2MB.',
      },
      {
        question: 'هل تبقى الأختام والتواقيع واضحة بعد الضغط؟',
        answer:
          'نعم. يراعي FileReady حدود المقروئية الأساسية حتى تظل التواقيع الرسمية والأختام الحكومية واضحة ومقبولة لدى جهات التدقيق.',
      },
      {
        question: 'هل ملفاتي آمنة ولا يتم الاطلاع عليها؟',
        answer:
          'ملفاتك لا ترفع إلى أي خادم إطلاقاً. المعالجة تتم 100% داخل المتصفح على جهازك الشخصي.',
      },
    ],
  },

  '/compress-pdf-to-1mb': {
    h1: 'اضغط ملف PDF إلى 1 ميجابايت',
    subheading: 'تجهيز ملفات PDF لحد الـ 1MB الصارم في البوابات الحكومية والاستمارات الرسمية.',
    targetBadge: 'الهدف: أقل من 1 ميجابايت',
    targetSummary:
      'حد 1 ميجابايت هو من أكثر الشروط صرامة في البوابات الإلكترونية. يقوم FileReady بضبط مستويات الجودة ليناسب الحجم 1,000,000 بايت بدقة واحترافية.',
    realisticConstraints: [
      'حد 1MB شائع جداً في بوابات التقديم والمسابقات الحكومية.',
      'تعتبر المستندات الورقية الممسوحة ضوئياً المكونة من 1 إلى 3 صفحات مرشحاً مثالياً للوصول إلى 1MB مع وضوح ممتاز.',
      'المستندات التي تحتوي عدداً كبيراً من الصور الملونة قد تتطلب مستويات ضغط أعلى.',
      'يتجنب FileReady الضغط المفرط إذا كان الوصول للهدف سيؤدي إلى جعل النصوص غير مقروءة.',
    ],
    howTo: [
      {
        step: 1,
        title: 'اختر المستند',
        description: 'حدد الملف من هاتفك المحمول أو حاسوبك.',
      },
      {
        step: 2,
        title: 'الهدف مفعّل: 1 ميجابايت',
        description: 'تم ضبط الحجم المستهدف على 1MB بدقة متناهية.',
      },
      {
        step: 3,
        title: 'بحث تكيفي عن الجودة',
        description: 'يختبر FileReady مستويات الضغط الأنسب لتحقيق الهدف مع الحفاظ على النقاء.',
      },
      {
        step: 4,
        title: 'تنزيل الملف المعتمد',
        description: 'بمجرد التأكد من أن الحجم أقل من 1MB، يبدأ التحميل مباشرة.',
      },
    ],
    faqs: [
      {
        question: 'كيف يمكنني تقليل حجم PDF إلى 1MB؟',
        answer:
          'ارفع الملف على هذه الصفحة والهدف 1MB نشط، وسيقوم النظام بمعالجة الصفحات وموازنة الجودة مع الحجم والتأكد من البايتات قبل حفظ الملف.',
      },
      {
        question: 'هل يمكن لكل مستند أن يصل إلى 1MB؟',
        answer:
          'ليس دائماً. إذا كان الملف يحتوي 15 صفحة مسحوبة بدقة ملونة عالية، فإن البيانات المطلوبة قد تتجاوز 1MB. عندما يتعذر ذلك بأمان، يقدم FileReady أصغر ملف آمن.',
      },
      {
        question: 'هل سيصبح المستند ضبابياً أو غير واضح؟',
        answer:
          'يبدأ FileReady باختبار أعلى درجات الدقة الممكنة ضمن ميزانية 1MB، ولا يقلل الأبعاد إلا إذا كان ذلك ضرورياً لتفادي تجاوز الحد المطلوب.',
      },
      {
        question: 'ماذا لو كان ملفي بالفعل أقل من 1MB؟',
        answer:
          'يكتشف FileReady ذلك فورياً وينبهك بأن الملف مستوفٍ للشرط ولا يحتاج لأي معالجة.',
      },
    ],
  },

  '/compress-pdf-to-500kb': {
    h1: 'اضغط ملف PDF إلى 500 كيلوبايت',
    subheading: 'تحسين الشهادات، الإيصالات، والمستندات ذات الصفحة الواحدة للحدود الصارمة 500KB.',
    targetBadge: 'الهدف: أقل من 500 كيلوبايت',
    targetSummary:
      'حد 500KB يعتبر من أضيق الحدود في الأنظمة القديمة والمواقع ذات القيود التخزينية. يحسّن FileReady الملف ليصل إلى 500,000 بايت بأمان.',
    realisticConstraints: [
      'أنسب ما يكون للاستمارات الفردية، السير الذاتية، الإيصالات البنكية، والشهادات.',
      'قد يصعب وصول المستندات ذات 5 صفحات أو أكثر إلى 500KB مع الحفاظ على مقروئية الخطوط الدقيقة.',
      'يختبر FileReady تقليل المقاسات فقط عندما لا يكفي تقليل الجودة وحده.',
      'عند تعذر الوصول إلى 500KB بأمان، يوضح النظام أصغر حجم وصل إليه دون تشويه.',
    ],
    howTo: [
      {
        step: 1,
        title: 'اختر المستند',
        description: 'اختر ملف PDF المكون من صفحة أو بضع صفحات.',
      },
      {
        step: 2,
        title: 'تثبيت الهدف عند 500KB',
        description: 'يتم تحديد سقف الحجم بدقة عند 500,000 بايت.',
      },
      {
        step: 3,
        title: 'معالجة فائقة الدقة',
        description: 'موازنة أبعاد الصفحات وضغط الصور النقطية للوصول للهدف.',
      },
      {
        step: 4,
        title: 'تنزيل بعد الفحص',
        description: 'تنزيل الملف فور التأكد من انطباق شرط الـ 500KB.',
      },
    ],
    faqs: [
      {
        question: 'هل يمكن لملف متعدد الصفحات أن يصل إلى 500KB؟',
        answer:
          'نعم، إذا كان المستند نصوصاً رقمية أو يحتوي من 1 إلى 3 صفحات. أما الأوراق الممسوحة ضوئياً ذات الصفحات الكثيرة فقد تتطلب حداً أعلى مثل 1MB للحفاظ على المقروئية.',
      },
      {
        question: 'كيف يتأكد FileReady من عدم تجاوز 500KB؟',
        answer:
          'يتم فحص مصفوفة الـ Blob الثنائية في الذاكرة ومقارنة عدد البايتات الفعلي بـ 500,000 بايت قبل اعتماد الملف كملف ناجح.',
      },
      {
        question: 'لماذا تبدو الملفات مشوهة في بعض برامج الضغط عند 500KB؟',
        answer:
          'لأن البرامج الأخرى تطبق خفضاً عشوائياً لدقة العرض. FileReady يختبر مستويات متعددة تدريجياً ليحتفظ بأعلى وضوح ممكن يسمح به حجم 500KB.',
      },
    ],
  },

  '/pdf-too-large-to-upload': {
    h1: 'ملف PDF كبير جداً للرفع؟',
    subheading: 'دليل وحل عملي لمعالجة رفض الملفات في بوابات التوظيف والجامعات والاستمارات الإلكترونية.',
    targetBadge: 'حل مشكلات الرفع',
    targetSummary:
      'كثيراً ما ترفض مواقع التقديم والجامعات ملفات PDF لأنها تتجاوز الحد المسموح. يوفر FileReady أداة فورية وخطوات عملية لتصغير المستند وتجهيزه للقبول.',
    realisticConstraints: [
      'حجم الملف هو السبب الأكثر شيوعاً لرفض الرفع، لكنه ليس السبب الوحيد دائماً.',
      'قد ترفض بعض المواقع الملف بسبب رموز خاصة في الاسم، أو تشفير الملف، أو انقطاع الاتصال أثناء الرفع.',
      'تحقق دائماً من الحد الأقصى المكتوب في موقع التقديم (مثل 2MB أو 1MB) وضع هدفاً مساوياً له أو أقل قليلاً.',
      'يفحص FileReady حجم البايتات الحقيقي قبل التنزيل لتجنب تكرار رسائل الخطأ في الموقع.',
    ],
    howTo: [
      {
        step: 1,
        title: 'تحقق من حد الموقع',
        description: 'اعرف الرقم الأقصى المكتوب في صفحة الرفع (مثل 2MB أو 1MB أو 500KB).',
      },
      {
        step: 2,
        title: 'اضبط الهدف في FileReady',
        description: 'ضع نفس الرقم أو أقل قليلاً (مثلاً 1.9MB إذا كان الحد المسموح 2MB).',
      },
      {
        step: 3,
        title: 'اضغط المستند محلياً',
        description: 'يعالج FileReady ملفك في المتصفح ويتحقق من وصوله للحجم المطلوب بدقة.',
      },
      {
        step: 4,
        title: 'عاين المستند ثم ارفعه',
        description: 'افتح الملف بعد تنزيله للتأكد من وضوح الأرقام والتواقيع، ثم أعد رفعه للموقع بنجاح.',
      },
    ],
    faqs: [
      {
        question: 'لماذا يرفض الموقع رفع ملف PDF الخاص بي؟',
        answer:
          'السبب الأكثر شيوعاً هو تجاوز حجم الملف للحد الأقصى المسموح به في خادم الموقع. ومن الأسباب الأخرى: احتواء اسم الملف على رموز خاصة، أو حماية الملف برقم سري، أو بطء الاتصال الذي يؤدي لانتهاء مهلة الجلسة.',
      },
      {
        question: 'ما هو الحجم الذي يجب أن أختاره إذا كان حد الموقع 2MB؟',
        answer:
          'اختيار 2MB يعمل في أغلب الحالات. إذا كان نظام الموقع شديد الحساسية، فإن اختيار 1.9MB أو 1.8MB يمنحك هامش أمان ممتاز.',
      },
      {
        question: 'هل يحل FileReady كافة أخطاء الرفع في المواقع؟',
        answer:
          'يحل FileReady المشكلات الناتجة عن تجاوز حجم الملف. أما إذا كان الموقع يشترط معياراً خاصاً مثل PDF/A أو يرفض أسماء ملفات معينة، فيجب مراجعة شروط الموقع التقنية الأخرى.',
      },
      {
        question: 'كيف أضمن أن الملف بعد ضغطه سيقبله الموقع؟',
        answer:
          'FileReady يفحص الحجم الثنائي الفعلي بالبايت في الذاكرة ويتأكد من أنه أصغر تماماً من الحد المطلوب قبل إعطائك رابط التنزيل.',
      },
    ],
  },

  '/compress-scanned-pdf': {
    h1: 'اضغط ملف PDF ممسوح ضوئياً',
    subheading: 'تصغير المستندات والأوراق الممسوحة بالماسح أو الهاتف مع الحفاظ على وضوح الأختام والتواقيع.',
    targetBadge: 'مستندات ممسوحة ضوئياً',
    targetSummary:
      'تكون ملفات PDF الممسوحة ضوئياً ضخمة لأن كل صفحة عبارة عن صورة نقطية عالية الدقة وليست نصوصاً مجردة. يوازن FileReady بين الدقة وضغط الصور للحفاظ على مقروئية المستند.',
    realisticConstraints: [
      'تتكون الصفحات الممسوحة من ملايين البكسلات، مما يستهلك حجماً أكبر بكثير من ملفات النصوص الرقمية العادية.',
      'التقليل المفرط للدقة قد يجعل الخطوط الصغيرة والأختام الرسمية والتواقيع غير واضحة.',
      'يتوقف FileReady عند حد أمان مقروئية محدد لتفادي تحويل المستند إلى صورة ضبابية مشوهة.',
      'للمستندات ذات الصفحات الكثيرة، ينصح باختيار هدف واقعي مثل 2MB بدلاً من 500KB للحفاظ على الوضوح.',
    ],
    howTo: [
      {
        step: 1,
        title: 'اختر المستند الممسوح',
        description: 'حدد العقد، كشف الدرجات، الشهادة، أو المعاملة الممسوحة ضوئياً.',
      },
      {
        step: 2,
        title: 'اختر هدفاً واقعياً',
        description: 'حدد حجماً يناسب عدد الصفحات (مثلاً 2MB للمستندات متعددة الصفحات).',
      },
      {
        step: 3,
        title: 'إعادة تشكيل الصفحات محلياً',
        description: 'يعالج FileReady كل صفحة ويضبط كثافة البكسلات دون خروج الملف من جهازك.',
      },
      {
        step: 4,
        title: 'معاينة وتنزيل',
        description: 'تنزيل الملف بعد التأكد من تلبية الحجم وبقاء التفاصيل الهامة مقروءة.',
      },
    ],
    faqs: [
      {
        question: 'لماذا تكون ملفات PDF الممسوحة ضوئياً أكبر بكثير من غيرها؟',
        answer:
          'المستندات المنشأة من برامج الكتابة تحتوي نصوصاً برمجية خفيفة جداً. أما الورق الممسوح فهو عبارة عن صور فوتوغرافية كاملة بدقة عالية لكل صفحة، مما يولد حجماً كبيراً بطبيعته.',
      },
      {
        question: 'هل سيؤدي ضغط المستند الممسوح إلى جعل الخطوط غير واضحة؟',
        answer:
          'أي ضغط للصور يتضمن موازنة بين الحجم والدقة. يبدأ FileReady بأعلى درجات الوضوح المتاحة لميزانية الحجم المحددة، ويتوقف قبل الوصول لأي تشويه قد يضر بالمقروئية.',
      },
      {
        question: 'هل يمكن ضغط مستند ممسوح مكون من 10 صفحات لأقل من 1MB؟',
        answer:
          'يتطلب حشر 10 صفحات مصورة في 1MB ضغطاً شديداً (حوالي 100KB للصفحة)، مما قد يضعف وضوح النصوص الصغيرة. يفضل في هذه الحالة اختيار هدف 2MB لضمان قبول المعاملة.',
      },
      {
        question: 'هل يستخدم FileReady تقنية التعرف الضوئي OCR أو يعدل النصوص؟',
        answer:
          'لا. لا يقوم FileReady بتعديل طبقات النصوص أو تطبيق OCR، بل يعمل على تحسين كثافة ودقة صور الصفحات بأعلى كفاءة.',
      },
    ],
  },

  '/reduce-pdf-size': {
    h1: 'تقليل حجم ملف PDF أونلاين',
    subheading: 'ضغط مخصص يعتمد على الحجم المستهدف لتلبية متطلبات الرفع بدقة وأمان تام.',
    targetBadge: 'تحسين ملفات PDF',
    targetSummary:
      'يعتمد حجم ملف PDF على ما يحتويه من نصوص شعاعية، وخطوط مدمجة، وصور نقطية. يساعدك FileReady على تحديد هدفك بدقة ويفحص الحجم الفعلي دون رفع أي ملف لخوادم خارجية.',
    realisticConstraints: [
      'تختلف استجابة ملفات النصوص الرقمية للضغط عن الأوراق الممسوحة ضوئياً والصور.',
      'الضغط المعتمد على الحجم المستهدف يعطيك نتيجة دقيقة لا توفرها أشرطة النسب المئوية العشوائية.',
      'إذا كان المستند يحتوي ملفات ثلاثية الأبعاد أو مرفقات مدمجة خاصة، فقد لا تؤثر معالجة الصور عليها.',
      'يتم التحقق من الحجم الفعلي للملف دائماً في الذاكرة قبل التنزيل.',
    ],
    howTo: [
      {
        step: 1,
        title: 'اختر المستند',
        description: 'اسحب ملف PDF إلى FileReady مباشرة في متصفحك.',
      },
      {
        step: 2,
        title: 'حدد الحجم المطلوب',
        description: 'اختر الحجم الذي يطلبه منك الموقع أو البريد الإلكتروني.',
      },
      {
        step: 3,
        title: 'تحسين متكيف وفوري',
        description: 'يوازن FileReady بين الدقة والضغط ليناسب ميزانية الحجم المحددة.',
      },
      {
        step: 4,
        title: 'تنزيل فوري موثوق',
        description: 'احصل على ملفك بالحجم المطلوب وجاهزاً للرفع فوراً.',
      },
    ],
    faqs: [
      {
        question: 'لماذا تصبح بعض ملفات PDF كبيرة الحجم؟',
        answer:
          'يرجع ذلك أساساً لاحتوائها على صور مدمجة فائقة الدقة، أو صفحات ممسوحة ضوئياً بجودة تصوير عالية، أو خطوط مدمجة غير مضغوطة. المستندات النصية الخالصة تكون عادة أصغر بكثير.',
      },
      {
        question: 'لماذا يعد الضغط الموجه بالحجم أفضل من أشرطة النسب المئوية؟',
        answer:
          'أشرطة النسب (مثل "ضغط 50%") تدخلك في تجارب عشوائية لأنك لا تعرف الناتج النهائي بالميجابايت. في FileReady تحدد الحجم المطلوب بالضبط (مثل 2MB) والنظام يطبق الإعداد الأنسب له.',
      },
      {
        question: 'لماذا تزعم بعض المواقع نجاح الضغط بينما يظل الملف كبيراً؟',
        answer:
          'تعتمد بعض الأدوات على حسابات نظرية تقديرية قبل بناء الملف. FileReady يقوم بإنشاء الملف في الذاكرة ويقيس عدد البايتات الحقيقي قبل تأكيد النجاح.',
      },
      {
        question: 'هل بياناتي محمية بالكامل أثناء المعالجة؟',
        answer:
          'نعم 100%. يعمل FileReady كلياً داخل متصفح جهازك، ولا يتم تخزين أو نقل أو رفع أي مستند إلى أي خادم خارجي على الإطلاق.',
      },
    ],
  },

  '/compress-image-to-500kb': {
    h1: 'اضغط الصورة إلى 500 كيلوبايت',
    subheading: 'تقليل حجم صور JPG و PNG لأقل من 500KB مع الحفاظ على الأبعاد والوضوح.',
    targetBadge: 'الهدف: أقل من 500 كيلوبايت',
    targetSummary:
      '500 كيلوبايت هو الحد الأقصى المعتمد لصور الملفات الشخصية، وصور الهويات، واستمارات التقديم. يختبر FileReady ضغط الجودة بالأبعاد الأصلية قبل أي تصغير.',
    realisticConstraints: [
      'الأولوية دائماً للحفاظ على الأبعاد الأصلية (100% dimensions) وتخفيض جودة JPG أولاً.',
      'الحفاظ على خلفية PNG الشفافة متى ما كان الحجم يسمح بالوصول للهدف.',
      'إذا تعذر الوصول إلى 500KB مع إبقاء الشفافية، يتاح خيار اختياري للتحويل إلى JPG بخلفية بيضاء.',
      'تتم كافة العمليات داخل المتصفح عبر لوحة Canvas دون إرسال الصور للإنترنت.',
    ],
    howTo: [
      {
        step: 1,
        title: 'اختر صورتك',
        description: 'حدد أي صورة بصيغة JPG أو JPEG أو PNG من جهازك.',
      },
      {
        step: 2,
        title: 'الهدف مضبوط: 500KB',
        description: 'تم تثبيت السقف الأقصى للحجم عند 500,000 بايت.',
      },
      {
        step: 3,
        title: 'أولوية الحفاظ على الجودة',
        description: 'اختبار مستويات النقاء بالأبعاد الكاملة قبل التفكير بتصغير المقاس.',
      },
      {
        step: 4,
        title: 'تنزيل فوري',
        description: 'احفظ صورتك المجهزة بنقرة واحدة.',
      },
    ],
    faqs: [
      {
        question: 'كيف اضغط صورتي لتصبح أقل من 500KB؟',
        answer:
          'اختر صورتك في هذه الصفحة، وسيختبر FileReady درجات ضغط JPEG بأبعاد الصورة الأصلية أولاً. وإذا تطلب الأمر، يقوم بضبط طفيف للأبعاد حتى يتحقق الهدف تماماً.',
      },
      {
        question: 'ماذا يحدث لصور PNG ذات الخلفية الشفافة؟',
        answer:
          'يحافظ FileReady على الشفافية بصيغة PNG الأصلية. وإذا تعذر النزول تحت 500KB بسبب تفاصيل الرسم، يتيح لك خياراً سهلاً للتحويل إلى JPG بخلفية بيضاء نقية.',
      },
      {
        question: 'هل ستتغير أبعاد صورتي (العرض والارتفاع)؟',
        answer:
          'ليس بالضرورة. نعتمد سياسة "الجودة أولاً": نضغط جودة البكسلات بالأبعاد الكاملة، ولا نغير الأبعاد إلا إذا كانت الصورة ضخمة جداً ولا يمكن أن تصل للهدف بدون ذلك.',
      },
      {
        question: 'هل يمكنني ضغط صور JPG و PNG معاً؟',
        answer:
          'نعم. يدعم FileReady صور JPG و JPEG و PNG. الصور غير الشفافة بصيغة PNG يتم تحويلها تلقائياً لـ JPG لتحقيق أعلى نسبة توفير في الحجم.',
      },
    ],
  },

  '/compress-image-to-1mb': {
    h1: 'اضغط الصورة إلى 1 ميجابايت',
    subheading: 'تحسين الصور الفوتوغرافية عالية الدقة ورسومات PNG لتناسب حد 1MB بأعلى نقاء.',
    targetBadge: 'الهدف: أقل من 1 ميجابايت',
    targetSummary:
      'تنتج كاميرات الهواتف الحديثة صوراً بأحجام بين 4MB و 15MB. يوفر حد 1MB مساحة كافية للاحتفاظ بأدق التفاصيل والحدة مع الالتزام بحدود الرفع.',
    realisticConstraints: [
      'يتيح الاحتفاظ بجودة JPEG ممتازة (عادة بين 75% و 85%) بالأبعاد الأصلية الكاملة.',
      'معالجة صور الكاميرا بدقة فائقة بتسلسل سلس يحترم ذاكرة الهواتف المحمولة.',
      'الحفاظ على صيغة PNG الشفافة للرسومات التي تسعها مساحة الـ 1MB.',
      'تتم المعالجة بالكامل محلياً داخل جلسة المتصفح الخاصة بك.',
    ],
    howTo: [
      {
        step: 1,
        title: 'اختر الصورة',
        description: 'حدد صورتك عالية الدقة بصيغة JPG أو PNG.',
      },
      {
        step: 2,
        title: 'الهدف محدد: 1MB',
        description: 'تم ضبط الحجم تلقائياً على 1 ميجابايت (1,000,000 بايت).',
      },
      {
        step: 3,
        title: 'ضغط متوازن وعالي النقاء',
        description: 'اختبار درجات الضغط للحفاظ على تفاصيل الصورة بأبعادها الأصلية.',
      },
      {
        step: 4,
        title: 'تنزيل مباشر',
        description: 'احفظ صورتك المعتمدة وجاهزة للرفع على أي منصة.',
      },
    ],
    faqs: [
      {
        question: 'لماذا أضغط الصورة إلى 1MB بدلاً من حجم أصغر؟',
        answer:
          'إذا كان موقع الرفع يسمح بحجم 1MB، فإن اختيار هذا الهدف بدلاً من تقليصها إلى 200KB يمنحك وضوحاً وتفاصيل فائقة النقاء تظهر بوضوح في الصور الشخصية والأعمال الاحترافية.',
      },
      {
        question: 'كيف يحافظ FileReady على جودة الصورة عند 1MB؟',
        answer:
          'على عكس المواقع التي تبادر فوراً لتصغير عرض وارتفاع الصورة، يختبر FileReady ضغط الجودة بالأبعاد الأصلية الكاملة أولاً، ولا يعدل الأبعاد إلا للضرورة القصوى.',
      },
      {
        question: 'هل يمكن ضغط صور الهواتف الكبيرة بدقة 48MP أو أكثر؟',
        answer:
          'نعم. يتعامل FileReady مع الصور الكبيرة بكفاءة عبر لوحة Canvas داخل المتصفح مع مراعاة موارد الهاتف لضمان سلاسة الأداء.',
      },
      {
        question: 'ما الفرق بين ضغط الصورة إلى 1MB وضغطها إلى 500KB؟',
        answer:
          'يتيح حد 1MB الاحتفاظ بنسبة جودة أعلى وتفاصيل أكثر دقة بالأبعاد الكاملة، بينما يعتبر حد 500KB أكثر صرامة وقد يتطلب تخفيضاً طفيفاً للأبعاد في الصور المعقدة.',
      },
    ],
  },

  '/tools': {
    h1: 'أدوات FileReady',
    subheading: 'مجموعة أدوات مجانية ومحلية بالكامل لمعالجة وضغط ودمج ملفات PDF والصور.',
  },

  '/merge-pdf': {
    h1: 'دمج ملفات PDF',
    subheading: 'دمج عدة ملفات PDF في مستند واحد منظم بسهولة وأمان تام داخل المتصفح.',
  },
};
