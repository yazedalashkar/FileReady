import React, { useState, useEffect, useRef } from 'react';
import { SITE_CONFIG } from '../config/siteConfig.js';
import { UI_TRANSLATIONS } from '../data/translations.js';

/**
 * Adsterra Native Banner Component (Compact Card & Periodic Rotation)
 * Sits directly below Header on the main page.
 *
 * Configured as a compact square / widget (approx 1/4 screen width),
 * centered, with periodic refresh to rotate to the next ad every 15s.
 */
export default function AdBanner({ lang = 'en' }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const adConfig = SITE_CONFIG.ads || {};
  const adWrapperRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);

  // Keep ref in sync for interval callbacks
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // If ads are globally disabled in config, do not render
  if (adConfig.enabled === false) {
    return null;
  }

  const CONTAINER_ID =
    adConfig.adsterra?.containerId ||
    'container-9a9605932a8b9e173e2bc610da3bbe44';
  const SCRIPT_URL =
    adConfig.adsterra?.scriptUrl ||
    'https://pl31477883.profitableratecpmnetwork.com/9a9605932a8b9e173e2bc610da3bbe44/invoke.js';

  // Loads / refreshes the Adsterra ad inside the container
  const loadAd = () => {
    const wrapper = adWrapperRef.current;
    if (!wrapper || typeof document === 'undefined') return;

    // Remove any previously appended script tag to allow re-fetching
    const oldScript = wrapper.querySelector('script');
    if (oldScript) {
      oldScript.remove();
    }

    // Clean previous ad DOM inside the container
    const container = document.getElementById(CONTAINER_ID);
    if (container) {
      container.innerHTML = '';
    }

    // Append fresh script to invoke the next ad
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = SCRIPT_URL;

    wrapper.appendChild(script);
  };

  useEffect(() => {
    // Initial load
    loadAd();

    // Periodic rotation: switch to next ad every 15 seconds (when not hovered)
    const intervalTime = 15000;
    const timer = setInterval(() => {
      if (!isPausedRef.current) {
        loadAd();
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
      const wrapper = adWrapperRef.current;
      if (wrapper) {
        const s = wrapper.querySelector('script');
        if (s) s.remove();
      }
    };
  }, [CONTAINER_ID, SCRIPT_URL]);

  return (
    <aside
      aria-label={t.adLabel || 'Advertisement'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full max-w-[320px] sm:max-w-[340px] mx-auto min-h-[140px] rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/80 shadow-2xs overflow-hidden relative transition-all"
    >
      {/* Small subtle label */}
      <div className="absolute top-2 start-3 z-10 flex items-center gap-1.5 pointer-events-none">
        <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 bg-white/70 dark:bg-slate-900/70 px-1.5 py-0.5 rounded-md">
          {t.adLabel || 'Advertisement'}
        </span>
      </div>

      {/* Adsterra Native Banner Slot — Centered Single Ad Container */}
      <div
        ref={adWrapperRef}
        className="w-full min-h-[140px] pt-6 pb-2 px-2 flex items-center justify-center overflow-hidden [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_a]:no-underline text-center"
      >
        <div
          id={CONTAINER_ID}
          className="w-full flex items-center justify-center min-h-[100px]"
        />
      </div>
    </aside>
  );
}
