'use client';

import { TagBadge, DifficultyBadge, StackBadge } from './TagBadge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, X } from 'lucide-react';

interface FilterBarProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  onDifficultyChange?: (difficulty: 'beginner' | 'intermediate' | 'advanced' | undefined) => void;
  stack?: 'js' | 'ts' | 'react' | 'css' | 'ai';
  onStackChange?: (stack: 'js' | 'ts' | 'react' | 'css' | 'ai' | undefined) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string) => void;
  sortOptions: { value: string; label: string }[];
  onClearAll: () => void;
  hasFilters: boolean;
}

export function FilterBar({
  tags,
  selectedTags,
  onTagToggle,
  difficulty,
  onDifficultyChange,
  stack,
  onStackChange,
  sortBy,
  sortOrder,
  onSortChange,
  sortOptions,
  onClearAll,
  hasFilters,
}: FilterBarProps) {
  const difficulties: Array<'beginner' | 'intermediate' | 'advanced'> = [
    'beginner',
    'intermediate',
    'advanced',
  ];
  const stacks: Array<'js' | 'ts' | 'react' | 'css' | 'ai'> = ['react', 'css', 'ai', 'js', 'ts'];

  return (
    <div className="space-y-4">
      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-2">Tags:</span>
        {tags.map((tag) => (
          <TagBadge
            key={tag}
            tag={tag}
            selected={selectedTags.includes(tag)}
            onClick={() => onTagToggle(tag)}
          />
        ))}
      </div>

      {/* Difficulty filter (for demos) */}
      {onDifficultyChange && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground mr-2">Difficulty:</span>
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => onDifficultyChange(difficulty === d ? undefined : d)}
              className={`transition-opacity ${difficulty === d ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
            >
              <DifficultyBadge difficulty={d} />
            </button>
          ))}
        </div>
      )}

      {/* Stack filter (for playgrounds) */}
      {onStackChange && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground mr-2">Stack:</span>
          {stacks.map((s) => (
            <button
              key={s}
              onClick={() => onStackChange(stack === s ? undefined : s)}
              className={`transition-opacity ${stack === s ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
            >
              <StackBadge stack={s} />
            </button>
          ))}
        </div>
      )}

      {/* Sort and Clear */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
          <div className="flex gap-1">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onSortChange(option.value)}
                className="gap-1"
              >
                {option.label}
                {sortBy === option.value && (
                  <ArrowUpDown
                    className={`h-3 w-3 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                  />
                )}
              </Button>
            ))}
          </div>
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="gap-1">
            <X className="h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
