'use client';

import { useState, useMemo } from 'react';
import { Demo, DemoFrontmatter } from '@/types';
import { modules, getFeaturedModules, getModuleById } from '@/lib/modules';
import { useProgressStore } from '@/hooks';
import { SearchBar, FilterBar } from '@/components/shared';
import { DemoCard } from './DemoCard';
import { ModuleCard } from './ModuleCard';
import { ModuleDetail } from './ModuleDetail';
import { LayoutGrid, BookOpen, Sparkles } from 'lucide-react';

// ============================================
// Types
// ============================================

type ViewTab = 'modules' | 'all-lessons';

interface WorkshopContentProps {
  demos: Demo[];
  allTags: string[];
}

// ============================================
// Component
// ============================================

export function WorkshopContent({ demos, allTags }: WorkshopContentProps) {
  // Progress store
  const { completedLessons } = useProgressStore();

  // View state
  const [activeTab, setActiveTab] = useState<ViewTab>('modules');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  // Filter state (for All Lessons view)
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<DemoFrontmatter['difficulty'] | undefined>();
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  // ============================================
  // Filtered/sorted demos for All Lessons view
  // ============================================

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

  // ============================================
  // Module selection
  // ============================================

  const selectedModule = selectedModuleId ? getModuleById(selectedModuleId) : null;

  const handleModuleClick = (moduleId: string) => {
    setSelectedModuleId(moduleId);
  };

  const handleBackToModules = () => {
    setSelectedModuleId(null);
  };

  // ============================================
  // Categorize modules
  // ============================================

  const featuredModules = getFeaturedModules();
  const otherModules = modules.filter((m) => !m.isFeatured);

  // ============================================
  // Render
  // ============================================

  return (
    <div className="workshop-content">
      {/* Tab navigation (hidden when viewing module detail) */}
      {!selectedModule && (
        <div className="workshop-tabs flex items-center gap-1 p-1 mb-6 rounded-lg bg-white/5 w-fit">
          <button
            onClick={() => setActiveTab('modules')}
            className={`workshop-tab flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'modules' ? 'workshop-tab--active' : ''
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Modules
          </button>
          <button
            onClick={() => setActiveTab('all-lessons')}
            className={`workshop-tab flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'all-lessons' ? 'workshop-tab--active' : ''
            }`}
          >
            <BookOpen className="h-4 w-4" />
            All Lessons
          </button>
        </div>
      )}

      {/* Module Detail View */}
      {selectedModule && (
        <ModuleDetail
          module={selectedModule}
          lessons={demos}
          onBack={handleBackToModules}
          completedLessons={completedLessons}
        />
      )}

      {/* Modules View */}
      {!selectedModule && activeTab === 'modules' && (
        <div className="space-y-8">
          {/* Start Here / Featured section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-text-primary">
                Recommended Modules
              </h2>
            </div>
            <p className="text-text-muted mb-4">
              New to AI? Start with these foundational modules.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onClick={handleModuleClick}
                  completedLessons={completedLessons}
                />
              ))}
            </div>
          </section>

          {/* Other modules */}
          {otherModules.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                More Modules
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {otherModules.map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    onClick={handleModuleClick}
                    completedLessons={completedLessons}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Future: Tracks section */}
          {/* <section className="mt-12">
            <h2 className="text-lg font-semibold">Learning Tracks</h2>
            <p className="text-text-muted mb-4">Guided paths for specific goals</p>
            ... Track cards ...
          </section> */}
        </div>
      )}

      {/* All Lessons View (existing behavior) */}
      {!selectedModule && activeTab === 'all-lessons' && (
        <div className="space-y-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search lessons by title, description, or tags..."
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
              <p className="text-muted-foreground text-lg">
                No lessons found matching your filters.
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
              {filteredDemos.map((demo) => (
                <DemoCard key={demo.slug} demo={demo} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
