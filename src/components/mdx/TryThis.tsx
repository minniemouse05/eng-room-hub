import React from 'react';
import Link from 'next/link';

interface TryThisProps {
  title: string;
  description: string;
  href: string;
  linkText?: string;
}

export function TryThis({ title, description, href, linkText = 'Try it now' }: TryThisProps) {
  return (
    <div className="my-6 rounded-lg border-2 border-dashed border-cyan-400 dark:border-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 p-5">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-200 dark:bg-cyan-800 flex items-center justify-center text-xl">
          🎯
        </div>
        <div className="flex-1">
          <div className="font-semibold mb-1 text-cyan-900 dark:text-cyan-100">{title}</div>
          <div className="text-sm text-cyan-700 dark:text-cyan-300 mb-3">{description}</div>
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-medium text-cyan-700 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-cyan-100 transition-colors underline"
          >
            {linkText}
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
