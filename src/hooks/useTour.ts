'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  tourSteps,
  TourStep,
  TourState,
  TOUR_STORAGE_KEY,
  TOUR_VERSION,
  getDefaultTourState,
} from '@/lib/tourConfig';

// ============================================
// Helper Functions
// ============================================

function loadTourState(): TourState {
  if (typeof window === 'undefined') return getDefaultTourState();
  try {
    const stored = localStorage.getItem(TOUR_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as TourState;
      // Reset if version changed
      if (parsed.version !== TOUR_VERSION) {
        return getDefaultTourState();
      }
      return parsed;
    }
  } catch {
    // Ignore storage errors
  }
  return getDefaultTourState();
}

function saveTourState(state: TourState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

// Wait for an element to appear in the DOM
export function waitForSelector(
  selector: string,
  timeout = 5000
): Promise<Element | null> {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      resolve(document.querySelector(selector));
    }, timeout);
  });
}

// ============================================
// Hook
// ============================================

export interface UseTourReturn {
  // State
  isActive: boolean;
  currentStep: number;
  currentStepData: TourStep | null;
  totalSteps: number;
  showWelcomeModal: boolean;
  isHydrated: boolean;

  // Actions
  startTour: () => void;
  endTour: () => void;
  skipTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepIndex: number) => void;
  dismissWelcomeModal: () => void;
  resetTour: () => void;
}

export function useTour(): UseTourReturn {
  const router = useRouter();
  const pathname = usePathname();

  const [isHydrated, setIsHydrated] = useState(false);
  const [tourState, setTourState] = useState<TourState>(getDefaultTourState);
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const state = loadTourState();
    setTourState(state);

    // Show welcome modal on first visit (only on home page)
    if (!state.hasSeenTour && pathname === '/') {
      setShowWelcomeModal(true);
    }

    setIsHydrated(true);
  }, [pathname]);

  // Persist state changes
  useEffect(() => {
    if (isHydrated) {
      saveTourState(tourState);
    }
  }, [tourState, isHydrated]);

  // Get current step data
  const currentStepData = isActive ? tourSteps[currentStep] ?? null : null;

  // Navigate to step's route if needed
  const navigateToStep = useCallback(
    async (stepIndex: number) => {
      const step = tourSteps[stepIndex];
      if (!step) return false;

      if (pathname !== step.route) {
        router.push(step.route);
        // Wait for navigation and element
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Wait for the element to appear
      const element = await waitForSelector(step.selector, 3000);
      return !!element;
    },
    [pathname, router]
  );

  // Start the tour
  const startTour = useCallback(async () => {
    setShowWelcomeModal(false);
    setCurrentStep(0);
    setIsActive(true);

    // Navigate to first step
    const firstStep = tourSteps[0];
    if (firstStep && pathname !== firstStep.route) {
      router.push(firstStep.route);
    }
  }, [pathname, router]);

  // End/complete the tour
  const endTour = useCallback(() => {
    setIsActive(false);
    setTourState((prev) => ({
      ...prev,
      hasSeenTour: true,
      lastCompletedStep: currentStep,
    }));
  }, [currentStep]);

  // Skip the tour (mark as seen but don't complete)
  const skipTour = useCallback(() => {
    setIsActive(false);
    setShowWelcomeModal(false);
    setTourState((prev) => ({
      ...prev,
      hasSeenTour: true,
    }));
  }, []);

  // Go to next step
  const nextStep = useCallback(async () => {
    const nextIndex = currentStep + 1;

    if (nextIndex >= tourSteps.length) {
      endTour();
      return;
    }

    const success = await navigateToStep(nextIndex);
    if (success) {
      setCurrentStep(nextIndex);
      setTourState((prev) => ({
        ...prev,
        lastCompletedStep: Math.max(prev.lastCompletedStep, currentStep),
      }));
    }
  }, [currentStep, navigateToStep, endTour]);

  // Go to previous step
  const prevStep = useCallback(async () => {
    const prevIndex = currentStep - 1;
    if (prevIndex < 0) return;

    const success = await navigateToStep(prevIndex);
    if (success) {
      setCurrentStep(prevIndex);
    }
  }, [currentStep, navigateToStep]);

  // Go to specific step
  const goToStep = useCallback(
    async (stepIndex: number) => {
      if (stepIndex < 0 || stepIndex >= tourSteps.length) return;

      const success = await navigateToStep(stepIndex);
      if (success) {
        setCurrentStep(stepIndex);
      }
    },
    [navigateToStep]
  );

  // Dismiss welcome modal without starting tour
  const dismissWelcomeModal = useCallback(() => {
    setShowWelcomeModal(false);
    setTourState((prev) => ({
      ...prev,
      hasSeenTour: true,
    }));
  }, []);

  // Reset tour (for testing or re-showing)
  const resetTour = useCallback(() => {
    setTourState(getDefaultTourState());
    setIsActive(false);
    setCurrentStep(0);
    if (pathname === '/') {
      setShowWelcomeModal(true);
    }
  }, [pathname]);

  return {
    isActive,
    currentStep,
    currentStepData,
    totalSteps: tourSteps.length,
    showWelcomeModal,
    isHydrated,
    startTour,
    endTour,
    skipTour,
    nextStep,
    prevStep,
    goToStep,
    dismissWelcomeModal,
    resetTour,
  };
}
