/**
 * Tour Configuration
 * Defines all steps for the guided tour through the Design Hub House
 */

export interface TourStep {
  id: string;
  route: string;
  selector: string;
  title: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right" | "auto";
  tryItLabel?: string;
  tryItAction?: "click" | "focus";
  spotlightPadding?: number;
  scrollBehavior?: "smooth" | "instant";
}

export const tourSteps: TourStep[] = [
  // House page steps
  {
    id: "welcome",
    route: "/",
    selector: "header",
    title: "Welcome to Design Hub House!",
    content:
      "This is your interactive learning hub for design systems, tools, and code. Let me show you around the three rooms.",
    position: "bottom",
    spotlightPadding: 20,
  },
  {
    id: "workshop-room",
    route: "/",
    selector: '[aria-label="Enter Workshop - Tool Demos room"]',
    title: "The Workshop",
    content:
      "Structured learning modules with lessons on machine learning fundamentals, AI safety, and more. Perfect for step-by-step learning.",
    position: "right",
    spotlightPadding: 8,
  },
  {
    id: "maker-room",
    route: "/",
    selector: '[aria-label="Enter Maker Studio - Coding Playgrounds room"]',
    title: "The Maker Studio",
    content:
      "Interactive code playgrounds where you can experiment and build. Practice what you learn hands-on.",
    position: "left",
    spotlightPadding: 8,
  },
  {
    id: "entryway-room",
    route: "/",
    selector: '[aria-label="Enter Entryway - AI Chatbot room"]',
    title: "The Entryway",
    content:
      "Your AI guide lives here! Ask questions about The Engine Room, demos, playgrounds, or get personalized recommendations.",
    position: "top",
    spotlightPadding: 8,
  },

  // Workshop page steps
  {
    id: "workshop-tabs",
    route: "/workshop",
    selector: ".workshop-tabs",
    title: "Welcome to the Workshop!",
    content:
      "You're now in the Workshop. Toggle between curated learning modules or browse all lessons individually.",
    position: "bottom",
    spotlightPadding: 12,
  },
  {
    id: "workshop-module",
    route: "/workshop",
    selector: ".module-card",
    title: "Start a Module",
    content:
      "Each module contains related lessons with progress tracking. Click to see the full curriculum and start learning!",
    position: "bottom",
    spotlightPadding: 12,
  },
  {
    id: "lesson-complete",
    route: "/workshop/ai-history",
    selector: "button[aria-pressed]",
    title: "Inside a Lesson",
    content:
      "Here's what a lesson looks like. When you're done, click this button to mark it complete. Your progress counts toward 100% module completion!",
    position: "left",
    spotlightPadding: 8,
  },

  // Maker Studio page steps
  {
    id: "maker-tabs",
    route: "/maker",
    selector: ".maker-tabs",
    title: "Welcome to the Maker Studio!",
    content:
      "You're now in the Maker Studio. Browse curated collections or search all playgrounds.",
    position: "bottom",
    spotlightPadding: 12,
  },
  {
    id: "maker-collection",
    route: "/maker",
    selector: ".collection-card",
    title: "Explore Collections",
    content:
      "Each collection groups related playgrounds together. Playgrounds are live coding or game-based environments where you learn by doing!",
    position: "bottom",
    spotlightPadding: 12,
  },
  {
    id: "playground-complete",
    route: "/maker/ai-concepts-quiz",
    selector: "button[aria-pressed]",
    title: "Inside a Playground",
    content:
      "Here's what a playground looks like. Mark it complete when you're done — this tracks your progress across collections too!",
    position: "right",
    spotlightPadding: 8,
  },

  // Entryway page steps
  {
    id: "entryway-chat",
    route: "/entryway",
    selector: ".chat-header",
    title: "Welcome to the Entryway!",
    content:
      "You're now in the Entryway. This is your AI guide — ask questions about any topic and get personalized recommendations.",
    position: "bottom",
    spotlightPadding: 12,
  },
  {
    id: "entryway-history",
    route: "/entryway",
    selector: ".chat-thread-selector",
    title: "Your Chat History",
    content:
      "Click here to see all your prior conversations. You can switch between chats or pick up where you left off.",
    position: "bottom",
    spotlightPadding: 8,
  },
  {
    id: "entryway-new-chat",
    route: "/entryway",
    selector: ".chat-new-btn",
    title: "Start Fresh",
    content:
      'Click "New chat" to begin a fresh conversation. Your chat history is saved so you can return anytime.',
    position: "bottom",
    spotlightPadding: 8,
  },

  // Final step
  {
    id: "tour-complete",
    route: "/entryway",
    selector: "header",
    title: "You're Ready to Explore!",
    content:
      "Start learning with a module, experiment in a playground, or ask the guide for recommendations. The house is yours!",
    position: "bottom",
    spotlightPadding: 20,
  },
];

export const TOUR_STORAGE_KEY = "design-hub-tour-state";
export const TOUR_VERSION = "1.0.0"; // Increment to re-show tour after major updates

export interface TourState {
  hasSeenTour: boolean;
  lastCompletedStep: number;
  version: string;
}

export function getDefaultTourState(): TourState {
  return {
    hasSeenTour: false,
    lastCompletedStep: -1,
    version: TOUR_VERSION,
  };
}
