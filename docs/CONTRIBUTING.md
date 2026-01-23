# Contributing to Design Hub House

This guide provides detailed conventions and workflows for contributors. For quick-start instructions, see the main [README.md](../README.md).

## Table of Contents

- [Content Structure](#content-structure)
- [MDX Components](#mdx-components)
- [Common Pitfalls](#common-pitfalls)
- [TypeScript Interfaces](#typescript-interfaces)
- [Testing Your Changes](#testing-your-changes)

---

## Content Structure

### Workshop Lessons (Demos)

Workshop lessons are educational MDX files that explain concepts. They live in `content/demos/`.

**Naming convention**: Use kebab-case that describes the topic: `what-is-machine-learning.mdx`, `neural-networks-building-blocks.mdx`

**Frontmatter example with all fields**:

```yaml
---
title: What is Machine Learning?
description: Learn how machines learn from data without explicit programming.
tags:
  - machine-learning
  - ai-fundamentals
difficulty: beginner
timeMinutes: 12
relatedPlaygrounds:
  - teach-the-machine
  - algorithm-matcher
updatedAt: "2025-01-23"
---
```

### Maker Studio Playgrounds

Playgrounds are interactive code sandboxes. Each playground lives in its own folder under `content/playgrounds/`.

**Folder structure**:
```
content/playgrounds/my-playground/
└── config.json    # Required: metadata and file contents
```

**Config.json example with all fields**:

```json
{
  "slug": "my-playground",
  "title": "My Playground",
  "description": "Learn X by building Y.",
  "tags": ["ai-fundamentals"],
  "difficulty": "beginner",
  "stack": "react",
  "relatedDemos": ["intro-to-ai"],
  "hideCode": false,
  "remixIdeas": [
    "Add feature A",
    "Try approach B"
  ],
  "files": [
    {
      "path": "/App.tsx",
      "code": "export default function App() {\n  return <div>Hello</div>;\n}"
    }
  ]
}
```

**Stack options**:
- `react` - React with TypeScript (most common)
- `ts` - Plain TypeScript
- `js` - Plain JavaScript
- `css` - CSS-focused (still uses HTML/JS)
- `ai` - AI-related playground (uses React)

### Modules, Tracks, and Collections

Defined in `src/lib/modules.ts`:

- **Module**: Ordered sequence of lessons on a topic (e.g., "AI Fundamentals")
- **Track**: Learning path combining multiple modules for an audience (e.g., "Learner Track")
- **Collection**: Thematic grouping across modules (e.g., "Ethics & Safety")

---

## MDX Components

These components are available in all lesson MDX files:

### Callout

Highlight important information:

```mdx
<Callout type="key" title="Key Concept">
The most important thing to understand.
</Callout>

<Callout type="warning" title="Watch Out">
A common mistake or pitfall.
</Callout>

<Callout type="tip" title="Pro Tip">
Helpful but optional information.
</Callout>

<Callout type="example" title="Real Example">
A concrete illustration.
</Callout>

<Callout type="pitfall" title="Common Mistake">
Something that often goes wrong.
</Callout>

<Callout type="checklist" title="Self-Check">
- [ ] Item one
- [ ] Item two
</Callout>
```

### KeyTakeaways

Summary at end of lesson:

```mdx
<KeyTakeaways items={[
  "First key point",
  "Second key point",
  "Third key point"
]} />
```

### ComparisonTable

Side-by-side comparison:

```mdx
<ComparisonTable
  headers={["Approach A", "Approach B"]}
  rows={[
    { label: "Speed", values: ["Fast", "Slow"] },
    { label: "Cost", values: [{ text: "Low", highlight: "good" }, { text: "High", highlight: "bad" }] }
  ]}
/>
```

### StepProcess

Step-by-step instructions:

```mdx
<StepProcess
  title="How to Do X"
  steps={[
    {
      title: "Step One",
      description: "What to do first.",
      action: "Specific task to complete"
    },
    {
      title: "Step Two",
      description: "What to do next.",
      action: "Another specific task"
    }
  ]}
/>
```

### DecisionTree

Interactive decision guide:

```mdx
<DecisionTree
  title="Should you use AI?"
  tree={{
    question: "Is the task well-defined?",
    yes: {
      question: "Do you have quality data?",
      yes: "Consider AI",
      no: "Gather data first"
    },
    no: "Define the problem first"
  }}
/>
```

### QuickNav

Table of contents for longer lessons:

```mdx
<QuickNav items={[
  { label: "Section One", time: "3 min" },
  { label: "Section Two", time: "5 min" }
]} />
```

### TryThis

Link to related playground:

```mdx
<TryThis
  title="Try It Yourself"
  description="Build X in this interactive playground."
  href="/maker/playground-slug"
/>
```

---

## Common Pitfalls

### Duplicate IDs

**Problem**: Two lessons or playgrounds have the same slug.

**Solution**: Each slug must be unique within its type. Check existing content before creating new files.

### Invalid Tags

**Problem**: Using tags not in the taxonomy causes inconsistent filtering.

**Solution**: Only use tags from the [approved list](../README.md#tag-taxonomy). Don't invent new tags.

### Missing Module Wiring

**Problem**: Lesson exists but doesn't appear in any learning path.

**Solution**: Add the lesson slug to a module's `lessonSlugs` array in `src/lib/modules.ts`.

### Forgotten Difficulty

**Problem**: Missing `difficulty` field causes filter issues.

**Solution**: Always include `difficulty: beginner | intermediate | advanced` in frontmatter/config.

### Broken relatedPlaygrounds/relatedDemos Links

**Problem**: Referencing a playground/demo that doesn't exist.

**Solution**: Verify the slug exists before adding it to `relatedPlaygrounds` or `relatedDemos`.

### Code in config.json Formatting

**Problem**: JSON doesn't support multiline strings naturally.

**Solution**: Use `\n` for newlines in code strings:

```json
{
  "code": "function hello() {\n  return 'world';\n}"
}
```

### Forgetting to Update `updatedAt`

**Problem**: Stale dates affect sorting.

**Solution**: Always update `updatedAt` to today's date when modifying a lesson.

---

## TypeScript Interfaces

Reference these when creating content:

### DemoFrontmatter (Lesson)

```typescript
interface DemoFrontmatter {
  title: string;
  description: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeMinutes: number;
  relatedPlaygrounds: string[];
  updatedAt: string;  // "YYYY-MM-DD"
}
```

### PlaygroundConfig

```typescript
interface PlaygroundConfig {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';  // Defaults to 'beginner'
  stack: 'js' | 'ts' | 'react' | 'css' | 'ai';
  relatedDemos: string[];
  files: { path: string; code: string }[];
  remixIdeas?: string[];
  hideCode?: boolean;
}
```

### Module

```typescript
interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;  // Emoji
  color: string;  // Hex color
  audience?: ('learner' | 'builder' | 'leader')[];
  difficultyRange: ['beginner' | 'intermediate' | 'advanced', 'beginner' | 'intermediate' | 'advanced'];
  estimatedMinutes: number;
  prerequisites?: string[];  // Module IDs
  lessonSlugs: string[];
  isStartHere?: boolean;
  isFeatured?: boolean;
}
```

---

## Testing Your Changes

### 1. Build Check

```bash
npm run build
```

This runs TypeScript type checking and builds all pages. Fix any errors before committing.

### 2. Lint Check

```bash
npm run lint
```

Ensure code style is consistent.

### 3. Manual Testing

1. Start dev server: `npm run dev`
2. Navigate to your new content
3. Test the Workshop filters (tags, difficulty, search)
4. Test the Maker filters
5. If adding external RAG source: test chatbot citations

### 4. Checklist

Before opening a PR:

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Content appears correctly in the UI
- [ ] Filters work with new tags/difficulty
- [ ] Related links (playgrounds/demos) work
- [ ] Lesson is wired to a module (if applicable)
- [ ] Chatbot can cite new external sources (if applicable)

---

## Questions?

If you're unsure about conventions or have questions:

1. Check existing content for patterns
2. Look at the TypeScript interfaces in `src/types/index.ts`
3. Ask in the project's issue tracker
