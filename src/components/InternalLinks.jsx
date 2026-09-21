import React from 'react';
import Link from './Link.jsx';

export default function InternalLinks({
  links,
  currentPath,
  title = 'Related Target Limits',
  subtitle = 'Need a different file size or format? Select another targeted tool:',
}) {
  if (!links || links.length === 0) return null;

  return (
    <section className="space-y-3 pt-6 border-t border-slate-200/80 dark:border-slate-800/80" aria-label="Related tools">
      <div className="space-y-1 text-center sm:text-start">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {links.map((link) => {
          if (link.path === currentPath) return null;
          return (
            <Link
              key={link.path}
              href={link.path}
              className="p-3.5 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/80 dark:hover:border-blue-500/80 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 rounded-2xl transition-all block group shadow-2xs text-start"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-[#0B1220] dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {link.title}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors shrink-0">
                  {link.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {link.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
