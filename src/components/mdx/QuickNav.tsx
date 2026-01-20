import React from 'react';

interface QuickNavProps {
  items: Array<{
    label: string;
    time?: string;
  }>;
}

export function QuickNav({ items }: QuickNavProps) {
  return (
    <div className="my-6 rounded-lg bg-slate-100 dark:bg-slate-800 p-4 border border-slate-300 dark:border-slate-600">
      <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">
        In this lesson
      </div>
      <ol className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center justify-between text-sm text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                {i + 1}
              </span>
              <span>{item.label}</span>
            </span>
            {item.time && (
              <span className="text-slate-500 dark:text-slate-400 text-xs">{item.time}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
