import { Metadata } from 'next';
import { getAllDemos, getAllDemoTags } from '@/lib/content';
import { BackToHouse, Breadcrumbs } from '@/components/shared';
import { WorkshopFilters } from '@/components/workshop';

export const metadata: Metadata = {
  title: 'Workshop',
  description: 'Explore tool demos and tutorials for design systems and development patterns.',
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
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
              <span className="text-3xl">🔧</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Workshop</h1>
              <p className="text-muted-foreground">Tool Demos & Tutorials</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover hands-on tool demos and tutorials. Learn about design systems,
            components, and development patterns through guided examples.
          </p>
        </header>

        {/* Demos Grid with Filters */}
        <WorkshopFilters demos={demos} allTags={allTags} />
      </div>
    </main>
  );
}
