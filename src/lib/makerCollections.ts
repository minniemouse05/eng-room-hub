/**
 * Maker Studio Collection System
 *
 * Collections organize playgrounds into meaningful groups aligned with
 * Workshop modules and learning paths. A playground can appear in
 * multiple collections without duplication.
 *
 * ADDING NEW CONTENT:
 * 1. Create the playground config in content/playgrounds/{slug}/config.json
 * 2. Add the slug to appropriate collection(s) in playgroundSlugs array
 * 3. Update relatedLessonSlugs to connect Workshop lessons to this collection
 */

import { PlaygroundCollection, LessonPlaygroundLink } from '@/types';

// ============================================
// COLLECTIONS
// Organized groups of related playgrounds
// ============================================

export const playgroundCollections: PlaygroundCollection[] = [
  // ----------------------------------------
  // START HERE: AI BASICS
  // Aligns with AI Fundamentals module
  // ----------------------------------------
  {
    id: 'ai-basics',
    title: 'Start Here: AI Basics',
    description:
      'Interactive activities to build your foundational understanding of artificial intelligence. Perfect for beginners!',
    iconKey: 'brain',
    color: '#6A2CFF', // electric-violet (matches AI Fundamentals module)
    audience: ['learner', 'builder', 'leader'],
    difficulty: 'beginner',
    stack: 'ai',
    playgroundSlugs: ['ai-concepts-quiz', 'pattern-recognition-demo', 'robot-trainer'],
    relatedModuleId: 'ai-fundamentals',
    relatedLessonSlugs: ['intro-to-ai', 'types-of-ai', 'ai-history'],
    isStartHere: true,
    isFeatured: true,
  },

  // ----------------------------------------
  // MACHINE LEARNING IN ACTION
  // Aligns with ML Foundations module
  // ----------------------------------------
  {
    id: 'ml-in-action',
    title: 'Machine Learning in Action',
    description:
      'See machine learning concepts come alive. Train models, explore clustering, and understand how AI makes decisions.',
    iconKey: 'bar-chart',
    color: '#39E6FF', // cyan (matches ML Foundations module)
    audience: ['learner', 'builder'],
    difficulty: 'beginner',
    stack: 'ai',
    playgroundSlugs: ['teach-the-machine', 'clustering-explorer', 'ai-decision-maker'],
    relatedModuleId: 'ml-foundations',
    relatedLessonSlugs: ['what-is-machine-learning', 'types-of-machine-learning'],
    isFeatured: true,
  },

  // ----------------------------------------
  // LLM PLAYGROUND
  // Aligns with LLM Essentials module
  // ----------------------------------------
  {
    id: 'llm-playground',
    title: 'LLM Playground',
    description:
      'Explore how large language models work, their history, and their limitations through hands-on activities.',
    iconKey: 'message-circle',
    color: '#FF9A3D', // orange (matches LLM Essentials module)
    audience: ['learner', 'builder', 'leader'],
    difficulty: 'beginner',
    stack: 'ai',
    playgroundSlugs: ['llm-word-predictor', 'llm-timeline', 'spot-the-hallucination'],
    relatedModuleId: 'llm-essentials',
    relatedLessonSlugs: ['what-are-llms', 'how-llms-work', 'llm-limitations'],
    isFeatured: true,
  },

  // ----------------------------------------
  // ETHICS & RESPONSIBLE AI
  // Cross-cutting collection
  // ----------------------------------------
  {
    id: 'ethics-responsible-ai',
    title: 'Ethics & Responsible AI',
    description:
      'Practice identifying AI limitations, biases, and ethical considerations. Essential for responsible AI use.',
    iconKey: 'scale',
    color: '#B9A7FF', // lavender
    audience: ['learner', 'builder', 'leader'],
    difficulty: 'beginner',
    stack: 'ai',
    playgroundSlugs: ['ai-ethics-checklist', 'spot-the-hallucination'],
    relatedLessonSlugs: ['llm-ethics', 'llm-limitations'],
    isFeatured: false,
  },

  // ----------------------------------------
  // UI COMPONENTS
  // Aligns with UI Development module
  // ----------------------------------------
  {
    id: 'ui-components',
    title: 'UI Components',
    description:
      'Practice building and styling UI components. Explore buttons, layouts, and CSS techniques.',
    iconKey: 'palette',
    color: '#FF5C6C', // coral
    audience: ['builder'],
    difficulty: 'beginner',
    stack: 'css',
    playgroundSlugs: ['button-playground', 'grid-layout'],
    relatedModuleId: 'ui-development',
    relatedLessonSlugs: ['button-variants', 'responsive-layout'],
    isFeatured: false,
  },

  // ----------------------------------------
  // REACT FUNDAMENTALS
  // Aligns with UI Development module
  // ----------------------------------------
  {
    id: 'react-fundamentals',
    title: 'React Fundamentals',
    description:
      'Build interactive React components. Practice state management, forms, and component patterns.',
    iconKey: 'atom',
    color: '#61DAFB', // React blue
    audience: ['builder'],
    difficulty: 'intermediate',
    stack: 'react',
    playgroundSlugs: ['counter-app', 'form-playground'],
    relatedModuleId: 'ui-development',
    relatedLessonSlugs: ['state-management', 'form-validation'],
    isFeatured: false,
  },

  // ----------------------------------------
  // RESPONSIBLE AI FOR CIVIL SOCIETY
  // Aligns with Responsible AI for CSO module
  // ----------------------------------------
  {
    id: 'responsible-ai-tools',
    title: 'Responsible AI Tools',
    description:
      'Practical tools for civil society organizations evaluating and adopting AI responsibly. Checklists, calculators, and assessment frameworks.',
    iconKey: 'globe',
    color: '#22C55E', // green
    audience: ['learner', 'leader'],
    difficulty: 'beginner',
    stack: 'ai',
    playgroundSlugs: [
      'chatbot-adoption-checklist',
      'ai-carbon-calculator',
      'african-ai-values-explorer',
      'ai-vendor-assessment',
    ],
    relatedModuleId: 'responsible-ai-cso',
    relatedLessonSlugs: [
      'chatbots-humanitarian-contexts',
      'ai-environmental-impact',
      'african-ai-pluriverse',
      'evaluating-ai-solutions',
    ],
    isFeatured: true,
  },

  // ----------------------------------------
  // AI ALGORITHMS TOOLKIT
  // Aligns with AI Algorithms module
  // ----------------------------------------
  {
    id: 'ai-algorithms-toolkit',
    title: 'AI Algorithms Toolkit',
    description:
      'Interactive visualizations and quizzes to understand the four main types of AI algorithms. See classification, regression, clustering, and reinforcement learning in action.',
    iconKey: 'flask',
    color: '#EC4899', // pink
    audience: ['learner', 'builder', 'leader'],
    difficulty: 'beginner',
    stack: 'ai',
    playgroundSlugs: [
      'algorithm-type-explorer',
      'data-split-simulator',
      'bias-detector',
      'algorithm-matcher',
    ],
    relatedModuleId: 'ai-algorithms',
    relatedLessonSlugs: [
      'four-ways-machines-learn',
      'data-practice-quiz-exam',
      'choosing-the-right-recipe',
    ],
    isFeatured: true,
  },
];

// ============================================
// LESSON → PLAYGROUND LINKS
// Maps Workshop lessons to recommended activities
// ============================================

export const lessonPlaygroundLinks: LessonPlaygroundLink[] = [
  // AI Fundamentals lessons
  {
    lessonSlug: 'intro-to-ai',
    playgroundSlugs: ['ai-concepts-quiz', 'pattern-recognition-demo'],
    collectionId: 'ai-basics',
  },
  {
    lessonSlug: 'types-of-ai',
    playgroundSlugs: ['ai-concepts-quiz', 'robot-trainer'],
    collectionId: 'ai-basics',
  },
  {
    lessonSlug: 'ai-history',
    playgroundSlugs: ['ai-concepts-quiz'],
    collectionId: 'ai-basics',
  },

  // ML Foundations lessons
  {
    lessonSlug: 'what-is-machine-learning',
    playgroundSlugs: ['teach-the-machine', 'clustering-explorer'],
    collectionId: 'ml-in-action',
  },
  {
    lessonSlug: 'types-of-machine-learning',
    playgroundSlugs: ['teach-the-machine', 'clustering-explorer', 'ai-decision-maker'],
    collectionId: 'ml-in-action',
  },

  // LLM Essentials lessons
  {
    lessonSlug: 'what-are-llms',
    playgroundSlugs: ['llm-word-predictor', 'llm-timeline'],
    collectionId: 'llm-playground',
  },
  {
    lessonSlug: 'how-llms-work',
    playgroundSlugs: ['llm-word-predictor'],
    collectionId: 'llm-playground',
  },
  {
    lessonSlug: 'llm-limitations',
    playgroundSlugs: ['spot-the-hallucination'],
    collectionId: 'llm-playground',
  },
  {
    lessonSlug: 'llm-ethics',
    playgroundSlugs: ['ai-ethics-checklist', 'spot-the-hallucination'],
    collectionId: 'ethics-responsible-ai',
  },

  // UI Development lessons
  {
    lessonSlug: 'button-variants',
    playgroundSlugs: ['button-playground'],
    collectionId: 'ui-components',
  },
  {
    lessonSlug: 'responsive-layout',
    playgroundSlugs: ['grid-layout'],
    collectionId: 'ui-components',
  },
  {
    lessonSlug: 'state-management',
    playgroundSlugs: ['counter-app'],
    collectionId: 'react-fundamentals',
  },
  {
    lessonSlug: 'form-validation',
    playgroundSlugs: ['form-playground'],
    collectionId: 'react-fundamentals',
  },

  // Responsible AI for CSO lessons
  {
    lessonSlug: 'chatbots-humanitarian-contexts',
    playgroundSlugs: ['chatbot-adoption-checklist'],
    collectionId: 'responsible-ai-tools',
  },
  {
    lessonSlug: 'ai-environmental-impact',
    playgroundSlugs: ['ai-carbon-calculator'],
    collectionId: 'responsible-ai-tools',
  },
  {
    lessonSlug: 'african-ai-pluriverse',
    playgroundSlugs: ['african-ai-values-explorer'],
    collectionId: 'responsible-ai-tools',
  },
  {
    lessonSlug: 'evaluating-ai-solutions',
    playgroundSlugs: ['ai-vendor-assessment'],
    collectionId: 'responsible-ai-tools',
  },

  // AI Algorithms lessons
  {
    lessonSlug: 'four-ways-machines-learn',
    playgroundSlugs: ['algorithm-type-explorer', 'algorithm-matcher'],
    collectionId: 'ai-algorithms-toolkit',
  },
  {
    lessonSlug: 'data-practice-quiz-exam',
    playgroundSlugs: ['data-split-simulator', 'bias-detector'],
    collectionId: 'ai-algorithms-toolkit',
  },
  {
    lessonSlug: 'choosing-the-right-recipe',
    playgroundSlugs: ['algorithm-matcher'],
    collectionId: 'ai-algorithms-toolkit',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a collection by ID
 */
export function getCollectionById(id: string): PlaygroundCollection | undefined {
  return playgroundCollections.find((c) => c.id === id);
}

/**
 * Get collections marked as "Start Here"
 */
export function getStartHereCollections(): PlaygroundCollection[] {
  return playgroundCollections.filter((c) => c.isStartHere);
}

/**
 * Get featured collections
 */
export function getFeaturedCollections(): PlaygroundCollection[] {
  return playgroundCollections.filter((c) => c.isFeatured);
}

/**
 * Get collections for a specific tech stack
 */
export function getCollectionsByStack(
  stack: PlaygroundCollection['stack']
): PlaygroundCollection[] {
  return playgroundCollections.filter((c) => c.stack === stack);
}

/**
 * Get recommended playgrounds for a lesson
 */
export function getPlaygroundsForLesson(lessonSlug: string): LessonPlaygroundLink | undefined {
  return lessonPlaygroundLinks.find((link) => link.lessonSlug === lessonSlug);
}

/**
 * Get collections that include a specific playground
 */
export function getCollectionsForPlayground(playgroundSlug: string): PlaygroundCollection[] {
  return playgroundCollections.filter((c) => c.playgroundSlugs.includes(playgroundSlug));
}

/**
 * Get the collection linked to a Workshop module
 */
export function getCollectionForModule(moduleId: string): PlaygroundCollection | undefined {
  return playgroundCollections.find((c) => c.relatedModuleId === moduleId);
}

/**
 * Get all unique playground slugs across all collections
 */
export function getAllCollectionPlaygroundSlugs(): string[] {
  const slugs = new Set<string>();
  playgroundCollections.forEach((c) => c.playgroundSlugs.forEach((s) => slugs.add(s)));
  return Array.from(slugs);
}

/**
 * Get collections appropriate for a specific audience
 */
export function getCollectionsForAudience(
  audience: NonNullable<PlaygroundCollection['audience']>[number]
): PlaygroundCollection[] {
  return playgroundCollections.filter((c) => !c.audience || c.audience.includes(audience));
}
