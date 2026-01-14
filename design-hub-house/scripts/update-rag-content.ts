#!/usr/bin/env npx tsx

/**
 * RAG Content Update Script
 *
 * Crawls configured URLs and generates TypeScript content files for the RAG system.
 * Supports both static HTML pages and JavaScript-rendered SPAs via Puppeteer.
 *
 * Usage:
 *   npx tsx scripts/update-rag-content.ts
 *   npx tsx scripts/update-rag-content.ts --config ./custom-config.json
 *   npx tsx scripts/update-rag-content.ts --dry-run
 */

import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import puppeteer, { Browser, Page } from 'puppeteer';

// Types
interface SourceConfig {
  name: string;
  baseUrl: string;
  startUrls: string[];
  depth: number;
  category: string;
  useBrowser?: boolean; // Use Puppeteer for JavaScript-rendered pages
  waitForSelector?: string; // Wait for this selector before extracting content
  includePatterns?: string[];
  excludePatterns?: string[];
  selectors: {
    title: string;
    content: string;
    removeSelectors?: string[];
  };
}

interface RagConfig {
  sources: SourceConfig[];
  output: {
    path: string;
    format: 'typescript' | 'json';
  };
  crawlOptions: {
    delayMs: number;
    maxPagesPerSource: number;
    timeout: number;
    userAgent: string;
  };
}

interface CrawledPage {
  url: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  sourceName: string;
}

// Browser manager for Puppeteer
let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserInstance) {
    console.log('  Launching headless browser...');
    browserInstance = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browserInstance;
}

async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

// CLI argument parsing
function parseArgs(): { configPath: string; dryRun: boolean; verbose: boolean } {
  const args = process.argv.slice(2);
  let configPath = path.join(__dirname, 'rag-config.json');
  let dryRun = false;
  let verbose = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--config' && args[i + 1]) {
      configPath = path.resolve(args[++i]);
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    } else if (args[i] === '--verbose' || args[i] === '-v') {
      verbose = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
RAG Content Update Script

Usage:
  npx tsx scripts/update-rag-content.ts [options]

Options:
  --config <path>   Path to config file (default: ./scripts/rag-config.json)
  --dry-run         Preview what would be crawled without writing files
  --verbose, -v     Show detailed output
  --help, -h        Show this help message

Example:
  npx tsx scripts/update-rag-content.ts --config ./my-config.json --verbose
`);
      process.exit(0);
    }
  }

  return { configPath, dryRun, verbose };
}

// Load configuration
function loadConfig(configPath: string): RagConfig {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }
  const content = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(content);
}

// URL utilities
function normalizeUrl(url: string, baseUrl: string): string {
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return '';
  }
}

function urlToSlug(url: string): string {
  return new URL(url).pathname
    .replace(/^\/|\/$/g, '')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]/gi, '-')
    .replace(/-+/g, '-')
    .toLowerCase() || 'home';
}

function matchesPatterns(url: string, patterns: string[]): boolean {
  return patterns.some((pattern) => url.includes(pattern));
}

function isSameDomain(url: string, baseUrl: string): boolean {
  try {
    const urlHost = new URL(url).host;
    const baseHost = new URL(baseUrl).host;
    return urlHost === baseHost;
  } catch {
    return false;
  }
}

// Delay utility
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fetch with timeout (for static pages)
async function fetchWithTimeout(
  url: string,
  timeout: number,
  userAgent: string
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': userAgent,
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeoutId);
  }
}

// Fetch with Puppeteer (for JavaScript-rendered pages)
async function fetchWithBrowser(
  url: string,
  timeout: number,
  waitForSelector?: string
): Promise<string> {
  const browser = await getBrowser();
  const page: Page = await browser.newPage();

  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout,
    });

    // Wait for content to render
    if (waitForSelector) {
      await page.waitForSelector(waitForSelector, { timeout: timeout / 2 });
    } else {
      // Default: wait a bit for SPA to render
      await delay(2000);
    }

    // Get the fully rendered HTML
    const html = await page.content();
    return html;
  } finally {
    await page.close();
  }
}

// Extract content from HTML
function extractContent(
  html: string,
  selectors: SourceConfig['selectors']
): { title: string; content: string; links: string[] } {
  const $ = cheerio.load(html);

  // Remove unwanted elements
  if (selectors.removeSelectors) {
    selectors.removeSelectors.forEach((sel) => $(sel).remove());
  }

  // Extract title
  let title = '';
  for (const sel of selectors.title.split(',').map((s) => s.trim())) {
    const el = $(sel).first();
    if (el.length) {
      title = el.text().trim();
      break;
    }
  }

  // Extract main content
  let content = '';
  for (const sel of selectors.content.split(',').map((s) => s.trim())) {
    const el = $(sel).first();
    if (el.length) {
      // Get text content, preserving some structure
      content = el
        .text()
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();
      break;
    }
  }

  // Extract links for crawling
  const links: string[] = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
      links.push(href);
    }
  });

  return { title, content, links };
}

// Generate tags from content
function generateTags(title: string, content: string, url: string): string[] {
  const tags = new Set<string>();

  // Extract tags from URL path
  const pathParts = new URL(url).pathname.split('/').filter(Boolean);
  pathParts.forEach((part) => {
    if (part.length > 2 && part.length < 20) {
      tags.add(part.replace(/-/g, ' ').toLowerCase());
    }
  });

  // Common keywords to look for
  const keywords = [
    'research',
    'support',
    'services',
    'report',
    'library',
    'about',
    'mission',
    'values',
    'security',
    'data',
    'technology',
    'civil society',
    'social justice',
    'digital rights',
    'privacy',
    'organizational security',
    'risk assessment',
    'threat',
    'password',
    'encryption',
  ];

  const lowerContent = (title + ' ' + content).toLowerCase();
  keywords.forEach((keyword) => {
    if (lowerContent.includes(keyword)) {
      tags.add(keyword);
    }
  });

  return Array.from(tags).slice(0, 8);
}

// Crawl a single source
async function crawlSource(
  source: SourceConfig,
  options: RagConfig['crawlOptions'],
  verbose: boolean
): Promise<CrawledPage[]> {
  const pages: CrawledPage[] = [];
  const visited = new Set<string>();
  const queue: Array<{ url: string; depth: number }> = [];

  // Initialize queue with start URLs
  source.startUrls.forEach((url) => {
    queue.push({ url: normalizeUrl(url, source.baseUrl), depth: 0 });
  });

  console.log(`\nCrawling source: ${source.name}`);
  console.log(`  Start URLs: ${source.startUrls.length}`);
  console.log(`  Max depth: ${source.depth}`);
  console.log(`  Using browser: ${source.useBrowser ? 'yes' : 'no'}`);

  while (queue.length > 0 && pages.length < options.maxPagesPerSource) {
    const { url, depth } = queue.shift()!;

    // Skip if already visited or invalid
    if (!url || visited.has(url)) continue;
    visited.add(url);

    // Check domain
    if (!isSameDomain(url, source.baseUrl)) continue;

    // Check include/exclude patterns (empty includePatterns = include all)
    if (source.includePatterns && source.includePatterns.length > 0 && !matchesPatterns(url, source.includePatterns)) {
      if (verbose) console.log(`  Skipping (no include match): ${url}`);
      continue;
    }
    if (source.excludePatterns && matchesPatterns(url, source.excludePatterns)) {
      if (verbose) console.log(`  Skipping (exclude match): ${url}`);
      continue;
    }

    try {
      if (verbose) console.log(`  Fetching: ${url} (depth ${depth})`);
      else process.stdout.write('.');

      // Use browser or simple fetch based on config
      let html: string;
      if (source.useBrowser) {
        html = await fetchWithBrowser(url, options.timeout, source.waitForSelector);
      } else {
        html = await fetchWithTimeout(url, options.timeout, options.userAgent);
      }

      const { title, content, links } = extractContent(html, source.selectors);

      if (title && content && content.length > 100) {
        const slug = urlToSlug(url);
        const tags = generateTags(title, content, url);

        pages.push({
          url,
          slug,
          title,
          content,
          category: source.category,
          tags,
          sourceName: source.name,
        });

        if (verbose) console.log(`    -> Extracted: "${title}" (${content.length} chars)`);
      } else if (verbose) {
        console.log(`    -> Skipped: title="${title}", content length=${content.length}`);
      }

      // Add discovered links to queue if within depth
      if (depth < source.depth) {
        links.forEach((link) => {
          const normalizedLink = normalizeUrl(link, url);
          if (normalizedLink && !visited.has(normalizedLink)) {
            queue.push({ url: normalizedLink, depth: depth + 1 });
          }
        });
      }

      // Rate limiting
      await delay(options.delayMs);
    } catch (error) {
      if (verbose) {
        console.log(`  Error fetching ${url}: ${error instanceof Error ? error.message : error}`);
      }
    }
  }

  console.log(`\n  Crawled ${pages.length} pages from ${source.name}`);
  return pages;
}

// Generate TypeScript output
function generateTypeScriptOutput(pages: CrawledPage[]): string {
  const categories = [...new Set(pages.map((p) => p.category))];

  let output = `/**
 * Pre-indexed content from external sources
 * This content is used by the RAG system to answer questions.
 *
 * Generated by: npx tsx scripts/update-rag-content.ts
 * Last updated: ${new Date().toISOString().split('T')[0]}
 * Total pages: ${pages.length}
 */

export interface EngineRoomPage {
  slug: string;
  title: string;
  url: string;
  category: ${categories.map((c) => `'${c}'`).join(' | ')};
  content: string;
  tags: string[];
}

export const engineRoomContent: EngineRoomPage[] = [
`;

  for (const page of pages) {
    const escapedContent = page.content
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$');

    output += `  {
    slug: '${page.slug}',
    title: '${page.title.replace(/'/g, "\\'")}',
    url: '${page.url}',
    category: '${page.category}',
    tags: [${page.tags.map((t) => `'${t.replace(/'/g, "\\'")}'`).join(', ')}],
    content: \`${escapedContent}\`,
  },
`;
  }

  output += `];

// Helper to get all Engine Room content
export function getAllEngineRoomContent(): EngineRoomPage[] {
  return engineRoomContent;
}

// Helper to get content by category
export function getEngineRoomContentByCategory(category: EngineRoomPage['category']): EngineRoomPage[] {
  return engineRoomContent.filter(page => page.category === category);
}

// Helper to search Engine Room content
export function searchEngineRoomContent(query: string): EngineRoomPage[] {
  const queryLower = query.toLowerCase();
  return engineRoomContent.filter(page =>
    page.title.toLowerCase().includes(queryLower) ||
    page.content.toLowerCase().includes(queryLower) ||
    page.tags.some(tag => tag.toLowerCase().includes(queryLower))
  );
}
`;

  return output;
}

// Generate JSON output
function generateJsonOutput(pages: CrawledPage[]): string {
  return JSON.stringify(pages, null, 2);
}

// Main function
async function main() {
  const { configPath, dryRun, verbose } = parseArgs();

  console.log('RAG Content Update Script');
  console.log('=========================');
  console.log(`Config: ${configPath}`);
  console.log(`Dry run: ${dryRun}`);
  console.log(`Verbose: ${verbose}`);

  const config = loadConfig(configPath);
  const allPages: CrawledPage[] = [];

  try {
    // Crawl all sources
    for (const source of config.sources) {
      const pages = await crawlSource(source, config.crawlOptions, verbose);
      allPages.push(...pages);
    }

    console.log(`\nTotal pages crawled: ${allPages.length}`);

    if (dryRun) {
      console.log('\nDry run - would generate file with:');
      allPages.forEach((p) => console.log(`  - ${p.title} (${p.url})`));
      return;
    }

    // Generate output
    const outputPath = path.resolve(process.cwd(), config.output.path);
    let output: string;

    if (config.output.format === 'typescript') {
      output = generateTypeScriptOutput(allPages);
    } else {
      output = generateJsonOutput(allPages);
    }

    // Write file
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, output, 'utf-8');

    console.log(`\nOutput written to: ${outputPath}`);
    console.log('Done!');
  } finally {
    // Always close browser if it was opened
    await closeBrowser();
  }
}

main().catch((error) => {
  console.error('Error:', error);
  closeBrowser().finally(() => process.exit(1));
});
