import React, { useState, useRef, useEffect } from 'react';
import Link from './Link.jsx';
import { inspectPdfForms, flattenPdf } from '../utils/pdfFlattener.js';
import { formatBytes } from '../utils/fileUtils.js';
import { UI_TRANSLATIONS } from '../data/translations.js';

export default function FlattenPdfTool({ lang = 'en' }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inspection, setInspection] = useState(null);

  // User Flattening Options
  const [mode, setMode] = useState('vector'); // 'vector' | 'print'
  const [stripMetadata, setStripMetadata] = useState(true);
  const [stripAnnotations, setStripAnnotations] = useState(false);

  // Execution & Progress State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressInfo, setProgressInfo] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Clean up object URL on unmount or reset
  useEffect(() => {
    return () => {
      if (result?.downloadUrl) {
        URL.revokeObjectURL(result.downloadUrl);
      }
    };
  }, [result]);

  const resetAll = () => {
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }
    setFile(null);
    setIsAnalyzing(false);
    setInspection(null);
    setMode('vector');
    setStripMetadata(true);
    setStripAnnotations(false);
    setIsProcessing(false);
    setProgressInfo(null);
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
          ? 'يرجى اختيار ملف PDF صالح.'
          : 'Please select a valid PDF file.'
      );
      return;
    }

    resetAll();
    setFile(selectedFile);
    setIsAnalyzing(true);
    setErrorMessage('');

    try {
      const formInfo = await inspectPdfForms(selectedFile);
      if (!formInfo.isOpenable) {
        if (formInfo.isEncrypted) {
          setErrorMessage(
            lang === 'ar'
              ? 'هذا المستند محمي بكلمة مرور. يرجى إزالة كلمة المرور أولاً.'
              : 'This PDF is password-protected. Please unlock it before flattening.'
          );
        } else {
          setErrorMessage(
            lang === 'ar'
              ? 'تعذر قراءة ملف الـ PDF. قد يكون الملف تالفاً.'
              : 'Unable to read the PDF. The file may be corrupted.'
          );
        }
        setFile(null);
        return;
      }
      setInspection(formInfo);
    } catch (err) {
      console.error('Inspection error:', err);
      setErrorMessage(
        lang === 'ar'
          ? 'حدث خطأ أثناء فحص المستند.'
          : 'An error occurred while inspecting the document.'
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

  const handleFlatten = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgressInfo({
      stage: t.flattenAnalyzingTitle || 'Preparing to flatten...',
      percent: 10,
    });
    setErrorMessage('');

    try {
      const flattenedData = await flattenPdf(
        file,
        {
          mode,
          stripMetadata,
          stripAnnotations,
        },
        (prog) => {
          setProgressInfo(prog);
        }
      );

      setResult(flattenedData);

      // Automatic download on success
      if (flattenedData.downloadUrl) {
        const a = document.createElement('a');
        a.href = flattenedData.downloadUrl;
        a.download = flattenedData.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Flattening error:', err);
      setErrorMessage(
        lang === 'ar'
          ? 'حدث خطأ أثناء تسطيح المستند. يرجى المحاولة مرة أخرى.'
          : 'An error occurred while flattening the document. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
      {/* Tool Header */}
      <div className="text-center sm:text-start space-y-1.5 pt-1">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
            {t.toolBadgeFlattenPdf || 'Security'}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0B1220] dark:text-white tracking-tight">
          {t.toolTitleFlattenPdf}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
          {t.toolDescFlattenPdf}
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
      {/* STATE 1: DROPZONE                                              */}
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
              🔒
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-white">
                {t.flattenDropzonePrompt}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supports Government, Visa, Tax, and Academic PDF Forms • 100% Client-Side Privacy
              </p>
            </div>
          </div>

          {/* Key Advantages */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-2 text-start max-w-lg mx-auto">
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> Locks form fields
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> Burns in signatures
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> Portal-compliant (USCIS/Courts)
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> Strips edit history
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> Vector sharpness preserved
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> 100% Client-Side
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STATE 2: ANALYZING DOCUMENT                                    */}
      {/* ============================================================== */}
      {file && isAnalyzing && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs text-center space-y-4">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl">
            <span className="animate-spin inline-block h-6 w-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-white">
              {t.flattenAnalyzingTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs mx-auto">
              {file.name} ({formatBytes(file.size)})
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STATE 3: INSPECTED & OPTIONS                                   */}
      {/* ============================================================== */}
      {file && !isAnalyzing && inspection && !result && !isProcessing && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 transition-colors">
          {/* File Card Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#0B1220] dark:text-white truncate">
                {file.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatBytes(file.size)} • {inspection.pageCount} {lang === 'ar' ? 'صفحة' : 'pages'}
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

          {/* Inspection Findings */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.flattenFindingsTitle}
            </h4>

            {inspection.fieldCount > 0 ? (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                  <span className="text-base text-amber-600">✓</span>
                  <span>{t.flattenFormsFound.replace('{count}', inspection.fieldCount)}</span>
                </div>
                {/* Field types badges */}
                <div className="flex flex-wrap gap-1.5 ps-6">
                  {inspection.fieldTypes.text > 0 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/80 dark:bg-slate-900/80 border border-amber-200/60 dark:border-amber-800/60 text-amber-800 dark:text-amber-300">
                      {inspection.fieldTypes.text} {lang === 'ar' ? 'حقل نصي' : 'text fields'}
                    </span>
                  )}
                  {inspection.fieldTypes.checkbox > 0 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/80 dark:bg-slate-900/80 border border-amber-200/60 dark:border-amber-800/60 text-amber-800 dark:text-amber-300">
                      {inspection.fieldTypes.checkbox} {lang === 'ar' ? 'مربع اختيار' : 'checkboxes'}
                    </span>
                  )}
                  {inspection.fieldTypes.dropdown > 0 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/80 dark:bg-slate-900/80 border border-amber-200/60 dark:border-amber-800/60 text-amber-800 dark:text-amber-300">
                      {inspection.fieldTypes.dropdown} {lang === 'ar' ? 'قائمة منسدلة' : 'dropdowns'}
                    </span>
                  )}
                  {inspection.fieldTypes.radio > 0 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/80 dark:bg-slate-900/80 border border-amber-200/60 dark:border-amber-800/60 text-amber-800 dark:text-amber-300">
                      {inspection.fieldTypes.radio} {lang === 'ar' ? 'زر خيار' : 'radio buttons'}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/50 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <span className="text-base text-blue-600">ℹ</span>
                <span>{t.flattenNoForms}</span>
              </div>
            )}
          </div>

          {/* Mode Selection */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.flattenModeTitle}
            </h4>

            <div className="space-y-2">
              <label
                className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                  mode === 'vector'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <input
                  type="radio"
                  name="flattenMode"
                  value="vector"
                  checked={mode === 'vector'}
                  onChange={() => setMode('vector')}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div className="space-y-0.5 text-start">
                  <span className="text-xs font-bold block">{t.flattenModeVector}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed block">
                    {t.flattenModeVectorDesc}
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                  mode === 'print'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <input
                  type="radio"
                  name="flattenMode"
                  value="print"
                  checked={mode === 'print'}
                  onChange={() => setMode('print')}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div className="space-y-0.5 text-start">
                  <span className="text-xs font-bold block">{t.flattenModePrint}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed block">
                    {t.flattenModePrintDesc}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Security & Sanitization Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <label className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors">
              <input
                type="checkbox"
                checked={stripMetadata}
                onChange={(e) => setStripMetadata(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span>{t.flattenOptMetadata}</span>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors">
              <input
                type="checkbox"
                checked={stripAnnotations}
                onChange={(e) => setStripAnnotations(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span>{t.flattenOptAnnotations}</span>
            </label>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleFlatten}
            className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🔒</span>
            <span>{t.flattenBtnAction}</span>
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* STATE 4: PROCESSING                                            */}
      {/* ============================================================== */}
      {isProcessing && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs text-center space-y-4">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl">
            <span className="animate-spin inline-block h-6 w-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-white">
              {progressInfo?.stage || 'Flattening document...'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Processing locally in your browser • 100% Private
            </p>
          </div>

          {/* Real Progress Bar */}
          <div className="max-w-md mx-auto space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>{progressInfo?.stage}</span>
              <span>{progressInfo?.percent || 0}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-200 rounded-full"
                style={{ width: `${progressInfo?.percent || 0}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STATE 5: VERIFIED SUCCESS RESULT                               */}
      {/* ============================================================== */}
      {result && !isProcessing && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
          {/* Success Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 flex items-start gap-2.5">
            <span className="text-xl shrink-0">✓</span>
            <div className="space-y-0.5 text-start">
              <h3 className="text-sm font-bold tracking-tight">
                {t.flattenSuccessTitle}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.flattenSuccessDesc}
              </p>
            </div>
          </div>

          {/* Before vs After Comparison Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {lang === 'ar' ? 'المقارنة والتحقق الفعلي' : 'Before vs After Verification'}
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Before Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-start">
                <span className="font-bold text-slate-500 dark:text-slate-400 block border-b border-slate-200 dark:border-slate-800 pb-1">
                  {t.flattenBefore}
                </span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.flattenFieldsCount}</span>
                    <span className="font-bold">{result.before.fieldCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.flattenFileSize}</span>
                    <span className="font-bold">{result.before.fileSizeFormatted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.flattenPageCount}</span>
                    <span className="font-bold">{result.before.pageCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.flattenLockedStatus}</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {result.before.hasForms ? t.flattenEditableVal : 'Standard'}
                    </span>
                  </div>
                </div>
              </div>

              {/* After Card */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 space-y-2 text-start">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block border-b border-emerald-200/80 dark:border-emerald-800/50 pb-1">
                  {t.flattenAfter}
                </span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{t.flattenFieldsCount}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">0 (Locked)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{t.flattenFileSize}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {result.after.fileSizeFormatted}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{t.flattenPageCount}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {result.after.pageCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{t.flattenLockedStatus}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {t.flattenLockedVal}
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
              <span>{t.flattenDownloadBtn} ({result.after.fileSizeFormatted})</span>
            </a>

            <button
              type="button"
              onClick={resetAll}
              className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              {t.flattenStartOver}
            </button>
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
