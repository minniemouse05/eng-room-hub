'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompletionToggleProps {
  isComplete: boolean;
  onToggle: () => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  disabled?: boolean;
}

export function CompletionToggle({
  isComplete,
  onToggle,
  label,
  size = 'md',
  color = '#10b981',
  className,
  disabled = false,
}: CompletionToggleProps) {
  const sizes = {
    sm: { icon: 'h-4 w-4', text: 'text-xs', gap: 'gap-1.5', padding: 'px-2 py-1' },
    md: { icon: 'h-5 w-5', text: 'text-sm', gap: 'gap-2', padding: 'px-3 py-1.5' },
    lg: { icon: 'h-6 w-6', text: 'text-base', gap: 'gap-2.5', padding: 'px-4 py-2' },
  };

  const { icon, text, gap, padding } = sizes[size];

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        'inline-flex items-center rounded-lg font-medium transition-all',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        gap,
        padding,
        text,
        isComplete
          ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 focus-visible:ring-emerald-500'
          : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary focus-visible:ring-white/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-pressed={isComplete}
      aria-label={isComplete ? 'Mark as incomplete' : 'Mark as complete'}
    >
      {isComplete ? (
        <CheckCircle2 className={icon} style={{ color }} />
      ) : (
        <Circle className={cn(icon, 'text-text-muted')} />
      )}
      <span>
        {label || (isComplete ? 'Completed' : 'Mark complete')}
      </span>
    </button>
  );
}
