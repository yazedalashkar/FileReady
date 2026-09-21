import React, { useState } from 'react';

export default function FAQAccordion({
  faqs,
  title = 'Frequently Asked Questions',
  subtitle = 'Clear answers regarding file size constraints and client-side processing.',
}) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="space-y-4 pt-6 border-t border-slate-200/80 dark:border-slate-800/80" aria-label="FAQ">
      <div className="space-y-1 text-center sm:text-start">
        <h2 className="text-base sm:text-lg font-bold text-[#0B1220] dark:text-white tracking-tight">
          {title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-4 text-start flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#0B1220] dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 font-mono">
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3 bg-slate-50/50 dark:bg-slate-950/40 animate-in fade-in duration-150">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
