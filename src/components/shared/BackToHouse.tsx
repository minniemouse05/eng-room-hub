'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BackToHouse() {
  return (
    <Link href="/">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-text-secondary hover:text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to House
      </Button>
    </Link>
  );
}
