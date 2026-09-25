import React from 'react';
import Link from './Link.jsx';
import { UI_TRANSLATIONS } from '../data/translations.js';

export default function Footer({ lang = 'en' }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  return (
    <footer className="mt-14 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 py-8 px-4 sm:px-6 transition-colors">
      <div className="max-w-xl mx-auto space-y-6 text-center">
        {/* Brand identity */}
        <div className="space-y-1">
          <Link
            href="/"
            className="inline-block text-sm font-bold text-slate-900 dark:text-white tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            FileReady
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.footerSlogan}</p>
        </div>

        {/* Clean, minimal core navigation */}
        <nav aria-label="Footer navigation" className="flex items-center justify-center gap-x-4 gap-y-2 flex-wrap text-xs font-semibold text-slate-600 dark:text-slate-400">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {t.navHome}
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Link href="/tools" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {t.toolsNavTitle}
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Link href="/merge-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {t.toolTitleMergePdf}
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Link href="/clean-scan" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {t.scanCleanupTitle}
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Link href="/flatten-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {t.toolTitleFlattenPdf}
          </Link>
        </nav>

        {/* Separator line */}
        <div className="h-px bg-slate-200/70 dark:bg-slate-800 max-w-xs mx-auto" />

        {/* Attribution and social links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 dark:text-slate-500">{t.footerCreatedBy}</span>
            <a
              href="https://www.instagram.com/lia.yazed"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-0.5 cursor-pointer"
            >
              Yazed Alashkar
              <span className="text-[10px] text-slate-400">↗</span>
            </a>
          </div>

          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 dark:text-slate-500">{t.footerFollow}</span>
            <a
              href="https://www.instagram.com/file_ready"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-0.5 cursor-pointer"
            >
              @file_ready
              <span className="text-[10px] text-blue-400">↗</span>
            </a>
          </div>
        </div>

        {/* Local privacy notice */}
        <div className="space-y-0.5 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
          <p>{t.footerLocal1}</p>
          <p>{t.footerLocal2}</p>
        </div>
      </div>
    </footer>
  );
}
