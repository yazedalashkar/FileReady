import React, { useState, useRef, useEffect } from 'react';
import Link from './Link.jsx';
import { convertImagesToPdf } from '../utils/imagesToPdf.js';
import { formatBytes } from '../utils/fileUtils.js';
import { UI_TRANSLATIONS } from '../data/translations.js';

export default function ImagesToPdfTool({ lang = 'en' }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  const [images, setImages] = useState([]); // Array of { file, previewUrl, id }
  const [pageSize, setPageSize] = useState('a4'); // 'a4' | 'fit'
  const [orientation, setOrientation] = useState('auto'); // 'auto' | 'portrait' | 'landscape'
  const [margin, setMargin] = useState(15); // 0, 15, 30
  const [optimize, setOptimize] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressInfo, setProgressInfo] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);
  const addMoreInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Clean up object URLs on unmount or reset
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      });
      if (result?.downloadUrl) {
        URL.revokeObjectURL(result.downloadUrl);
      }
    };
  }, []);

  const handleFilesAdded = (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const validImages = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type.startsWith('image/') || /\.(jpe?g|png|webp|bmp)$/i.test(file.name)) {
        validImages.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }
    }

    if (validImages.length === 0) {
      setErrorMessage(
        lang === 'ar'
          ? 'يرجى اختيار ملفات صور صالحة (JPG, PNG, WebP).'
          : 'Please select valid image files (JPG, PNG, WebP).'
      );
      return;
    }

    setErrorMessage('');
    setImages((prev) => [...prev, ...validImages]);
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => {
      const target = prev[indexToRemove];
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  const moveUp = (idx) => {
    if (idx <= 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[idx - 1];
      copy[idx - 1] = copy[idx];
      copy[idx] = temp;
      return copy;
    });
  };

  const moveDown = (idx) => {
    if (idx >= images.length - 1) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[idx + 1];
      copy[idx + 1] = copy[idx];
      copy[idx] = temp;
      return copy;
    });
  };

  const resetAll = () => {
    images.forEach((img) => {
      if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
    });
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }
    setImages([]);
    setResult(null);
    setProgressInfo(null);
    setIsProcessing(false);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (addMoreInputRef.current) addMoreInputRef.current.value = '';
  };

  const handleConvert = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    setProgressInfo({
      stage: lang === 'ar' ? 'بدء تجهيز الصور...' : 'Preparing images...',
      percent: 5,
    });
    setErrorMessage('');

    try {
      const rawFiles = images.map((item) => item.file);
      const output = await convertImagesToPdf(
        rawFiles,
        {
          pageSize,
          orientation,
          margin,
          optimize,
        },
        (prog) => {
          setProgressInfo(prog);
        }
      );

      setResult(output);

      // Auto trigger download
      if (output.downloadUrl) {
        const a = document.createElement('a');
        a.href = output.downloadUrl;
        a.download = output.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Images to PDF conversion error:', err);
      setErrorMessage(
        lang === 'ar'
          ? 'حدث خطأ أثناء تحويل الصور إلى PDF. يرجى المحاولة مرة أخرى.'
          : 'Failed to convert images to PDF. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const totalRawSize = images.reduce((acc, curr) => acc + curr.file.size, 0);

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
      {/* Tool Header */}
      <div className="text-center sm:text-start space-y-1.5 pt-1">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
            {t.toolBadgeImagesToPdf || 'Conversion'}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0B1220] dark:text-white tracking-tight">
          {t.toolTitleImagesToPdf || (lang === 'ar' ? 'تحويل الصور إلى PDF' : 'Convert Images to PDF')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
          {t.toolDescImagesToPdf ||
            (lang === 'ar'
              ? 'حوّل ورتب صور الشهادات والهويات والوثائق إلى مستند PDF واحد أنيق ومنظم ومطابق لاشتراطات التقديم.'
              : 'Combine, reorder, and convert photos and document scans into one clean, portal-compliant PDF document.')}
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
          <span className="text-base shrink-0">⚠️</span>
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* STATE 1: NO IMAGES - DROPZONE                                  */}
      {/* ============================================================== */}
      {images.length === 0 && !result && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFilesAdded(e.dataTransfer?.files);
          }}
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
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={(e) => handleFilesAdded(e.target.files)}
            className="hidden"
          />

          <div className="space-y-3">
            <div className="h-16 w-16 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/20">
              🖼️
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-white">
                {lang === 'ar' ? 'اختر الصور أو أسقطها هنا' : 'Choose images or drop them here'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'ar'
                  ? 'يدعم صور JPG, PNG, WebP • يمكنك اختيار عدة صور دفعة واحدة'
                  : 'Supports JPG, PNG, WebP • Select multiple images at once'}
              </p>
            </div>
          </div>

          {/* Quick Advantages Grid */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-2 text-start max-w-lg mx-auto">
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> {lang === 'ar' ? 'ترتيب الصفحات بسهولة' : 'Easy page reordering'}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> {lang === 'ar' ? 'مقاس A4 رسمي للبوابات' : 'Standard A4 page format'}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> {lang === 'ar' ? 'تعديل الاتجاه التلقائي' : 'Auto page orientation'}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> {lang === 'ar' ? 'ضغط ذكي لأقل من 2MB' : 'Smart compression under 2MB'}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> {lang === 'ar' ? 'معالجة محلية 100%' : '100% Client-Side Privacy'}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-500 font-bold">✓</span> {lang === 'ar' ? 'لا يستهلك باقة إنترنت' : 'Zero upload bandwidth'}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STATE 2: IMAGES LIST & CONFIGURATION                           */}
      {/* ============================================================== */}
      {images.length > 0 && !result && !isProcessing && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 transition-colors">
          {/* Top Actions Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
            <div>
              <h3 className="text-sm font-bold text-[#0B1220] dark:text-white">
                {images.length} {lang === 'ar' ? 'صور محددة' : 'images selected'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'ar' ? 'الحجم الإجمالي:' : 'Total original size:'} {formatBytes(totalRawSize)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={addMoreInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={(e) => handleFilesAdded(e.target.files)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => addMoreInputRef.current?.click()}
                className="h-8 px-2.5 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>+</span>
                <span>{lang === 'ar' ? 'إضافة صور' : 'Add More'}</span>
              </button>

              <button
                type="button"
                onClick={resetAll}
                className="h-8 px-2 text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                {t.btnCancel || 'Cancel'}
              </button>
            </div>
          </div>

          {/* Images Grid / List */}
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {images.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs"
              >
                {/* Page Number Badge */}
                <span className="h-6 w-6 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>

                {/* Thumbnail */}
                <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-300/60 dark:border-slate-700">
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1 text-start">
                  <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {item.file.name}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {formatBytes(item.file.size)}
                  </p>
                </div>

                {/* Reorder and Delete Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="h-7 w-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center"
                    title={lang === 'ar' ? 'تحريك لأعلى' : 'Move up'}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(idx)}
                    disabled={idx === images.length - 1}
                    className="h-7 w-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center"
                    title={lang === 'ar' ? 'تحريك لأسفل' : 'Move down'}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors flex items-center justify-center ml-1"
                    title={lang === 'ar' ? 'حذف الصفحة' : 'Delete'}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Options Grid */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {lang === 'ar' ? 'إعدادات المستند وتنسيق الصفحات' : 'Document & Page Settings'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Page Format */}
              <div className="space-y-1 text-start">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  {lang === 'ar' ? 'حجم الصفحة:' : 'Page Size:'}
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="a4">{lang === 'ar' ? 'ورق رسمي A4 (موصى به للبوابات)' : 'Standard A4 (Recommended for portals)'}</option>
                  <option value="fit">{lang === 'ar' ? 'حسب مقاس الصورة الأصلي' : 'Fit to Original Image Dimensions'}</option>
                </select>
              </div>

              {/* Orientation */}
              <div className="space-y-1 text-start">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  {lang === 'ar' ? 'اتجاه الصفحة:' : 'Orientation:'}
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="auto">{lang === 'ar' ? 'تلقائي حسب أبعاد كل صورة' : 'Auto (Match each image)'}</option>
                  <option value="portrait">{lang === 'ar' ? 'عمودي (Portrait)' : 'Portrait'}</option>
                  <option value="landscape">{lang === 'ar' ? 'أفقي (Landscape)' : 'Landscape'}</option>
                </select>
              </div>
            </div>

            {/* Checkbox: Optimize for Web & Portals */}
            <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors">
              <input
                type="checkbox"
                checked={optimize}
                onChange={(e) => setOptimize(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span>
                {lang === 'ar'
                  ? 'تحسين وضغط حجم الـ PDF ليكون مناسباً للرفع على بوابات التقديم (أقل من 2MB عادة)'
                  : 'Optimize file size for portal uploads (maintains high readability while keeping file compact)'}
              </span>
            </label>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleConvert}
            className="w-full h-12 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>📑</span>
            <span>
              {lang === 'ar'
                ? `تحويل ${images.length} صور إلى PDF الآن`
                : `Convert ${images.length} Images to PDF Now`}
            </span>
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* STATE 3: PROCESSING                                            */}
      {/* ============================================================== */}
      {isProcessing && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs text-center space-y-4">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl">
            <span className="animate-spin inline-block h-6 w-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-white">
              {progressInfo?.stage || (lang === 'ar' ? 'جاري تجميع وتحويل الصور...' : 'Compiling images to PDF...')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'ar'
                ? 'تتم المعالجة بالكامل محلياً داخل المتصفح دون رفع الملفات لأي سيرفر'
                : 'Processing locally in your browser • 100% Private'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span className="truncate max-w-[240px] text-start">{progressInfo?.stage}</span>
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
      {/* STATE 4: SUCCESS RESULT                                        */}
      {/* ============================================================== */}
      {result && !isProcessing && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 flex items-start gap-2.5">
            <span className="text-xl shrink-0">✓</span>
            <div className="space-y-0.5 text-start">
              <h3 className="text-sm font-bold tracking-tight">
                {lang === 'ar' ? 'تم إنشاء ملف الـ PDF بنجاح ✓' : 'PDF Created Successfully ✓'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? `تم دمج وترتيب ${result.pageCount} صور في مستند PDF واحد مطابق وموثق.`
                  : `Successfully combined ${result.pageCount} images into a single, portal-compliant PDF.`}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1 text-start">
              <span className="text-slate-400 block text-[11px]">
                {lang === 'ar' ? 'عدد الصفحات' : 'Total Pages'}
              </span>
              <span className="text-base font-bold text-slate-800 dark:text-white">
                {result.pageCount} {lang === 'ar' ? 'صفحات' : 'pages'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 space-y-1 text-start">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                {lang === 'ar' ? 'حجم ملف الـ PDF الناتج' : 'Final PDF Size'}
              </span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {result.finalSizeFormatted}
              </span>
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
              <span>{lang === 'ar' ? 'تنزيل ملف الـ PDF' : 'Download PDF Document'} ({result.finalSizeFormatted})</span>
            </a>

            <button
              type="button"
              onClick={resetAll}
              className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              {lang === 'ar' ? 'تحويل دفعة صور أخرى' : 'Convert Another Set of Images'}
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
