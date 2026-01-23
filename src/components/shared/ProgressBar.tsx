'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  color = '#6A2CFF',
  size = 'md',
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-text-muted mb-1">
          <span>{label || 'Progress'}</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-white/10 rounded-full overflow-hidden',
          heights[size]
        )}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${clampedValue}%`,
            background: `linear-gradient(90deg, ${color}, ${color}CC)`,
          }}
        />
      </div>
    </div>
  );
}
