import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Demo, DemoFrontmatter, PlaygroundConfig } from '@/types';

const DEMOS_PATH = path.join(process.cwd(), 'content/demos');
const PLAYGROUNDS_PATH = path.join(process.cwd(), 'content/playgrounds');

// Get all demo files
export function getAllDemoSlugs(): string[] {
  if (!fs.existsSync(DEMOS_PATH)) return [];
  return fs
    .readdirSync(DEMOS_PATH)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

// Get a single demo by slug
export function getDemoBySlug(slug: string): Demo | null {
  const filePath = path.join(DEMOS_PATH, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug,
    content,
    ...(data as DemoFrontmatter),
  };
}

// Get all demos with frontmatter
export function getAllDemos(): Demo[] {
  const slugs = getAllDemoSlugs();
  return slugs
    .map((slug) => getDemoBySlug(slug))
    .filter((demo): demo is Demo => demo !== null)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

// Get unique tags from all demos
export function getAllDemoTags(): string[] {
  const demos = getAllDemos();
  const tags = new Set<string>();
  demos.forEach((demo) => {
    demo.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

// Get all playground slugs
export function getAllPlaygroundSlugs(): string[] {
  if (!fs.existsSync(PLAYGROUNDS_PATH)) return [];
  return fs
    .readdirSync(PLAYGROUNDS_PATH)
    .filter((dir) => {
      const configPath = path.join(PLAYGROUNDS_PATH, dir, 'config.json');
      return fs.existsSync(configPath);
    });
}

// Get a single playground by slug
export function getPlaygroundBySlug(slug: string): PlaygroundConfig | null {
  const configPath = path.join(PLAYGROUNDS_PATH, slug, 'config.json');
  if (!fs.existsSync(configPath)) return null;

  const configContent = fs.readFileSync(configPath, 'utf-8');
  const config = JSON.parse(configContent) as PlaygroundConfig;

  // Load all files for the playground
  const playgroundDir = path.join(PLAYGROUNDS_PATH, slug);
  const files: PlaygroundConfig['files'] = [];

  // Read files specified in config or default to index file
  if (config.files && config.files.length > 0) {
    config.files.forEach((file) => {
      const filePath = path.join(playgroundDir, file.path);
      if (fs.existsSync(filePath)) {
        files.push({
          path: file.path,
          code: fs.readFileSync(filePath, 'utf-8'),
        });
      } else {
        // Use code from config if file doesn't exist
        files.push(file);
      }
    });
  }

  return {
    ...config,
    files,
  };
}

// Get all playgrounds
export function getAllPlaygrounds(): PlaygroundConfig[] {
  const slugs = getAllPlaygroundSlugs();
  return slugs
    .map((slug) => getPlaygroundBySlug(slug))
    .filter((playground): playground is PlaygroundConfig => playground !== null);
}

// Get unique tags from all playgrounds
export function getAllPlaygroundTags(): string[] {
  const playgrounds = getAllPlaygrounds();
  const tags = new Set<string>();
  playgrounds.forEach((playground) => {
    playground.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

// Get related demos by tag overlap
export function getRelatedDemos(currentSlug: string, tags: string[], limit = 3): Demo[] {
  const allDemos = getAllDemos();
  return allDemos
    .filter((demo) => demo.slug !== currentSlug)
    .map((demo) => ({
      demo,
      overlap: demo.tags.filter((tag) => tags.includes(tag)).length,
    }))
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ demo }) => demo);
}

// Get related playgrounds by slug list
export function getRelatedPlaygrounds(slugs: string[]): PlaygroundConfig[] {
  return slugs
    .map((slug) => getPlaygroundBySlug(slug))
    .filter((playground): playground is PlaygroundConfig => playground !== null);
}

// Filter and search demos
export function filterDemos(
  demos: Demo[],
  search: string,
  tags: string[],
  difficulty?: DemoFrontmatter['difficulty']
): Demo[] {
  return demos.filter((demo) => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        demo.title.toLowerCase().includes(searchLower) ||
        demo.description.toLowerCase().includes(searchLower) ||
        demo.tags.some((tag) => tag.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Tag filter
    if (tags.length > 0) {
      const hasMatchingTag = tags.some((tag) => demo.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    // Difficulty filter
    if (difficulty && demo.difficulty !== difficulty) {
      return false;
    }

    return true;
  });
}

// Filter and search playgrounds
export function filterPlaygrounds(
  playgrounds: PlaygroundConfig[],
  search: string,
  tags: string[],
  stack?: PlaygroundConfig['stack']
): PlaygroundConfig[] {
  return playgrounds.filter((playground) => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        playground.title.toLowerCase().includes(searchLower) ||
        playground.description.toLowerCase().includes(searchLower) ||
        playground.tags.some((tag) => tag.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Tag filter
    if (tags.length > 0) {
      const hasMatchingTag = tags.some((tag) => playground.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    // Stack filter
    if (stack && playground.stack !== stack) {
      return false;
    }

    return true;
  });
}
