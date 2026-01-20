import React from 'react';

type CalloutType = 'tip' | 'warning' | 'example' | 'checklist' | 'pitfall' | 'key';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const config: Record<CalloutType, { icon: string; bg: string; border: string; title: string; text: string }> = {
  tip: {
    icon: '💡',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-400 dark:border-amber-600',
    text: 'text-amber-900 dark:text-amber-100',
    title: 'Tip',
  },
  warning: {
    icon: '⚠️',
    bg: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-400 dark:border-red-600',
    text: 'text-red-900 dark:text-red-100',
    title: 'Watch Out',
  },
  example: {
    icon: '📋',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-400 dark:border-blue-600',
    text: 'text-blue-900 dark:text-blue-100',
    title: 'Real Example',
  },
  checklist: {
    icon: '✅',
    bg: 'bg-green-50 dark:bg-green-950/40',
    border: 'border-green-400 dark:border-green-600',
    text: 'text-green-900 dark:text-green-100',
    title: 'Checklist',
  },
  pitfall: {
    icon: '🚫',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    border: 'border-orange-400 dark:border-orange-600',
    text: 'text-orange-900 dark:text-orange-100',
    title: 'Common Pitfall',
  },
  key: {
    icon: '🔑',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    border: 'border-violet-400 dark:border-violet-600',
    text: 'text-violet-900 dark:text-violet-100',
    title: 'Key Idea',
  },
};

export function Callout({ type = 'tip', title, children }: CalloutProps) {
  const { icon, bg, border, text, title: defaultTitle } = config[type];
  const displayTitle = title || defaultTitle;

  return (
    <div className={`my-6 rounded-lg border-l-4 ${border} ${bg} p-4`}>
      <div className={`flex items-center gap-2 font-semibold ${text} mb-2`}>
        <span className="text-lg">{icon}</span>
        <span>{displayTitle}</span>
      </div>
      <div className={`text-sm ${text} opacity-90 [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&>ul]:my-2 [&>ul]:ml-4 [&>ul]:list-disc`}>
        {children}
      </div>
    </div>
  );
}
