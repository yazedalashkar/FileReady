import React from 'react';
import { UI_TRANSLATIONS } from '../data/translations.js';

// Stable preset list with numeric values and internal unit codes ('KB' | 'MB')
const PRESETS = [
  { value: 150, unit: 'KB' },
  { value: 300, unit: 'KB' },
  { value: 500, unit: 'KB' },
  { value: 800, unit: 'KB' },
  { value: 1, unit: 'MB' },
  { value: 2, unit: 'MB' },
];

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
    const raw = e.target.value;
    if (raw === '') {
      setTargetValue('');
      return;
    }
    const val = parseFloat(raw);
    if (!isNaN(val) && val > 0) {
      setTargetValue(val);
    }
  };

  const handleUnitToggle = (newUnit) => {
    if (newUnit === targetUnit || disabled) return;
    setTargetUnit(newUnit);
    // Keep target value logically reasonable when switching units
    if (newUnit === 'KB' && targetValue <= 5 && targetValue > 0) {
      setTargetValue(Math.round(targetValue * 1024));
    } else if (newUnit === 'MB' && targetValue >= 100) {
      setTargetValue(parseFloat((targetValue / 1024).toFixed(2)));
    }
  };

  const handlePresetClick = (preset) => {
    if (disabled) return;
    setTargetValue(preset.value);
    setTargetUnit(preset.unit);
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
            min={targetUnit === 'KB' ? '10' : '0.05'}
            step="any"
            value={targetValue}
            onChange={handleValueChange}
            disabled={disabled}
            placeholder={targetUnit === 'KB' ? 'e.g. 500' : 'e.g. 2'}
            className="w-full text-lg sm:text-xl font-bold text-[#0B1220] dark:text-white bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-2xl px-4 py-2.5 sm:py-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Stable Unit Toggle: internal values 'MB' / 'KB', visual labels localized */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => handleUnitToggle('MB')}
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
            onClick={() => handleUnitToggle('KB')}
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

      {/* Suggested Target Size Presets */}
      <div className="space-y-1.5 pt-0.5">
        <span className="block text-[11px] font-medium text-slate-400 dark:text-slate-500">
          {t.commonLimits}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {PRESETS.map((preset) => {
            const isActive = targetValue === preset.value && targetUnit === preset.unit;
            const unitLabel = preset.unit === 'KB' ? t.unitKb : t.unitMb;
            return (
              <button
                key={`${preset.value}-${preset.unit}`}
                type="button"
                onClick={() => handlePresetClick(preset)}
                disabled={disabled}
                className={`text-xs px-2.5 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer min-h-[36px] flex items-center justify-center ${
                  isActive
                    ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {preset.value} {unitLabel}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
