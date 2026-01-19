'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlaygroundConfig } from '@/types';
import {
  playgroundCollections,
  getFeaturedCollections,
  getCollectionById,
  getPlaygroundsForLesson,
} from '@/lib/makerCollections';
import { SearchBar, FilterBar } from '@/components/shared';
import { PlaygroundCard } from './PlaygroundCard';
import { CollectionCard } from './CollectionCard';
import { CollectionDetail } from './CollectionDetail';
import { LayoutGrid, Play, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// ============================================
// Types
// ============================================

type ViewTab = 'collections' | 'all-playgrounds';

interface MakerContentProps {
  playgrounds: PlaygroundConfig[];
  allTags: string[];
}

// Storage key for progress
const PROGRESS_STORAGE_KEY = 'design-hub-playground-progress';

// ============================================
// Component
// ============================================

export function MakerContent({ playgrounds, allTags }: MakerContentProps) {
  const searchParams = useSearchParams();
  const fromLesson = searchParams.get('fromLesson');

  // View state
  const [activeTab, setActiveTab] = useState<ViewTab>('collections');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  // Filter state (for All Playgrounds view)
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [stack, setStack] = useState<PlaygroundConfig['stack'] | undefined>();
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Progress state
  const [completedPlaygrounds, setCompletedPlaygrounds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // ============================================
  // Load/Save Progress
  // ============================================

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCompletedPlaygrounds(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(
          PROGRESS_STORAGE_KEY,
          JSON.stringify(completedPlaygrounds)
        );
      } catch {
        // Ignore storage errors
      }
    }
  }, [completedPlaygrounds, isHydrated]);

  // ============================================
  // "Recommended for you" based on fromLesson param
  // ============================================

  const lessonRecommendation = fromLesson
    ? getPlaygroundsForLesson(fromLesson)
    : null;

  const recommendedPlaygrounds = lessonRecommendation
    ? lessonRecommendation.playgroundSlugs
        .map((slug) => playgrounds.find((p) => p.slug === slug))
        .filter((p): p is PlaygroundConfig => p !== undefined)
    : [];

  const recommendedCollection = lessonRecommendation?.collectionId
    ? getCollectionById(lessonRecommendation.collectionId)
    : null;

  // ============================================
  // Filter handlers
  // ============================================

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

  // ============================================
  // Filtered playgrounds for All Playgrounds view
  // ============================================

  const filteredPlaygrounds = useMemo(() => {
    let result = playgrounds;

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (playground) =>
          playground.title.toLowerCase().includes(searchLower) ||
          playground.description.toLowerCase().includes(searchLower) ||
          playground.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((playground) =>
        selectedTags.some((tag) => playground.tags.includes(tag))
      );
    }

    if (stack) {
      result = result.filter((playground) => playground.stack === stack);
    }

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

  // ============================================
  // Collection selection
  // ============================================

  const selectedCollection = selectedCollectionId
    ? getCollectionById(selectedCollectionId)
    : null;

  const handleCollectionClick = (collectionId: string) => {
    setSelectedCollectionId(collectionId);
  };

  const handleBackToCollections = () => {
    setSelectedCollectionId(null);
  };

  // ============================================
  // Categorize collections
  // ============================================

  const featuredCollections = getFeaturedCollections();
  const otherCollections = playgroundCollections.filter((c) => !c.isFeatured);

  // ============================================
  // Render
  // ============================================

  return (
    <div className="maker-content">
      {/* Recommended section (when coming from a lesson) */}
      {fromLesson && recommendedPlaygrounds.length > 0 && !selectedCollection && (
        <section className="maker-recommended mb-8 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-cyan" />
            <h2 className="text-lg font-semibold text-text-primary">
              Recommended for you
            </h2>
          </div>
          <p className="text-text-muted text-sm mb-4">
            Based on the lesson you just completed, try these activities:
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            {recommendedPlaygrounds.slice(0, 3).map((playground) => (
              <PlaygroundCard key={playground.slug} playground={playground} />
            ))}
          </div>

          {recommendedCollection && (
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleCollectionClick(recommendedCollection.id);
              }}
              className="inline-flex items-center gap-1 text-sm text-cyan hover:text-mint transition-colors"
            >
              Explore the full {recommendedCollection.title} collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </section>
      )}

      {/* Tab navigation (hidden when viewing collection detail) */}
      {!selectedCollection && (
        <div className="maker-tabs flex items-center gap-1 p-1 mb-6 rounded-lg bg-white/5 w-fit">
          <button
            onClick={() => setActiveTab('collections')}
            className={`maker-tab flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'collections' ? 'maker-tab--active' : ''
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Collections
          </button>
          <button
            onClick={() => setActiveTab('all-playgrounds')}
            className={`maker-tab flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'all-playgrounds' ? 'maker-tab--active' : ''
            }`}
          >
            <Play className="h-4 w-4" />
            All Playgrounds
          </button>
        </div>
      )}

      {/* Collection Detail View */}
      {selectedCollection && (
        <CollectionDetail
          collection={selectedCollection}
          playgrounds={playgrounds}
          onBack={handleBackToCollections}
          completedPlaygrounds={completedPlaygrounds}
        />
      )}

      {/* Collections View */}
      {!selectedCollection && activeTab === 'collections' && (
        <div className="space-y-8">
          {/* Featured collections */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-text-primary">
                Featured Collections
              </h2>
            </div>
            <p className="text-text-muted mb-4">
              Curated activities aligned with Workshop lessons. Pick a collection to get started.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onClick={handleCollectionClick}
                  completedPlaygrounds={completedPlaygrounds}
                />
              ))}
            </div>
          </section>

          {/* Other collections */}
          {otherCollections.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                More Collections
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {otherCollections.map((collection) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    onClick={handleCollectionClick}
                    completedPlaygrounds={completedPlaygrounds}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* All Playgrounds View */}
      {!selectedCollection && activeTab === 'all-playgrounds' && (
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
              <p className="text-muted-foreground text-lg">
                No playgrounds found matching your filters.
              </p>
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
      )}
    </div>
  );
}
