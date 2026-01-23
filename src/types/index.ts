// Demo content types
export interface DemoFrontmatter {
  title: string;
  description: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeMinutes: number;
  relatedPlaygrounds: string[];
  updatedAt: string;
}

export interface Demo extends DemoFrontmatter {
  slug: string;
  content: string;
}

// Playground content types
export interface PlaygroundConfig {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  difficulty?: DemoFrontmatter['difficulty']; // Optional, defaults to 'beginner'
  stack: 'js' | 'ts' | 'react' | 'css' | 'ai';
  relatedDemos: string[];
  files: PlaygroundFile[];
  remixIdeas?: string[];
  hideCode?: boolean; // Hide code editor (useful for quizzes to hide answers)
}

export interface PlaygroundFile {
  path: string;
  code: string;
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  createdAt: Date;
}

export interface ChatSource {
  type: 'demo' | 'playground' | 'engine-room';
  slug: string;
  title: string;
  relevance: number;
  url?: string; // External URL for engine-room sources
}

// Chat thread for multi-conversation support
export interface ChatThread {
  id: string;
  title: string;
  createdAt: number; // Unix timestamp for easy serialization
  messages: ChatMessage[];
  draftInput?: string; // Unsent text preserved per thread
}

// Content chunk for RAG
export interface ContentChunk {
  id: string;
  content: string;
  sourceType: 'demo' | 'playground' | 'engine-room';
  sourceSlug: string;
  sourceTitle: string;
  sourceUrl?: string; // External URL for engine-room sources
  metadata: Record<string, unknown>;
}

// Room types for house map
export type RoomId = 'entryway' | 'workshop' | 'maker';

export interface Room {
  id: RoomId;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

// Filter and search types
export interface FilterState {
  search: string;
  tags: string[];
  difficulty?: DemoFrontmatter['difficulty'];
  stack?: PlaygroundConfig['stack'];
  sortBy: 'updatedAt' | 'timeMinutes' | 'title';
  sortOrder: 'asc' | 'desc';
}

// ============================================
// Workshop Module System
// Supports structured learning paths at scale
// ============================================

// Target audience for content
export type Audience = 'learner' | 'builder' | 'leader';

// A Module is an ordered collection of lessons around a topic
export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or icon name
  color: string; // Accent color (hex)
  audience?: Audience[]; // Who this module is for (optional, empty = everyone)
  difficultyRange: [DemoFrontmatter['difficulty'], DemoFrontmatter['difficulty']]; // [min, max]
  estimatedMinutes: number; // Total time (can be calculated from lessons)
  prerequisites?: string[]; // Module IDs that should be completed first
  lessonSlugs: string[]; // Ordered list of lesson (demo) slugs
  isStartHere?: boolean; // Recommended starting point
  isFeatured?: boolean; // Show in featured section
}

// A Track is a curated sequence of modules for a specific goal
export interface Track {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  audience: Audience; // Primary audience for this track
  moduleIds: string[]; // Ordered list of module IDs
  goal: string; // What you'll achieve: "Understand AI basics", "Build AI apps", etc.
}

// A Collection is a non-linear grouping of lessons across modules
// (e.g., "Ethics & Safety", "Quick Reads", "Case Studies")
export interface Collection {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessonSlugs: string[]; // Can span multiple modules
  tags?: string[]; // Auto-include lessons with these tags
}

// User's selected learning goal (for personalization)
export type LearningGoal = 'learn-basics' | 'build-apps' | 'lead-strategy';

// User preferences for lightweight personalization (stored in localStorage)
export interface UserPreferences {
  learningGoal?: LearningGoal;
  startingLevel?: DemoFrontmatter['difficulty'];
  completedLessons?: string[]; // Lesson slugs
  completedModules?: string[]; // Module IDs
  completedPlaygrounds?: string[]; // Playground slugs
}

// ============================================
// Maker Studio Collection System
// Organizes playgrounds into discoverable groups
// ============================================

// A PlaygroundCollection groups related playgrounds
export interface PlaygroundCollection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  audience?: Audience[];
  difficulty?: DemoFrontmatter['difficulty']; // Primary difficulty level
  stack?: PlaygroundConfig['stack']; // Primary tech stack (optional)
  playgroundSlugs: string[]; // Ordered list of playground slugs
  relatedModuleId?: string; // Links to Workshop module for "Continue learning"
  relatedLessonSlugs?: string[]; // Lessons that recommend this collection
  isStartHere?: boolean;
  isFeatured?: boolean;
}

// Maps Workshop lessons to recommended playgrounds
export interface LessonPlaygroundLink {
  lessonSlug: string;
  playgroundSlugs: string[]; // Recommended playgrounds after this lesson
  collectionId?: string; // Or recommend entire collection
}
