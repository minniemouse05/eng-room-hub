import React from 'react';

interface KeyTakeawaysProps {
  items: string[];
}

export function KeyTakeaways({ items }: KeyTakeawaysProps) {
  return (
    <div className="my-8 rounded-lg bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-950/40 dark:to-violet-900/20 border border-violet-300 dark:border-violet-700 p-5">
      <div className="flex items-center gap-2 font-semibold mb-4 text-violet-900 dark:text-violet-100">
        <span className="text-xl">📌</span>
        <span>Key Takeaways</span>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-violet-800 dark:text-violet-200">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-200 flex items-center justify-center text-xs font-bold">
              {i + 1}
            </span>
            <span className="pt-0.5">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
