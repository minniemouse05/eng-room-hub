/**
 * Workshop Module System
 *
 * This file defines the structured learning content for the Workshop.
 * Modules group lessons into coherent topics, Tracks provide learning paths,
 * and Collections offer cross-cutting thematic groupings.
 *
 * ADDING NEW CONTENT:
 * 1. Create the lesson MDX file in content/demos/
 * 2. Add the lesson slug to the appropriate module's lessonSlugs array
 * 3. For new topics, create a new module and optionally add to tracks
 */

import { Module, Track, Collection, Audience } from '@/types';

// ============================================
// MODULES
// Ordered collections of lessons around a topic
// ============================================

export const modules: Module[] = [
  // ----------------------------------------
  // AI FUNDAMENTALS - Start Here
  // ----------------------------------------
  {
    id: 'ai-fundamentals',
    title: 'AI Fundamentals',
    description:
      'Start your AI journey here. Learn what AI is, how it evolved, and the different types of AI systems that exist today.',
    icon: '🧠',
    color: '#6A2CFF', // electric-violet
    audience: ['learner', 'builder', 'leader'],
    difficultyRange: ['beginner', 'beginner'],
    estimatedMinutes: 30,
    lessonSlugs: ['intro-to-ai', 'types-of-ai', 'ai-history'],
    isStartHere: true,
    isFeatured: true,
  },

  // ----------------------------------------
  // MACHINE LEARNING FOUNDATIONS
  // ----------------------------------------
  {
    id: 'ml-foundations',
    title: 'Machine Learning Foundations',
    description:
      'Discover how machines learn from data. Understand supervised, unsupervised, and reinforcement learning without the math.',
    icon: '📊',
    color: '#39E6FF', // cyan
    audience: ['learner', 'builder'],
    difficultyRange: ['beginner', 'beginner'],
    estimatedMinutes: 25,
    prerequisites: ['ai-fundamentals'],
    lessonSlugs: ['what-is-machine-learning', 'types-of-machine-learning'],
    isFeatured: true,
  },

  // ----------------------------------------
  // LLM ESSENTIALS
  // ----------------------------------------
  {
    id: 'llm-essentials',
    title: 'LLM Essentials',
    description:
      'Understand the technology behind ChatGPT and Claude. Learn how large language models work, their capabilities, and their limitations.',
    icon: '💬',
    color: '#FF9A3D', // orange
    audience: ['learner', 'builder', 'leader'],
    difficultyRange: ['beginner', 'beginner'],
    estimatedMinutes: 40,
    prerequisites: ['ai-fundamentals'],
    lessonSlugs: ['what-are-llms', 'how-llms-work', 'llm-limitations', 'llm-ethics'],
    isFeatured: true,
  },

  // ----------------------------------------
  // UI DEVELOPMENT (non-AI tutorials)
  // ----------------------------------------
  {
    id: 'ui-development',
    title: 'UI Development',
    description:
      'Master modern frontend development patterns. From component design to responsive layouts and state management.',
    icon: '🎨',
    color: '#FF5C6C', // coral
    audience: ['builder'],
    difficultyRange: ['beginner', 'advanced'],
    estimatedMinutes: 75,
    lessonSlugs: [
      'button-variants',
      'animation-basics',
      'dark-mode',
      'form-validation',
      'responsive-layout',
      'state-management',
    ],
    isFeatured: false,
  },
];

// ============================================
// TRACKS
// Curated learning paths for specific goals
// ============================================

export const tracks: Track[] = [
  {
    id: 'learner-track',
    title: 'Learner Track',
    description:
      'Perfect for beginners. Build a solid foundation in AI concepts before diving deeper.',
    icon: '📚',
    color: '#6A2CFF',
    audience: 'learner',
    moduleIds: ['ai-fundamentals', 'ml-foundations', 'llm-essentials'],
    goal: 'Understand the fundamentals of AI, machine learning, and LLMs',
  },
  {
    id: 'builder-track',
    title: 'Builder Track',
    description:
      'For developers who want to build with AI. Focus on practical applications and implementation.',
    icon: '🛠️',
    color: '#39E6FF',
    audience: 'builder',
    moduleIds: ['llm-essentials', 'ui-development'],
    goal: 'Learn to build applications that leverage AI capabilities',
  },
  {
    id: 'leader-track',
    title: 'Leader Track',
    description:
      'For executives and decision-makers. Understand AI strategy, governance, and organizational impact.',
    icon: '🎯',
    color: '#FF9A3D',
    audience: 'leader',
    moduleIds: ['ai-fundamentals', 'llm-essentials'],
    goal: 'Make informed decisions about AI adoption and strategy',
  },
];

// ============================================
// COLLECTIONS
// Cross-cutting thematic groupings
// ============================================

export const collections: Collection[] = [
  {
    id: 'ethics-safety',
    title: 'Ethics & Safety',
    description: 'Responsible AI practices, limitations awareness, and ethical considerations.',
    icon: '⚖️',
    lessonSlugs: ['llm-ethics', 'llm-limitations'],
    tags: ['ethics', 'safety', 'governance'],
  },
  {
    id: 'quick-reads',
    title: 'Quick Reads',
    description: 'Lessons you can complete in under 15 minutes.',
    icon: '⚡',
    lessonSlugs: ['intro-to-ai', 'what-are-llms', 'button-variants'],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a module by its ID
 */
export function getModuleById(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

/**
 * Get modules that are marked as "Start Here"
 */
export function getStartHereModules(): Module[] {
  return modules.filter((m) => m.isStartHere);
}

/**
 * Get featured modules for the landing page
 */
export function getFeaturedModules(): Module[] {
  return modules.filter((m) => m.isFeatured);
}

/**
 * Get modules appropriate for a specific audience
 */
export function getModulesForAudience(audience: Audience): Module[] {
  return modules.filter((m) => !m.audience || m.audience.includes(audience));
}

/**
 * Get the track for a specific audience
 */
export function getTrackForAudience(audience: Track['audience']): Track | undefined {
  return tracks.find((t) => t.audience === audience);
}

/**
 * Get modules that have a specific module as a prerequisite
 */
export function getNextModules(moduleId: string): Module[] {
  return modules.filter((m) => m.prerequisites?.includes(moduleId));
}

/**
 * Calculate total time for a track
 */
export function getTrackTotalMinutes(track: Track): number {
  return track.moduleIds.reduce((total, moduleId) => {
    const module = getModuleById(moduleId);
    return total + (module?.estimatedMinutes || 0);
  }, 0);
}

/**
 * Get all lesson slugs across all modules (for validation)
 */
export function getAllModuleLessonSlugs(): string[] {
  const slugs = new Set<string>();
  modules.forEach((m) => m.lessonSlugs.forEach((s) => slugs.add(s)));
  return Array.from(slugs);
}

/**
 * Find which module(s) a lesson belongs to
 */
export function getModulesForLesson(lessonSlug: string): Module[] {
  return modules.filter((m) => m.lessonSlugs.includes(lessonSlug));
}

/**
 * Get the next lesson in a module after the current one
 */
export function getNextLessonInModule(
  moduleId: string,
  currentLessonSlug: string
): string | null {
  const module = getModuleById(moduleId);
  if (!module) return null;

  const currentIndex = module.lessonSlugs.indexOf(currentLessonSlug);
  if (currentIndex === -1 || currentIndex === module.lessonSlugs.length - 1) {
    return null;
  }
  return module.lessonSlugs[currentIndex + 1];
}

/**
 * Get lesson position in module (1-indexed for display)
 */
export function getLessonPositionInModule(
  moduleId: string,
  lessonSlug: string
): { position: number; total: number } | null {
  const module = getModuleById(moduleId);
  if (!module) return null;

  const index = module.lessonSlugs.indexOf(lessonSlug);
  if (index === -1) return null;

  return {
    position: index + 1,
    total: module.lessonSlugs.length,
  };
}
