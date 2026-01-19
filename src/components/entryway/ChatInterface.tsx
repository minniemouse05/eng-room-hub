'use client';

import { useState, useRef, useEffect, FormEvent, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import {
  Send,
  Loader2,
  AlertCircle,
  Sparkles,
  Plus,
  ChevronDown,
  MessageSquare,
  Trash2,
} from 'lucide-react';

// ============================================
// Types
// ============================================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatThread {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
  draftInput?: string;
}

// ============================================
// Constants
// ============================================

const SUGGESTED_QUESTIONS = [
  'What demos are available for beginners?',
  'How do I implement dark mode?',
  'What playgrounds can I use to practice React?',
  'Tell me about button components',
];

const STORAGE_KEY = 'design-hub-chat-threads';
const DEFAULT_THREAD_TITLE = 'New chat';

// ============================================
// Helpers
// ============================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function createNewThread(): ChatThread {
  return {
    id: generateId(),
    title: DEFAULT_THREAD_TITLE,
    createdAt: Date.now(),
    messages: [],
    draftInput: '',
  };
}

function generateThreadTitle(firstMessage: string): string {
  // Take first 6-8 words, max 50 chars
  const words = firstMessage.trim().split(/\s+/).slice(0, 8);
  let title = words.join(' ');
  if (title.length > 50) {
    title = title.substring(0, 47) + '...';
  }
  return title || DEFAULT_THREAD_TITLE;
}

function loadThreadsFromStorage(): ChatThread[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage errors
  }
  return [];
}

function saveThreadsToStorage(threads: ChatThread[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch {
    // Ignore storage errors
  }
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

// ============================================
// Component
// ============================================

export function ChatInterface() {
  // Thread state
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // UI state
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  // Derived state
  const activeThread = threads.find((t) => t.id === activeThreadId) || null;
  const messages = activeThread?.messages || [];

  // ============================================
  // Initialization
  // ============================================

  useEffect(() => {
    const storedThreads = loadThreadsFromStorage();
    if (storedThreads.length > 0) {
      setThreads(storedThreads);
      // Set the most recent thread as active
      const sorted = [...storedThreads].sort((a, b) => b.createdAt - a.createdAt);
      setActiveThreadId(sorted[0].id);
      // Restore draft input if any
      if (sorted[0].draftInput) {
        setInput(sorted[0].draftInput);
      }
    } else {
      // Create initial thread
      const initialThread = createNewThread();
      setThreads([initialThread]);
      setActiveThreadId(initialThread.id);
    }
    setIsHydrated(true);
  }, []);

  // ============================================
  // Persistence
  // ============================================

  useEffect(() => {
    if (isHydrated && threads.length > 0) {
      saveThreadsToStorage(threads);
    }
  }, [threads, isHydrated]);

  // Save draft input when it changes
  useEffect(() => {
    if (isHydrated && activeThreadId && input !== activeThread?.draftInput) {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId ? { ...t, draftInput: input } : t
        )
      );
    }
  }, [input, activeThreadId, isHydrated, activeThread?.draftInput]);

  // ============================================
  // Auto-scroll
  // ============================================

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        '[data-slot="scroll-area-viewport"]'
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  // ============================================
  // Auto-resize textarea
  // ============================================

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [input]);

  // ============================================
  // Close history dropdown on outside click
  // ============================================

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
        setIsHistoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================
  // Thread Actions
  // ============================================

  const createNewChat = useCallback(() => {
    const newThread = createNewThread();
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    setInput('');
    setError(null);
    textareaRef.current?.focus();
  }, []);

  const handleNewChatClick = useCallback(() => {
    // If there's unsent input, show confirmation
    if (input.trim() && !isLoading) {
      setPendingAction(() => createNewChat);
      setShowConfirmDialog(true);
    } else {
      createNewChat();
    }
  }, [input, isLoading, createNewChat]);

  const switchThread = useCallback(
    (threadId: string) => {
      if (threadId === activeThreadId) {
        setIsHistoryOpen(false);
        return;
      }

      const switchAction = () => {
        const thread = threads.find((t) => t.id === threadId);
        setActiveThreadId(threadId);
        setInput(thread?.draftInput || '');
        setError(null);
        setIsHistoryOpen(false);
        textareaRef.current?.focus();
      };

      // If there's unsent input, show confirmation
      if (input.trim() && !isLoading) {
        setPendingAction(() => switchAction);
        setShowConfirmDialog(true);
      } else {
        switchAction();
      }
    },
    [activeThreadId, threads, input, isLoading]
  );

  const deleteThread = useCallback(
    (threadId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setThreads((prev) => {
        const updated = prev.filter((t) => t.id !== threadId);
        // If we deleted the active thread, switch to the most recent one
        if (threadId === activeThreadId) {
          if (updated.length > 0) {
            const sorted = [...updated].sort((a, b) => b.createdAt - a.createdAt);
            setActiveThreadId(sorted[0].id);
            setInput(sorted[0].draftInput || '');
          } else {
            // Create a new thread if we deleted the last one
            const newThread = createNewThread();
            setActiveThreadId(newThread.id);
            setInput('');
            return [newThread];
          }
        }
        return updated;
      });
    },
    [activeThreadId]
  );

  const confirmAction = useCallback(() => {
    if (pendingAction) {
      pendingAction();
    }
    setShowConfirmDialog(false);
    setPendingAction(null);
  }, [pendingAction]);

  const cancelAction = useCallback(() => {
    setShowConfirmDialog(false);
    setPendingAction(null);
  }, []);

  // ============================================
  // Message Handling
  // ============================================

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !activeThreadId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    // Update thread with new message and clear draft
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== activeThreadId) return t;
        const isFirstMessage = t.messages.length === 0;
        return {
          ...t,
          messages: [...t.messages, userMessage],
          draftInput: '',
          // Auto-title after first user message
          title: isFirstMessage
            ? generateThreadTitle(userMessage.content)
            : t.title,
        };
      })
    );

    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const currentMessages = [...messages, userMessage];
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText || 'Failed to send message');
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content,
        };
        setThreads((prev) =>
          prev.map((t) =>
            t.id === activeThreadId
              ? { ...t, messages: [...t.messages, assistantMessage] }
              : t
          )
        );
      } else {
        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = '';

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
        };

        setThreads((prev) =>
          prev.map((t) =>
            t.id === activeThreadId
              ? { ...t, messages: [...t.messages, assistantMessage] }
              : t
          )
        );

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            assistantContent += chunk;

            setThreads((prev) =>
              prev.map((t) =>
                t.id === activeThreadId
                  ? {
                      ...t,
                      messages: t.messages.map((m) =>
                        m.id === assistantMessage.id
                          ? { ...m, content: assistantContent }
                          : m
                      ),
                    }
                  : t
              )
            );
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as unknown as FormEvent);
      }
    }
  };

  // ============================================
  // Render
  // ============================================

  // Sort threads by creation time (newest first)
  const sortedThreads = [...threads].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] border rounded-2xl bg-background overflow-hidden">
      {/* Chat Header */}
      <div className="chat-header flex items-center justify-between px-4 py-3 border-b">
        {/* Thread selector dropdown */}
        <div className="relative flex-1 min-w-0" ref={historyRef}>
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="chat-thread-selector flex items-center gap-2 max-w-full"
            aria-expanded={isHistoryOpen}
            aria-haspopup="listbox"
          >
            <MessageSquare className="h-4 w-4 flex-shrink-0 text-text-muted" />
            <span className="truncate font-medium">
              {activeThread?.title || DEFAULT_THREAD_TITLE}
            </span>
            <ChevronDown
              className={`h-4 w-4 flex-shrink-0 text-text-muted transition-transform ${
                isHistoryOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* History dropdown */}
          {isHistoryOpen && (
            <div className="chat-history-dropdown absolute left-0 top-full mt-2 w-72 max-h-80 overflow-auto z-50">
              <div className="p-2 border-b border-border-soft">
                <button
                  onClick={() => {
                    setIsHistoryOpen(false);
                    handleNewChatClick();
                  }}
                  className="chat-history-new-btn w-full flex items-center gap-2 px-3 py-2 rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-medium">New chat</span>
                </button>
              </div>
              <div className="p-2">
                <p className="px-3 py-1 text-xs font-medium text-text-muted uppercase tracking-wide">
                  Recent chats
                </p>
                {sortedThreads.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-text-muted text-center">
                    No chats yet
                  </p>
                ) : (
                  <div className="space-y-1 mt-1">
                    {sortedThreads.map((thread) => (
                      <div
                        key={thread.id}
                        onClick={() => switchThread(thread.id)}
                        className={`chat-history-item group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${
                          thread.id === activeThreadId
                            ? 'chat-history-item--active'
                            : ''
                        }`}
                        role="option"
                        aria-selected={thread.id === activeThreadId}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {thread.title}
                          </p>
                          <p className="text-xs text-text-muted">
                            {thread.messages.length} messages &middot;{' '}
                            {formatRelativeTime(thread.createdAt)}
                          </p>
                        </div>
                        {threads.length > 1 && (
                          <button
                            onClick={(e) => deleteThread(thread.id, e)}
                            className="chat-history-delete opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20"
                            aria-label={`Delete ${thread.title}`}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* New chat button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewChatClick}
          className="chat-new-btn gap-1.5 ml-2"
          aria-label="Start new chat"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New chat</span>
        </Button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="chat-confirm-overlay fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={cancelAction}
          />
          <div className="chat-confirm-dialog relative z-10 p-6 rounded-2xl max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2">Unsaved message</h3>
            <p className="text-sm text-text-secondary mb-4">
              You have unsaved text in the input. Do you want to discard it?
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={cancelAction}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmAction}
              >
                Discard
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div ref={scrollAreaRef} className="flex-1 min-h-0">
        <ScrollArea className="h-full p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Welcome to the Entryway!
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                I&apos;m your guide to the Design Hub House. Ask me about demos,
                playgrounds, or anything you&apos;d like to learn.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="px-3 py-1.5 text-sm rounded-full border bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                />
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex items-center gap-2 text-muted-foreground p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-2 p-3 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="border-t p-4 flex items-end gap-2 bg-muted/30"
      >
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about demos, playgrounds, or concepts..."
          className="min-h-[44px] max-h-[150px] resize-none"
          disabled={isLoading}
          rows={1}
          aria-label="Chat message input"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading}
          className="flex-shrink-0 h-11 w-11"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
