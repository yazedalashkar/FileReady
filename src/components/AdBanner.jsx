import React, { useState, useEffect, useRef } from 'react';
import { SITE_CONFIG } from '../config/siteConfig.js';
import { UI_TRANSLATIONS } from '../data/translations.js';

/**
 * Premium Responsive AdBanner Component
 * Sits directly below Header on the main page.
 * 
 * Features:
 * - Fixed height prevents layout shift (CLS = 0).
 * - Smooth content rotation every 10s.
 * - Respects prefers-reduced-motion.
 * - Pauses rotation on mouse hover / touch.
 * - Seamless Google AdSense readiness via SITE_CONFIG.ads.adsense.
 */
export default function AdBanner({ lang = 'en' }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const adConfig = SITE_CONFIG.ads || {};

  // If ads are globally disabled, do not render
  if (!adConfig.enabled) {
    return null;
  }

  const isAdSenseConfigured =
    adConfig.adsense?.enabled &&
    adConfig.adsense?.clientId &&
    adConfig.adsense.clientId !== 'ADSENSE_CLIENT_ID' &&
    adConfig.adsense?.slotId &&
    adConfig.adsense.slotId !== 'ADSENSE_SLOT_ID';

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const adSenseRef = useRef(null);

  // Check user motion preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const onChange = (e) => setReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    }
  }, []);

  // Promotional rotation slides when AdSense is in placeholder or promotional mode
  const slides = [
    {
      id: 'privacy',
      icon: '🔒',
      tag: lang === 'ar' ? 'خصوصية تامة' : 'Privacy First',
      title: t.adSlide1Title,
      description: t.adSlide1Desc,
      tagClass:
        'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    },
    {
      id: 'smart-reqs',
      icon: '📋',
      tag: lang === 'ar' ? 'فحص الشروط' : 'Smart Check',
      title: t.adSlide2Title,
      description: t.adSlide2Desc,
      tagClass:
        'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
    },
    {
      id: 'tools',
      icon: '⚡',
      tag: lang === 'ar' ? 'أدوات سريعة' : 'Private Tools',
      title: t.adSlide3Title,
      description: t.adSlide3Desc,
      tagClass:
        'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
    },
    {
      id: 'partner',
      icon: '📢',
      tag: lang === 'ar' ? 'مساحة شركاء' : 'Partner Space',
      title: t.adSlide4Title,
      description: t.adSlide4Desc,
      tagClass:
        'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
    },
  ];

  // Rotate slides every 10 seconds (paused on hover / unmount)
  useEffect(() => {
    if (isAdSenseConfigured || isPaused) return;

    const intervalTime = adConfig.rotationIntervalMs || 10000;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isAdSenseConfigured, isPaused, slides.length, adConfig.rotationIntervalMs]);

  // Load Google AdSense script once if configured with real Client ID
  useEffect(() => {
    if (!isAdSenseConfigured || typeof window === 'undefined') return;

    const existingScript = document.getElementById('adsbygoogle-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'adsbygoogle-script';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adConfig.adsense.clientId}`;
      document.head.appendChild(script);
    }

    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.warn('AdSense push error:', e);
    }
  }, [isAdSenseConfigured, adConfig.adsense?.clientId]);

  const activeSlide = slides[currentSlide];

  return (
    <aside
      aria-label={t.adLabel || 'Advertisement'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full h-[88px] sm:h-[96px] rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/80 shadow-2xs overflow-hidden relative transition-colors select-none"
    >
      {/* Small subtle label */}
      <div className="absolute top-2 start-3.5 z-10 flex items-center gap-1.5 pointer-events-none">
        <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">
          {t.adLabel || 'Advertisement'}
        </span>
      </div>

      {/* Mode A: Real Google AdSense Slot */}
      {isAdSenseConfigured ? (
        <div ref={adSenseRef} className="w-full h-full pt-5 px-3 pb-2 flex items-center justify-center">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client={adConfig.adsense.clientId}
            data-ad-slot={adConfig.adsense.slotId}
            data-ad-format={adConfig.adsense.format || 'auto'}
            data-full-width-responsive={adConfig.adsense.responsive ? 'true' : 'false'}
          />
        </div>
      ) : (
        /* Mode B: Rotating Sponsor / Promotional Banner */
        <div className="w-full h-full pt-4.5 pb-2 px-3.5 sm:px-4 flex items-center justify-between gap-3">
          <div
            key={activeSlide.id}
            className={`min-w-0 flex-1 flex items-center gap-3 ${
              reducedMotion ? '' : 'animate-in fade-in duration-300'
            }`}
          >
            {/* Slide Icon */}
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-lg shrink-0 shadow-2xs">
              {activeSlide.icon}
            </div>

            {/* Slide Content */}
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-md border shrink-0 ${activeSlide.tagClass}`}
                >
                  {activeSlide.tag}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                  {activeSlide.title}
                </h4>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                {activeSlide.description}
              </p>
            </div>
          </div>

          {/* Slide Navigation Indicators */}
          <div className="flex items-center gap-1 shrink-0 self-end mb-1">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'w-4 bg-blue-600 dark:bg-blue-400'
                    : 'w-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
