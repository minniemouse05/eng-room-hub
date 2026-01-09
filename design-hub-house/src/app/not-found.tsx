import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
      <div className="text-center px-4">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">🏠</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Room Not Found</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md">
          Looks like you&apos;ve wandered into an undiscovered part of the house.
          Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home className="h-4 w-4" />
              Back to House
            </Button>
          </Link>
          <Link href="/workshop">
            <Button variant="outline" size="lg" className="gap-2">
              <Search className="h-4 w-4" />
              Browse Workshop
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
