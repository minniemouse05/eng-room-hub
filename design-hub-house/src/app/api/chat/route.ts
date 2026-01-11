import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { indexContent, searchContent, formatContext, extractSources } from '@/lib/rag';

// Simple rate limiting using in-memory store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

// Index content once (will be cached per serverless instance)
let contentIndex: ReturnType<typeof indexContent> | null = null;

function getContentIndex() {
  if (!contentIndex) {
    contentIndex = indexContent();
  }
  return contentIndex;
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(ip)) {
      return new Response('Rate limit exceeded. Please try again later.', { status: 429 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Invalid request: messages array required', { status: 400 });
    }

    // Get the latest user message for context retrieval
    const lastUserMessage = messages
      .filter((m: { role: string }) => m.role === 'user')
      .pop();
    if (!lastUserMessage) {
      return new Response('No user message found', { status: 400 });
    }

    // Extract text content from the message
    const userText =
      typeof lastUserMessage.content === 'string'
        ? lastUserMessage.content
        : Array.isArray(lastUserMessage.content)
          ? lastUserMessage.content
              .filter((p: { type: string }) => p.type === 'text')
              .map((p: { text: string }) => p.text)
              .join(' ')
          : '';

    // Search for relevant content
    const index = getContentIndex();
    const relevantChunks = searchContent(userText, index, 5);
    const context = formatContext(relevantChunks);
    const sources = extractSources(relevantChunks);

    // Format sources for the response
    const sourcesText =
      sources.length > 0
        ? '\n\n**Sources:**\n' +
          sources
            .map((s) => {
              if (s.type === 'engine-room') {
                return `- [${s.title}](${s.url || 'https://www.theengineroom.org/'})`;
              }
              return `- [${s.title}](${s.type === 'demo' ? '/workshop/' : '/maker/'}${s.slug})`;
            })
            .join('\n')
        : '';

    // System prompt for the chatbot
    const systemPrompt = `You are a friendly and knowledgeable guide for the Design Hub House, an interactive learning platform for design systems and development. You also have knowledge about The Engine Room, a nonprofit organization supporting civil society to use technology and data strategically and responsibly.

Your role is to:
1. Answer questions about the demos and playgrounds available in the hub
2. Help users find relevant content based on their learning goals
3. Explain concepts covered in the demos
4. Suggest what to explore next based on user interests
5. Answer questions about The Engine Room organization, their services, programs (like MATCHBOX and LITS), and their library of resources

Guidelines:
- Be helpful, concise, and friendly
- Always reference specific demos, playgrounds, or Engine Room resources when relevant
- If you can't find relevant content, be honest and suggest browsing the Workshop, Maker Studio, or The Engine Room website
- Include links to relevant pages when mentioning demos, playgrounds, or Engine Room articles
- Keep responses focused and actionable
- For Engine Room content, use the external URLs provided to link to their website

Available content context:
${context}

When you reference a demo or playground in your response, always include the markdown link so users can navigate directly. For Engine Room content, use the full URL to link to their website.

${sources.length > 0 ? `Available sources to cite: ${JSON.stringify(sources)}` : 'No directly relevant sources found for this query.'}`;

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      // Return a helpful message if no API key
      return new Response(
        JSON.stringify({
          role: 'assistant',
          content: `I'd love to help you explore the Design Hub! However, the AI chat feature requires an Anthropic API key to be configured.

**In the meantime, you can:**
- Browse the [Workshop](/workshop) to see all available demos
- Explore the [Maker Studio](/maker) for interactive coding playgrounds
- Visit [The Engine Room](https://www.theengineroom.org/) to learn about their services and resources
- Navigate back to the [House Map](/) to choose a room

${sourcesText}`,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Stream the response using AI SDK v4+ API
    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('An error occurred processing your request', {
      status: 500,
    });
  }
}
