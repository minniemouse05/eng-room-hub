'use client';

import { PartyPopper, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CompletionBannerProps {
  title: string;
  message?: string;
  nextHref?: string;
  nextLabel?: string;
  reviewHref?: string;
  reviewLabel?: string;
  color?: string;
  className?: string;
}

export function CompletionBanner({
  title,
  message = "You've completed all items!",
  nextHref,
  nextLabel = 'Continue learning',
  reviewHref,
  reviewLabel = 'Review again',
  color = '#10b981',
  className,
}: CompletionBannerProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-6 text-center',
        'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5',
        'border border-emerald-500/20',
        className
      )}
    >
      <div
        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${color}30, ${color}10)`,
        }}
      >
        <PartyPopper className="h-8 w-8" style={{ color }} />
      </div>

      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary mb-6">{message}</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {reviewHref && (
          <Link href={reviewHref}>
            <Button variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              {reviewLabel}
            </Button>
          </Link>
        )}
        {nextHref && (
          <Link href={nextHref}>
            <Button
              className="gap-2"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}DD)`,
              }}
            >
              {nextLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
