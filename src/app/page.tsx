"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { HouseMap, RoomPreview, MobileRoomButtons } from "@/components/house";
import { TakeTourButton } from "@/components/tour";
import { Room } from "@/types";

export default function HomePage() {
  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);

  return (
    <main className="min-h-screen relative">
      {/* Decorative blobs for depth - positioned behind content */}
      <div
        className="blob blob-warm w-64 h-64 -top-20 -right-20 opacity-40"
        aria-hidden="true"
      />
      <div
        className="blob blob-cool w-80 h-80 -bottom-32 -left-32 opacity-30"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 py-8 lg:py-16 relative z-10">
        {/* Header */}
        <header className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white text-glow-strong">
            Design Hub House
          </h1>
          <p className="text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-6">
            An interactive learning hub for design systems, tools, and code.
            Explore the house to discover demos, playgrounds, and AI-powered
            guidance.
          </p>
          <TakeTourButton
            variant="outline"
            size="default"
            className="border-cyan/40 hover:border-cyan/70 hover:bg-cyan/10"
          />
        </header>

        {/* Desktop Layout: House Map + Preview Panel */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center max-w-6xl mx-auto">
          {/* House Map */}
          <div className="relative">
            <div className="glass-panel p-8">
              <HouseMap
                onRoomHover={setHoveredRoom}
                hoveredRoom={hoveredRoom}
              />
              <p className="text-center text-sm text-text-muted mt-6">
                Click on a room to navigate
              </p>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="min-h-[400px]">
            <RoomPreview room={hoveredRoom} />
          </div>
        </div>

        {/* Mobile Layout: Simplified House + Button List */}
        <div className="lg:hidden">
          <div className="relative max-w-sm mx-auto">
            <div className="glass-panel p-6">
              <HouseMap
                onRoomHover={setHoveredRoom}
                hoveredRoom={hoveredRoom}
              />
            </div>
          </div>
          <MobileRoomButtons />
        </div>

        {/* Footer hint */}
        <footer className="text-center mt-16 text-sm text-text-muted">
          <p className="inline-flex items-center gap-1.5">
            <Heart className="h-4 w-4 text-white-400" aria-hidden="true" />
            <span>The Engine Room</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
