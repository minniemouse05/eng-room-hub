'use client';

import Link from 'next/link';
import { Module, Demo } from '@/types';
import { Button } from '@/components/ui/button';
import { DifficultyBadge, StatusChip, CompletionBanner } from '@/components/shared';
import { getNextModules } from '@/lib/modules';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  PlayCircle,
  RotateCcw,
} from 'lucide-react';
import { ModuleIcon } from '@/components/icons';

interface ModuleDetailProps {
  module: Module;
  lessons: Demo[];
  onBack: () => void;
  completedLessons?: string[];
  onMarkComplete?: (lessonSlug: string) => void;
}

export function ModuleDetail({
  module,
  lessons,
  onBack,
  completedLessons = [],
  onMarkComplete,
}: ModuleDetailProps) {
  // Find first incomplete lesson for "Continue" CTA
  const firstIncompleteLessonSlug = module.lessonSlugs.find(
    (slug) => !completedLessons.includes(slug)
  );
  const firstIncompleteLesson = lessons.find(
    (l) => l.slug === firstIncompleteLessonSlug
  );

  // Calculate progress
  const completedCount = module.lessonSlugs.filter((slug) =>
    completedLessons.includes(slug)
  ).length;
  const progressPercent = Math.round(
    (completedCount / module.lessonSlugs.length) * 100
  );
  const isComplete = completedCount === module.lessonSlugs.length;
  const isStarted = completedCount > 0;

  // Get lessons in module order
  const orderedLessons = module.lessonSlugs
    .map((slug) => lessons.find((l) => l.slug === slug))
    .filter((l): l is Demo => l !== undefined);

  // Get next recommended modules
  const nextModules = getNextModules(module.id);
  const firstLesson = orderedLessons[0];

  // Determine module status
  const status: 'not-started' | 'in-progress' | 'completed' = isComplete
    ? 'completed'
    : isStarted
    ? 'in-progress'
    : 'not-started';

  return (
    <div className="module-detail">
      {/* Back button */}
      <button
        onClick={onBack}
        className="module-detail-back flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to modules
      </button>

      {/* Module header */}
      <div className="module-detail-header mb-8">
        <div className="flex items-start gap-4 mb-4">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${module.color}35 0%, ${module.color}15 100%)`,
              boxShadow: `0 0 30px ${module.color}25`,
              border: `1px solid ${module.color}30`,
            }}
          >
            <ModuleIcon
              iconKey={module.iconKey}
              className="w-8 h-8"
              strokeWidth={1.75}
              style={{ color: module.color }}
            />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {module.title}
            </h2>
            <p className="text-text-secondary">{module.description}</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
          <StatusChip status={status} size="md" />
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            {module.lessonSlugs.length} lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {module.estimatedMinutes} min total
          </span>
          {module.prerequisites && module.prerequisites.length > 0 && (
            <span className="text-amber-400">
              Prereq: {module.prerequisites.join(', ')}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-muted">
              {isComplete ? 'Module complete!' : `${completedCount} of ${module.lessonSlugs.length} lessons completed`}
            </span>
            <span className="font-medium" style={{ color: module.color }}>
              {progressPercent}%
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${module.color}, ${module.color}CC)`,
              }}
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {firstIncompleteLesson ? (
            <Link href={`/workshop/${firstIncompleteLesson.slug}`}>
              <Button
                className="module-detail-cta gap-2"
                style={{
                  background: `linear-gradient(135deg, ${module.color} 0%, ${module.color}DD 100%)`,
                }}
              >
                <PlayCircle className="h-4 w-4" />
                {completedCount === 0 ? 'Start module' : 'Continue learning'}
              </Button>
            </Link>
          ) : firstLesson ? (
            <Link href={`/workshop/${firstLesson.slug}`}>
              <Button variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Review module
              </Button>
            </Link>
          ) : null}
        </div>
      </div>

      {/* Completion Banner */}
      {isComplete && (
        <CompletionBanner
          title="Module Complete!"
          message={`Congratulations! You've completed all ${module.lessonSlugs.length} lessons in ${module.title}.`}
          reviewHref={firstLesson ? `/workshop/${firstLesson.slug}` : undefined}
          reviewLabel="Review lessons"
          nextHref={nextModules[0] ? '/workshop' : undefined}
          nextLabel={nextModules[0] ? `Explore ${nextModules[0].title}` : undefined}
          color={module.color}
          className="mb-8"
        />
      )}

      {/* Lesson list */}
      <div className="module-detail-lessons">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Lessons in this module
        </h3>

        <div className="space-y-2">
          {orderedLessons.map((lesson, index) => {
            const isLessonComplete = completedLessons.includes(lesson.slug);
            const isNextUp = lesson.slug === firstIncompleteLessonSlug;

            return (
              <Link
                key={lesson.slug}
                href={`/workshop/${lesson.slug}`}
                className={`module-lesson-item group flex items-center gap-3 p-4 rounded-xl transition-all ${
                  isNextUp ? 'module-lesson-item--next' : ''
                } ${isLessonComplete ? 'module-lesson-item--complete' : ''}`}
                style={{
                  borderColor: isNextUp ? `${module.color}40` : undefined,
                }}
              >
                {/* Lesson number / status */}
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  {isLessonComplete ? (
                    <CheckCircle2
                      className="h-6 w-6"
                      style={{ color: module.color }}
                    />
                  ) : (
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                        isNextUp
                          ? 'border-current text-text-primary'
                          : 'border-text-muted text-text-muted'
                      }`}
                      style={isNextUp ? { borderColor: module.color, color: module.color } : undefined}
                    >
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Lesson info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                      {lesson.title}
                    </h4>
                    {isNextUp && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: `${module.color}20`,
                          color: module.color,
                        }}
                      >
                        Next up
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-muted truncate">
                    {lesson.description}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {lesson.timeMinutes}m
                  </span>
                  <DifficultyBadge difficulty={lesson.difficulty} />
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
