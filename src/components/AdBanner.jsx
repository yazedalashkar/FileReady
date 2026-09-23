import React, { useEffect, useRef } from 'react';
import { SITE_CONFIG } from '../config/siteConfig.js';
import { UI_TRANSLATIONS } from '../data/translations.js';

/**
 * Adsterra Native Banner Component
 * Placed directly below Header on the main page.
 *
 * Adsterra Official Code:
 * <script async="async" data-cfasync="false" src="https://pl31477883.profitableratecpmnetwork.com/9a9605932a8b9e173e2bc610da3bbe44/invoke.js"></script>
 * <div id="container-9a9605932a8b9e173e2bc610da3bbe44"></div>
 */
export default function AdBanner({ lang = 'en' }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const adConfig = SITE_CONFIG.ads || {};
  const adWrapperRef = useRef(null);

  // If ads are globally disabled in config, do not render
  if (adConfig.enabled === false) {
    return null;
  }

  useEffect(() => {
    const wrapper = adWrapperRef.current;
    if (!wrapper || typeof document === 'undefined') return;

    const SCRIPT_URL =
      'https://pl31477883.profitableratecpmnetwork.com/9a9605932a8b9e173e2bc610da3bbe44/invoke.js';

    // Prevent duplicate script injection inside this container
    const existing = wrapper.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existing) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = SCRIPT_URL;

    wrapper.appendChild(script);

    return () => {
      if (wrapper && script.parentNode === wrapper) {
        wrapper.removeChild(script);
      }
    };
  }, []);

  return (
    <aside
      aria-label={t.adLabel || 'Advertisement'}
      className="w-full min-h-[90px] rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/80 shadow-2xs overflow-hidden relative transition-colors"
    >
      {/* Small subtle label */}
      <div className="absolute top-2 start-3.5 z-10 flex items-center gap-1.5 pointer-events-none">
        <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">
          {t.adLabel || 'Advertisement'}
        </span>
      </div>

      {/* Adsterra Native Banner Slot */}
      <div
        ref={adWrapperRef}
        className="w-full min-h-[90px] pt-6 pb-2 px-2 flex items-center justify-center overflow-hidden"
      >
        <div
          id="container-9a9605932a8b9e173e2bc610da3bbe44"
          className="w-full flex items-center justify-center min-h-[60px]"
        />
      </div>
    </aside>
  );
}
