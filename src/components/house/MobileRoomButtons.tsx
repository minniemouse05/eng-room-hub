'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { rooms } from '@/lib/rooms';

// Map room IDs to their glow classes
const roomGlowClass: Record<string, string> = {
  entryway: 'glow-entryway',
  workshop: 'glow-workshop',
  maker: 'glow-maker',
};

export function MobileRoomButtons() {
  return (
    <div className="lg:hidden space-y-4 mt-8">
      <h2 className="text-lg font-semibold text-center text-text-secondary">
        Choose a room to enter
      </h2>
      <div className="space-y-3">
        {rooms.map((room) => (
          <Link key={room.id} href={room.route} className="block">
            <div
              className={`glass-card p-4 transition-all duration-200 ${roomGlowClass[room.id] || ''}`}
              style={{
                borderColor: `${room.color}40`,
              }}
            >
              <div className="flex items-center gap-4">
                {/* Icon container with room-specific gradient */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${room.color}35 0%, ${room.color}15 100%)`,
                    boxShadow: `0 0 20px ${room.color}25`,
                    border: `1px solid ${room.color}30`,
                  }}
                >
                  <span
                    className="text-2xl"
                    style={{ filter: `drop-shadow(0 0 8px ${room.color}80)` }}
                  >
                    {room.icon === 'MessageCircle' && '💬'}
                    {room.icon === 'Wrench' && '🔧'}
                    {room.icon === 'Code2' && '💻'}
                  </span>
                </div>

                {/* Room info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white">
                    {room.name}
                  </h3>
                  <p className="text-sm text-text-muted line-clamp-1">
                    {room.description}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight
                  className="h-5 w-5 flex-shrink-0 transition-transform duration-200"
                  style={{ color: room.color }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
