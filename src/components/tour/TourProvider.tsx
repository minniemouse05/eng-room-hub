'use client';

import { createContext, useContext, ReactNode } from 'react';
import { GuidedTour } from './GuidedTour';
import { useTour, UseTourReturn } from '@/hooks/useTour';

const TourContext = createContext<UseTourReturn | null>(null);

export function useTourContext(): UseTourReturn {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTourContext must be used within a TourProvider');
  }
  return context;
}

interface TourProviderProps {
  children: ReactNode;
}

export function TourProvider({ children }: TourProviderProps) {
  const tour = useTour();

  return (
    <TourContext.Provider value={tour}>
      {children}
      <GuidedTour tour={tour} />
    </TourContext.Provider>
  );
}
