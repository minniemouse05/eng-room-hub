'use client';

import { useState, useMemo } from 'react';
import { Demo, DemoFrontmatter } from '@/types';
import { SearchBar, FilterBar } from '@/components/shared';
import { DemoCard } from './DemoCard';

interface WorkshopFiltersProps {
  demos: Demo[];
  allTags: string[];
}

export function WorkshopFilters({ demos, allTags }: WorkshopFiltersProps) {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<DemoFrontmatter['difficulty'] | undefined>();
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
      setSortOrder('desc');
    }
  };

  const handleClearAll = () => {
    setSearch('');
    setSelectedTags([]);
    setDifficulty(undefined);
    setSortBy('updatedAt');
    setSortOrder('desc');
  };

  const filteredDemos = useMemo(() => {
    let result = demos;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (demo) =>
          demo.title.toLowerCase().includes(searchLower) ||
          demo.description.toLowerCase().includes(searchLower) ||
          demo.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      result = result.filter((demo) =>
        selectedTags.some((tag) => demo.tags.includes(tag))
      );
    }

    // Difficulty filter
    if (difficulty) {
      result = result.filter((demo) => demo.difficulty === difficulty);
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'updatedAt') {
        comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else if (sortBy === 'timeMinutes') {
        comparison = a.timeMinutes - b.timeMinutes;
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return result;
  }, [demos, search, selectedTags, difficulty, sortBy, sortOrder]);

  const hasFilters = search || selectedTags.length > 0 || difficulty;

  return (
    <div className="space-y-6">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search demos by title, description, or tags..."
        className="max-w-xl"
      />

      <FilterBar
        tags={allTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        sortOptions={[
          { value: 'updatedAt', label: 'Updated' },
          { value: 'timeMinutes', label: 'Duration' },
          { value: 'title', label: 'Title' },
        ]}
        onClearAll={handleClearAll}
        hasFilters={!!hasFilters}
      />

      {filteredDemos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No demos found matching your filters.</p>
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
          {filteredDemos.map((demo) => (
            <DemoCard key={demo.slug} demo={demo} />
          ))}
        </div>
      )}
    </div>
  );
}
