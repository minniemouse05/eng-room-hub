import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPlaygroundBySlug, getAllPlaygroundSlugs, getDemoBySlug } from '@/lib/content';
import { BackToHouse, Breadcrumbs, TagBadge, StackBadge } from '@/components/shared';
import { PlaygroundRunner } from '@/components/maker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, BookOpen, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPlaygroundSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const playground = getPlaygroundBySlug(slug);
  if (!playground) return { title: 'Playground Not Found' };

  return {
    title: playground.title,
    description: playground.description,
  };
}

export default async function PlaygroundPage({ params }: PageProps) {
  const { slug } = await params;
  const playground = getPlaygroundBySlug(slug);

  if (!playground) {
    notFound();
  }

  // Get related demos
  const relatedDemos = playground.relatedDemos
    .map((demoSlug) => getDemoBySlug(demoSlug))
    .filter(Boolean);

  return (
    <main className="min-h-screen hero-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <BackToHouse />
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Maker Studio', href: '/maker' },
            { label: playground.title },
          ]}
        />

        {/* Header */}
        <header className="my-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <StackBadge stack={playground.stack} />
            {playground.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          <h1 className="text-3xl font-bold mb-3">{playground.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {playground.description}
          </p>
        </header>

        {/* Info Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* What You'll Build */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                What You&apos;ll Build
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {playground.description} Use the editor below to write and modify code,
                then see your changes instantly in the preview panel.
              </p>
            </CardContent>
          </Card>

          {/* Remix Ideas */}
          {playground.remixIdeas && playground.remixIdeas.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Remix Ideas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {playground.remixIdeas.map((idea, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      {idea}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Playground Runner */}
        <PlaygroundRunner playground={playground} />

        {/* Related Demos */}
        {relatedDemos.length > 0 && (
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-amber-600" />
              Learn More in Workshop
            </h2>
            <p className="text-muted-foreground mb-6">
              Explore these demos to understand the concepts behind this playground.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedDemos.map((demo) => demo && (
                <Link key={demo.slug} href={`/workshop/${demo.slug}`}>
                  <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base line-clamp-1">{demo.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-2 mb-4">
                        {demo.description}
                      </CardDescription>
                      <Button variant="ghost" className="gap-2 p-0 h-auto">
                        Read Demo
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
