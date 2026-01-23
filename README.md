# Design Hub House

An interactive learning hub for AI literacy, design systems, and code. Users explore a virtual "house" with three rooms: an AI-powered Entryway guide, a Workshop with tool demos, and a Maker Studio with interactive coding playgrounds.

## Quick Start

```bash
# Prerequisites: Node.js 18+

# Install dependencies
npm install

# Copy environment file (optional, for AI chat)
cp .env.example .env.local
# Add ANTHROPIC_API_KEY=sk-ant-... to .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (includes TypeScript check) |
| `npm run lint` | Run ESLint |
| `npm run start` | Start production server |
| `npm run update-rag` | Crawl external sources and update RAG content |
| `npm run update-rag:dry` | Preview what will be crawled (dry run) |

### Key Folders

| Folder | Purpose |
|--------|---------|
| `content/demos/` | Workshop lesson MDX files |
| `content/playgrounds/` | Maker Studio playground configs |
| `src/app/` | Next.js App Router pages and API routes |
| `src/lib/` | Content loading, RAG, modules, utilities |
| `src/types/` | TypeScript interfaces |
| `scripts/` | Build scripts and RAG crawler config |

---

## Content Authoring Guide

This section explains how to add new content to the hub. See also: [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for detailed conventions.

### 1. Add a New Maker Studio Playground

Playgrounds are interactive code editors powered by Sandpack. Users can edit and run code directly in the browser.

#### File Location

```
content/playgrounds/{slug}/config.json
```

Each playground lives in its own folder. The folder name becomes the URL slug.

#### Required Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | Yes | URL-safe identifier (must match folder name) |
| `title` | string | Yes | Display title |
| `description` | string | Yes | What users will learn/build |
| `tags` | string[] | Yes | Topic tags ([see taxonomy](#tag-taxonomy)) |
| `difficulty` | string | Yes | `beginner` \| `intermediate` \| `advanced` |
| `stack` | string | Yes | `js` \| `ts` \| `react` \| `css` \| `ai` |
| `relatedDemos` | string[] | Yes | Lesson slugs to link (can be empty `[]`) |
| `files` | array | Yes | Files for the code editor |
| `remixIdeas` | string[] | No | Suggestions for extending the playground |
| `hideCode` | boolean | No | Hide code editor (useful for quizzes) |

#### Copy-Paste Example

Create `content/playgrounds/my-playground/config.json`:

```json
{
  "slug": "my-playground",
  "title": "My Playground Title",
  "description": "Learn how to build X by doing Y.",
  "tags": ["ai-fundamentals"],
  "difficulty": "beginner",
  "stack": "react",
  "relatedDemos": ["intro-to-ai"],
  "remixIdeas": [
    "Add a dark mode toggle",
    "Connect to a real API"
  ],
  "files": [
    {
      "path": "/App.tsx",
      "code": "export default function App() {\n  return <h1>Hello World</h1>;\n}"
    },
    {
      "path": "/styles.css",
      "code": "body { font-family: sans-serif; }"
    }
  ]
}
```

The playground will automatically appear at `/maker/my-playground`.

#### Linking from a Workshop Lesson

In your MDX lesson, add the playground slug to `relatedPlaygrounds`:

```yaml
---
title: My Lesson
relatedPlaygrounds:
  - my-playground
---
```

---

### 2. Add a New Workshop Lesson (and Module Wiring)

Workshop lessons are MDX files with interactive components. Lessons are organized into **Modules** (ordered learning paths).

#### File Location

```
content/demos/{slug}.mdx
```

The filename (without `.mdx`) becomes the URL slug.

#### Required Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Lesson title |
| `description` | string | Yes | 1-2 sentence summary |
| `tags` | string[] | Yes | Topic tags ([see taxonomy](#tag-taxonomy)) |
| `difficulty` | string | Yes | `beginner` \| `intermediate` \| `advanced` |
| `timeMinutes` | number | Yes | Estimated reading time |
| `relatedPlaygrounds` | string[] | Yes | Playground slugs (can be empty `[]`) |
| `updatedAt` | string | Yes | ISO date `"YYYY-MM-DD"` |

#### Copy-Paste Example

Create `content/demos/my-lesson.mdx`:

```mdx
---
title: My Lesson Title
description: A clear, one-sentence description of what readers will learn.
tags:
  - ai-fundamentals
  - responsible-ai
difficulty: beginner
timeMinutes: 10
relatedPlaygrounds:
  - my-playground
updatedAt: "2025-01-23"
---

# My Lesson Title

Introduction paragraph that hooks the reader.

## First Section

Your content here. Use these MDX components:

<Callout type="key" title="Key Concept">
Important information the reader must understand.
</Callout>

<Callout type="warning" title="Watch Out">
Common mistakes or pitfalls.
</Callout>

## Key Takeaways

<KeyTakeaways items={[
  "First key point",
  "Second key point",
  "Third key point"
]} />
```

#### Attaching a Lesson to a Module

Modules are defined in `src/lib/modules.ts`. To add your lesson to a module:

1. Open `src/lib/modules.ts`
2. Find the relevant module (or create a new one)
3. Add your lesson slug to the `lessonSlugs` array:

```typescript
{
  id: "ai-fundamentals",
  title: "AI Fundamentals",
  // ... other fields
  lessonSlugs: [
    "intro-to-ai",
    "types-of-ai",
    "my-lesson"  // ← Add here
  ],
}
```

**Lesson ordering**: Lessons appear in the order listed in `lessonSlugs`. First = earliest in the learning path.

#### Creating a New Module

Add a new object to the `modules` array in `src/lib/modules.ts`:

```typescript
{
  id: "my-module",  // kebab-case, unique
  title: "My Module Title",
  description: "What learners will achieve in this module.",
  icon: "🎯",  // Emoji
  color: "#6A2CFF",  // Hex color
  audience: ["learner", "builder"],  // Who it's for
  difficultyRange: ["beginner", "intermediate"],  // [min, max]
  estimatedMinutes: 45,  // Total time for all lessons
  prerequisites: ["ai-fundamentals"],  // Module IDs (optional)
  lessonSlugs: [
    "my-first-lesson",
    "my-second-lesson"
  ],
  isStartHere: false,  // Recommended starting point?
  isFeatured: true,  // Show on landing page?
}
```

---

### 3. Add New Sources to the AI Chatbot

The AI chatbot uses RAG (Retrieval-Augmented Generation) to answer questions. It indexes three types of content:

| Source Type | Location | Indexed Automatically? |
|-------------|----------|------------------------|
| Workshop lessons | `content/demos/*.mdx` | Yes, at runtime |
| Playgrounds | `content/playgrounds/*/config.json` | Yes, at runtime |
| External websites | `src/lib/engine-room-content.ts` | No, requires crawl |

#### How Indexing Works

1. **Internal content** (demos/playgrounds): Indexed automatically when the chat API is called. Content is chunked into ~500 character segments with metadata.

2. **External content**: Pre-crawled and stored in `src/lib/engine-room-content.ts`. This file is generated by the RAG crawler script.

#### Adding Internal Content (Lessons/Playgrounds)

Simply create the content file. It will be automatically indexed:
- Lesson metadata (title, description, tags) is indexed
- Lesson body content is chunked and indexed
- Playground descriptions and code are indexed

**No additional configuration needed** for internal content.

#### Adding a New External Source

External sources are configured in `scripts/rag-config.json`.

1. Add a new entry to the `sources` array:

```json
{
  "sources": [
    {
      "name": "my-source",
      "baseUrl": "https://example.org",
      "startUrls": ["https://example.org/docs/"],
      "depth": 2,
      "category": "docs",
      "useBrowser": false,
      "includePatterns": ["/docs/"],
      "excludePatterns": ["/author/", "#"],
      "selectors": {
        "title": "h1, .page-title",
        "content": "main, article, .content",
        "removeSelectors": ["nav", "footer", "script"]
      }
    }
  ]
}
```

2. Test the configuration:

```bash
npm run update-rag:dry
```

3. Run the crawler:

```bash
npm run update-rag
```

This updates `src/lib/engine-room-content.ts` with the crawled content.

#### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `name` | string | Identifier for the source |
| `baseUrl` | string | Base URL for domain matching |
| `startUrls` | string[] | URLs to begin crawling from |
| `depth` | number | How many links deep to crawl (0 = start URLs only) |
| `category` | string | Category tag for the content |
| `useBrowser` | boolean | Use Puppeteer for JavaScript-rendered SPAs |
| `waitForSelector` | string | CSS selector to wait for (when `useBrowser: true`) |
| `includePatterns` | string[] | Only crawl URLs containing these strings |
| `excludePatterns` | string[] | Skip URLs containing these strings |
| `selectors.title` | string | CSS selectors for page title |
| `selectors.content` | string | CSS selectors for main content |
| `selectors.removeSelectors` | string[] | Elements to remove before extraction |

#### Testing the Chatbot

1. Start the dev server: `npm run dev`
2. Go to `/entryway`
3. Ask a question related to your new content
4. Verify the bot cites the new source in its response

---

## Conventions

### ID Naming

- Use **kebab-case** for all IDs: `my-lesson-slug`, `ai-fundamentals`
- IDs must be **unique** within their type (lesson slugs, module IDs, playground slugs)
- Slug must match the folder/filename

### Tag Taxonomy

Use only these 12 high-signal tags. **Do not add new tags** without discussion.

| Tag | Use For |
|-----|---------|
| `ai-fundamentals` | Core AI concepts, intro content |
| `machine-learning` | ML algorithms, training, data |
| `deep-learning` | Neural networks, architectures |
| `llm` | Large language models, prompting |
| `applications` | Real-world AI use cases |
| `responsible-ai` | Ethics, bias, governance, safety |
| `civil-society` | CSO-specific content, advocacy |
| `sustainability` | Environmental impact, green tech |
| `data` | Data practices, responsible data |
| `chatbots` | Conversational AI, bot design |
| `global-perspectives` | Non-Western viewpoints, pluriverse |
| `frontend` | UI development, React, CSS |

**Do not** put difficulty levels in tags. Use the `difficulty` field instead.

### Difficulty Rubric

| Level | Criteria |
|-------|----------|
| **beginner** | No prerequisites. Guided, scaffolded. Introduces concepts. |
| **intermediate** | Assumes familiarity with basics. Decision frameworks, evaluation tools. |
| **advanced** | Requires strong foundation. Complex scenarios, synthesis required. |

### Content Tone Guidelines

- **Non-technical**: Avoid jargon. Define terms on first use.
- **Scannable**: Use headers, bullets, callouts. Short paragraphs.
- **Active voice**: "The model learns" not "Learning is performed by the model"
- **Second person**: "You can configure..." not "Users can configure..."

### Citations and References

At the end of lessons, include a **Resources** section:

```mdx
## Resources

This lesson draws on:

- **[Title](https://url)** — Brief description of the resource
- **[Another Title](https://url)** — Brief description
```

**Do not**:
- Use footnotes
- Link to paywalled content without noting it
- Include affiliate links

---

## Checklist Before Opening a PR

Before submitting content changes:

- [ ] **Build passes**: Run `npm run build` with no errors
- [ ] **Lint passes**: Run `npm run lint` with no errors
- [ ] **IDs are unique**: No duplicate slugs for lessons/playgrounds
- [ ] **Tags are valid**: Only use tags from the [taxonomy](#tag-taxonomy)
- [ ] **Difficulty is set**: Every lesson and playground has a valid difficulty
- [ ] **Module wiring**: If adding a lesson, it's added to a module in `src/lib/modules.ts`
- [ ] **Filters work**: Test the Workshop and Maker filters in the browser
- [ ] **Chatbot cites source**: For new external sources, test that the bot can answer questions from it

### Quick Validation Commands

```bash
# Build (includes TypeScript check)
npm run build

# Lint
npm run lint

# Test external source indexing
npm run update-rag:dry
```

---

## Architecture Overview

```
design-hub-house/
├── content/                    # Content files
│   ├── demos/                  # Workshop lesson MDX files
│   │   └── *.mdx
│   └── playgrounds/            # Maker Studio playgrounds
│       └── {slug}/config.json
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Landing page (House Map)
│   │   ├── entryway/           # AI chatbot room
│   │   ├── workshop/           # Lesson index + [slug] pages
│   │   ├── maker/              # Playground index + [slug] pages
│   │   └── api/chat/           # Chat API route
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── shared/             # Breadcrumbs, TagBadge, etc.
│   │   ├── house/              # House map SVG
│   │   ├── workshop/           # Workshop-specific components
│   │   ├── maker/              # Playground runner (Sandpack)
│   │   └── entryway/           # Chat interface
│   ├── lib/
│   │   ├── content.ts          # Content loading from filesystem
│   │   ├── modules.ts          # Module/Track/Collection definitions
│   │   ├── rag.ts              # RAG indexing and search
│   │   ├── engine-room-content.ts  # Pre-indexed external content
│   │   ├── mdx.tsx             # MDX compilation
│   │   └── rooms.ts            # Room configuration
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── scripts/
│   └── rag-config.json         # External source crawl config
└── public/                     # Static assets
```

### Routes

| Route | Description |
|-------|-------------|
| `/` | House Map landing page |
| `/entryway` | AI chatbot guide |
| `/workshop` | Workshop lessons index |
| `/workshop/[slug]` | Individual lesson page |
| `/maker` | Maker Studio index |
| `/maker/[slug]` | Individual playground |
| `/api/chat` | Streaming chat API |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | No* | API key for Claude AI chatbot |

*The app works without an API key, but the AI chatbot will show a fallback message.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS 4, shadcn/ui (Radix primitives)
- **AI**: Anthropic Claude via Vercel AI SDK
- **Code Playground**: Sandpack (CodeSandbox)
- **Content**: MDX with gray-matter for frontmatter
- **Animation**: Framer Motion

---

## Deploying on Vercel

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com/new)
3. Add environment variables: `ANTHROPIC_API_KEY` (optional)
4. Deploy

Default build settings work out of the box.

---

## License

MIT
