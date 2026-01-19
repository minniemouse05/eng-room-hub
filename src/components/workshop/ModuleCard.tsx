'use client';

import { Module } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, BookOpen, ChevronRight, Star } from 'lucide-react';

interface ModuleCardProps {
  module: Module;
  onClick: (moduleId: string) => void;
  completedLessons?: string[];
}

export function ModuleCard({ module, onClick, completedLessons = [] }: ModuleCardProps) {
  // Calculate progress
  const completedCount = module.lessonSlugs.filter((slug) =>
    completedLessons.includes(slug)
  ).length;
  const progressPercent = Math.round((completedCount / module.lessonSlugs.length) * 100);
  const isComplete = completedCount === module.lessonSlugs.length;

  // Format difficulty range
  const difficultyLabel =
    module.difficultyRange[0] === module.difficultyRange[1]
      ? module.difficultyRange[0]
      : `${module.difficultyRange[0]} - ${module.difficultyRange[1]}`;

  return (
    <button
      onClick={() => onClick(module.id)}
      className="module-card block w-full text-left group"
    >
      <Card
        className="module-card-inner h-full transition-all duration-200"
        style={{
          borderColor: `${module.color}30`,
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Icon */}
            <div
              className="module-card-icon w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${module.color}30 0%, ${module.color}10 100%)`,
                boxShadow: `0 0 20px ${module.color}20`,
                border: `1px solid ${module.color}25`,
              }}
            >
              <span className="text-2xl">{module.icon}</span>
            </div>

            {/* Badges */}
            <div className="flex flex-col items-end gap-1">
              {module.isStartHere && (
                <span className="module-badge module-badge--start flex items-center gap-1 text-xs px-2 py-0.5 rounded-full">
                  <Star className="h-3 w-3" />
                  Start here
                </span>
              )}
              {isComplete && (
                <span className="module-badge module-badge--complete text-xs px-2 py-0.5 rounded-full">
                  Complete
                </span>
              )}
            </div>
          </div>

          <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
            {module.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">{module.description}</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted mb-3">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {module.lessonSlugs.length} lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {module.estimatedMinutes} min
            </span>
            <span className="capitalize">{difficultyLabel}</span>
          </div>

          {/* Progress bar (only show if started) */}
          {completedCount > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-text-muted mb-1">
                <span>Progress</span>
                <span>
                  {completedCount}/{module.lessonSlugs.length}
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progressPercent}%`,
                    background: module.color,
                  }}
                />
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center justify-end text-sm font-medium text-text-secondary group-hover:text-primary transition-colors">
            {completedCount === 0 ? 'Start module' : 'Continue'}
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
