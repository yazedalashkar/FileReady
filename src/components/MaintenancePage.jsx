import React from 'react';

/**
 * Premium Dark Cinematic Maintenance Page
 * Displayed globally when SITE_CONFIG.maintenanceMode is true.
 */
export default function MaintenancePage({ config }) {
  const {
    titleAr = 'ميزات جديدة وحصرية قادمة قريباً',
    titleEn = 'Exclusive new features are coming soon.',
    descriptionAr = 'نعمل حالياً على تطوير تجربة FileReady لتكون أفضل.',
    descriptionEn = "We're working on something better for you.",
  } = config || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 bg-[#070B14] text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Cinematic Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Logo */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10 pt-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-blue-500/20">
            F
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white leading-none">
              File<span className="text-blue-400">Ready</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              100% Client-Side
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-950/60 text-blue-300 border border-blue-800/50">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>Under Maintenance</span>
        </span>
      </header>

      {/* Main Content Card */}
      <main className="w-full max-w-xl my-auto z-10 text-center space-y-6 py-12">
        {/* Maintenance Icon */}
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-linear-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/60 shadow-2xl shadow-blue-900/20 mx-auto text-3xl text-blue-400">
          <svg
            className="w-10 h-10 text-blue-400 stroke-[1.75]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.07a4.5 4.5 0 004.486-6.32l-3.27 3.27-2.496-.356-.356-2.496 3.27-3.27a4.5 4.5 0 00-6.32 4.486c.118.58.094 1.193-.07 1.743m-1.076 1.076l-2.73 2.73"
            />
          </svg>
        </div>

        {/* Headings */}
        <div className="space-y-3">
          <h1
            dir="rtl"
            className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-relaxed"
          >
            {titleAr}
          </h1>
          <h2 className="text-lg sm:text-xl font-bold text-slate-300 tracking-normal">
            {titleEn}
          </h2>
        </div>

        {/* Divider */}
        <div className="w-16 h-0.5 bg-linear-to-r from-transparent via-blue-500/40 to-transparent mx-auto" />

        {/* Descriptions */}
        <div className="space-y-1.5 text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          <p dir="rtl" className="font-medium text-slate-300">
            {descriptionAr}
          </p>
          <p className="font-normal text-slate-400">
            {descriptionEn}
          </p>
        </div>

        {/* Subtle Status Pill */}
        <div className="pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>All local browser processing tools remain completely safe & private</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center z-10 pb-4">
        <p className="text-[11px] text-slate-500">
          © {new Date().getFullYear()} FileReady • All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
