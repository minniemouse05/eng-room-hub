'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Room } from '@/types';

interface RoomPreviewProps {
  room: Room | null;
}

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
            <Card className="border-2" style={{ borderColor: room.color }}>
              <CardHeader>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${room.color}20` }}
                >
                  <span className="text-3xl">
                    {room.icon === 'MessageCircle' && '💬'}
                    {room.icon === 'Wrench' && '🔧'}
                    {room.icon === 'Code2' && '💻'}
                  </span>
                </div>
                <CardTitle className="text-2xl">{room.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <CardDescription className="text-base leading-relaxed">
                  {room.description}
                </CardDescription>
                <Link href={room.route}>
                  <Button
                    className="w-full gap-2"
                    style={{ backgroundColor: room.color }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-muted-foreground"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏠</span>
            </div>
            <p className="text-lg font-medium mb-2">Welcome to Design Hub House</p>
            <p className="text-sm">
              Click or hover over a room to see more details
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
