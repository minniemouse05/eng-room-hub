'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MessageCircle, Wrench, Code2 } from 'lucide-react';
import { rooms } from '@/lib/rooms';

// Palette-aligned room colors
const ROOM_COLORS: Record<string, string> = {
  workshop: '#FD946F',
  entryway: '#4F61E3',
  maker: '#2cb4e0',
};

const ROOM_GLOWS: Record<string, string> = {
  workshop: '0 8px 24px -8px rgba(253, 148, 111, 0.3)',
  entryway: '0 8px 24px -8px rgba(79, 97, 227, 0.3)',
  maker: '0 8px 24px -8px rgba(44, 180, 224, 0.3)',
};

const ROOM_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  MessageCircle,
  Wrench,
  Code2,
};

export function MobileRoomButtons() {
  return (
    <div className="lg:hidden space-y-5 mt-10">
      <h2 className="text-lg font-semibold text-center text-[#7C7DC9]">
        Choose a room to enter
      </h2>
      <div className="space-y-4">
        {rooms.map((room) => {
          const roomColor = ROOM_COLORS[room.id] || room.color;
          const roomGlow = ROOM_GLOWS[room.id];

          return (
            <Link key={room.id} href={room.route}>
              <Card
                className="glass-card rounded-2xl transition-all duration-300 hover:-translate-y-1 border-l-4 overflow-hidden"
                style={{
                  borderLeftColor: roomColor,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = roomGlow;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-soft)';
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 hover:scale-105"
                      style={{
                        backgroundColor: `${roomColor}15`,
                        border: `2px solid ${roomColor}25`,
                      }}
                    >
                      {(() => {
                        const IconComponent = ROOM_ICONS[room.icon];
                        return IconComponent ? (
                          <IconComponent className="w-6 h-6" style={{ color: roomColor }} />
                        ) : null;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg text-[#1a1a2e]">{room.name}</CardTitle>
                    </div>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                      style={{
                        backgroundColor: `${roomColor}15`,
                      }}
                    >
                      <ArrowRight
                        className="h-4 w-4"
                        style={{ color: roomColor }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm line-clamp-2 text-[#64648c]">
                    {room.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
