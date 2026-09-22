import React, { useState } from 'react';
import { formatBytes } from '../utils/fileUtils.js';
import { UI_TRANSLATIONS } from '../data/translations.js';

export default function FileInspector({
  inspection,
  targetBytes,
  targetFormatted,
  result,
  lang = 'en',
}) {
  if (!inspection) return null;

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const [showDetails, setShowDetails] = useState(false);

  // Helper to interpolate string templates like "{count} pages"
  const interpolate = (template, params = {}) => {
    if (!template) return '';
    return Object.entries(params).reduce((str, [key, val]) => {
      return str.replace(new RegExp(`\\{${key}\\}`, 'g'), val);
    }, template);
  };

  // Re-evaluate file size check dynamically based on targetBytes and any compression result
  const currentFileSize = result?.finalSizeBytes || inspection.file.size;
  const isSizeCompliant = !targetBytes || currentFileSize <= targetBytes;

  // Determine dynamic overall readiness
  let effectiveStatus = inspection.overallStatus;
  if (!inspection.pdf?.isOpenable && inspection.file.format === 'PDF') {
    effectiveStatus = 'NOT_READY';
  } else if (inspection.pdf?.isEncrypted) {
    effectiveStatus = 'NOT_READY';
  } else if (!isSizeCompliant) {
    effectiveStatus = 'NEEDS_ATTENTION';
  } else if (inspection.pdf?.hasMixedPageSizes) {
    effectiveStatus = 'NEEDS_ATTENTION';
  } else {
    effectiveStatus = 'READY';
  }

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'READY':
        return {
          icon: '✓',
          label: t.statusReady,
          classes:
            'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
        };
      case 'NEEDS_ATTENTION':
        return {
          icon: '⚡',
          label: t.statusNeedsAttention,
          classes:
            'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
        };
      case 'NOT_READY':
      default:
        return {
          icon: '✕',
          label: t.statusNotReady,
          classes:
            'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80',
        };
    }
  };

  const statusInfo = getStatusBadge(effectiveStatus);

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 transition-colors animate-in fade-in duration-200">
      {/* Inspector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
              {t.inspectorBadge}
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-white tracking-tight">
            {t.inspectorTitle}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            {t.inspectorSubtitle}
          </p>
        </div>

        {/* Readiness Status Pill */}
        <div className="self-start sm:self-center shrink-0">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-2xs ${statusInfo.classes}`}
            role="status"
            aria-label={`${t.inspectorStatusLabel}: ${statusInfo.label}`}
          >
            <span>{statusInfo.icon}</span>
            <span>{statusInfo.label}</span>
          </div>
        </div>
      </div>

      {/* Checks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {inspection.checks.map((check) => {
          // Dynamic overrides for size check
          let checkStatus = check.status;
          let valueText = '';

          if (check.id === 'file_size') {
            if (targetBytes && targetBytes > 0) {
              checkStatus = isSizeCompliant ? 'PASS' : 'WARN';
              const template = isSizeCompliant ? t.checkFileSizeOk : t.checkFileSizeExceeds;
              valueText = interpolate(template, {
                size: formatBytes(currentFileSize),
                target: targetFormatted || formatBytes(targetBytes),
              });
            } else {
              checkStatus = 'INFO';
              valueText = interpolate(t.checkFileSizeNoTarget, {
                size: formatBytes(currentFileSize),
              });
            }
          } else {
            const rawTemplate = t[check.valueKey] || check.valueKey;
            valueText = interpolate(rawTemplate, check.params);
          }

          // Check icons & colors
          let icon = '✓';
          let iconClass =
            'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300';

          if (checkStatus === 'WARN') {
            icon = '⚠';
            iconClass =
              'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300';
          } else if (checkStatus === 'FAIL') {
            icon = '✕';
            iconClass =
              'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300';
          } else if (checkStatus === 'INFO') {
            icon = 'ℹ';
            iconClass =
              'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
          }

          return (
            <div
              key={check.id}
              className="flex items-center gap-2.5 p-2.5 bg-slate-50/80 dark:bg-slate-950/80 rounded-2xl border border-slate-100 dark:border-slate-800/80 transition-colors"
            >
              <span
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${iconClass}`}
                aria-hidden="true"
              >
                {icon}
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                  {t[check.labelKey] || check.labelKey}
                </span>
                <span className="text-xs font-bold text-[#0B1220] dark:text-white truncate block">
                  {valueText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapsible Technical Details */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer focus:outline-hidden"
          aria-expanded={showDetails}
          aria-label={t.ariaToggleDetails}
        >
          <span>{showDetails ? '▴' : '▾'}</span>
          <span>{showDetails ? t.inspectorDetailsHide : t.inspectorDetailsToggle}</span>
        </button>

        {showDetails && (
          <div className="mt-3 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-[11px] space-y-2 animate-in fade-in duration-150">
            {inspection.file.format === 'PDF' && inspection.pdf ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-400 block">{t.checkFormat}:</span>
                  <span className="font-bold text-[#0B1220] dark:text-white">
                    {inspection.pdf.pdfVersion ? `PDF v${inspection.pdf.pdfVersion}` : 'PDF'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.checkPageSizes}:</span>
                  <span className="font-bold text-[#0B1220] dark:text-white">
                    {inspection.pdf.dominantPageSize}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.checkPageOrientation}:</span>
                  <span className="font-bold text-[#0B1220] dark:text-white capitalize">
                    {inspection.pdf.hasMixedOrientation
                      ? t.checkOrientationMixed
                      : inspection.pdf.dominantOrientation === 'landscape'
                      ? t.checkOrientationLandscape
                      : t.checkOrientationPortrait}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.checkRotation}:</span>
                  <span className="font-bold text-[#0B1220] dark:text-white">
                    {inspection.pdf.hasRotation ? t.checkRotationDetected : t.checkRotationNone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.checkForms}:</span>
                  <span className="font-bold text-[#0B1220] dark:text-white">
                    {inspection.pdf.hasForms ? t.checkFormsDetected : t.checkFormsNone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.checkAnnotations}:</span>
                  <span className="font-bold text-[#0B1220] dark:text-white">
                    {inspection.pdf.hasAnnotations
                      ? t.checkAnnotationsDetected
                      : t.checkAnnotationsNone}
                  </span>
                </div>
              </div>
            ) : inspection.image ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-400 block">{t.checkFormat}:</span>
                  <span className="font-bold text-[#0B1220] dark:text-white">
                    {inspection.file.format}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.checkDimensions}:</span>
                  <span className="font-bold text-[#0B1220] dark:text-white">
                    {inspection.image.width} × {inspection.image.height} px
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Aspect Ratio:</span>
                  <span className="font-bold text-[#0B1220] dark:text-white">
                    {inspection.image.aspectRatio}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Resolution:</span>
                  <span className="font-bold text-[#0B1220] dark:text-white">
                    {inspection.image.megapixels} MP
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.checkTransparency}:</span>
                  <span className="font-bold text-[#0B1220] dark:text-white">
                    {inspection.image.hasTransparency
                      ? t.checkHasTransparency
                      : t.checkNoTransparency}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Readiness Guidance Advice */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {effectiveStatus === 'NEEDS_ATTENTION' && (
          <p className="text-xs text-amber-700 dark:text-amber-300 font-medium flex items-start gap-1.5">
            <span className="shrink-0 text-sm">⚡</span>
            <span>{t.inspectorFixSuggestion}</span>
          </p>
        )}
        {effectiveStatus === 'READY' && (
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium flex items-start gap-1.5">
            <span className="shrink-0 text-sm">✓</span>
            <span>{t.inspectorReadyMessage}</span>
          </p>
        )}
        {effectiveStatus === 'NOT_READY' && (
          <p className="text-xs text-rose-700 dark:text-rose-300 font-medium flex items-start gap-1.5">
            <span className="shrink-0 text-sm">✕</span>
            <span>{t.inspectorEncryptedMessage}</span>
          </p>
        )}
      </div>
    </div>
  );
}
