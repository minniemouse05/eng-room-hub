'use client';

import { useCallback } from 'react';
import { SpotlightOverlay } from './SpotlightOverlay';
import { TourTooltip } from './TourTooltip';
import { TourWelcomeModal } from './TourWelcomeModal';
import { UseTourReturn } from '@/hooks/useTour';

interface GuidedTourProps {
  tour: UseTourReturn;
}

export function GuidedTour({ tour }: GuidedTourProps) {
  const {
    isActive,
    currentStepData,
    currentStep,
    totalSteps,
    showWelcomeModal,
    isHydrated,
    startTour,
    skipTour,
    nextStep,
    prevStep,
  } = tour;

  // Handle "Try it" action
  const handleTryIt = useCallback(() => {
    if (!currentStepData?.tryItAction) return;

    const element = document.querySelector(currentStepData.selector);
    if (!element) return;

    if (currentStepData.tryItAction === 'click') {
      (element as HTMLElement).click();
    } else if (currentStepData.tryItAction === 'focus') {
      (element as HTMLElement).focus();
    }

    // Advance to next step after a brief delay
    setTimeout(nextStep, 300);
  }, [currentStepData, nextStep]);

  // Don't render until hydrated
  if (!isHydrated) return null;

  return (
    <>
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <TourWelcomeModal onStart={startTour} onSkip={skipTour} />
      )}

      {/* Active Tour */}
      {isActive && currentStepData && (
        <>
          <SpotlightOverlay
            targetSelector={currentStepData.selector}
            padding={currentStepData.spotlightPadding}
            onOverlayClick={skipTour}
          />
          <TourTooltip
            step={currentStepData}
            currentIndex={currentStep}
            totalSteps={totalSteps}
            onNext={nextStep}
            onPrev={prevStep}
            onSkip={skipTour}
            onTryIt={currentStepData.tryItLabel ? handleTryIt : undefined}
          />
        </>
      )}
    </>
  );
}
