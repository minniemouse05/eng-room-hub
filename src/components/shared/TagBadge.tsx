'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TagBadgeProps {
  tag: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TagBadge({ tag, selected, onClick, className }: TagBadgeProps) {
  const isInteractive = !!onClick;

  return (
    <Badge
      variant={selected ? 'default' : 'secondary'}
      className={cn(
        'transition-colors',
        isInteractive &&
          'cursor-pointer hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {tag}
    </Badge>
  );
}

interface DifficultyBadgeProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const colorMap = {
    beginner: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    advanced: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
  };

  return (
    <Badge variant="outline" className={cn(colorMap[difficulty], 'border-0', className)}>
      {difficulty}
    </Badge>
  );
}

interface StackBadgeProps {
  stack: 'js' | 'ts' | 'react' | 'css' | 'ai';
  className?: string;
}

export function StackBadge({ stack, className }: StackBadgeProps) {
  const colorMap = {
    js: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    ts: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    react: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    css: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    ai: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };

  const labelMap = {
    js: 'JavaScript',
    ts: 'TypeScript',
    react: 'React',
    css: 'CSS',
    ai: 'AI/ML',
  };

  return (
    <Badge variant="outline" className={cn(colorMap[stack], 'border-0', className)}>
      {labelMap[stack]}
    </Badge>
  );
}
