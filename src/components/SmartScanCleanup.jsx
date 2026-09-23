import React, { useState, useRef } from 'react';
import Link from './Link.jsx';
import { analyzeScannedPdf, cleanScannedPdf } from '../utils/scanCleaner.js';
import { formatBytes } from '../utils/fileUtils.js';
import { UI_TRANSLATIONS } from '../data/translations.js';

export default function SmartScanCleanup({ lang = 'en' }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  // User Cleanup Preferences
  const [options, setOptions] = useState({
    deskew: true,
    cropMargins: true,
    cleanBackground: true,
    removeBlankPages: false,
    normalizeOrientation: true,
  });

  // Blank Page Confirmation Modal
  const [isBlankModalOpen, setIsBlankModalOpen] = useState(false);

  // Processing & Execution State
  const [isProcessing, setIsProcessing] = useState(false);
  const [cleanProgress, setCleanProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const resetAll = () => {
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }
    setFile(null);
    setIsAnalyzing(false);
    setAnalysisProgress(null);
    setAnalysisResult(null);
    setOptions({
      deskew: true,
      cropMargins: true,
      cleanBackground: true,
      removeBlankPages: false,
      normalizeOrientation: true,
    });
    setIsBlankModalOpen(false);
    setIsProcessing(false);
    setCleanProgress(null);
    setResult(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return;

    const isPdf =
      selectedFile.type === 'application/pdf' ||
      selectedFile.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setErrorMessage(
        lang === 'ar'
          ? 'يرجى اختيار ملف PDF ممسوح ضوئياً.'
          : 'Please select a scanned PDF file.'
      );
      return;
    }

    resetAll();
    setFile(selectedFile);
    setIsAnalyzing(true);
    setErrorMessage('');

    try {
      const analysis = await analyzeScannedPdf(selectedFile, (prog) => {
        setAnalysisProgress(prog);
      });

      setAnalysisResult(analysis);
      // Smart default checkboxes based on actual findings
      setOptions({
        deskew: analysis.findings.skewedPagesCount > 0,
        cropMargins: analysis.findings.marginPagesCount > 0,
        cleanBackground: analysis.findings.backgroundPagesCount > 0,
        removeBlankPages: false, // Never auto-enable page deletion
        normalizeOrientation: analysis.findings.orientationPagesCount > 0,
      });
    } catch (err) {
      console.error('Scan analysis error:', err);
      setErrorMessage(
        lang === 'ar'
          ? 'تعذر قراءة صفحات ملف الـ PDF. قد يكون الملف محمياً بكلمة مرور.'
          : 'Unable to analyze PDF pages. The file may be password-protected or corrupted.'
      );
      setFile(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleStartCleanup = async () => {
    if (!file || !analysisResult) return;

    setIsProcessing(true);
    setCleanProgress({
      stage: 'Starting scan cleanup...',
      percent: 5,
    });
    setErrorMessage('');

    try {
      const cleanedData = await cleanScannedPdf(
        file,
        {
          ...options,
          pageAnalyses: analysisResult.pageAnalyses,
        },
        (prog) => {
          setCleanProgress(prog);
        }
      );

      setResult(cleanedData);

      // Automatic download on verified success
      if (cleanedData.downloadUrl) {
        const a = document.createElement('a');
        a.href = cleanedData.downloadUrl;
        a.download = cleanedData.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Scan cleanup error:', err);
      setErrorMessage(
        lang === 'ar'
          ? 'حدث خطأ أثناء تنظيف المستند. يرجى المحاولة مرة أخرى.'
          : 'An error occurred while cleaning the document. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const findings = analysisResult?.findings;
  const hasAnyFindings =
    findings &&
    (findings.skewedPagesCount > 0 ||
      findings.marginPagesCount > 0 ||
      findings.backgroundPagesCount > 0 ||
      findings.blankPagesCount > 0 ||
      findings.orientationPagesCount > 0);

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
      {/* Tool Header */}
      <div className="text-center sm:text-start space-y-1.5 pt-1">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
            Smart Scan
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0B1220] dark:text-white tracking-tight">
          {t.scanCleanupTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
          {t.scanCleanupSubtitle}
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
          <span className="text-base shrink-0">⚠️</span>
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* STATE 1: NO FILE SELECTED — DROPZONE                            */}
      {/* ============================================================== */}
      {!file && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-md'
              : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50/50 dark:hover:bg-slate-900 shadow-2xs'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
            className="hidden"
          />

          <div className="space-y-3">
            <div className="h-16 w-16 mx-auto rounded-3xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/20">
              ✨
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-white">
                {t.scanDropzonePrompt}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supports all scanned PDF documents • 100% Client-Side Privacy
              </p>
            </div>
          </div>

          {/* Key Capabilities Preview */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-2 text-start max-w-lg mx-auto">
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> Deskew crooked text
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> Crop excessive margins
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> Whiten gray background
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> Detect blank pages
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> Normalize orientation
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> Per-page analysis
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STATE 2: ANALYZING DOCUMENT STRUCTURE                          */}
      {/* ============================================================== */}
      {file && isAnalyzing && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs text-center space-y-4">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl">
            <span className="animate-spin inline-block h-6 w-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-white">
              {analysisProgress?.stage || t.scanAnalyzingTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs mx-auto">
              {file.name} ({formatBytes(file.size)})
            </p>
          </div>

          {/* Real Progress Bar */}
          <div className="max-w-md mx-auto space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>{analysisProgress?.stage || 'Analyzing...'}</span>
              <span>{analysisProgress?.percent || 0}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-200 rounded-full"
                style={{ width: `${analysisProgress?.percent || 0}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STATE 3: ANALYSIS COMPLETE & CLEANUP OPTIONS                   */}
      {/* ============================================================== */}
      {file && !isAnalyzing && analysisResult && !result && !isProcessing && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 transition-colors">
          {/* File Meta Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#0B1220] dark:text-white truncate">
                {file.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatBytes(file.size)} • {analysisResult.totalPages}{' '}
                {lang === 'ar' ? 'صفحة' : 'pages'}
              </p>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors px-2 py-1 cursor-pointer"
            >
              ✕ {t.btnCancel}
            </button>
          </div>

          {/* Detection Findings Section */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.scanFindingsTitle}
            </h4>

            {hasAnyFindings ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {findings.skewedPagesCount > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-600">✓</span>
                    <span>
                      {t.scanPagesSkewed.replace(
                        '{count}',
                        findings.skewedPagesCount
                      )}
                    </span>
                  </div>
                )}

                {findings.marginPagesCount > 0 && (
                  <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/50 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-600">✓</span>
                    <span>
                      {t.scanPagesMargins.replace(
                        '{count}',
                        findings.marginPagesCount
                      )}
                    </span>
                  </div>
                )}

                {findings.backgroundPagesCount > 0 && (
                  <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/50 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                    <span className="text-sm font-bold text-indigo-600">✓</span>
                    <span>
                      {t.scanPagesBg.replace(
                        '{count}',
                        findings.backgroundPagesCount
                      )}
                    </span>
                  </div>
                )}

                {findings.blankPagesCount > 0 && (
                  <div className="p-3 rounded-xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/50 text-xs text-purple-900 dark:text-purple-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-purple-600">✓</span>
                      <span>
                        {t.scanPagesBlank.replace(
                          '{count}',
                          findings.blankPagesCount
                        )}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsBlankModalOpen(true)}
                      className="text-[11px] font-bold text-purple-700 dark:text-purple-300 underline hover:no-underline cursor-pointer"
                    >
                      {t.scanReviewBlankPages}
                    </button>
                  </div>
                )}

                {findings.orientationPagesCount > 0 && (
                  <div className="p-3 rounded-xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/50 text-xs text-teal-900 dark:text-teal-200 flex items-center gap-2">
                    <span className="text-sm font-bold text-teal-600">✓</span>
                    <span>
                      {t.scanPagesOrient.replace(
                        '{count}',
                        findings.orientationPagesCount
                      )}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <span>✓</span>
                <span>{t.scanNoDefects}</span>
              </div>
            )}
          </div>

          {/* Cleanup Options Checklist */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {lang === 'ar' ? 'خيارات المعالجة والتنظيف' : 'Cleanup Options'}
            </h4>

            <div className="space-y-2">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={options.deskew}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, deskew: e.target.checked }))
                  }
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>{t.scanOptDeskew}</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={options.cropMargins}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      cropMargins: e.target.checked,
                    }))
                  }
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>{t.scanOptCropMargins}</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={options.cleanBackground}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      cleanBackground: e.target.checked,
                    }))
                  }
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>{t.scanOptCleanBg}</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={options.normalizeOrientation}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      normalizeOrientation: e.target.checked,
                    }))
                  }
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>{t.scanOptNormalizeOrient}</span>
              </label>

              {findings?.blankPagesCount > 0 && (
                <div
                  className={`p-2.5 rounded-xl border transition-colors flex items-center justify-between ${
                    options.removeBlankPages
                      ? 'border-purple-300 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/30'
                      : 'border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={options.removeBlankPages}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setIsBlankModalOpen(true);
                        } else {
                          setOptions((prev) => ({
                            ...prev,
                            removeBlankPages: false,
                          }));
                        }
                      }}
                      className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4"
                    />
                    <span>{t.scanOptRemoveBlank}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsBlankModalOpen(true)}
                    className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    {t.scanReviewBlankPages} ({findings.blankPagesCount})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleStartCleanup}
            className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>✨</span>
            <span>{t.scanBtnClean}</span>
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* STATE 4: PROCESSING / CLEANING SCAN PAGES                     */}
      {/* ============================================================== */}
      {isProcessing && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs text-center space-y-4">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl">
            <span className="animate-spin inline-block h-6 w-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-white">
              {cleanProgress?.stage || 'Cleaning scanned pages...'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Processing locally in your browser • No server uploads
            </p>
          </div>

          {/* Real Progress Bar */}
          <div className="max-w-md mx-auto space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>{cleanProgress?.stage}</span>
              <span>{cleanProgress?.percent || 0}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-200 rounded-full"
                style={{ width: `${cleanProgress?.percent || 0}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STATE 5: COMPLETE & VERIFIED RESULTS                          */}
      {/* ============================================================== */}
      {result && !isProcessing && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
          {/* Success Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 flex items-start gap-2.5">
            <span className="text-xl shrink-0">✓</span>
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold tracking-tight">
                {t.scanCompleteTitle}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                All selected scan corrections have been applied and verified.
              </p>
            </div>
          </div>

          {/* Applied Operations Verified List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {lang === 'ar' ? 'الإصلاحات المنفذة' : 'Applied Cleanups'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.appliedOperations.deskewedCount > 0 && (
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  ✓ {t.scanDeskewed.replace('{count}', result.appliedOperations.deskewedCount)}
                </span>
              )}
              {result.appliedOperations.croppedCount > 0 && (
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                  ✓ {t.scanCropped.replace('{count}', result.appliedOperations.croppedCount)}
                </span>
              )}
              {result.appliedOperations.cleanedBgCount > 0 && (
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300">
                  ✓ {t.scanBgCleaned.replace('{count}', result.appliedOperations.cleanedBgCount)}
                </span>
              )}
              {result.appliedOperations.blankRemovedCount > 0 && (
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
                  ✓ {t.scanBlankRemoved.replace('{count}', result.appliedOperations.blankRemovedCount)}
                </span>
              )}
              {result.appliedOperations.normalizedCount > 0 && (
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300">
                  ✓ {t.scanNormalized.replace('{count}', result.appliedOperations.normalizedCount)}
                </span>
              )}
            </div>
          </div>

          {/* Before vs After Comparison Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {lang === 'ar' ? 'المقارنة قبل وبعد المعالجة' : 'Before vs After Verification'}
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Before Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-500 dark:text-slate-400 block border-b border-slate-200 dark:border-slate-800 pb-1">
                  {t.scanBefore}
                </span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pages:</span>
                    <span className="font-bold">{result.before.pageCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Size:</span>
                    <span className="font-bold">{result.before.fileSizeFormatted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dimensions:</span>
                    <span className="font-bold">{result.before.pageSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Orientation:</span>
                    <span className="font-bold capitalize">{result.before.orientation}</span>
                  </div>
                </div>
              </div>

              {/* After Card */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 space-y-2">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block border-b border-emerald-200/80 dark:border-emerald-800/50 pb-1">
                  {t.scanAfter}
                </span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Pages:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {result.after.pageCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Size:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {result.after.fileSizeFormatted}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Dimensions:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {result.after.pageSize}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Orientation:</span>
                    <span className="font-bold capitalize text-emerald-600 dark:text-emerald-400">
                      {result.after.orientation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <a
              href={result.downloadUrl}
              download={result.fileName}
              className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>⬇</span>
              <span>
                {t.scanDownloadBtn} ({result.after.fileSizeFormatted})
              </span>
            </a>

            <button
              type="button"
              onClick={resetAll}
              className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              {t.scanStartOver}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BLANK PAGES REVIEW / CONFIRMATION MODAL                        */}
      {/* ============================================================== */}
      {isBlankModalOpen && findings?.blankPagesCount > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400">
              <span className="text-xl">📄</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.scanModalBlankTitle}
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.scanModalBlankDesc.replace('{count}', findings.blankPagesCount)}
            </p>

            {/* List of blank page numbers */}
            <div className="max-h-32 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap gap-1.5">
              {findings.blankPageNumbers.map((num) => (
                <span
                  key={num}
                  className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Page {num}
                </span>
              ))}
            </div>

            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              {t.scanModalBlankPrompt}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setIsBlankModalOpen(false);
                  setOptions((prev) => ({ ...prev, removeBlankPages: false }));
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                {t.btnCancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsBlankModalOpen(false);
                  setOptions((prev) => ({ ...prev, removeBlankPages: true }));
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all cursor-pointer"
              >
                {t.scanModalBtnRemove.replace('{count}', findings.blankPagesCount)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return link to Tools Hub */}
      <div className="text-center pt-2">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>←</span>
          <span>{lang === 'ar' ? 'العودة لمركز الأدوات' : 'Back to Tools Hub'}</span>
        </Link>
      </div>
    </div>
  );
}
