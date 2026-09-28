import React, { useEffect, useState } from 'react';
import { SITE_CONFIG } from '../config/siteConfig.js';
import { UI_TRANSLATIONS } from '../data/translations.js';

export default function DownloadAppModal({ isOpen, onClose, lang = 'en' }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const appConfig = SITE_CONFIG.androidApp || {};
  const [notice, setNotice] = useState('');
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleSmoothClose();
      }
    };
    if (isOpen) {
      setIsDismissing(false);
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSmoothClose = () => {
    setIsDismissing(true);
    setTimeout(() => {
      setIsDismissing(false);
      onClose();
    }, 220);
  };

  const handleDriveClick = () => {
    const driveUrl = appConfig.googleDriveUrl?.trim();
    if (driveUrl) {
      window.open(driveUrl, '_blank', 'noopener,noreferrer');
      handleSmoothClose();
    } else {
      setNotice(t.androidDriveNotSet || 'رابط التحميل قيد التجهيز وسيتم تفعيله فوراً.');
    }
  };

  const handleUptodownClick = () => {
    const uptodown = appConfig.uptodownUrl?.trim();
    if (uptodown) {
      window.open(uptodown, '_blank', 'noopener,noreferrer');
      handleSmoothClose();
    } else {
      setNotice(
        t.androidOptionUptodownNotice ||
          (lang === 'ar'
            ? 'التطبيق قيد المراجعة حالياً على متجر Uptodown، يرجى استخدام رابط Google Drive المباشر حالياً!'
            : 'The app is currently undergoing review on Uptodown. Please use the Google Drive direct download link for now!')
      );
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-250 ${
        isDismissing ? 'opacity-0' : 'animate-ios-backdrop bg-black/50 dark:bg-black/70'
      }`}
      onClick={handleSmoothClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-md ios-glass-modal rounded-[32px] p-6 sm:p-7 space-y-5 text-start transition-all duration-250 ${
          isDismissing ? 'scale-95 opacity-0' : 'animate-ios-modal'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Frosted Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200/50 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3.5">
            {/* Glowing 3D Glass Emblem */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-md opacity-40 animate-pulse" />
              <div className="relative h-13 w-13 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/25 border border-white/30">
                🤖
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0B1220] dark:text-white tracking-tight">
                {t.androidModalTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t.brandSlogan} • v{appConfig.version || '1.0.0'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSmoothClose}
            className="h-8 w-8 rounded-full bg-slate-200/60 dark:bg-white/10 hover:bg-slate-300/60 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all ios-spring-press cursor-pointer text-xs font-bold"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {t.androidModalSubtitle}
        </p>

        {/* Notice Alert */}
        {notice && (
          <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 animate-in fade-in duration-200">
            <span className="text-base shrink-0">ℹ️</span>
            <div className="flex-1 font-medium">{notice}</div>
            <button
              type="button"
              onClick={() => setNotice('')}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-800 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* iOS Frosted Download Options */}
        <div className="space-y-3">
          {/* Option 1: Google Drive Direct APK */}
          <button
            type="button"
            onClick={handleDriveClick}
            className="w-full p-4 rounded-[22px] border border-emerald-400/50 hover:border-emerald-500 bg-gradient-to-r from-emerald-50/60 to-teal-50/30 dark:from-emerald-950/40 dark:to-teal-950/20 hover:from-emerald-100/70 hover:to-teal-100/40 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/30 transition-all text-start group cursor-pointer shadow-xs ios-spring-press block relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl drop-shadow-sm">📁</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {t.androidOptionDriveTitle}
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs shrink-0 tracking-wider">
                {t.androidOptionDriveBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              {t.androidOptionDriveDesc}
            </p>
          </button>

          {/* Option 2: Uptodown Official Store */}
          <button
            type="button"
            onClick={handleUptodownClick}
            className="w-full p-4 rounded-[22px] border border-slate-200/80 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/60 dark:bg-white/5 hover:bg-slate-100/70 dark:hover:bg-white/10 transition-all text-start group cursor-pointer shadow-xs ios-spring-press block relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl drop-shadow-sm">🛍️</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t.androidOptionUptodownTitle}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 shrink-0">
                {appConfig.uptodownUrl ? 'Active' : t.androidOptionUptodownBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              {t.androidOptionUptodownDesc}
            </p>
          </button>
        </div>

        {/* iOS Frosted Tip */}
        <div className="p-3.5 rounded-[20px] bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
            💡 {lang === 'ar' ? 'طريقة التثبيت:' : 'Installation Tip:'}
          </span>
          {t.androidInstallTip}
        </div>
      </div>
    </div>
  );
}
