import { Metadata } from 'next';
import { getAllDemos, getAllDemoTags } from '@/lib/content';
import { BackToHouse, Breadcrumbs } from '@/components/shared';
import { WorkshopContent } from '@/components/workshop';

export const metadata: Metadata = {
  title: 'Workshop',
  description:
    'Learn AI fundamentals, machine learning, and LLMs through structured modules and hands-on tutorials.',
};

export default function WorkshopPage() {
  const demos = getAllDemos();
  const allTags = getAllDemoTags();

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <BackToHouse />
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Workshop' }]} />

        {/* Header */}
        <header className="my-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 154, 61, 0.3) 0%, rgba(255, 154, 61, 0.1) 100%)',
                boxShadow: '0 0 24px rgba(255, 154, 61, 0.2)',
                border: '1px solid rgba(255, 154, 61, 0.25)',
              }}
            >
              <span className="text-3xl">🔧</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Workshop</h1>
              <p className="text-text-secondary">Learn AI through structured modules</p>
            </div>
          </div>
          <p className="text-lg text-text-muted max-w-2xl">
            Start with the fundamentals and work your way up. Each module contains
            curated lessons designed to build your understanding step by step.
          </p>
        </header>

        {/* Workshop content with modules and lessons */}
        <WorkshopContent demos={demos} allTags={allTags} />
      </div>
    </main>
  );
}
