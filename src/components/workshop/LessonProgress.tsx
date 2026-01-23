'use client';

import { useEffect } from 'react';
import { useProgressStore } from '@/hooks';
import { CompletionToggle } from '@/components/shared';
import { CheckCircle2 } from 'lucide-react';

interface LessonProgressProps {
  lessonSlug: string;
  moduleId?: string;
}

export function LessonProgress({ lessonSlug, moduleId }: LessonProgressProps) {
  const { isLessonComplete, toggleLessonComplete, setLastVisitedLesson, isHydrated } =
    useProgressStore();

  const isComplete = isLessonComplete(lessonSlug);

  // Track last visited lesson for the module
  useEffect(() => {
    if (moduleId && isHydrated) {
      setLastVisitedLesson(moduleId, lessonSlug);
    }
  }, [moduleId, lessonSlug, setLastVisitedLesson, isHydrated]);

  if (!isHydrated) {
    // Show a placeholder while hydrating to prevent layout shift
    return (
      <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
    );
  }

  return (
    <CompletionToggle
      isComplete={isComplete}
      onToggle={() => toggleLessonComplete(lessonSlug)}
      label={isComplete ? 'Lesson completed' : 'Mark lesson complete'}
      size="md"
    />
  );
}

// Compact version for use in sidebars or cards
interface LessonStatusIndicatorProps {
  lessonSlug: string;
  showLabel?: boolean;
}

export function LessonStatusIndicator({ lessonSlug, showLabel = true }: LessonStatusIndicatorProps) {
  const { isLessonComplete, isHydrated } = useProgressStore();

  if (!isHydrated) return null;

  const isComplete = isLessonComplete(lessonSlug);

  if (!isComplete) return null;

  return (
    <span className="inline-flex items-center gap-1 text-emerald-500 text-sm">
      <CheckCircle2 className="h-4 w-4" />
      {showLabel && <span>Completed</span>}
    </span>
  );
}
