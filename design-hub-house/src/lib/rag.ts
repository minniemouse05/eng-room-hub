import { getAllDemos, getAllPlaygrounds } from './content';
import { ContentChunk } from '@/types';

// Simple text chunking function
function chunkText(text: string, maxChunkSize = 500): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxChunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    currentChunk += sentence + ' ';
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Index all content at build/runtime
export function indexContent(): ContentChunk[] {
  const chunks: ContentChunk[] = [];

  // Index demos
  const demos = getAllDemos();
  for (const demo of demos) {
    // Add title/description chunk
    chunks.push({
      id: `demo-${demo.slug}-meta`,
      content: `${demo.title}: ${demo.description}. Tags: ${demo.tags.join(', ')}. Difficulty: ${demo.difficulty}. Time: ${demo.timeMinutes} minutes.`,
      sourceType: 'demo',
      sourceSlug: demo.slug,
      sourceTitle: demo.title,
      metadata: {
        tags: demo.tags,
        difficulty: demo.difficulty,
        timeMinutes: demo.timeMinutes,
      },
    });

    // Chunk the content
    const contentChunks = chunkText(demo.content);
    contentChunks.forEach((chunk, index) => {
      chunks.push({
        id: `demo-${demo.slug}-${index}`,
        content: chunk,
        sourceType: 'demo',
        sourceSlug: demo.slug,
        sourceTitle: demo.title,
        metadata: {
          chunkIndex: index,
          totalChunks: contentChunks.length,
        },
      });
    });
  }

  // Index playgrounds
  const playgrounds = getAllPlaygrounds();
  for (const playground of playgrounds) {
    // Add title/description chunk
    chunks.push({
      id: `playground-${playground.slug}-meta`,
      content: `${playground.title}: ${playground.description}. Tags: ${playground.tags.join(', ')}. Stack: ${playground.stack}.`,
      sourceType: 'playground',
      sourceSlug: playground.slug,
      sourceTitle: playground.title,
      metadata: {
        tags: playground.tags,
        stack: playground.stack,
      },
    });

    // Add remix ideas if present
    if (playground.remixIdeas && playground.remixIdeas.length > 0) {
      chunks.push({
        id: `playground-${playground.slug}-remix`,
        content: `Remix ideas for ${playground.title}: ${playground.remixIdeas.join('. ')}`,
        sourceType: 'playground',
        sourceSlug: playground.slug,
        sourceTitle: playground.title,
        metadata: { type: 'remix-ideas' },
      });
    }

    // Add code snippets as searchable content
    for (const file of playground.files) {
      const codeChunks = chunkText(file.code, 300);
      codeChunks.forEach((chunk, index) => {
        chunks.push({
          id: `playground-${playground.slug}-${file.path}-${index}`,
          content: `Code from ${playground.title} (${file.path}): ${chunk}`,
          sourceType: 'playground',
          sourceSlug: playground.slug,
          sourceTitle: playground.title,
          metadata: {
            filePath: file.path,
            chunkIndex: index,
          },
        });
      });
    }
  }

  return chunks;
}

// Simple BM25-like text search (no external dependencies)
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function calculateScore(query: string, document: string): number {
  const queryTokens = tokenize(query);
  const docTokens = tokenize(document);

  if (queryTokens.length === 0 || docTokens.length === 0) return 0;

  // Simple TF-IDF-like scoring
  let score = 0;
  const docTokenSet = new Set(docTokens);

  for (const queryToken of queryTokens) {
    if (docTokenSet.has(queryToken)) {
      // Term frequency in document
      const tf = docTokens.filter((t) => t === queryToken).length / docTokens.length;
      score += tf;
    }

    // Check for partial matches
    for (const docToken of docTokenSet) {
      if (docToken.includes(queryToken) || queryToken.includes(docToken)) {
        score += 0.5;
      }
    }
  }

  return score;
}

// Search for relevant chunks
export function searchContent(
  query: string,
  chunks: ContentChunk[],
  topK = 5
): ContentChunk[] {
  const scoredChunks = chunks.map((chunk) => ({
    chunk,
    score: calculateScore(query, chunk.content),
  }));

  // Sort by score descending and return top K
  return scoredChunks
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(({ chunk }) => chunk);
}

// Format context for the LLM
export function formatContext(chunks: ContentChunk[]): string {
  if (chunks.length === 0) {
    return 'No relevant content found in the Design Hub.';
  }

  const grouped: Record<string, ContentChunk[]> = {};

  for (const chunk of chunks) {
    const key = `${chunk.sourceType}:${chunk.sourceSlug}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(chunk);
  }

  let context = 'Relevant content from the Design Hub:\n\n';

  for (const [key, groupChunks] of Object.entries(grouped)) {
    const [type, slug] = key.split(':');
    const title = groupChunks[0].sourceTitle;
    const typeName = type === 'demo' ? 'Demo' : 'Playground';
    const link = type === 'demo' ? `/workshop/${slug}` : `/maker/${slug}`;

    context += `### ${typeName}: ${title}\n`;
    context += `Link: ${link}\n`;
    context += groupChunks.map((c) => c.content).join('\n');
    context += '\n\n';
  }

  return context;
}

// Extract unique sources for citations
export function extractSources(
  chunks: ContentChunk[]
): Array<{ type: 'demo' | 'playground'; slug: string; title: string }> {
  const seen = new Set<string>();
  const sources: Array<{ type: 'demo' | 'playground'; slug: string; title: string }> = [];

  for (const chunk of chunks) {
    const key = `${chunk.sourceType}:${chunk.sourceSlug}`;
    if (!seen.has(key)) {
      seen.add(key);
      sources.push({
        type: chunk.sourceType,
        slug: chunk.sourceSlug,
        title: chunk.sourceTitle,
      });
    }
  }

  return sources;
}
