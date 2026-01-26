'use client';

import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';
import { useTourContext } from './TourProvider';

interface TakeTourButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export function TakeTourButton({
  className,
  variant = 'outline',
  size = 'sm',
}: TakeTourButtonProps) {
  const { startTour, isHydrated, isActive } = useTourContext();

  // Don't render until hydrated or if tour is active
  if (!isHydrated || isActive) return null;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={startTour}
      className={`gap-2 ${className ?? ''}`}
      aria-label="Take a guided tour"
    >
      <Compass className="w-4 h-4" />
      <span>Take the Tour</span>
    </Button>
  );
}
