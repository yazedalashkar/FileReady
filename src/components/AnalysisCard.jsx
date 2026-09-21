import React from 'react';
import { formatBytes, calculateSeverityFromBytes } from '../utils/fileUtils.js';
import { UI_TRANSLATIONS } from '../data/translations.js';

export default function AnalysisCard({
  file,
  fileType,
  metadata,
  targetBytes,
  targetFormatted,
  isProcessing,
  progressInfo,
  result,
  onProcess,
  onReset,
  onResetResult,
  onRequestJpgConversion,
  lang = 'en',
}) {
  if (!file) return null;

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const originalFormatted = formatBytes(file.size);
  const isAlreadyCompliant = targetBytes && file.size <= targetBytes;
  const severity = calculateSeverityFromBytes(file.size, targetBytes);

  const getSeverityLabel = (lvl) => {
    if (lvl === 'STRONG') return t.severityStrong;
    if (lvl === 'MEDIUM') return t.severityModerate;
    return t.severityGentle;
  };

  const getSeverityDescription = (lvl) => {
    if (lvl === 'STRONG') return t.severityStrongText;
    if (lvl === 'MEDIUM') return t.severityModerateText;
    return t.severityGentleText;
  };

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 sm:space-y-5 transition-colors">
      {/* File Card Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
        <div className="min-w-0 flex-1 flex items-center gap-2.5">
          <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shrink-0">
            {fileType || 'FILE'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#0B1220] dark:text-white truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              {originalFormatted}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={isProcessing}
          className="text-xs font-semibold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors px-2 py-1 cursor-pointer disabled:opacity-50"
          aria-label="Remove selected file"
        >
          ✕ {t.btnCancel}
        </button>
      </div>

      {/* Analysis Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
        <div className="bg-slate-50/90 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {t.originalSize}
          </span>
          <span className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-slate-100 mt-0.5 block">
            {originalFormatted}
          </span>
        </div>
        <div className="bg-slate-50/90 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {t.targetLimit}
          </span>
          <span className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">
            {targetFormatted || '—'}
          </span>
        </div>
        <div className="bg-slate-50/90 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {fileType === 'PDF' ? t.pagesLabel : t.dimensionsLabel}
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 truncate block mt-0.5">
            {fileType === 'PDF'
              ? metadata?.numPages !== undefined
                ? `${metadata.numPages} ${lang === 'ar' ? 'صفحات' : metadata.numPages === 1 ? 'page' : 'pages'}`
                : '...'
              : metadata?.width
              ? `${metadata.width} × ${metadata.height}${metadata?.hasTransparency ? ' (alpha)' : ''}`
              : '...'}
          </span>
        </div>
      </div>

      {/* Severity Indicator */}
      {!isProcessing && !result && !isAlreadyCompliant && targetBytes > 0 && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-medium flex items-center justify-between border ${
            severity.level === 'STRONG'
              ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200/90 dark:border-amber-800/60 text-amber-950 dark:text-amber-200'
              : severity.level === 'MEDIUM'
              ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-200/90 dark:border-blue-800/60 text-blue-950 dark:text-blue-200'
              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base shrink-0">
              {severity.level === 'STRONG' ? '⚡' : '⚙️'}
            </span>
            <div>
              <span>{lang === 'ar' ? 'مستوى الضغط المطلوب: ' : 'Compression required: '}</span>
              <strong className="font-bold">{getSeverityLabel(severity.level)}</strong>
              {severity.reductionPercent > 0 && (
                <span className="text-slate-600 dark:text-slate-400">
                  {' '}(~{severity.reductionPercent}% {t.reductionNeeded})
                </span>
              )}
            </div>
          </div>
          {severity.level === 'STRONG' && (
            <span className="text-[10px] bg-amber-200 dark:bg-amber-800/80 text-amber-900 dark:text-amber-100 px-2.5 py-0.5 rounded-full font-bold uppercase shrink-0">
              {lang === 'ar' ? 'تنبيه' : 'Notice'}
            </span>
          )}
        </div>
      )}

      {/* File Already Meets Target */}
      {!isProcessing && !result && isAlreadyCompliant && (
        <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs flex items-center gap-1.5">
              <span className="text-sm text-emerald-600 dark:text-emerald-400">✓</span> {t.fileComplies}
            </span>
            <span className="text-[10px] bg-emerald-200 dark:bg-emerald-800/80 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded-full font-bold uppercase">
              {lang === 'ar' ? 'مطابق' : 'Compliant'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.noCompressionNeeded}
          </p>
        </div>
      )}

      {/* Compression in Progress */}
      {isProcessing && (
        <div className="p-4 sm:p-5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs text-blue-950 dark:text-blue-200 font-bold">
            <span className="flex items-center gap-2">
              <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full"></span>
              <span>{progressInfo?.stage || t.preparingTitle}</span>
            </span>
            <span>{progressInfo?.percent || 0}%</span>
          </div>
          <div className="w-full bg-blue-200/70 dark:bg-blue-900/40 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressInfo?.percent || 0}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {progressInfo?.attempt > 1
                ? `${lang === 'ar' ? 'محاولة متكيفة' : 'Adaptive pass'} ${progressInfo.attempt} / ${progressInfo.totalAttempts}`
                : t.compressingTitle}
            </span>
            <span className="text-slate-400 dark:text-slate-500">
              {lang === 'ar' ? 'قد تستغرق الملفات الكبيرة وقتاً أطول على الهواتف.' : 'Large files may take a little longer on mobile.'}
            </span>
          </div>
        </div>
      )}

      {/* Result Card */}
      {!isProcessing && result && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 ${
            result.isTargetAchieved
              ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200'
              : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
              <span className="text-base">
                {result.isTargetAchieved ? '✓' : '⚠️'}
              </span>
              <span>
                {result.isTargetAchieved
                  ? t.resultAchievedTitle
                  : t.resultNotAchievedTitle}
              </span>
            </div>
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                result.isTargetAchieved
                  ? 'bg-emerald-200 dark:bg-emerald-800/80 text-emerald-900 dark:text-emerald-100'
                  : 'bg-amber-200 dark:bg-amber-800/80 text-amber-900 dark:text-amber-100'
              }`}
            >
              {result.isTargetAchieved
                ? (lang === 'ar' ? 'جاهز للرفع' : 'Verified')
                : (lang === 'ar' ? 'أفضل نتيجة آمنة' : 'Best Result')}
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            {result.isTargetAchieved
              ? t.resultAchievedSub
              : t.resultNotAchievedSub}
          </p>

          {/* PNG Transparency Badges */}
          {result.transparencyPreserved && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100/90 dark:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs font-bold">
              <span>✨</span> {lang === 'ar' ? 'تم الحفاظ على شفافية PNG بنجاح ✓' : 'PNG transparency preserved ✓'}
            </div>
          )}

          {result.formatConverted && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100/90 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-bold">
              <span>ℹ️</span> {result.conversionNote || (lang === 'ar' ? 'تم التحويل إلى JPG مع خلفية بيضاء' : 'PNG converted to JPG — transparency removed')}
            </div>
          )}

          {/* Comparison Grid */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
            <div className="bg-white/90 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-2xs">
              <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">{t.targetLimit}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {result.targetFormatted || `${result.targetMB} MB`}
              </span>
            </div>
            <div className="bg-white/90 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-2xs">
              <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">{t.finalSize}</span>
              <span
                className={`font-bold mt-0.5 block ${
                  result.isTargetAchieved ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {result.finalSizeFormatted || `${result.finalSizeMB} MB`}
              </span>
            </div>
            <div className="bg-white/90 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-2xs">
              <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
                {lang === 'ar' ? 'نسبة التوفير' : 'Saved'}
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{result.savedPercent}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        {result ? (
          <div className="space-y-2">
            <a
              href={result.downloadUrl}
              download={result.fileName}
              className={`w-full h-12 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 text-white shadow-sm cursor-pointer ${
                result.isTargetAchieved
                  ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-blue-500/20'
                  : 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800'
              }`}
            >
              <span>⬇</span>{' '}
              {result.isTargetAchieved
                ? `${t.btnDownloadReady} (${result.finalSizeFormatted || result.finalSizeMB + ' MB'})`
                : `${lang === 'ar' ? 'تنزيل أفضل نتيجة' : 'Download Best Result'} (${result.finalSizeFormatted || result.finalSizeMB + ' MB'})`}
            </a>

            {/* Optional Fallback Button to JPG */}
            {!result.isTargetAchieved && result.transparencyFallbackAvailable && onRequestJpgConversion && (
              <button
                type="button"
                onClick={onRequestJpgConversion}
                className="w-full h-11 px-3 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🔄</span> {t.btnConvertJpg} ({targetFormatted})
              </button>
            )}

            <button
              type="button"
              onClick={onResetResult}
              className="w-full h-11 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {t.btnCompressAnother}
            </button>
          </div>
        ) : isAlreadyCompliant ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                const url = URL.createObjectURL(file);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 5000);
              }}
              className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>⬇</span> {lang === 'ar' ? 'تنزيل الملف الأصلي' : 'Download Original'}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onProcess}
            disabled={isProcessing || !targetBytes || targetBytes <= 0}
            className={`w-full h-12 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isProcessing
                ? 'bg-blue-400 text-white cursor-wait'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-500/20'
            }`}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>{t.preparingTitle}</span>
              </>
            ) : (
              t.btnPrepare
            )}
          </button>
        )}
      </div>
    </div>
  );
}
