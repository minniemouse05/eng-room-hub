'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TagBadge, DifficultyBadge } from '@/components/shared';
import { Clock, ArrowRight } from 'lucide-react';
import { Demo } from '@/types';

interface DemoCardProps {
  demo: Demo;
}

export function DemoCard({ demo }: DemoCardProps) {
  return (
    <Link href={`/workshop/${demo.slug}`} className="block group">
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                {demo.title}
              </CardTitle>
            </div>
            <DifficultyBadge difficulty={demo.difficulty} />
          </div>
          <CardDescription className="line-clamp-2">{demo.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {demo.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} className="text-xs" />
            ))}
            {demo.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{demo.tags.length - 3}</span>
            )}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{demo.timeMinutes} min</span>
            </div>
            <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Read more
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
