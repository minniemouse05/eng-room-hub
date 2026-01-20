import React from 'react';

interface ImpactItem {
  label: string;
  level: 1 | 2 | 3 | 4 | 5;
  description?: string;
}

interface ImpactScaleProps {
  title?: string;
  items: ImpactItem[];
  lowLabel?: string;
  highLabel?: string;
}

export function ImpactScale({
  title,
  items,
  lowLabel = 'Low',
  highLabel = 'High'
}: ImpactScaleProps) {
  const getColor = (level: number) => {
    if (level <= 2) return 'bg-green-500';
    if (level === 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="my-6 rounded-lg border border-slate-300 dark:border-slate-600 p-4 bg-slate-50 dark:bg-slate-900">
      {title && (
        <div className="text-sm font-semibold mb-4 text-slate-900 dark:text-slate-100">{title}</div>
      )}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {item.level <= 2 ? lowLabel : item.level >= 4 ? highLabel : 'Medium'}
              </span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getColor(item.level)} transition-all`}
                style={{ width: `${item.level * 20}%` }}
              />
            </div>
            {item.description && (
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
