import { Suspense } from 'react';
import { Metadata } from 'next';
import { Code2 } from 'lucide-react';
import { getAllPlaygrounds, getAllPlaygroundTags } from '@/lib/content';
import { BackToHouse, Breadcrumbs } from '@/components/shared';
import { MakerContent } from '@/components/maker';

export const metadata: Metadata = {
  title: 'Maker Studio',
  description:
    'Interactive playgrounds to practice AI concepts, machine learning, and coding patterns.',
};

export default function MakerPage() {
  const playgrounds = getAllPlaygrounds();
  const allTags = getAllPlaygroundTags();

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
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
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(57, 230, 255, 0.3) 0%, rgba(57, 230, 255, 0.1) 100%)',
                boxShadow: '0 0 24px rgba(57, 230, 255, 0.2)',
                border: '1px solid rgba(57, 230, 255, 0.25)',
              }}
            >
              <Code2 className="w-7 h-7 text-cyan-400" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Maker Studio</h1>
              <p className="text-text-secondary">Interactive Learning Playgrounds</p>
            </div>
          </div>
          <p className="text-lg text-text-muted max-w-2xl">
            Practice what you&apos;ve learned with hands-on activities. Each collection
            aligns with Workshop lessons to reinforce your understanding.
          </p>
        </header>

        {/* Playgrounds with Collections - wrapped in Suspense for useSearchParams */}
        <Suspense fallback={<div className="text-text-muted">Loading...</div>}>
          <MakerContent playgrounds={playgrounds} allTags={allTags} />
        </Suspense>
      </div>
    </main>
  );
}
