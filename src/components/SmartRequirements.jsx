import React, { useState, useMemo } from 'react';
import {
  COMMON_SIZE_PRESETS,
  DEFAULT_REQUIREMENTS,
  evaluateRequirements,
} from '../utils/fileInspector.js';
import { parseTargetToBytes, formatBytes } from '../utils/fileUtils.js';
import { UI_TRANSLATIONS } from '../data/translations.js';

export default function SmartRequirements({
  inspection,
  targetBytes,
  onSyncTarget,
  onMakeReady,
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

  const [isCustomExpanded, setIsCustomExpanded] = useState(false);

  // Evaluate requirements dynamically
  const evaluation = useMemo(() => {
    return evaluateRequirements(inspection, requirements);
  }, [inspection, requirements]);

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

  const handleCustomToggle = () => {
    setIsCustomExpanded((prev) => !prev);
  };

  const handleFormatChange = (fmt) => {
    setRequirements((prev) => ({
      ...prev,
      format: fmt,
    }));
  };

  const handleMaxPagesChange = (pagesStr) => {
    const p = parseInt(pagesStr, 10);
    setRequirements((prev) => ({
      ...prev,
      maxPages: isNaN(p) || p <= 0 ? null : p,
    }));
  };

  const handleMinPagesChange = (pagesStr) => {
    const p = parseInt(pagesStr, 10);
    setRequirements((prev) => ({
      ...prev,
      minPages: isNaN(p) || p <= 0 ? null : p,
    }));
  };

  const handleMinSizeChange = (valStr) => {
    const val = parseFloat(valStr);
    const bytes = isNaN(val) || val <= 0 ? null : Math.round(val * 1000);
    setRequirements((prev) => ({
      ...prev,
      minSizeBytes: bytes,
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

  const handleMaxWidthChange = (wStr) => {
    const w = parseInt(wStr, 10);
    setRequirements((prev) => ({
      ...prev,
      maxWidth: isNaN(w) || w <= 0 ? null : w,
    }));
  };

  const handleMaxHeightChange = (hStr) => {
    const h = parseInt(hStr, 10);
    setRequirements((prev) => ({
      ...prev,
      maxHeight: isNaN(h) || h <= 0 ? null : h,
    }));
  };

  const isPdf = inspection?.file?.format === 'PDF';
  const isImage = inspection?.file?.format === 'JPG' || inspection?.file?.format === 'PNG';

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 sm:space-y-5 transition-colors animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
              {t.requirementsBadge}
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-white tracking-tight">
            {t.requirementsTitle}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            {t.requirementsSubtitle}
          </p>
        </div>

        {/* Custom Rules Toggle */}
        <button
          type="button"
          onClick={handleCustomToggle}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-center cursor-pointer"
        >
          <span>{isCustomExpanded ? '▴' : '▾'}</span>
          <span>{isCustomExpanded ? t.btnHideCustomRules : t.btnCustomizeRules}</span>
        </button>
      </div>

      {/* Preset Buttons Bar */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
          {t.presetSizeLabel}
        </label>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {COMMON_SIZE_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetClick(preset)}
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
        </div>
      </div>

      {/* Customizable Rules Drawer */}
      {isCustomExpanded && (
        <div className="p-4 bg-slate-50/80 dark:bg-slate-950/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3.5 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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

            {/* Min Size (KB) */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {t.reqMinSize} (KB)
              </label>
              <input
                type="number"
                min="10"
                placeholder="e.g. 50"
                value={requirements.minSizeBytes ? Math.round(requirements.minSizeBytes / 1000) : ''}
                onChange={(e) => handleMinSizeChange(e.target.value)}
                className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Max Pages (PDF) */}
            {isPdf && (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.reqMaxPages}
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder={t.reqMaxPages}
                    value={requirements.maxPages || ''}
                    onChange={(e) => handleMaxPagesChange(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.reqMinPages}
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder={t.reqMinPages}
                    value={requirements.minPages || ''}
                    onChange={(e) => handleMinPagesChange(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>

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
              </>
            )}

            {/* Image Dimensions */}
            {isImage && (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.reqMaxWidth}
                  </label>
                  <input
                    type="number"
                    min="100"
                    placeholder="e.g. 1920"
                    value={requirements.maxWidth || ''}
                    onChange={(e) => handleMaxWidthChange(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {t.reqMaxHeight}
                  </label>
                  <input
                    type="number"
                    min="100"
                    placeholder="e.g. 1080"
                    value={requirements.maxHeight || ''}
                    onChange={(e) => handleMaxHeightChange(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {/* Orientation */}
            <div className="space-y-1 sm:col-span-2">
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
          </div>
        </div>
      )}

      {/* Comparison Rules Table */}
      <div className="space-y-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60">
          <table
            className="w-full text-xs text-start border-collapse"
            aria-label={t.ariaRequirementsTable}
          >
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                <th className="py-2.5 px-3 text-start">{t.requirementsTitle}</th>
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
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            • {t.reqCannotFixAutomatically}
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

      {/* Compliance Box & 'Make File Ready' Action */}
      <div className="pt-1">
        {evaluation.isCompliant ? (
          <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 flex items-start gap-2.5">
            <span className="text-base shrink-0">✓</span>
            <div className="space-y-0.5">
              <h3 className="text-xs sm:text-sm font-bold">{t.reqAllPassedTitle}</h3>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400">
                {t.reqAllPassedDesc}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200 space-y-1.5">
              <div className="flex items-start gap-2.5">
                <span className="text-base shrink-0">⚠</span>
                <div className="space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-bold">{t.reqFailedTitle}</h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400">
                    {t.reqFailedDesc}
                  </p>
                </div>
              </div>

              {/* Notice for unfixable rules */}
              {evaluation.unfixableRules && evaluation.unfixableRules.length > 0 && (
                <div className="pt-1 text-[11px] text-amber-800 dark:text-amber-300 ps-6">
                  {t.reqUnfixableWarning?.replace(
                    '{items}',
                    evaluation.unfixableRules.map((r) => t[r.labelKey] || r.labelKey).join(', ')
                  )}
                </div>
              )}
            </div>

            {/* Make File Ready CTA Button */}
            <button
              type="button"
              onClick={() => onMakeReady?.(evaluation)}
              className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              aria-label={t.ariaMakeReady}
            >
              <span>✨</span>
              <span>{t.btnMakeFileReady}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
