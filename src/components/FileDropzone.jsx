import React, { useRef, useState } from 'react';
import { UI_TRANSLATIONS } from '../data/translations.js';

export default function FileDropzone({ onFileSelected, disabled, lang = 'en' }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
        isDragOver
          ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 scale-[0.995]'
          : 'border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-900/70 hover:border-blue-500/80 dark:hover:border-blue-500/70 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 shadow-xs'
      } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center space-y-3.5">
        <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
          📄
        </div>

        <div className="space-y-1">
          <p className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-white">
            <span className="text-blue-600 dark:text-blue-400 hover:underline">
              {t.chooseFile}
            </span>{' '}
            <span className="text-slate-600 dark:text-slate-400 font-normal">{t.orDragDrop}</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t.supportedFormats}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
          <span className="text-emerald-500 dark:text-emerald-400">🔒</span>
          {t.clientSideNotice}
        </div>
      </div>
    </div>
  );
}
