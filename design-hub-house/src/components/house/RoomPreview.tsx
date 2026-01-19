'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Room } from '@/types';

interface RoomPreviewProps {
  room: Room | null;
}

// Map room IDs to their glow color classes
const roomGlowStyles: Record<string, string> = {
  entryway: '0 4px 30px rgba(106, 44, 255, 0.5), 0 0 60px rgba(185, 167, 255, 0.25)',
  workshop: '0 4px 30px rgba(255, 154, 61, 0.5), 0 0 60px rgba(255, 211, 106, 0.25)',
  maker: '0 4px 30px rgba(57, 230, 255, 0.5), 0 0 60px rgba(125, 255, 197, 0.25)',
};

// Map room IDs to their gradient backgrounds (darker for contrast)
const roomGradients: Record<string, string> = {
  entryway: 'linear-gradient(135deg, rgba(106, 44, 255, 0.25) 0%, rgba(11, 15, 42, 0.7) 100%)',
  workshop: 'linear-gradient(135deg, rgba(255, 92, 108, 0.2) 0%, rgba(11, 15, 42, 0.7) 100%)',
  maker: 'linear-gradient(135deg, rgba(57, 230, 255, 0.2) 0%, rgba(11, 15, 42, 0.7) 100%)',
};

export function RoomPreview({ room }: RoomPreviewProps) {
  return (
    <div className="h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {room ? (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <div
              className="glass-panel p-8 transition-all duration-300"
              style={{
                background: roomGradients[room.id] || 'var(--glass-strong-bg)',
                boxShadow: `var(--glass-shadow), ${roomGlowStyles[room.id] || 'var(--glass-glow)'}`,
                borderColor: `${room.color}50`,
              }}
            >
              {/* Icon container */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: `linear-gradient(135deg, ${room.color}40 0%, ${room.color}15 100%)`,
                  boxShadow: `0 0 24px ${room.color}30`,
                  border: `1px solid ${room.color}40`,
                }}
              >
                <span className="text-3xl" style={{ filter: `drop-shadow(0 0 10px ${room.color})` }}>
                  {room.icon === 'MessageCircle' && '💬'}
                  {room.icon === 'Wrench' && '🔧'}
                  {room.icon === 'Code2' && '💻'}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white mb-4 text-glow">
                {room.name}
              </h2>

              {/* Description */}
              <p className="text-text-secondary text-base leading-relaxed mb-6">
                {room.description}
              </p>

              {/* CTA Button */}
              <Link href={room.route}>
                <Button
                  className="w-full gap-2 btn-glow font-semibold text-white border-0 h-11"
                  style={{
                    background: `linear-gradient(135deg, ${room.color} 0%, ${room.color}DD 100%)`,
                  }}
                >
                  Enter {room.name}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            {/* Default empty state */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'rgba(11, 15, 42, 0.6)',
                boxShadow: '0 0 30px rgba(47, 91, 255, 0.25)',
                border: '1px solid rgba(246, 248, 255, 0.2)',
              }}
            >
              <span className="text-3xl" style={{ filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.6))' }}>
                🏠
              </span>
            </div>
            <p className="text-lg font-semibold mb-2 text-white text-glow">
              Welcome to Design Hub House
            </p>
            <p className="text-sm text-text-muted">
              Click or hover over a room to see more details
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
