import React, { useState, useEffect } from 'react';

/**
 * Windows 11 Inspired Fluid Splash Screen
 * Ultra-lightweight (Pure CSS + SVG, < 2KB)
 * Runs once per session, smooth 2-second fluid animation, tap-to-skip.
 */
export default function SplashScreen({ onFinish }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    try {
      if (sessionStorage.getItem('fileready_splash_shown')) {
        onFinish();
        return;
      }
    } catch {
      // Ignore storage errors in restrictive environments
    }

    // Auto dismiss after 2.1s
    const timer = setTimeout(() => {
      triggerDismiss();
    }, 2100);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const triggerDismiss = () => {
    setIsClosing(true);
    try {
      sessionStorage.setItem('fileready_splash_shown', 'true');
    } catch {
      // Ignore storage errors
    }
    setTimeout(() => {
      onFinish();
    }, 350); // Matches fade-out transition duration
  };

  return (
    <div
      onClick={triggerDismiss}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B1220] text-white select-none transition-all duration-350 ease-out cursor-pointer ${
        isClosing ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="FileReady Splash Screen"
      role="dialog"
    >
      <div className="flex flex-col items-center space-y-6 max-w-xs text-center px-4 animate-in fade-in zoom-in-95 duration-500">
        {/* Sleek Glowing Logo Icon */}
        <div className="relative">
          {/* Ambient Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-40 animate-pulse" />
          
          <div className="relative h-18 w-18 rounded-3xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-2xl border border-white/15">
            <svg
              className="w-10 h-10 text-white drop-shadow-md"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 3v5a1 1 0 001 1h5"
                className="text-blue-200"
              />
            </svg>
          </div>
        </div>

        {/* Brand Name & Micro Tagline */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-1.5 font-sans">
            FileReady
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          </h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Fast • Private • Portal-Ready
          </p>
        </div>

        {/* Windows 11 Style Fluid Progress Bar */}
        <div className="w-40 sm:w-48 space-y-1.5 pt-2">
          {/* Track */}
          <div className="h-1 sm:h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden relative shadow-inner border border-white/5">
            {/* Windows 11 Fluid Fill Animation */}
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-400 rounded-full animate-win11-progress shadow-[0_0_8px_rgba(56,189,248,0.6)]"
              style={{
                animationDuration: '2.0s',
                animationTimingFunction: 'cubic-bezier(0.1, 0.9, 0.2, 1.0)',
                animationFillMode: 'forwards',
              }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-mono tracking-wider block">
            Tap anywhere to skip
          </span>
        </div>
      </div>
    </div>
  );
}
