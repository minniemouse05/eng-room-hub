'use client';

import { PlaygroundCollection } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, ChevronRight, Star, Sparkles } from 'lucide-react';

interface CollectionCardProps {
  collection: PlaygroundCollection;
  onClick: (collectionId: string) => void;
  completedPlaygrounds?: string[];
}

export function CollectionCard({
  collection,
  onClick,
  completedPlaygrounds = [],
}: CollectionCardProps) {
  // Calculate progress
  const completedCount = collection.playgroundSlugs.filter((slug) =>
    completedPlaygrounds.includes(slug)
  ).length;
  const progressPercent = Math.round(
    (completedCount / collection.playgroundSlugs.length) * 100
  );
  const isComplete = completedCount === collection.playgroundSlugs.length;

  return (
    <button
      onClick={() => onClick(collection.id)}
      className="collection-card block w-full text-left group"
    >
      <Card
        className="collection-card-inner h-full transition-all duration-200"
        style={{
          borderColor: `${collection.color}30`,
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Icon */}
            <div
              className="collection-card-icon w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${collection.color}30 0%, ${collection.color}10 100%)`,
                boxShadow: `0 0 20px ${collection.color}20`,
                border: `1px solid ${collection.color}25`,
              }}
            >
              <span className="text-2xl">{collection.icon}</span>
            </div>

            {/* Badges */}
            <div className="flex flex-col items-end gap-1">
              {collection.isStartHere && (
                <span className="collection-badge collection-badge--start flex items-center gap-1 text-xs px-2 py-0.5 rounded-full">
                  <Sparkles className="h-3 w-3" />
                  Start here
                </span>
              )}
              {isComplete && (
                <span className="collection-badge collection-badge--complete text-xs px-2 py-0.5 rounded-full">
                  Complete
                </span>
              )}
            </div>
          </div>

          <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
            {collection.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {collection.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted mb-3">
            <span className="flex items-center gap-1">
              <Play className="h-4 w-4" />
              {collection.playgroundSlugs.length} activities
            </span>
            {collection.difficulty && (
              <span className="capitalize">{collection.difficulty}</span>
            )}
            {collection.stack && (
              <span className="px-1.5 py-0.5 rounded text-xs bg-white/10 uppercase">
                {collection.stack}
              </span>
            )}
          </div>

          {/* Progress bar (only show if started) */}
          {completedCount > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-text-muted mb-1">
                <span>Progress</span>
                <span>
                  {completedCount}/{collection.playgroundSlugs.length}
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progressPercent}%`,
                    background: collection.color,
                  }}
                />
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center justify-end text-sm font-medium text-text-secondary group-hover:text-primary transition-colors">
            {completedCount === 0 ? 'Explore' : 'Continue'}
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
