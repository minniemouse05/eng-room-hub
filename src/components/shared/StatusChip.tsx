'use client';

import { CheckCircle2, PlayCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'not-started' | 'in-progress' | 'completed';

interface StatusChipProps {
  status: Status;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig = {
  'not-started': {
    label: 'Not started',
    icon: Circle,
    className: 'bg-white/5 text-text-muted',
  },
  'in-progress': {
    label: 'In progress',
    icon: PlayCircle,
    className: 'bg-amber-500/10 text-amber-500',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    className: 'bg-emerald-500/10 text-emerald-500',
  },
};

export function StatusChip({ status, size = 'sm', className }: StatusChipProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizes = {
    sm: { text: 'text-xs', icon: 'h-3 w-3', padding: 'px-2 py-0.5' },
    md: { text: 'text-sm', icon: 'h-4 w-4', padding: 'px-2.5 py-1' },
  };

  const { text, icon, padding } = sizes[size];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        text,
        padding,
        config.className,
        className
      )}
    >
      <Icon className={icon} />
      {config.label}
    </span>
  );
}
