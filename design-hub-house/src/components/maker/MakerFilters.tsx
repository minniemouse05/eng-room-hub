'use client';

import { useState, useMemo } from 'react';
import { PlaygroundConfig } from '@/types';
import { SearchBar, FilterBar } from '@/components/shared';
import { PlaygroundCard } from './PlaygroundCard';

interface MakerFiltersProps {
  playgrounds: PlaygroundConfig[];
  allTags: string[];
}

export function MakerFilters({ playgrounds, allTags }: MakerFiltersProps) {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [stack, setStack] = useState<PlaygroundConfig['stack'] | undefined>();
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const handleClearAll = () => {
    setSearch('');
    setSelectedTags([]);
    setStack(undefined);
    setSortBy('title');
    setSortOrder('asc');
  };

  const filteredPlaygrounds = useMemo(() => {
    let result = playgrounds;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (playground) =>
          playground.title.toLowerCase().includes(searchLower) ||
          playground.description.toLowerCase().includes(searchLower) ||
          playground.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      result = result.filter((playground) =>
        selectedTags.some((tag) => playground.tags.includes(tag))
      );
    }

    // Stack filter
    if (stack) {
      result = result.filter((playground) => playground.stack === stack);
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [playgrounds, search, selectedTags, stack, sortBy, sortOrder]);

  const hasFilters = search || selectedTags.length > 0 || stack;

  return (
    <div className="space-y-6">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search playgrounds by title, description, or tags..."
        className="max-w-xl"
      />

      <FilterBar
        tags={allTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        stack={stack}
        onStackChange={setStack}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        sortOptions={[{ value: 'title', label: 'Title' }]}
        onClearAll={handleClearAll}
        hasFilters={!!hasFilters}
      />

      {filteredPlaygrounds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No playgrounds found matching your filters.</p>
          {hasFilters && (
            <button
              onClick={handleClearAll}
              className="mt-4 text-primary hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlaygrounds.map((playground) => (
            <PlaygroundCard key={playground.slug} playground={playground} />
          ))}
        </div>
      )}
    </div>
  );
}
