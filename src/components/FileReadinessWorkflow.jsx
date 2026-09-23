import React, { useState, useMemo } from 'react';
import {
  COMMON_SIZE_PRESETS,
  DEFAULT_REQUIREMENTS,
  evaluateRequirements,
} from '../utils/fileInspector.js';
import { parseTargetToBytes, formatBytes } from '../utils/fileUtils.js';
import { UI_TRANSLATIONS } from '../data/translations.js';

export const COMMON_PAGE_PRESETS = [
  { id: 'no_limit', labelKey: 'reqNoPageLimit', value: null },
  { id: '1_page', labelKey: 'reqPagesPreset1', value: 1 },
  { id: '2_pages', labelKey: 'reqPagesPreset2', value: 2 },
  { id: '5_pages', labelKey: 'reqPagesPreset5', value: 5 },
  { id: '10_pages', labelKey: 'reqPagesPreset10', value: 10 },
];

export default function FileReadinessWorkflow({
  file,
  fileType,
  inspection,
  metadata,
  targetBytes,
  isProcessing,
  progressInfo,
  result,
  onSyncTarget,
  onMakeReady,
  onReset,
  onRequestJpgConversion,
  lang = 'en',
}) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  // Requirements state
  const [requirements, setRequirements] = useState(() => ({
    ...DEFAULT_REQUIREMENTS,
    maxSizeBytes: targetBytes || DEFAULT_REQUIREMENTS.maxSizeBytes,
  }));

  const [activePresetId, setActivePresetId] = useState(() => {
    const found = COMMON_SIZE_PRESETS.find((p) => p.bytes === targetBytes);
    return found ? found.id : 'custom';
  });

  const [activePagePreset, setActivePagePreset] = useState('no_limit');
  const [isCustomExpanded, setIsCustomExpanded] = useState(false);
  const [customMbValue, setCustomMbValue] = useState('2');
  const [customUnit, setCustomUnit] = useState('MB');

  // Effective inspection incorporates compressed result size if available
  const effectiveInspection = useMemo(() => {
    if (!inspection) return null;
    if (!result?.finalSizeBytes) return inspection;
    return {
      ...inspection,
      file: {
        ...inspection.file,
        size: result.finalSizeBytes,
        sizeFormatted: formatBytes(result.finalSizeBytes),
      },
    };
  }, [inspection, result]);

  // Evaluate requirements dynamically
  const evaluation = useMemo(() => {
    return evaluateRequirements(effectiveInspection, requirements);
  }, [effectiveInspection, requirements]);

  // Handle Preset Click
  const handlePresetClick = (preset) => {
    setActivePresetId(preset.id);
    const updated = {
      ...requirements,
      maxSizeBytes: preset.bytes,
    };
    setRequirements(updated);
    onSyncTarget?.(preset.value, preset.unit);
  };

  const handleCustomSizeToggle = () => {
    setActivePresetId('custom');
    setIsCustomExpanded(true);
  };

  const handleCustomNumericChange = (val, unit) => {
    setCustomMbValue(val);
    setCustomUnit(unit);
    setActivePresetId('custom');
    const bytes = parseTargetToBytes(val, unit);
    setRequirements((prev) => ({
      ...prev,
      maxSizeBytes: bytes,
    }));
    if (bytes) {
      onSyncTarget?.(val, unit);
    }
  };

  const handleFormatChange = (fmt) => {
    setRequirements((prev) => ({
      ...prev,
      format: fmt,
    }));
  };

  const handlePagePresetClick = (preset) => {
    setActivePagePreset(preset.id);
    setRequirements((prev) => ({
      ...prev,
      maxPages: preset.value,
    }));
  };

  const handleCustomMaxPagesChange = (pagesStr) => {
    setActivePagePreset('custom');
    const p = parseInt(pagesStr, 10);
    setRequirements((prev) => ({
      ...prev,
      maxPages: isNaN(p) || p <= 0 ? null : p,
    }));
  };

  const handleOrientationChange = (orient) => {
    setRequirements((prev) => ({
      ...prev,
      orientation: orient,
    }));
  };

  const handlePageSizeChange = (sz) => {
    setRequirements((prev) => ({
      ...prev,
      pageSize: sz,
    }));
  };

  const isPdf = fileType === 'PDF';
  const isImage = fileType === 'JPG' || fileType === 'PNG';
  const originalFormatted = formatBytes(file?.size || 0);

  // Compute overall status badge for File Information
  let fileStatusLabel = t.statusReady;
  let fileStatusColor =
    'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80';
  if (inspection?.pdf?.isEncrypted) {
    fileStatusLabel = t.statusNotReady;
    fileStatusColor =
      'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80';
  } else if (evaluation.hasFailures) {
    fileStatusLabel = t.statusNeedsAttention;
    fileStatusColor =
      'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80';
  }

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 transition-colors animate-in fade-in duration-200">
      {/* ============================================================== */}
      {/* SECTION A: FILE INFORMATION                                   */}
      {/* ============================================================== */}
      <div className="space-y-3.5 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        {/* Top File Title Bar */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 flex items-center gap-2.5">
            <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shrink-0">
              {fileType || 'FILE'}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-white truncate"
                title={file?.name}
              >
                {file?.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                <span>{originalFormatted}</span>
                <span>•</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${fileStatusColor}`}
                >
                  {fileStatusLabel}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            disabled={isProcessing}
            className="text-xs font-semibold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors px-2 py-1 cursor-pointer disabled:opacity-50 shrink-0"
            aria-label={t.ariaResetFile}
          >
            ✕ {t.btnCancel}
          </button>
        </div>

        {/* Quick Attributes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          {isPdf ? (
            <>
              <div className="bg-slate-50/80 dark:bg-slate-950/80 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t.checkPageCount}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#0B1220] dark:text-slate-200 mt-0.5 block truncate">
                  {inspection?.pdf?.pageCount
                    ? `${inspection.pdf.pageCount} ${
                        inspection.pdf.pageCount === 1 ? t.pageLabel : t.pagesLabel
                      }`
                    : '1 page'}
                </span>
              </div>

              <div className="bg-slate-50/80 dark:bg-slate-950/80 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t.reqPageSize}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#0B1220] dark:text-slate-200 mt-0.5 block truncate">
                  {inspection?.pdf?.dominantPageSize || t.unableToDetermine}
                </span>
              </div>

              <div className="bg-slate-50/80 dark:bg-slate-950/80 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t.reqOrientation}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#0B1220] dark:text-slate-200 mt-0.5 block truncate capitalize">
                  {inspection?.pdf?.dominantOrientation === 'landscape'
                    ? t.reqOrientationLandscape
                    : inspection?.pdf?.dominantOrientation === 'portrait'
                    ? t.reqOrientationPortrait
                    : t.unableToDetermine}
                </span>
              </div>

              <div className="bg-slate-50/80 dark:bg-slate-950/80 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t.checkPassword}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#0B1220] dark:text-slate-200 mt-0.5 block truncate">
                  {inspection?.pdf?.isEncrypted ? t.checkIsEncrypted : t.checkNotEncrypted}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="bg-slate-50/80 dark:bg-slate-950/80 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t.checkDimensions}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#0B1220] dark:text-slate-200 mt-0.5 block truncate">
                  {inspection?.image?.width && inspection?.image?.height
                    ? `${inspection.image.width} × ${inspection.image.height} px`
                    : '—'}
                </span>
              </div>

              <div className="bg-slate-50/80 dark:bg-slate-950/80 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Aspect Ratio
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#0B1220] dark:text-slate-200 mt-0.5 block truncate">
                  {inspection?.image?.aspectRatio || '—'}
                </span>
              </div>

              <div className="bg-slate-50/80 dark:bg-slate-950/80 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Resolution
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#0B1220] dark:text-slate-200 mt-0.5 block truncate">
                  {inspection?.image?.megapixels ? `${inspection.image.megapixels} MP` : '—'}
                </span>
              </div>

              <div className="bg-slate-50/80 dark:bg-slate-950/80 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t.checkTransparency}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#0B1220] dark:text-slate-200 mt-0.5 block truncate">
                  {inspection?.image?.hasTransparency
                    ? t.checkHasTransparency
                    : t.checkNoTransparency}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION B: DESTINATION REQUIREMENTS                           */}
      {/* ============================================================== */}
      <div className="space-y-3.5 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="text-xs sm:text-sm font-bold text-[#0B1220] dark:text-white uppercase tracking-wider">
              {t.destRequirementsTitle}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.requirementsSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCustomExpanded((prev) => !prev)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{isCustomExpanded ? '▴' : '▾'}</span>
            <span>{isCustomExpanded ? t.btnHideCustomRules : t.btnCustomizeRules}</span>
          </button>
        </div>

        {/* Size Presets Bar */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
            {t.reqMaxSize}
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {COMMON_SIZE_PRESETS.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  disabled={isProcessing}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer border ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-blue-500/20'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                  aria-label={t.ariaPresetBtn?.replace('{size}', preset.label) || preset.label}
                >
                  {preset.label}
                </button>
              );
            })}

            {/* Custom Preset Button */}
            <button
              type="button"
              onClick={handleCustomSizeToggle}
              disabled={isProcessing}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer border ${
                activePresetId === 'custom'
                  ? 'bg-blue-600 border-blue-600 text-white shadow-blue-500/20'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              {t.presetCustom}
            </button>
          </div>
        </div>

        {/* Custom Rules Drawer */}
        {isCustomExpanded && (
          <div className="p-4 bg-slate-50/90 dark:bg-slate-950/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3.5 animate-in fade-in duration-150 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Custom Max Size Input */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {t.reqMaxSize}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={customMbValue}
                    onChange={(e) => handleCustomNumericChange(e.target.value, customUnit)}
                    className="flex-1 h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={customUnit}
                    onChange={(e) => handleCustomNumericChange(customMbValue, e.target.value)}
                    className="w-20 h-9 px-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="KB">KB</option>
                    <option value="MB">MB</option>
                  </select>
                </div>
              </div>

              {/* Required Format */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {t.reqFormat}
                </label>
                <select
                  value={requirements.format}
                  onChange={(e) => handleFormatChange(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ANY">{t.reqAnyFormat}</option>
                  <option value="PDF">PDF</option>
                  <option value="JPG">JPG / JPEG</option>
                  <option value="PNG">PNG</option>
                </select>
              </div>

              {/* Max Pages (PDF) */}
              {isPdf && (
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    {t.reqMaxPages}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_PAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handlePagePresetClick(preset)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          activePagePreset === preset.id
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {t[preset.labelKey] || preset.id}
                      </button>
                    ))}
                    <input
                      type="number"
                      min="1"
                      placeholder="Custom"
                      value={requirements.maxPages || ''}
                      onChange={(e) => handleCustomMaxPagesChange(e.target.value)}
                      className="w-24 h-7 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Page Size & Orientation */}
              {isPdf && (
                <>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      {t.reqPageSize}
                    </label>
                    <select
                      value={requirements.pageSize}
                      onChange={(e) => handlePageSizeChange(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ANY">{t.reqAnyPageSize}</option>
                      <option value="A4">{t.reqPageSizeA4}</option>
                      <option value="US Letter">{t.reqPageSizeLetter}</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      {t.reqOrientation}
                    </label>
                    <select
                      value={requirements.orientation}
                      onChange={(e) => handleOrientationChange(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ANY">{t.reqAnyOrientation}</option>
                      <option value="portrait">{t.reqOrientationPortrait}</option>
                      <option value="landscape">{t.reqOrientationLandscape}</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* SECTION C: COMPLIANCE STATUS & TABLE                          */}
      {/* ============================================================== */}
      <div className="space-y-2.5 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h3 className="text-xs sm:text-sm font-bold text-[#0B1220] dark:text-white uppercase tracking-wider">
          {t.complianceTitle}
        </h3>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60">
          <table
            className="w-full text-xs text-start border-collapse"
            aria-label={t.ariaRequirementsTable}
          >
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                <th className="py-2.5 px-3 text-start">{t.destRequirementsTitle}</th>
                <th className="py-2.5 px-3 text-end">{t.reqStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {evaluation.rules.map((rule) => {
                const reqLabel = rule.isTranslationKey ? t[rule.conditionText] : rule.conditionText;
                const actLabel = rule.isTranslationKey ? t[rule.actualText] : rule.actualText;
                const ruleName = t[rule.labelKey] || rule.labelKey;

                return (
                  <tr
                    key={rule.id}
                    className="hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors"
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="font-bold text-[#0B1220] dark:text-white">
                          {ruleName} {reqLabel}
                        </span>
                        {rule.status === 'FAILED' && rule.autoFixable && (
                          <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                            • {t.reqFixableViaCompression}
                          </span>
                        )}
                        {rule.status === 'FAILED' && !rule.autoFixable && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                            • {rule.id === 'max_pages' || rule.id === 'min_pages' ? t.reqRequiresPageEditing : t.reqRequiresManualEditing}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-end shrink-0 whitespace-nowrap">
                      {rule.status === 'PASSED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                          ✓ {t.reqRulePassed}
                        </span>
                      )}
                      {rule.status === 'FAILED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                          ✗ {t.reqRuleFailed} — {actLabel}
                        </span>
                      )}
                      {rule.status === 'UNDETERMINED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          — {t.reqRuleUndetermined}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION D: ONE PRIMARY ACTION & EXECUTION / RESULTS           */}
      {/* ============================================================== */}
      <div className="space-y-3.5 pt-1">
        {/* State 1: In Progress */}
        {isProcessing && (
          <div className="p-5 rounded-2xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-center space-y-3 animate-in fade-in duration-150">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg mx-auto shadow-2xs">
              <span className="animate-spin inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-blue-950 dark:text-blue-200">
                {progressInfo?.stage || t.preparingTitle}
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                {t.verifyingTitle}
              </p>
            </div>
          </div>
        )}

        {/* State 2: Result Available */}
        {!isProcessing && result && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {evaluation.isCompliant ? (
              <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 flex items-start gap-2.5">
                <span className="text-lg shrink-0">✓</span>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold">{t.statusReadyAllPassed}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t.statusReadyDesc}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200 space-y-1">
                <div className="flex items-start gap-2.5">
                  <span className="text-lg shrink-0">⚠</span>
                  <div>
                    <h4 className="text-sm font-bold">{t.statusNeedsAttention}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {t.reqUnfixableWarning?.replace(
                        '{items}',
                        evaluation.unfixableRules.map((r) => t[r.labelKey] || r.labelKey).join(', ')
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Execution Metrics Summary */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">{t.originalSize}</span>
                <span className="font-bold text-[#0B1220] dark:text-white mt-0.5 block">{originalFormatted}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">{t.finalSize}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {formatBytes(result.finalSizeBytes)}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">{t.targetLimit}</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">
                  {formatBytes(requirements.maxSizeBytes)}
                </span>
              </div>
            </div>

            {/* Download Button */}
            {result.downloadUrl && (
              <a
                href={result.downloadUrl}
                download={result.fileName}
                className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                aria-label={t.ariaReadyFileDownload}
              >
                <span>⬇</span>
                <span>{t.downloadReadyFile} ({formatBytes(result.finalSizeBytes)})</span>
              </a>
            )}
          </div>
        )}

        {/* State 3: Ready to Fix / Needs Attention */}
        {!isProcessing && !result && (
          <div className="space-y-3">
            {evaluation.isCompliant ? (
              <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 flex items-start gap-2.5">
                <span className="text-lg shrink-0">✓</span>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold">{t.statusReadyAllPassed}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t.statusReadyDesc}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200 space-y-1.5">
                  <div className="flex items-start gap-2.5">
                    <span className="text-lg shrink-0">⚠</span>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold">{t.reqFailedTitle}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {t.reqFailedDesc}
                      </p>
                    </div>
                  </div>

                  {evaluation.unfixableRules && evaluation.unfixableRules.length > 0 && (
                    <div className="pt-1 text-[11px] text-amber-800 dark:text-amber-300 ps-7">
                      {t.reqUnfixableWarning?.replace(
                        '{items}',
                        evaluation.unfixableRules
                          .map((r) => t[r.labelKey] || r.labelKey)
                          .join(', ')
                      )}
                    </div>
                  )}
                </div>

                {/* THE ONE PRIMARY ACTION */}
                <button
                  type="button"
                  onClick={() => onMakeReady?.(evaluation)}
                  disabled={isProcessing}
                  className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  aria-label={t.ariaMakeReady}
                >
                  <span>✨</span>
                  <span>{t.btnMakeFileReady}</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
