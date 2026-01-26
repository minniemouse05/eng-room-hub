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
    title: "Modules vs All Lessons",
    content:
      "Toggle between curated learning modules or browse all lessons individually. Modules provide a structured path through related topics.",
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

  // Maker Studio page steps
  {
    id: "maker-tabs",
    route: "/maker",
    selector: ".maker-tabs",
    title: "Collections & Playgrounds",
    content:
      "Browse curated collections or search all playgrounds. Collections group related exercises together.",
    position: "bottom",
    spotlightPadding: 12,
  },
  {
    id: "maker-collection",
    route: "/maker",
    selector: ".collection-card",
    title: "Interactive Playgrounds",
    content:
      "Each playground is a live coding or game-based environment. Write code, see results instantly, and learn by doing!",
    position: "bottom",
    spotlightPadding: 12,
  },

  // Entryway page steps
  {
    id: "entryway-chat",
    route: "/entryway",
    selector: ".chat-header",
    title: "Chat with Your Guide",
    content:
      "Ask questions about any topic! The AI knows about all demos and playgrounds and can recommend what to learn next.",
    position: "bottom",
    spotlightPadding: 12,
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
