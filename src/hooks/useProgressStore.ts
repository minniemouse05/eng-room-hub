'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

// ============================================
// Types
// ============================================

export interface ProgressState {
  completedLessons: string[];
  completedPlaygrounds: string[];
  lastVisitedLessonByModule: Record<string, string>;
  lastVisitedPlaygroundByCollection: Record<string, string>;
}

export interface ProgressStore extends ProgressState {
  isHydrated: boolean;
  // Lesson methods
  isLessonComplete: (slug: string) => boolean;
  toggleLessonComplete: (slug: string) => void;
  markLessonComplete: (slug: string) => void;
  markLessonIncomplete: (slug: string) => void;
  setLastVisitedLesson: (moduleId: string, lessonSlug: string) => void;
  getLastVisitedLesson: (moduleId: string) => string | undefined;
  // Playground methods
  isPlaygroundComplete: (slug: string) => boolean;
  togglePlaygroundComplete: (slug: string) => void;
  markPlaygroundComplete: (slug: string) => void;
  markPlaygroundIncomplete: (slug: string) => void;
  setLastVisitedPlayground: (collectionId: string, playgroundSlug: string) => void;
  getLastVisitedPlayground: (collectionId: string) => string | undefined;
  // Module/Collection progress helpers
  getModuleProgress: (lessonSlugs: string[]) => { completed: number; total: number; percent: number };
  getCollectionProgress: (playgroundSlugs: string[]) => { completed: number; total: number; percent: number };
  getModuleStatus: (lessonSlugs: string[]) => 'not-started' | 'in-progress' | 'completed';
  getCollectionStatus: (playgroundSlugs: string[]) => 'not-started' | 'in-progress' | 'completed';
  getFirstIncompleteLesson: (lessonSlugs: string[]) => string | undefined;
  getFirstIncompletePlayground: (playgroundSlugs: string[]) => string | undefined;
}

// ============================================
// Storage Keys
// ============================================

const STORAGE_KEY = 'design-hub-progress';

const defaultState: ProgressState = {
  completedLessons: [],
  completedPlaygrounds: [],
  lastVisitedLessonByModule: {},
  lastVisitedPlaygroundByCollection: {},
};

// ============================================
// Hook
// ============================================

export function useProgressStore(): ProgressStore {
  const [state, setState] = useState<ProgressState>(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState({
          completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
          completedPlaygrounds: Array.isArray(parsed.completedPlaygrounds) ? parsed.completedPlaygrounds : [],
          lastVisitedLessonByModule: parsed.lastVisitedLessonByModule || {},
          lastVisitedPlaygroundByCollection: parsed.lastVisitedPlaygroundByCollection || {},
        });
      }
    } catch {
      // Ignore storage errors
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Ignore storage errors
      }
    }
  }, [state, isHydrated]);

  // ============================================
  // Lesson Methods
  // ============================================

  const isLessonComplete = useCallback(
    (slug: string) => state.completedLessons.includes(slug),
    [state.completedLessons]
  );

  const markLessonComplete = useCallback((slug: string) => {
    setState((prev) => ({
      ...prev,
      completedLessons: prev.completedLessons.includes(slug)
        ? prev.completedLessons
        : [...prev.completedLessons, slug],
    }));
  }, []);

  const markLessonIncomplete = useCallback((slug: string) => {
    setState((prev) => ({
      ...prev,
      completedLessons: prev.completedLessons.filter((s) => s !== slug),
    }));
  }, []);

  const toggleLessonComplete = useCallback(
    (slug: string) => {
      if (state.completedLessons.includes(slug)) {
        markLessonIncomplete(slug);
      } else {
        markLessonComplete(slug);
      }
    },
    [state.completedLessons, markLessonComplete, markLessonIncomplete]
  );

  const setLastVisitedLesson = useCallback((moduleId: string, lessonSlug: string) => {
    setState((prev) => ({
      ...prev,
      lastVisitedLessonByModule: {
        ...prev.lastVisitedLessonByModule,
        [moduleId]: lessonSlug,
      },
    }));
  }, []);

  const getLastVisitedLesson = useCallback(
    (moduleId: string) => state.lastVisitedLessonByModule[moduleId],
    [state.lastVisitedLessonByModule]
  );

  // ============================================
  // Playground Methods
  // ============================================

  const isPlaygroundComplete = useCallback(
    (slug: string) => state.completedPlaygrounds.includes(slug),
    [state.completedPlaygrounds]
  );

  const markPlaygroundComplete = useCallback((slug: string) => {
    setState((prev) => ({
      ...prev,
      completedPlaygrounds: prev.completedPlaygrounds.includes(slug)
        ? prev.completedPlaygrounds
        : [...prev.completedPlaygrounds, slug],
    }));
  }, []);

  const markPlaygroundIncomplete = useCallback((slug: string) => {
    setState((prev) => ({
      ...prev,
      completedPlaygrounds: prev.completedPlaygrounds.filter((s) => s !== slug),
    }));
  }, []);

  const togglePlaygroundComplete = useCallback(
    (slug: string) => {
      if (state.completedPlaygrounds.includes(slug)) {
        markPlaygroundIncomplete(slug);
      } else {
        markPlaygroundComplete(slug);
      }
    },
    [state.completedPlaygrounds, markPlaygroundComplete, markPlaygroundIncomplete]
  );

  const setLastVisitedPlayground = useCallback((collectionId: string, playgroundSlug: string) => {
    setState((prev) => ({
      ...prev,
      lastVisitedPlaygroundByCollection: {
        ...prev.lastVisitedPlaygroundByCollection,
        [collectionId]: playgroundSlug,
      },
    }));
  }, []);

  const getLastVisitedPlayground = useCallback(
    (collectionId: string) => state.lastVisitedPlaygroundByCollection[collectionId],
    [state.lastVisitedPlaygroundByCollection]
  );

  // ============================================
  // Module/Collection Progress Helpers
  // ============================================

  const getModuleProgress = useCallback(
    (lessonSlugs: string[]) => {
      const completed = lessonSlugs.filter((slug) => state.completedLessons.includes(slug)).length;
      const total = lessonSlugs.length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { completed, total, percent };
    },
    [state.completedLessons]
  );

  const getCollectionProgress = useCallback(
    (playgroundSlugs: string[]) => {
      const completed = playgroundSlugs.filter((slug) =>
        state.completedPlaygrounds.includes(slug)
      ).length;
      const total = playgroundSlugs.length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { completed, total, percent };
    },
    [state.completedPlaygrounds]
  );

  const getModuleStatus = useCallback(
    (lessonSlugs: string[]): 'not-started' | 'in-progress' | 'completed' => {
      const { completed, total } = getModuleProgress(lessonSlugs);
      if (completed === 0) return 'not-started';
      if (completed === total) return 'completed';
      return 'in-progress';
    },
    [getModuleProgress]
  );

  const getCollectionStatus = useCallback(
    (playgroundSlugs: string[]): 'not-started' | 'in-progress' | 'completed' => {
      const { completed, total } = getCollectionProgress(playgroundSlugs);
      if (completed === 0) return 'not-started';
      if (completed === total) return 'completed';
      return 'in-progress';
    },
    [getCollectionProgress]
  );

  const getFirstIncompleteLesson = useCallback(
    (lessonSlugs: string[]) => {
      return lessonSlugs.find((slug) => !state.completedLessons.includes(slug));
    },
    [state.completedLessons]
  );

  const getFirstIncompletePlayground = useCallback(
    (playgroundSlugs: string[]) => {
      return playgroundSlugs.find((slug) => !state.completedPlaygrounds.includes(slug));
    },
    [state.completedPlaygrounds]
  );

  return useMemo(
    () => ({
      ...state,
      isHydrated,
      isLessonComplete,
      toggleLessonComplete,
      markLessonComplete,
      markLessonIncomplete,
      setLastVisitedLesson,
      getLastVisitedLesson,
      isPlaygroundComplete,
      togglePlaygroundComplete,
      markPlaygroundComplete,
      markPlaygroundIncomplete,
      setLastVisitedPlayground,
      getLastVisitedPlayground,
      getModuleProgress,
      getCollectionProgress,
      getModuleStatus,
      getCollectionStatus,
      getFirstIncompleteLesson,
      getFirstIncompletePlayground,
    }),
    [
      state,
      isHydrated,
      isLessonComplete,
      toggleLessonComplete,
      markLessonComplete,
      markLessonIncomplete,
      setLastVisitedLesson,
      getLastVisitedLesson,
      isPlaygroundComplete,
      togglePlaygroundComplete,
      markPlaygroundComplete,
      markPlaygroundIncomplete,
      setLastVisitedPlayground,
      getLastVisitedPlayground,
      getModuleProgress,
      getCollectionProgress,
      getModuleStatus,
      getCollectionStatus,
      getFirstIncompleteLesson,
      getFirstIncompletePlayground,
    ]
  );
}
