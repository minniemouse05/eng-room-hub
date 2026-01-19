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
  entryway: '0 4px 30px rgba(106, 44, 255, 0.4), 0 0 60px rgba(185, 167, 255, 0.2)',
  workshop: '0 4px 30px rgba(255, 154, 61, 0.4), 0 0 60px rgba(255, 211, 106, 0.2)',
  maker: '0 4px 30px rgba(57, 230, 255, 0.4), 0 0 60px rgba(125, 255, 197, 0.2)',
};

// Map room IDs to their gradient backgrounds
const roomGradients: Record<string, string> = {
  entryway: 'linear-gradient(135deg, rgba(106, 44, 255, 0.15) 0%, rgba(185, 167, 255, 0.1) 100%)',
  workshop: 'linear-gradient(135deg, rgba(255, 92, 108, 0.15) 0%, rgba(255, 211, 106, 0.1) 100%)',
  maker: 'linear-gradient(135deg, rgba(57, 230, 255, 0.15) 0%, rgba(125, 255, 197, 0.1) 100%)',
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
                background: roomGradients[room.id] || 'var(--glass-bg)',
                boxShadow: `var(--glass-shadow), ${roomGlowStyles[room.id] || 'var(--glass-glow)'}`,
                borderColor: `${room.color}40`,
              }}
            >
              {/* Icon container */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: `linear-gradient(135deg, ${room.color}30 0%, ${room.color}10 100%)`,
                  boxShadow: `0 0 20px ${room.color}20`,
                }}
              >
                <span className="text-3xl" style={{ filter: `drop-shadow(0 0 8px ${room.color}80)` }}>
                  {room.icon === 'MessageCircle' && '💬'}
                  {room.icon === 'Wrench' && '🔧'}
                  {room.icon === 'Code2' && '💻'}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-off-white mb-4 text-glow">
                {room.name}
              </h2>

              {/* Description */}
              <p className="text-off-white/70 text-base leading-relaxed mb-6">
                {room.description}
              </p>

              {/* CTA Button */}
              <Link href={room.route}>
                <Button
                  className="w-full gap-2 btn-glow font-medium text-off-white border-0"
                  style={{
                    background: `linear-gradient(135deg, ${room.color} 0%, ${room.color}CC 100%)`,
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
                background: 'rgba(246, 248, 255, 0.08)',
                boxShadow: '0 0 30px rgba(47, 91, 255, 0.2)',
              }}
            >
              <span className="text-3xl" style={{ filter: 'drop-shadow(0 0 10px rgba(246, 248, 255, 0.5))' }}>
                🏠
              </span>
            </div>
            <p className="text-lg font-medium mb-2 text-off-white text-glow">
              Welcome to Design Hub House
            </p>
            <p className="text-sm text-off-white/50">
              Click or hover over a room to see more details
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
