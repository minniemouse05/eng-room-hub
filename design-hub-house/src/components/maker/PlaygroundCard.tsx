'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TagBadge, StackBadge } from '@/components/shared';
import { ArrowRight, Play } from 'lucide-react';
import { PlaygroundConfig } from '@/types';

interface PlaygroundCardProps {
  playground: PlaygroundConfig;
}

export function PlaygroundCard({ playground }: PlaygroundCardProps) {
  return (
    <Link href={`/maker/${playground.slug}`} className="block group">
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                {playground.title}
              </CardTitle>
            </div>
            <StackBadge stack={playground.stack} />
          </div>
          <CardDescription className="line-clamp-2">{playground.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {playground.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} className="text-xs" />
            ))}
            {playground.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{playground.tags.length - 3}</span>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Play className="h-4 w-4" />
              <span>{playground.files.length} files</span>
            </div>
            <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Open playground
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
