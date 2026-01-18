'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Home, MessageCircle, Wrench, Code2 } from 'lucide-react';
import { Room } from '@/types';

const ROOM_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  MessageCircle,
  Wrench,
  Code2,
};

interface RoomPreviewProps {
  room: Room | null;
}

// Palette-aligned room colors
const ROOM_COLORS: Record<string, string> = {
  workshop: '#FD946F',
  entryway: '#4F61E3',
  maker: '#2cb4e0',
};

const ROOM_GLOWS: Record<string, string> = {
  workshop: '0 8px 32px -8px rgba(253, 148, 111, 0.35)',
  entryway: '0 8px 32px -8px rgba(79, 97, 227, 0.35)',
  maker: '0 8px 32px -8px rgba(44, 180, 224, 0.35)',
};

export function RoomPreview({ room }: RoomPreviewProps) {
  const roomColor = room ? ROOM_COLORS[room.id] || room.color : '#4F61E3';
  const roomGlow = room ? ROOM_GLOWS[room.id] : undefined;

  return (
    <div className="h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {room ? (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full"
          >
            <Card
              className="glass-card border-2 rounded-[1.5rem] overflow-hidden transition-shadow duration-300"
              style={{
                borderColor: roomColor,
                boxShadow: roomGlow,
              }}
            >
              <CardHeader className="pb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-105"
                  style={{
                    backgroundColor: `${roomColor}15`,
                    border: `2px solid ${roomColor}30`,
                  }}
                >
                  {(() => {
                    const IconComponent = ROOM_ICONS[room.icon];
                    return IconComponent ? (
                      <IconComponent className="w-8 h-8" style={{ color: roomColor }} />
                    ) : null;
                  })()}
                </div>
                <CardTitle className="text-2xl font-bold text-[#1a1a2e]">
                  {room.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <CardDescription className="text-base leading-relaxed text-[#64648c]">
                  {room.description}
                </CardDescription>
                <Link href={room.route}>
                  <Button
                    className="w-full gap-2 rounded-xl h-12 font-semibold text-white transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
                    style={{
                      backgroundColor: roomColor,
                      boxShadow: `0 4px 14px -4px ${roomColor}60`,
                    }}
                  >
                    Enter {room.name}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="text-center"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 animate-float"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,238,229,0.8) 100%)',
                boxShadow: '0 8px 32px -8px rgba(79, 97, 227, 0.15)',
                border: '2px solid rgba(79, 97, 227, 0.1)',
              }}
            >
              <Home className="w-10 h-10 text-[#4F61E3]" />
            </div>
            <p className="text-xl font-semibold mb-2 text-[#1a1a2e]">
              Welcome to Design Hub House
            </p>
            <p className="text-sm text-[#7C7DC9]">
              Click or hover over a room to see more details
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
