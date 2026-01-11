'use client';

import { useState } from 'react';
import { HouseMap, RoomPreview, MobileRoomButtons } from '@/components/house';
import { Room } from '@/types';

export default function HomePage() {
  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        {/* Header */}
        <header className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Design Hub House
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            An interactive learning hub for design systems, tools, and code.
            Explore the house to discover demos, playgrounds, and AI-powered guidance.
          </p>
        </header>

        {/* Desktop Layout: House Map + Preview Panel */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center max-w-6xl mx-auto">
          {/* House Map */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-amber-500/10 to-emerald-500/10 rounded-3xl blur-3xl" />
            <div className="relative bg-background/80 backdrop-blur-sm rounded-3xl border p-8 shadow-xl">
              <HouseMap onRoomHover={setHoveredRoom} hoveredRoom={hoveredRoom} />
              <p className="text-center text-sm text-muted-foreground mt-6">
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
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-amber-500/10 to-emerald-500/10 rounded-3xl blur-3xl" />
            <div className="relative bg-background/80 backdrop-blur-sm rounded-3xl border p-6 shadow-xl">
              <HouseMap onRoomHover={setHoveredRoom} hoveredRoom={hoveredRoom} />
            </div>
          </div>
          <MobileRoomButtons />
        </div>

        {/* Footer hint */}
        <footer className="text-center mt-16 text-sm text-muted-foreground">
          <p>
          ❤️ The Engine Room
          </p>
        </footer>
      </div>
    </main>
  );
}
