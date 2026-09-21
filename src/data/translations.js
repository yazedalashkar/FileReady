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
      'حد 1 ميجابايت هو من أكثر الشروط صرامة في البوابات الإلكترونية. يقوم FileReady بضبط مستويات الجودة ليناسب الحجم 1,048,576 بايت بدقة واحترافية.',
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
      'حد 500KB يعتبر من أضيق الحدود في الأنظمة القديمة والمواقع ذات القيود التخزينية. ي оптимиز FileReady الملف ليصل إلى 512,000 بايت بأمان.',
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
        description: 'يتم تحديد سقف الحجم بدقة عند 512,000 بايت.',
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
          'يتم فحص مصفوفة الـ Blob الثنائية في الذاكرة ومقارنة عدد البايتات الفعلي بـ 512,000 بايت قبل اعتماد الملف كملف ناجح.',
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
        description: 'تم تثبيت السقف الأقصى للحجم عند 512,000 بايت.',
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
        description: 'تم ضبط الحجم تلقائياً على 1 ميجابايت (1,048,576 بايت).',
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
};
