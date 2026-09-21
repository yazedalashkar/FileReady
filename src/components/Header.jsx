import React from 'react';
import Link from './Link.jsx';
import { UI_TRANSLATIONS } from '../data/translations.js';

export default function Header({
  theme,
  setTheme,
  lang,
  setLang,
  isInstallable = false,
  onInstall,
}) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  return (
    <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xs sticky top-0 z-30 py-2.5 sm:py-3 px-3.5 sm:px-6 transition-colors">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
        {/* Brand identity */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer shrink-0">
          <img
            src="/logo.png"
            alt="FileReady Logo"
            className="h-8 w-8 sm:h-9 sm:w-9 object-contain shrink-0 group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextSibling) {
                e.currentTarget.nextSibling.style.display = 'flex';
              }
            }}
          />
          <div className="hidden h-8 w-8 rounded-xl bg-blue-600 items-center justify-center text-white font-bold text-sm shadow-2xs">
            FR
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold text-[#0B1220] dark:text-white tracking-tight leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                FileReady
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-tight mt-0.5">
              {t.brandSlogan}
            </p>
          </div>
        </Link>

        {/* Controls: Client-Side Badge, Optional PWA Install, Language Switcher, and Theme Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Privacy badge - hidden on very narrow mobile screens (<400px) for comfort */}
          <div className="hidden xs:flex sm:flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 px-2 py-1 rounded-full font-semibold shrink-0">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t.clientSideBadge}</span>
          </div>

          {/* Subtle Install Action: ONLY rendered when browser supports PWA installation */}
          {isInstallable && (
            <button
              type="button"
              onClick={onInstall}
              className="h-9 px-2 sm:px-2.5 rounded-xl border border-blue-200/90 dark:border-blue-800/80 bg-blue-50/90 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer shrink-0"
              title={t.installApp || 'Install App'}
              aria-label={t.installApp || 'Install App'}
            >
              <span className="text-xs leading-none">📥</span>
              <span className="text-[11px] font-bold">
                {t.installShort || (lang === 'ar' ? 'تثبيت' : 'Install')}
              </span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLang}
            className="h-9 px-2.5 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1 shadow-2xs cursor-pointer min-w-[44px] justify-center"
            title={lang === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
            aria-label="Language selector"
          >
            <span className="text-[13px]">{lang === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-300 transition-colors flex items-center justify-center shadow-2xs cursor-pointer"
            title={theme === 'dark' ? t.switchThemeLight : t.switchThemeDark}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <span className="text-sm" role="img" aria-label="Light mode">☀️</span>
            ) : (
              <span className="text-sm text-slate-600" role="img" aria-label="Dark mode">🌙</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
