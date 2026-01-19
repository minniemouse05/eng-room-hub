# Architectural Patterns

## Content Layer Pattern

Content (demos, playgrounds, external docs) is managed through a file-based abstraction layer.

**Demos**: MDX files with YAML frontmatter in `content/demos/`. Loaded via `gray-matter` parsing.
- Reference: `src/lib/content.ts:19-31` (getDemoBySlug)
- Frontmatter schema: `src/types/index.ts:2-10`

**Playgrounds**: JSON config files in `content/playgrounds/{slug}/config.json` with inline code.
- Reference: `src/lib/content.ts:64-95` (getPlaygroundBySlug)
- Config schema: `src/types/index.ts:18-27`

**External Content**: Pre-indexed content from The Engine Room website stored as TypeScript data.
- Reference: `src/lib/engine-room-content.ts:18-264`

## RAG (Retrieval-Augmented Generation)

Content is chunked and indexed for the AI chatbot's semantic search.

**Indexing**: All content sources (demos, playgrounds, engine-room) are chunked into searchable units.
- Reference: `src/lib/rag.ts:27-148` (indexContent)
- Chunk size: 500 chars for text, 300 for code

**Search**: BM25-like scoring with term frequency and partial matching.
- Reference: `src/lib/rag.ts:159-204` (calculateScore, searchContent)

**Context Formatting**: Chunks are grouped by source and formatted with links for LLM context.
- Reference: `src/lib/rag.ts:207-251` (formatContext)

## Static Generation Pattern

Dynamic routes use `generateStaticParams` for build-time pre-rendering.

- Workshop demos: `src/app/workshop/[slug]/page.tsx:21-24`
- Maker playgrounds: `src/app/maker/[slug]/page.tsx:20-23`

## Component Organization

Components follow domain-based organization with barrel exports.

**Structure**:
```
src/components/
  ui/          # shadcn/ui primitives (button, card, tabs, etc.)
  shared/      # Cross-domain components (Breadcrumbs, TagBadge, SearchBar)
  house/       # Landing page interactive map
  workshop/    # Demo listing and filters
  maker/       # Playground listing and Sandpack runner
  entryway/    # Chat interface components
```

**Barrel Exports**: Each domain folder has an `index.ts` for clean imports.
- Reference: `src/components/shared/index.ts`
- Usage: `import { BackToHouse, Breadcrumbs, TagBadge } from '@/components/shared'`

## Client/Server Component Split

- **Server Components** (default): Pages, data fetching, MDX rendering
- **Client Components** (`'use client'`): Interactive elements requiring useState/useEffect
  - `src/components/house/HouseMap.tsx` - Framer Motion animations, router
  - `src/components/maker/PlaygroundRunner.tsx` - Sandpack live code editor
  - `src/components/entryway/ChatInterface.tsx` - Streaming chat UI

## Streaming Chat API Pattern

Chat API uses Vercel AI SDK with Anthropic for streaming responses.

**Rate Limiting**: In-memory store tracking requests per IP.
- Reference: `src/app/api/chat/route.ts:6-25`

**Lazy Indexing**: Content index is created once per serverless instance.
- Reference: `src/app/api/chat/route.ts:28-35`

**Streaming Response**: Uses `streamText()` with `toTextStreamResponse()`.
- Reference: `src/app/api/chat/route.ts:136-145`

## Type-Safe Configuration

All content types are defined centrally and reused across the codebase.

- Central types: `src/types/index.ts`
- Room configuration as typed data: `src/lib/rooms.ts`
- Filter state types: `src/types/index.ts:75-82`

## MDX Rendering

Server-side MDX compilation with syntax highlighting and GitHub-flavored markdown.

- Reference: `src/lib/mdx.tsx`
- Plugins: `rehype-highlight`, `rehype-slug`, `remark-gfm`
