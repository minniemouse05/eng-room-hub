import { Metadata } from 'next';
import { getAllPlaygrounds, getAllPlaygroundTags } from '@/lib/content';
import { BackToHouse, Breadcrumbs } from '@/components/shared';
import { MakerFilters } from '@/components/maker';
import { Code2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Maker Studio',
  description: 'Interactive coding playgrounds to practice design patterns and build components.',
};

export default function MakerPage() {
  const playgrounds = getAllPlaygrounds();
  const allTags = getAllPlaygroundTags();

  return (
    <main className="min-h-screen hero-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <BackToHouse />
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Maker Studio' }]} />

        {/* Header */}
        <header className="my-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Code2 className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Maker Studio</h1>
              <p className="text-muted-foreground">Interactive Coding Playgrounds</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Get your hands dirty with interactive coding playgrounds. Write, edit, and run
            code in real-time to practice what you&apos;ve learned in the Workshop.
          </p>
        </header>

        {/* Playgrounds Grid with Filters */}
        <MakerFilters playgrounds={playgrounds} allTags={allTags} />
      </div>
    </main>
  );
}
