import React from 'react';
import Link from './Link.jsx';
import { UI_TRANSLATIONS } from '../data/translations.js';

export default function ToolsHub({ lang = 'en' }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  const pdfTools = [
    {
      path: '/',
      title: t.toolTitleCompressPdf,
      badge: t.toolBadgeCompressPdf,
      description: t.toolDescCompressPdf,
      icon: '⚡',
    },
    {
      path: '/merge-pdf',
      title: t.toolTitleMergePdf,
      badge: t.toolBadgeMergePdf,
      description: t.toolDescMergePdf,
      icon: '📑',
    },
  ];

  const imageTools = [
    {
      path: '/',
      title: t.toolTitleCompressImage,
      badge: t.toolBadgeCompressImage,
      description: t.toolDescCompressImage,
      icon: '🖼️',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Tools Hub Hero */}
      <div className="text-center sm:text-start space-y-2 pt-1">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
            {t.toolsHubBadge}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0B1220] dark:text-white tracking-tight">
          {t.toolsHubTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
          {t.toolsHubSubtitle}
        </p>
      </div>

      {/* PDF Category */}
      <section className="space-y-3" aria-label={t.toolsCategoryPdf}>
        <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
          <span className="text-base">📄</span>
          <h2 className="text-sm font-bold text-[#0B1220] dark:text-white uppercase tracking-wider">
            {t.toolsCategoryPdf}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pdfTools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.path}
              className="p-4 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/80 dark:hover:border-blue-500/80 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 rounded-2xl transition-all block group shadow-2xs text-start"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm shrink-0">{tool.icon}</span>
                  <span className="text-xs sm:text-sm font-bold text-[#0B1220] dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {tool.title}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors shrink-0">
                  {tool.badge}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Image Category */}
      <section className="space-y-3 pt-2" aria-label={t.toolsCategoryImages}>
        <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
          <span className="text-base">🖼️</span>
          <h2 className="text-sm font-bold text-[#0B1220] dark:text-white uppercase tracking-wider">
            {t.toolsCategoryImages}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {imageTools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.path}
              className="p-4 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/80 dark:hover:border-blue-500/80 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 rounded-2xl transition-all block group shadow-2xs text-start"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm shrink-0">{tool.icon}</span>
                  <span className="text-xs sm:text-sm font-bold text-[#0B1220] dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {tool.title}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors shrink-0">
                  {tool.badge}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Return to Compressor Link */}
      <div className="pt-2 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>←</span>
          <span>{t.returnToCompressor}</span>
        </Link>
      </div>
    </div>
  );
}
