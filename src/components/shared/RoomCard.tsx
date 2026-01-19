'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Room } from '@/types';
import { cn } from '@/lib/utils';

interface RoomCardProps {
  room: Room;
  className?: string;
}

export function RoomCard({ room, className }: RoomCardProps) {
  return (
    <Link href={room.route} className="block">
      <Card
        className={cn(
          'group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer',
          className
        )}
      >
        <CardHeader>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${room.color}20` }}
          >
            <span className="text-2xl" style={{ color: room.color }}>
              {room.icon === 'MessageCircle' && '💬'}
              {room.icon === 'Wrench' && '🔧'}
              {room.icon === 'Code2' && '💻'}
            </span>
          </div>
          <CardTitle className="text-xl">{room.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base leading-relaxed mb-4">
            {room.description}
          </CardDescription>
          <Button variant="ghost" className="gap-2 p-0 h-auto group-hover:text-primary">
            Enter Room
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
