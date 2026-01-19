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
