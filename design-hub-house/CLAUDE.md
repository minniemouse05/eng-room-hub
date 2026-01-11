# CLAUDE.md - Design Hub House

## Project Overview

Design Hub House is an interactive learning platform with a "house" metaphor. Three rooms provide different learning experiences:

- **Entryway** (`/entryway`): AI chatbot with RAG over local content + The Engine Room docs
- **Workshop** (`/workshop`): MDX-based tool demos with search/filter
- **Maker Studio** (`/maker`): Interactive Sandpack code playgrounds

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS 4, shadcn/ui (Radix primitives)
- **AI**: Vercel AI SDK + Anthropic Claude
- **Code Playgrounds**: Sandpack (CodeSandbox)
- **Content**: MDX (next-mdx-remote), gray-matter for frontmatter
- **Animation**: Framer Motion

## Essential Commands

```bash
npm run dev      # Start development server
npm run build    # Production build (runs TypeScript check)
npm run lint     # ESLint
npm run start    # Start production server
```

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    api/chat/route.ts     # Streaming chat API with RAG
    workshop/[slug]/      # Dynamic demo pages
    maker/[slug]/         # Dynamic playground pages
  components/
    ui/                   # shadcn/ui primitives
    shared/               # Cross-domain components (Breadcrumbs, TagBadge)
    house/                # Landing page SVG map
    workshop/             # Demo cards and filters
    maker/                # Playground runner (Sandpack)
    entryway/             # Chat interface
  lib/
    content.ts            # Demo/playground filesystem loaders
    rag.ts                # Content indexing and search
    engine-room-content.ts # Pre-indexed Engine Room website content
    mdx.tsx               # MDX compilation with plugins
    rooms.ts              # Room configuration data
  types/
    index.ts              # All TypeScript interfaces

content/
  demos/                  # MDX files with YAML frontmatter
  playgrounds/            # JSON configs with inline code
```

## Key Files

| Purpose | Location |
|---------|----------|
| Type definitions | `src/types/index.ts` |
| Content loading | `src/lib/content.ts` |
| RAG system | `src/lib/rag.ts` |
| Chat API | `src/app/api/chat/route.ts` |
| Room config | `src/lib/rooms.ts` |
| MDX rendering | `src/lib/mdx.tsx` |

## Content Management

**Adding a Demo**: Create `content/demos/{slug}.mdx` with frontmatter:
```yaml
---
title: Demo Title
description: Brief description
tags: [component, pattern]
difficulty: beginner | intermediate | advanced
timeMinutes: 15
relatedPlaygrounds: [playground-slug]
updatedAt: "2024-01-15"
---
```

**Adding a Playground**: Create `content/playgrounds/{slug}/config.json`:
```json
{
  "slug": "my-playground",
  "title": "Playground Title",
  "description": "Description",
  "tags": ["tag1"],
  "stack": "react",
  "relatedDemos": ["demo-slug"],
  "files": [{ "path": "/App.tsx", "code": "..." }]
}
```

## Environment Variables

```bash
ANTHROPIC_API_KEY=sk-ant-...  # Required for AI chat
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat` | POST | Streaming chat with RAG context |

Rate limited to 20 requests/minute per IP.

## Testing Considerations

- No test framework currently configured
- Build includes TypeScript type checking
- Static pages are pre-rendered via `generateStaticParams`

## Additional Documentation

Check these files for detailed information:

| Topic | File |
|-------|------|
| Architectural patterns, design decisions | `.claude/docs/architectural_patterns.md` |

## Quick Reference

- Component imports use barrel exports: `import { X } from '@/components/shared'`
- Client components require `'use client'` directive
- Content is statically generated at build time
- RAG indexes all content sources into searchable chunks
- External URLs (Engine Room) handled separately from internal routes
