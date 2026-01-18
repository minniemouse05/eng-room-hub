'use client';

import { useState } from 'react';
import { HouseMap, RoomPreview, MobileRoomButtons } from '@/components/house';
import { Room } from '@/types';

export default function HomePage() {
  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);

  return (
    <main className="min-h-screen hero-bg overflow-hidden">
      {/* Decorative floating shapes */}
      <div className="absolute top-20 left-[10%] w-32 h-32 rounded-full bg-[#2cb4e0]/10 blur-3xl animate-float" />
      <div className="absolute top-40 right-[15%] w-40 h-40 rounded-full bg-[#FD946F]/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-[20%] w-24 h-24 rounded-full bg-[#4F61E3]/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container relative z-10 mx-auto px-4 py-12 lg:py-20">
        {/* Header */}
        <header className="text-center mb-14 lg:mb-20">
          <h1 className="electric-headline text-4xl sm:text-5xl lg:text-6xl mb-5 tracking-tight">
            Design Hub House
          </h1>
          <p className="text-lg lg:text-xl text-[#64648c] max-w-2xl mx-auto leading-relaxed">
            An interactive learning hub for design systems, tools, and code.
            Explore the house to discover demos, playgrounds, and AI-powered guidance.
          </p>
        </header>

        {/* Desktop Layout: House Map + Preview Panel */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center max-w-6xl mx-auto">
          {/* House Map */}
          <div className="relative">
            {/* Multi-color gradient glow behind card */}
            <div
              className="absolute -inset-4 rounded-[2rem] blur-3xl opacity-60"
              style={{
                background: 'linear-gradient(135deg, rgba(79,97,227,0.2) 0%, rgba(44,180,224,0.15) 35%, rgba(253,148,111,0.2) 70%, rgba(182,94,160,0.15) 100%)'
              }}
            />
            <div className="relative glass-card rounded-[1.75rem] p-8 transition-all duration-300 hover:shadow-lg">
              <HouseMap onRoomHover={setHoveredRoom} hoveredRoom={hoveredRoom} />
              <p className="text-center text-sm text-[#7C7DC9] mt-6 font-medium">
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
            {/* Multi-color gradient glow behind card */}
            <div
              className="absolute -inset-3 rounded-[2rem] blur-2xl opacity-50"
              style={{
                background: 'linear-gradient(135deg, rgba(79,97,227,0.2) 0%, rgba(44,180,224,0.15) 35%, rgba(253,148,111,0.2) 70%, rgba(182,94,160,0.15) 100%)'
              }}
            />
            <div className="relative glass-card rounded-[1.5rem] p-6">
              <HouseMap onRoomHover={setHoveredRoom} hoveredRoom={hoveredRoom} />
            </div>
          </div>
          <MobileRoomButtons />
        </div>

        {/* Footer hint */}
        <footer className="text-center mt-20 text-sm">
          <p className="text-[#7C7DC9]">
            Made with <span className="text-[#FD946F]">love</span> by The Engine Room
          </p>
        </footer>
      </div>
    </main>
  );
}
