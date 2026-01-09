'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { rooms } from '@/lib/rooms';

export function MobileRoomButtons() {
  return (
    <div className="lg:hidden space-y-4 mt-8">
      <h2 className="text-lg font-semibold text-center text-muted-foreground">
        Choose a room to enter
      </h2>
      <div className="space-y-3">
        {rooms.map((room) => (
          <Link key={room.id} href={room.route}>
            <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${room.color}20` }}
                  >
                    <span className="text-2xl">
                      {room.icon === 'MessageCircle' && '💬'}
                      {room.icon === 'Wrench' && '🔧'}
                      {room.icon === 'Code2' && '💻'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm line-clamp-2">
                  {room.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
