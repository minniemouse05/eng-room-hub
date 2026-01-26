'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { TourStep } from '@/lib/tourConfig';

interface TourTooltipProps {
  step: TourStep;
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onTryIt?: () => void;
}

interface TooltipPosition {
  top: number;
  left: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

const TOOLTIP_MARGIN = 16;
const TOOLTIP_WIDTH = 320;
const TOOLTIP_HEIGHT_ESTIMATE = 200;

export function TourTooltip({
  step,
  currentIndex,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  onTryIt,
}: TourTooltipProps) {
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    const element = document.querySelector(step.selector);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const padding = step.spotlightPadding ?? 8;

    // Calculate available space in each direction
    const spaceTop = rect.top - padding;
    const spaceBottom = viewportHeight - (rect.bottom + padding);
    const spaceLeft = rect.left - padding;
    const spaceRight = viewportWidth - (rect.right + padding);

    // Determine best placement
    let placement = step.position ?? 'auto';

    if (placement === 'auto') {
      // Prefer bottom, then top, then right, then left
      if (spaceBottom >= TOOLTIP_HEIGHT_ESTIMATE + TOOLTIP_MARGIN) {
        placement = 'bottom';
      } else if (spaceTop >= TOOLTIP_HEIGHT_ESTIMATE + TOOLTIP_MARGIN) {
        placement = 'top';
      } else if (spaceRight >= TOOLTIP_WIDTH + TOOLTIP_MARGIN) {
        placement = 'right';
      } else if (spaceLeft >= TOOLTIP_WIDTH + TOOLTIP_MARGIN) {
        placement = 'left';
      } else {
        placement = 'bottom'; // fallback
      }
    }

    let top: number;
    let left: number;

    switch (placement) {
      case 'top':
        top = rect.top - padding - TOOLTIP_HEIGHT_ESTIMATE - TOOLTIP_MARGIN;
        left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
        break;
      case 'bottom':
        top = rect.bottom + padding + TOOLTIP_MARGIN;
        left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - TOOLTIP_HEIGHT_ESTIMATE / 2;
        left = rect.left - padding - TOOLTIP_WIDTH - TOOLTIP_MARGIN;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - TOOLTIP_HEIGHT_ESTIMATE / 2;
        left = rect.right + padding + TOOLTIP_MARGIN;
        break;
    }

    // Constrain to viewport
    left = Math.max(TOOLTIP_MARGIN, Math.min(left, viewportWidth - TOOLTIP_WIDTH - TOOLTIP_MARGIN));
    top = Math.max(TOOLTIP_MARGIN, Math.min(top, viewportHeight - TOOLTIP_HEIGHT_ESTIMATE - TOOLTIP_MARGIN));

    setPosition({ top, left, placement });
  }, [step]);

  useEffect(() => {
    // Initial calculation with delay
    const timeout = setTimeout(calculatePosition, 150);

    // Recalculate on scroll and resize
    window.addEventListener('scroll', calculatePosition, true);
    window.addEventListener('resize', calculatePosition);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', calculatePosition, true);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [calculatePosition]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSkip();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onSkip]);

  // Focus management
  useEffect(() => {
    if (tooltipRef.current) {
      tooltipRef.current.focus();
    }
  }, [step.id]);

  if (!position) return null;

  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === totalSteps - 1;
  const progress = ((currentIndex + 1) / totalSteps) * 100;

  return (
    <div
      ref={tooltipRef}
      className="fixed z-[10000] w-80 animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        top: position.top,
        left: position.left,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-tooltip-title"
      tabIndex={-1}
    >
      <div className="tour-tooltip bg-background/95 backdrop-blur-sm border border-border-soft rounded-xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-cyan to-mint transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan" />
              <h3 id="tour-tooltip-title" className="font-semibold text-text-primary">
                {step.title}
              </h3>
            </div>
            <button
              onClick={onSkip}
              className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-white/10 transition-colors"
              aria-label="Close tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <p className="text-sm text-text-secondary mb-4 leading-relaxed">
            {step.content}
          </p>

          {/* Try it button (if applicable) */}
          {step.tryItLabel && onTryIt && (
            <Button
              variant="outline"
              size="sm"
              onClick={onTryIt}
              className="w-full mb-3 gap-2 border-cyan/30 hover:border-cyan/60 hover:bg-cyan/10"
            >
              {step.tryItLabel}
            </Button>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">
              {currentIndex + 1} of {totalSteps}
            </span>

            <div className="flex items-center gap-2">
              {!isFirstStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPrev}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}

              <Button
                size="sm"
                onClick={onNext}
                className="gap-1 bg-cyan hover:bg-cyan/90 text-black"
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow indicator */}
      <TooltipArrow placement={position.placement} />
    </div>
  );
}

function TooltipArrow({ placement }: { placement: 'top' | 'bottom' | 'left' | 'right' }) {
  const baseClasses = 'absolute w-3 h-3 bg-background/95 border border-border-soft';

  switch (placement) {
    case 'top':
      return (
        <div
          className={`${baseClasses} rotate-45 left-1/2 -translate-x-1/2 -bottom-1.5 border-t-0 border-l-0`}
        />
      );
    case 'bottom':
      return (
        <div
          className={`${baseClasses} rotate-45 left-1/2 -translate-x-1/2 -top-1.5 border-b-0 border-r-0`}
        />
      );
    case 'left':
      return (
        <div
          className={`${baseClasses} rotate-45 top-1/2 -translate-y-1/2 -right-1.5 border-b-0 border-l-0`}
        />
      );
    case 'right':
      return (
        <div
          className={`${baseClasses} rotate-45 top-1/2 -translate-y-1/2 -left-1.5 border-t-0 border-r-0`}
        />
      );
  }
}
