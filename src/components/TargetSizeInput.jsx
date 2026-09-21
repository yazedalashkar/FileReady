import React from 'react';
import { UI_TRANSLATIONS } from '../data/translations.js';

export default function TargetSizeInput({
  targetValue,
  setTargetValue,
  targetUnit,
  setTargetUnit,
  disabled,
  lang = 'en',
}) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  const handleValueChange = (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val) || val <= 0) {
      setTargetValue('');
    } else {
      setTargetValue(val);
    }
  };

  const setPreset = (val, unit) => {
    setTargetValue(val);
    setTargetUnit(unit);
  };

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor="target-size-input"
          className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
        >
          {t.targetLabel}
        </label>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          {t.maxLimit}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            id="target-size-input"
            type="number"
            min="0.1"
            step="any"
            value={targetValue}
            onChange={handleValueChange}
            disabled={disabled}
            placeholder="e.g. 2"
            className="w-full text-lg sm:text-xl font-bold text-[#0B1220] dark:text-white bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-2xl px-4 py-2.5 sm:py-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setTargetUnit('MB')}
            disabled={disabled}
            className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              targetUnit === 'MB'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.unitMb}
          </button>
          <button
            type="button"
            onClick={() => setTargetUnit('KB')}
            disabled={disabled}
            className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              targetUnit === 'KB'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.unitKb}
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 me-1">
          {t.commonLimits}
        </span>
        {[
          { label: '500 KB', val: 500, unit: 'KB' },
          { label: '1 MB', val: 1, unit: 'MB' },
          { label: '2 MB', val: 2, unit: 'MB' },
          { label: '5 MB', val: 5, unit: 'MB' },
        ].map((preset) => {
          const isActive = targetValue === preset.val && targetUnit === preset.unit;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => setPreset(preset.val, preset.unit)}
              disabled={disabled}
              className={`text-xs px-2.5 py-1 rounded-xl font-semibold border transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 shadow-2xs'
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
