'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Sparkles, X } from 'lucide-react';

interface TourWelcomeModalProps {
  onStart: () => void;
  onSkip: () => void;
}

export function TourWelcomeModal({ onStart, onSkip }: TourWelcomeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSkip();
      } else if (e.key === 'Enter') {
        onStart();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus the modal
    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onStart, onSkip]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={onSkip}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-md animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
        tabIndex={-1}
      >
        <div className="bg-background/95 backdrop-blur-sm border border-border-soft rounded-2xl shadow-2xl overflow-hidden">
          {/* Close button */}
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-white/10 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Decorative header */}
          <div className="relative h-32 bg-gradient-to-br from-cyan/20 via-violet/20 to-orange/20 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
            <div className="relative flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan to-mint flex items-center justify-center shadow-lg">
                <Home className="w-8 h-8 text-black" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-4 text-center">
            <h2
              id="welcome-modal-title"
              className="text-2xl font-bold text-text-primary mb-2"
            >
              Welcome to Design Hub House!
            </h2>
            <p className="text-text-secondary mb-6 leading-relaxed">
              First time here? Take a quick tour to discover the Workshop,
              Maker Studio, and your AI guide. It only takes a minute!
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={onStart}
                size="lg"
                className="w-full gap-2 bg-cyan hover:bg-cyan/90 text-black font-medium"
              >
                <Sparkles className="w-5 h-5" />
                Start Tour
              </Button>
              <Button
                onClick={onSkip}
                variant="ghost"
                size="lg"
                className="w-full text-text-muted hover:text-text-secondary"
              >
                Skip for now
              </Button>
            </div>

            {/* Hint */}
            <p className="mt-4 text-xs text-text-muted">
              You can always take the tour later from the home page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
