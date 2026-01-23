'use client';

import Link from 'next/link';
import { PlaygroundCollection, PlaygroundConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { StackBadge, StatusChip, CompletionBanner } from '@/components/shared';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  ChevronRight,
  PlayCircle,
  BookOpen,
  RotateCcw,
} from 'lucide-react';

interface CollectionDetailProps {
  collection: PlaygroundCollection;
  playgrounds: PlaygroundConfig[];
  onBack: () => void;
  completedPlaygrounds?: string[];
}

export function CollectionDetail({
  collection,
  playgrounds,
  onBack,
  completedPlaygrounds = [],
}: CollectionDetailProps) {
  // Find first incomplete playground for "Continue" CTA
  const firstIncompleteSlug = collection.playgroundSlugs.find(
    (slug) => !completedPlaygrounds.includes(slug)
  );
  const firstIncompletePlayground = playgrounds.find(
    (p) => p.slug === firstIncompleteSlug
  );

  // Calculate progress
  const completedCount = collection.playgroundSlugs.filter((slug) =>
    completedPlaygrounds.includes(slug)
  ).length;
  const progressPercent = Math.round(
    (completedCount / collection.playgroundSlugs.length) * 100
  );
  const isComplete = completedCount === collection.playgroundSlugs.length;
  const isStarted = completedCount > 0;

  // Get playgrounds in collection order
  const orderedPlaygrounds = collection.playgroundSlugs
    .map((slug) => playgrounds.find((p) => p.slug === slug))
    .filter((p): p is PlaygroundConfig => p !== undefined);

  const firstPlayground = orderedPlaygrounds[0];

  // Determine status
  const status: 'not-started' | 'in-progress' | 'completed' = isComplete
    ? 'completed'
    : isStarted
    ? 'in-progress'
    : 'not-started';

  return (
    <div className="collection-detail">
      {/* Back button */}
      <button
        onClick={onBack}
        className="collection-detail-back flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to collections
      </button>

      {/* Collection header */}
      <div className="collection-detail-header mb-8">
        <div className="flex items-start gap-4 mb-4">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${collection.color}35 0%, ${collection.color}15 100%)`,
              boxShadow: `0 0 30px ${collection.color}25`,
              border: `1px solid ${collection.color}30`,
            }}
          >
            <span className="text-3xl">{collection.icon}</span>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {collection.title}
            </h2>
            <p className="text-text-secondary">{collection.description}</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
          <StatusChip status={status} size="md" />
          <span className="flex items-center gap-1.5">
            <Play className="h-4 w-4" />
            {collection.playgroundSlugs.length} activities
          </span>
          {collection.difficulty && (
            <span className="capitalize">{collection.difficulty}</span>
          )}
          {collection.stack && (
            <span className="px-2 py-0.5 rounded text-xs bg-white/10 uppercase font-medium">
              {collection.stack}
            </span>
          )}
          {collection.relatedModuleId && (
            <Link
              href="/workshop"
              className="flex items-center gap-1 text-cyan hover:text-mint transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Related lessons
            </Link>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-muted">
              {isComplete
                ? 'Collection complete!'
                : `${completedCount} of ${collection.playgroundSlugs.length} completed`}
            </span>
            <span className="font-medium" style={{ color: collection.color }}>
              {progressPercent}%
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${collection.color}, ${collection.color}CC)`,
              }}
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {firstIncompletePlayground ? (
            <Link href={`/maker/${firstIncompletePlayground.slug}`}>
              <Button
                className="collection-detail-cta gap-2"
                style={{
                  background: `linear-gradient(135deg, ${collection.color} 0%, ${collection.color}DD 100%)`,
                }}
              >
                <PlayCircle className="h-4 w-4" />
                {completedCount === 0 ? 'Start collection' : 'Continue'}
              </Button>
            </Link>
          ) : firstPlayground ? (
            <Link href={`/maker/${firstPlayground.slug}`}>
              <Button variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Review activities
              </Button>
            </Link>
          ) : null}
        </div>
      </div>

      {/* Completion Banner */}
      {isComplete && (
        <CompletionBanner
          title="Collection Complete!"
          message={`Well done! You've completed all ${collection.playgroundSlugs.length} activities in ${collection.title}.`}
          reviewHref={firstPlayground ? `/maker/${firstPlayground.slug}` : undefined}
          reviewLabel="Review activities"
          nextHref={collection.relatedModuleId ? '/workshop' : '/maker'}
          nextLabel={collection.relatedModuleId ? 'Continue learning' : 'Explore more'}
          color={collection.color}
          className="mb-8"
        />
      )}

      {/* Playground list */}
      <div className="collection-detail-playgrounds">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Activities in this collection
        </h3>

        <div className="space-y-2">
          {orderedPlaygrounds.map((playground, index) => {
            const isPlaygroundComplete = completedPlaygrounds.includes(playground.slug);
            const isNextUp = playground.slug === firstIncompleteSlug;

            return (
              <Link
                key={playground.slug}
                href={`/maker/${playground.slug}`}
                className={`collection-playground-item group flex items-center gap-3 p-4 rounded-xl transition-all ${
                  isNextUp ? 'collection-playground-item--next' : ''
                } ${isPlaygroundComplete ? 'collection-playground-item--complete' : ''}`}
                style={{
                  borderColor: isNextUp ? `${collection.color}40` : undefined,
                }}
              >
                {/* Status indicator */}
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  {isPlaygroundComplete ? (
                    <CheckCircle2
                      className="h-6 w-6"
                      style={{ color: collection.color }}
                    />
                  ) : (
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                        isNextUp
                          ? 'border-current text-text-primary'
                          : 'border-text-muted text-text-muted'
                      }`}
                      style={
                        isNextUp
                          ? { borderColor: collection.color, color: collection.color }
                          : undefined
                      }
                    >
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Playground info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                      {playground.title}
                    </h4>
                    {isNextUp && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: `${collection.color}20`,
                          color: collection.color,
                        }}
                      >
                        Next up
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-muted truncate">
                    {playground.description}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StackBadge stack={playground.stack} />
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Play className="h-3.5 w-3.5" />
                    {playground.files.length} files
                  </span>
                  <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
