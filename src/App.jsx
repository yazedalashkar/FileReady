import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FileDropzone from './components/FileDropzone.jsx';
import TargetSizeInput from './components/TargetSizeInput.jsx';
import AnalysisCard from './components/AnalysisCard.jsx';
import AlertBanner from './components/AlertBanner.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';
import SEO from './components/SEO.jsx';
import FAQAccordion from './components/FAQAccordion.jsx';
import InternalLinks from './components/InternalLinks.jsx';
import ToolsHub from './components/ToolsHub.jsx';
import MergePdfTool from './components/MergePdfTool.jsx';
import FileInspector from './components/FileInspector.jsx';
import SmartRequirements from './components/SmartRequirements.jsx';
import FileReadinessWorkflow from './components/FileReadinessWorkflow.jsx';
import { inspectFile } from './utils/fileInspector.js';
import { ROUTES_DATA } from './data/seoData.js';
import { UI_TRANSLATIONS, ARABIC_ROUTES_CONTENT } from './data/translations.js';
import { getPdfInfo, compressPdf } from './utils/pdfCompressor.js';
import { getImageInfo, compressImage } from './utils/imageCompressor.js';
import { usePWAInstall } from './utils/usePWAInstall.js';
import {
  getFileType,
  formatBytes,
  parseTargetToBytes,
  calculateSeverityFromBytes,
} from './utils/fileUtils.js';

function getCleanPath() {
  if (typeof window === 'undefined') return '/';
  let p = window.location.pathname.toLowerCase().trim();
  if (p.length > 1 && p.endsWith('/')) {
    p = p.slice(0, -1);
  }
  return p || '/';
}

export default function App() {
  // Client-side route state
  const [currentPath, setCurrentPath] = useState(getCleanPath);

  // Theme state: default 'light', saved in localStorage
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const saved = localStorage.getItem('fileready_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {}
    return 'light';
  });

  // Language state: default 'en', saved in localStorage
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    try {
      const saved = localStorage.getItem('fileready_lang');
      if (saved === 'ar' || saved === 'en') return saved;
    } catch (e) {}
    return 'en';
  });

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const { isInstallable, triggerInstall } = usePWAInstall();

  // Active page SEO copy and configuration (memoized to prevent reference thrashing)
  const pageData = useMemo(() => {
    const basePageData = ROUTES_DATA[currentPath] || ROUTES_DATA['/'];
    if (lang !== 'ar') return basePageData;

    const arabicOverride = ARABIC_ROUTES_CONTENT[currentPath] || ARABIC_ROUTES_CONTENT['/'];
    if (!arabicOverride) return basePageData;

    return {
      ...basePageData,
      h1: arabicOverride.h1 || basePageData.h1,
      subheading: arabicOverride.subheading || basePageData.subheading,
      targetBadge: arabicOverride.targetBadge || basePageData.targetBadge,
      targetSummary: arabicOverride.targetSummary || basePageData.targetSummary,
      realisticConstraints: arabicOverride.realisticConstraints || basePageData.realisticConstraints,
      howTo: arabicOverride.howTo || basePageData.howTo,
      faqs: arabicOverride.faqs || basePageData.faqs,
    };
  }, [currentPath, lang]);

  // Initial target value & unit based on the landing route
  const initialRouteData = ROUTES_DATA[currentPath] || ROUTES_DATA['/'];
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [inspectionResult, setInspectionResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [targetValue, setTargetValue] = useState(initialRouteData.defaultTargetValue || 2);
  const [targetUnit, setTargetUnit] = useState(initialRouteData.defaultTargetUnit || 'MB');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressInfo, setProgressInfo] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Unified modal state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Continue',
    cancelText: 'Cancel',
    onConfirm: () => {},
  });

  // Sync theme changes to <html> class and localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fileready_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  }, [theme]);

  // Sync language changes to <html> dir/lang and localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fileready_lang', lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    } catch (e) {}
  }, [lang]);

  // Listen to browser navigation (back/forward and internal <Link> clicks)
  useEffect(() => {
    const handleLocationChange = () => {
      const newPath = getCleanPath();
      setCurrentPath(newPath);
    };

    window.addEventListener('popstate', handleLocationChange);
    const handleSyncTarget = (value, unit) => {
    setTargetValue(value);
    setTargetUnit(unit);
  };

  const handleMakeReady = (evalResult) => {
    const fixableRule = evalResult?.fixableRules?.find((r) => r.fixType === 'COMPRESS_SIZE');
    if (fixableRule && fixableRule.targetBytes) {
      const targetB = fixableRule.targetBytes;
      if (targetB < 1000 * 1000) {
        setTargetUnit('KB');
        setTargetValue(Math.round(targetB / 1000));
      } else {
        setTargetUnit('MB');
        const mb = Math.round((targetB / (1000 * 1000)) * 10) / 10;
        setTargetValue(mb);
      }
      handleProcessClick(targetB);
    } else {
      handleProcessClick();
    }
  };

  return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Update preselected target value & unit ONLY when navigating to a new route
  // (Never reset target values on language switch, theme toggle, or input interactions)
  useEffect(() => {
    if (!file) {
      const routeData = ROUTES_DATA[currentPath] || ROUTES_DATA['/'];
      if (routeData.defaultTargetValue !== undefined) {
        setTargetValue(routeData.defaultTargetValue);
      }
      if (routeData.defaultTargetUnit !== undefined) {
        setTargetUnit(routeData.defaultTargetUnit);
      }
      setErrorMessage('');
      setResult(null);
    }
  }, [currentPath]);

  const targetBytes = parseTargetToBytes(targetValue, targetUnit) || 0;
  const targetFormatted = formatBytes(targetBytes);

  const handleFileSelect = async (selectedFile) => {
    setErrorMessage('');
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }
    setResult(null);
    setMetadata(null);
    setProgressInfo(null);
    setInspectionResult(null);

    if (!selectedFile) return;

    const detectedType = getFileType(selectedFile);
    if (detectedType === 'UNSUPPORTED') {
      setErrorMessage(t.errUnsupported);
      return;
    }

    setFile(selectedFile);
    setFileType(detectedType);
    setIsAnalyzing(true);

    // Auto-adjust target unit to KB for small images if currently on generic MB view
    if (
      currentPath === '/' &&
      detectedType !== 'PDF' &&
      selectedFile.size < 1.5 * 1000 * 1000
    ) {
      setTargetUnit('KB');
      const halfKb = Math.max(10, Math.round(selectedFile.size / 2000 / 10) * 10);
      setTargetValue(halfKb);
    }

    // Step 1: Inspect baseline file metadata needed for compression
    let metadataInfo = null;
    try {
      if (detectedType === 'PDF') {
        metadataInfo = await getPdfInfo(selectedFile);
      } else {
        metadataInfo = await getImageInfo(selectedFile);
      }
      setMetadata(metadataInfo);
    } catch (err) {
      console.warn('Metadata inspection notice:', err);
      const msg = (err?.message || '').toLowerCase();
      if (msg.includes('password')) {
        setErrorMessage(t.errPassword);
      } else {
        setErrorMessage(t.errCantRead);
      }
      setMetadata(null);
    }

    // Immediate baseline inspection guarantee
    const baseInspection = {
      file: {
        name: selectedFile.name,
        size: selectedFile.size,
        sizeFormatted: formatBytes(selectedFile.size),
        type: selectedFile.type || (detectedType === 'PDF' ? 'application/pdf' : 'image/jpeg'),
        format: detectedType,
      },
      pdf: detectedType === 'PDF' ? {
        isOpenable: true,
        isEncrypted: false,
        pageCount: metadataInfo?.numPages || 1,
        pageSizes: [],
        dominantPageSize: '—',
        orientations: [],
        dominantOrientation: '—',
        hasMixedPageSizes: false,
        hasMixedOrientation: false,
        hasRotation: false,
        hasForms: false,
        hasAnnotations: false,
      } : null,
      image: detectedType !== 'PDF' ? {
        isOpenable: true,
        width: metadataInfo?.width || 0,
        height: metadataInfo?.height || 0,
        aspectRatio: metadataInfo?.aspectRatio || '—',
        megapixels: metadataInfo?.megapixels || 0,
        hasTransparency: metadataInfo?.hasTransparency || false,
      } : null,
      checks: [
        {
          id: 'file_format',
          status: 'PASS',
          labelKey: 'checkFormat',
          valueKey: detectedType === 'PDF' ? 'checkFormatPdf' : 'checkFormatImage',
          params: { format: detectedType },
        },
        {
          id: 'file_readability',
          status: 'PASS',
          labelKey: 'checkOpensCorrectly',
          valueKey: 'checkOpensSuccess',
        },
        {
          id: 'file_size',
          status: targetBytes && selectedFile.size <= targetBytes ? 'PASS' : 'WARN',
          labelKey: 'checkFileSize',
          valueKey: targetBytes && selectedFile.size <= targetBytes ? 'checkFileSizeOk' : 'checkFileSizeExceeds',
          params: {
            size: formatBytes(selectedFile.size),
            target: targetFormatted || formatBytes(targetBytes || 2000000),
          },
        },
      ],
      overallStatus: targetBytes && selectedFile.size <= targetBytes ? 'READY' : 'NEEDS_ATTENTION',
      targetBytes,
      timestamp: Date.now(),
    };
    setInspectionResult(baseInspection);

    // Step 2: Run deep file inspection for readiness (ISOLATED - NEVER THROWS OR SETS ERROR BANNER)
    try {
      const inspection = await inspectFile(selectedFile, {
        targetBytes,
        targetFormatted,
        metadata: metadataInfo,
      });
      if (inspection) {
        setInspectionResult(inspection);
      }
    } catch (inspectErr) {
      console.warn('Deep inspection error (non-fatal):', inspectErr);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }
    setFile(null);
    setFileType(null);
    setMetadata(null);
    setInspectionResult(null);
    setIsAnalyzing(false);
    setResult(null);
    setErrorMessage('');
    setIsProcessing(false);
    setProgressInfo(null);
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
    // Re-apply landing page default targets
    const defaultData = ROUTES_DATA[currentPath] || ROUTES_DATA['/'];
    if (defaultData.defaultTargetValue !== undefined) {
      setTargetValue(defaultData.defaultTargetValue);
    }
    if (defaultData.defaultTargetUnit !== undefined) {
      setTargetUnit(defaultData.defaultTargetUnit);
    }
  };

  const handleResetResult = () => {
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }
    setResult(null);
    setProgressInfo(null);
  };

  const executeCompression = async (options = {}) => {
    const bytesToUse = options.targetBytes || targetBytes;
    if (!file || !bytesToUse) return;

    setModalConfig((prev) => ({ ...prev, isOpen: false }));
    setIsProcessing(true);
    setErrorMessage('');
    setResult(null);

    try {
      let compressedData = null;

      if (fileType === 'PDF') {
        const targetMB = bytesToUse / (1024 * 1024);
        compressedData = await compressPdf(file, targetMB, (info) => {
          let stageLabel = t.preparingTitle;
          if (info.stage === 'Rendering and optimizing pages...') {
            stageLabel = t.optimizingStep
              .replace('{current}', info.current || 1)
              .replace('{total}', info.total || metadata?.numPages || 1);
          } else if (info.stage === 'Measuring final PDF size...') {
            stageLabel = t.verifyingTitle;
          }
          setProgressInfo({ ...info, stage: stageLabel });
        });
        compressedData.targetFormatted = formatBytes(bytesToUse);
        compressedData.originalSizeFormatted = formatBytes(file.size);
        compressedData.finalSizeFormatted = formatBytes(compressedData.finalSizeBytes);
      } else {
        // Image compression (JPG / PNG)
        compressedData = await compressImage(
          file,
          bytesToUse,
          (info) => {
            let stageLabel = t.processingImage;
            if (info.stage === 'Testing compression levels at full dimensions...') {
              stageLabel = t.analyzingImage;
            } else if (info.stage === 'Adjusting image resolution to fit target...') {
              stageLabel = t.downscalingImage;
            }
            setProgressInfo({ ...info, stage: stageLabel });
          },
          options
        );
      }

      setResult(compressedData);

      // Trigger automatic download only when target constraint is genuinely achieved
      if (compressedData.isTargetAchieved && compressedData.downloadUrl) {
        const downloadLink = document.createElement('a');
        downloadLink.href = compressedData.downloadUrl;
        downloadLink.download = compressedData.fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    } catch (err) {
      console.error('Compression failure:', err);
      const msg = (err?.message || '').toLowerCase();
      if (msg.includes('password')) {
        setErrorMessage(t.errPassword);
      } else if (msg.includes('memory') || msg.includes('out of memory') || msg.includes('quota')) {
        setErrorMessage(t.errTooLarge);
      } else if (msg.includes('corrupted') || msg.includes('unable to process') || msg.includes('cannot read')) {
        setErrorMessage(t.errCantRead);
      } else {
        setErrorMessage(t.errGeneric);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessClick = (overrideBytes = null) => {
    const bytesToUse = overrideBytes || targetBytes;
    if (!file || !bytesToUse) return;

    if (file.size <= bytesToUse) {
      return; // Already compliant
    }

    const severity = calculateSeverityFromBytes(file.size, bytesToUse);
    if (severity.level === 'STRONG') {
      const msg = fileType === 'PDF' ? t.modalStrongPdfMsg : t.modalStrongImgMsg;

      setModalConfig({
        isOpen: true,
        title: t.modalStrongTitle,
        message: msg,
        confirmText: t.modalContinueBtn,
        cancelText: t.modalCancelBtn,
        onConfirm: () => executeCompression({ targetBytes: bytesToUse }),
      });
    } else {
      executeCompression({ targetBytes: bytesToUse });
    }
  };

  // Triggered when target could not be reached as transparent PNG and user chooses JPG fallback
  const handleRequestJpgConversion = () => {
    setModalConfig({
      isOpen: true,
      title: t.modalConvertTitle,
      message: t.modalConvertMsg,
      confirmText: t.btnConvertJpg,
      cancelText: t.btnKeepPng,
      onConfirm: () => executeCompression({ forceJpgConversion: true }),
    });
  };

  const handleSyncTarget = (value, unit) => {
    setTargetValue(value);
    setTargetUnit(unit);
  };

  const handleMakeReady = (evalResult) => {
    const fixableRule = evalResult?.fixableRules?.find((r) => r.fixType === 'COMPRESS_SIZE');
    if (fixableRule && fixableRule.targetBytes) {
      const targetB = fixableRule.targetBytes;
      if (targetB < 1000 * 1000) {
        setTargetUnit('KB');
        setTargetValue(Math.round(targetB / 1000));
      } else {
        setTargetUnit('MB');
        const mb = Math.round((targetB / (1000 * 1000)) * 10) / 10;
        setTargetValue(mb);
      }
      handleProcessClick(targetB);
    } else {
      handleProcessClick();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-[#0B1220] dark:text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white transition-colors">
      {/* Dynamic SEO Meta Tags, Canonical & JSON-LD Structured Data */}
      <SEO
        title={pageData.title}
        description={pageData.metaDescription}
        canonical={pageData.canonical}
        h1={pageData.h1}
        lang={lang}
      />

      {/* Global Header with Theme, Language, Tools Hub, and Optional Install Controls */}
      <Header
        theme={theme}
        setTheme={setTheme}
        lang={lang}
        setLang={setLang}
        isInstallable={isInstallable}
        onInstall={triggerInstall}
      />

      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
        {currentPath === '/tools' ? (
          <ToolsHub lang={lang} />
        ) : currentPath === '/merge-pdf' ? (
          <MergePdfTool lang={lang} />
        ) : (
          <>
            {/* Error notification banner */}
            <AlertBanner
              message={errorMessage}
              onDismiss={() => setErrorMessage('')}
            />

            {/* Page Hero Header */}
            <div className="text-center sm:text-start space-y-1.5 pt-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                  {pageData.targetBadge}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0B1220] dark:text-white tracking-tight">
                {pageData.h1}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {pageData.subheading}
              </p>
            </div>

            {/* Target limit input - shown before file selection */}
            {!file && (
              <TargetSizeInput
                targetValue={targetValue}
                setTargetValue={setTargetValue}
                targetUnit={targetUnit}
                setTargetUnit={setTargetUnit}
                disabled={isProcessing || isAnalyzing}
                lang={lang}
              />
            )}

            {/* State 1: File Picker / Dropzone */}
            {!file && (
              <FileDropzone
                onFileSelected={handleFileSelect}
                disabled={isProcessing || isAnalyzing}
                lang={lang}
              />
            )}

            {/* State 3: Analyzing State */}
            {file && isAnalyzing && (
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-xs space-y-3 animate-in fade-in duration-200">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl mx-auto shadow-2xs">
                  <span className="animate-spin inline-block h-5 w-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full"></span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-white">
                    {t.analyzingTitle}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs mx-auto">
                    {file.name} ({formatBytes(file.size)}) • {fileType}
                  </p>
                </div>
              </div>
            )}

            {/* State 4, 5, 6, 7, 8: Unified File Readiness Workflow */}
            {file && !isAnalyzing && (
              <FileReadinessWorkflow
                file={file}
                fileType={fileType}
                inspection={inspectionResult}
                metadata={metadata}
                targetBytes={targetBytes}
                isProcessing={isProcessing}
                progressInfo={progressInfo}
                result={result}
                onSyncTarget={handleSyncTarget}
                onMakeReady={handleMakeReady}
                onReset={handleReset}
                onRequestJpgConversion={handleRequestJpgConversion}
                lang={lang}
              />
            )}

            {/* Informational Context & Real Constraints */}
            {!file && pageData.howTo && (
              <section className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
                <div className="space-y-1">
                  <h2 className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-white tracking-tight">
                    {t.howItWorksTitle}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {pageData.targetSummary}
                  </p>
                </div>

                {/* 4 Concrete Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {pageData.howTo.map((item) => (
                    <div key={item.step} className="p-3 bg-slate-50/80 dark:bg-slate-950/80 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {item.step}
                        </span>
                        <h3 className="text-xs font-bold text-[#0B1220] dark:text-white">{item.title}</h3>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug ps-7">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Realistic Constraints List */}
                {pageData.realisticConstraints && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.realisticTitle}</h3>
                    <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                      {pageData.realisticConstraints.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold shrink-0">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Structured FAQ Section */}
            {pageData.faqs && pageData.faqs.length > 0 && (
              <FAQAccordion
                title={t.faqTitle}
                subtitle={t.faqSubtitle}
                faqs={pageData.faqs}
              />
            )}

            {/* Internal Contextual Cross-Links (Only on specialized landing pages, NOT on homepage) */}
            {currentPath !== '/' && pageData.relatedPages && (
              <InternalLinks
                title={t.relatedToolsTitle}
                subtitle={t.relatedToolsSubtitle}
                links={pageData.relatedPages}
                currentPath={currentPath}
              />
            )}
          </>
        )}
      </main>

      {/* Global Minimal SaaS Footer with Founder Attribution */}
      <Footer lang={lang} />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
