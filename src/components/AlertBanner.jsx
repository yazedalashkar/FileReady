import React from 'react';

export default function AlertBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="p-3.5 sm:p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs sm:text-sm font-medium flex items-start justify-between gap-3 shadow-2xs animate-in fade-in duration-150 transition-colors"
    >
      <div className="flex items-start gap-2.5">
        <span className="text-base shrink-0 leading-none mt-0.5">⚠️</span>
        <div className="leading-relaxed">{message}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-rose-400 hover:text-rose-700 dark:hover:text-rose-100 font-bold px-1 transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss message"
        >
          ✕
        </button>
      )}
    </div>
  );
}
