'use client';

import { useEffect } from 'react';
import { useProgressStore } from '@/hooks';
import { CompletionToggle } from '@/components/shared';
import { CheckCircle2 } from 'lucide-react';

interface PlaygroundProgressProps {
  playgroundSlug: string;
  collectionId?: string;
}

export function PlaygroundProgress({ playgroundSlug, collectionId }: PlaygroundProgressProps) {
  const { isPlaygroundComplete, togglePlaygroundComplete, setLastVisitedPlayground, isHydrated } =
    useProgressStore();

  const isComplete = isPlaygroundComplete(playgroundSlug);

  // Track last visited playground for the collection
  useEffect(() => {
    if (collectionId && isHydrated) {
      setLastVisitedPlayground(collectionId, playgroundSlug);
    }
  }, [collectionId, playgroundSlug, setLastVisitedPlayground, isHydrated]);

  if (!isHydrated) {
    // Show a placeholder while hydrating to prevent layout shift
    return (
      <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
    );
  }

  return (
    <CompletionToggle
      isComplete={isComplete}
      onToggle={() => togglePlaygroundComplete(playgroundSlug)}
      label={isComplete ? 'Activity completed' : 'Mark as complete'}
      size="md"
    />
  );
}

// Compact version for use in cards
interface PlaygroundStatusIndicatorProps {
  playgroundSlug: string;
  showLabel?: boolean;
}

export function PlaygroundStatusIndicator({ playgroundSlug, showLabel = true }: PlaygroundStatusIndicatorProps) {
  const { isPlaygroundComplete, isHydrated } = useProgressStore();

  if (!isHydrated) return null;

  const isComplete = isPlaygroundComplete(playgroundSlug);

  if (!isComplete) return null;

  return (
    <span className="inline-flex items-center gap-1 text-emerald-500 text-sm">
      <CheckCircle2 className="h-4 w-4" />
      {showLabel && <span>Completed</span>}
    </span>
  );
}
