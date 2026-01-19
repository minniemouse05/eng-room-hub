# Design Hub House

An interactive learning hub for design systems, tools, and code. Users explore a virtual "house" with three rooms: an AI-powered Entryway guide, a Workshop with tool demos, and a Maker Studio with interactive coding playgrounds.

## Architecture Overview

```
design-hub-house/
├── content/                    # Content files (MDX demos, playground configs)
│   ├── demos/                  # MDX files for tool demos
│   │   └── *.mdx              # Each file is a demo with frontmatter
│   └── playgrounds/           # Playground configurations
│       └── [slug]/            # Each folder is a playground
│           ├── config.json    # Playground metadata and file contents
│           └── *.tsx/*.css    # Optional external files
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # House Map landing page
│   │   ├── entryway/          # AI chatbot room
│   │   ├── workshop/          # Tool demos index + [slug]
│   │   ├── maker/             # Playgrounds index + [slug]
│   │   └── api/chat/          # Chat API route
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── shared/            # Shared components (Breadcrumbs, TagBadge, etc.)
│   │   ├── house/             # House map components
│   │   ├── workshop/          # Workshop-specific components
│   │   ├── maker/             # Maker studio components
│   │   └── entryway/          # Chat interface components
│   ├── lib/                   # Utilities
│   │   ├── content.ts         # Content loading functions
│   │   ├── mdx.tsx            # MDX rendering
│   │   ├── rag.ts             # RAG indexing and search
│   │   ├── rooms.ts           # Room configuration
│   │   └── utils.ts           # General utilities
│   └── types/                 # TypeScript types
└── public/                    # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd design-hub-house

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Add your Anthropic API key to .env.local (optional, for AI chat)
# ANTHROPIC_API_KEY=your_key_here

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | No* | Anthropic API key for the AI chatbot. Without it, the chat will show a helpful fallback message. |

*The app works without an API key, but the AI chatbot will be limited.

## Adding Content

### Adding a Demo (MDX)

1. Create a new file in `content/demos/` with the `.mdx` extension:

```mdx
---
title: Your Demo Title
description: A brief description of what this demo covers.
tags:
  - tag1
  - tag2
difficulty: beginner | intermediate | advanced
timeMinutes: 20
relatedPlaygrounds:
  - playground-slug
updatedAt: "2024-01-15"
---

# Your Content Here

Write your demo content using Markdown and MDX.

## Code Examples

\`\`\`tsx
function Example() {
  return <div>Hello World</div>;
}
\`\`\`
```

2. The demo will automatically appear in the Workshop.

### Adding a Playground

1. Create a new folder in `content/playgrounds/` with your playground slug:

```
content/playgrounds/my-playground/
├── config.json
```

2. Create `config.json` with the following structure:

```json
{
  "slug": "my-playground",
  "title": "My Playground Title",
  "description": "What users will build in this playground.",
  "tags": ["react", "components"],
  "stack": "react",
  "relatedDemos": ["demo-slug"],
  "remixIdeas": [
    "Idea 1 for extending the playground",
    "Idea 2"
  ],
  "files": [
    {
      "path": "/App.tsx",
      "code": "import React from 'react';\n\nexport default function App() {\n  return <div>Hello World</div>;\n}"
    },
    {
      "path": "/styles.css",
      "code": "body { font-family: sans-serif; }"
    }
  ]
}
```

3. The playground will automatically appear in the Maker Studio.

### Content Field Reference

#### Demo Frontmatter

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Demo title |
| `description` | string | Yes | Brief description |
| `tags` | string[] | Yes | Topic tags for filtering |
| `difficulty` | `beginner` \| `intermediate` \| `advanced` | Yes | Skill level |
| `timeMinutes` | number | Yes | Estimated reading time |
| `relatedPlaygrounds` | string[] | No | Playground slugs to link |
| `updatedAt` | string | Yes | Last update date (YYYY-MM-DD) |

#### Playground Config

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | Yes | URL-safe identifier |
| `title` | string | Yes | Playground title |
| `description` | string | Yes | What users will build |
| `tags` | string[] | Yes | Topic tags for filtering |
| `stack` | `js` \| `ts` \| `react` | Yes | Technology stack |
| `relatedDemos` | string[] | No | Demo slugs to link |
| `remixIdeas` | string[] | No | Suggestions for extending |
| `files` | array | Yes | Files for the sandbox |

## How RAG Indexing Works

The AI chatbot uses Retrieval-Augmented Generation (RAG) to answer questions about the hub's content:

1. **Indexing**: When the chat API is first called, all demos and playgrounds are indexed:
   - Demo content is chunked into ~500 character segments
   - Playground metadata and code are similarly processed
   - Each chunk includes source metadata (type, slug, title)

2. **Search**: When a user asks a question:
   - The query is tokenized and matched against indexed chunks
   - Simple TF-IDF-like scoring ranks relevance
   - Top 5 most relevant chunks are retrieved

3. **Context Building**: Retrieved chunks are formatted into context:
   - Grouped by source (demo or playground)
   - Links to source pages are included
   - Context is injected into the system prompt

4. **Response**: The AI model generates a response:
   - Uses the context to provide accurate information
   - Includes links to relevant pages
   - Cites sources when appropriate

### Updating External RAG Content

The RAG system includes pre-indexed content from external sources (e.g., The Engine Room website, OrgSec Wiki). Use the update script to refresh this content:

```bash
# Preview what will be crawled (dry run)
npm run update-rag:dry

# Crawl all sources and update the content file
npm run update-rag
```

#### Configuration

Edit `scripts/rag-config.json` to configure sources:

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

#### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `name` | string | Identifier for the source |
| `baseUrl` | string | Base URL for domain matching |
| `startUrls` | string[] | URLs to begin crawling from |
| `depth` | number | How many links deep to crawl (0 = start URLs only) |
| `category` | string | Category tag for the content |
| `useBrowser` | boolean | Use Puppeteer for JavaScript-rendered SPAs |
| `waitForSelector` | string | CSS selector to wait for before extraction (when `useBrowser: true`) |
| `includePatterns` | string[] | Only crawl URLs containing these strings (empty = all) |
| `excludePatterns` | string[] | Skip URLs containing these strings |
| `selectors.title` | string | CSS selectors for page title (comma-separated) |
| `selectors.content` | string | CSS selectors for main content (comma-separated) |
| `selectors.removeSelectors` | string[] | Elements to remove before extraction |

#### Adding a New Source

1. Add a new entry to the `sources` array in `scripts/rag-config.json`
2. Set `useBrowser: true` if the site is a JavaScript SPA (React, Vue, etc.)
3. Run `npm run update-rag:dry` to test the configuration
4. Run `npm run update-rag` to generate the updated content file

#### Global Crawl Options

```json
{
  "crawlOptions": {
    "delayMs": 1500,
    "maxPagesPerSource": 50,
    "timeout": 60000,
    "userAgent": "RAG-Content-Crawler/1.0"
  }
}
```

| Option | Description |
|--------|-------------|
| `delayMs` | Delay between requests (rate limiting) |
| `maxPagesPerSource` | Maximum pages to crawl per source |
| `timeout` | Request timeout in milliseconds |
| `userAgent` | User-Agent header for requests |

### Upgrading to Vector Search

For production with larger content, consider:

1. **pgvector (Recommended for Vercel)**:
   - Add Vercel Postgres with pgvector extension
   - Generate embeddings using OpenAI or Anthropic
   - Replace `searchContent` with vector similarity search

2. **Pinecone/Weaviate**:
   - Use a dedicated vector database
   - Better scalability for large content libraries

## Deploying on Vercel

1. Push your code to GitHub

2. Import the project on [Vercel](https://vercel.com/new)

3. Add environment variables:
   - `ANTHROPIC_API_KEY` (optional)

4. Deploy!

The app is fully compatible with Vercel's Edge Runtime and serverless functions.

### Build Configuration

The default settings work out of the box:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **Code Playground**: Sandpack (CodeSandbox)
- **AI**: Anthropic Claude (via Vercel AI SDK)
- **Content**: MDX with gray-matter

## Project Structure

### Routes

| Route | Description |
|-------|-------------|
| `/` | House Map landing page |
| `/entryway` | AI chatbot guide |
| `/workshop` | Tool demos index |
| `/workshop/[slug]` | Individual demo page |
| `/maker` | Playgrounds index |
| `/maker/[slug]` | Individual playground |
| `/api/chat` | Chat API endpoint |

### Key Components

- `HouseMap`: Interactive SVG house with clickable rooms
- `ChatInterface`: AI chat with streaming responses
- `PlaygroundRunner`: Sandpack-powered code editor
- `Breadcrumbs`: Navigation with house metaphor
- `FilterBar`: Tag, difficulty, and sort controls

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Update RAG content from external sources
npm run update-rag

# Preview RAG crawl without writing files
npm run update-rag:dry
```

## License

MIT
