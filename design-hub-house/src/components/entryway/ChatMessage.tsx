'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  // Simple markdown link parser
  const parseContent = (text: string): ReactNode => {
    // Parse markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      // Add the link
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last link (only if we found at least one link)
    if (lastIndex > 0 && lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    // Return original string if no links found, otherwise return parts array
    return lastIndex === 0 ? text : parts;
  };

  // Parse bold text **text**
  const parseBold = (content: ReactNode): ReactNode => {
    if (typeof content !== 'string') return content;

    const boldRegex = /\*\*([^*]+)\*\*/g;
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      parts.push(
        <strong key={match.index} className="font-semibold">
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  // Split by newlines and parse each line
  const renderContent = () => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Check for list items
      if (line.startsWith('- ')) {
        return (
          <li key={i} className="ml-4">
            {parseBold(parseContent(line.slice(2)))}
          </li>
        );
      }
      // Check for headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={i} className="font-semibold mt-3 mb-1">
            {parseBold(parseContent(line.slice(4)))}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={i} className="font-semibold text-lg mt-4 mb-2">
            {parseBold(parseContent(line.slice(3)))}
          </h2>
        );
      }
      // Regular paragraph
      return (
        <p key={i} className={line.trim() === '' ? 'h-2' : ''}>
          {parseBold(parseContent(line))}
        </p>
      );
    });
  };

  return (
    <div
      className={cn(
        'chat-bubble flex gap-3 p-4 rounded-2xl',
        isUser
          ? 'chat-bubble--user bg-primary text-primary-foreground ml-12'
          : 'chat-bubble--assistant bg-muted mr-12'
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-primary-foreground/20' : 'bg-indigo-100'
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4 text-indigo-600" />
        )}
      </div>
      <div className="flex-1 space-y-1 overflow-hidden">
        <p className="text-xs font-medium opacity-70 mb-1">
          {isUser ? 'You' : 'House Guide'}
        </p>
        <div className="text-sm leading-relaxed space-y-1">{renderContent()}</div>
      </div>
    </div>
  );
}
