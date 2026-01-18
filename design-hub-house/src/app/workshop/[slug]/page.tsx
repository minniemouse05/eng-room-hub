import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getDemoBySlug,
  getAllDemoSlugs,
  getRelatedDemos,
  getRelatedPlaygrounds,
} from '@/lib/content';
import { renderMDX } from '@/lib/mdx';
import { BackToHouse, Breadcrumbs, TagBadge, DifficultyBadge } from '@/components/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, Calendar, ArrowRight, Code2 } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllDemoSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const demo = getDemoBySlug(slug);
  if (!demo) return { title: 'Demo Not Found' };

  return {
    title: demo.title,
    description: demo.description,
  };
}

export default async function DemoPage({ params }: PageProps) {
  const { slug } = await params;
  const demo = getDemoBySlug(slug);

  if (!demo) {
    notFound();
  }

  const content = await renderMDX(demo.content);
  const relatedDemos = getRelatedDemos(demo.slug, demo.tags);
  const relatedPlaygrounds = getRelatedPlaygrounds(demo.relatedPlaygrounds);

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
            { label: 'Workshop', href: '/workshop' },
            { label: demo.title },
          ]}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <article className="min-w-0">
            {/* Header */}
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <DifficultyBadge difficulty={demo.difficulty} />
                {demo.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
              <h1 className="text-4xl font-bold mb-4">{demo.title}</h1>
              <p className="text-xl text-muted-foreground">{demo.description}</p>
            </header>

            {/* MDX Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {content}
            </div>

            {/* Related Playgrounds Section */}
            {relatedPlaygrounds.length > 0 && (
              <section className="mt-12 pt-8 border-t">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Code2 className="h-6 w-6 text-emerald-600" />
                  Try it in Maker Studio
                </h2>
                <p className="text-muted-foreground mb-6">
                  Practice what you&apos;ve learned with these interactive playgrounds.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedPlaygrounds.map((playground) => (
                    <Link key={playground.slug} href={`/maker/${playground.slug}`}>
                      <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{playground.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="line-clamp-2">
                            {playground.description}
                          </CardDescription>
                          <Button variant="ghost" className="mt-4 gap-2 p-0 h-auto">
                            Open Playground
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related Demos Section */}
            {relatedDemos.length > 0 && (
              <section className="mt-12 pt-8 border-t">
                <h2 className="text-2xl font-semibold mb-4">Related Demos</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedDemos.map((relatedDemo) => (
                    <Link key={relatedDemo.slug} href={`/workshop/${relatedDemo.slug}`}>
                      <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base line-clamp-1">
                              {relatedDemo.title}
                            </CardTitle>
                            <DifficultyBadge difficulty={relatedDemo.difficulty} />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="line-clamp-2">
                            {relatedDemo.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Metadata Card */}
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">About this demo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{demo.timeMinutes} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Updated {new Date(demo.updatedAt).toLocaleDateString()}</span>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Difficulty</p>
                  <DifficultyBadge difficulty={demo.difficulty} />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {demo.tags.map((tag) => (
                      <TagBadge key={tag} tag={tag} className="text-xs" />
                    ))}
                  </div>
                </div>

                {relatedPlaygrounds.length > 0 && (
                  <>
                    <Separator />
                    <Link href={`/maker/${relatedPlaygrounds[0].slug}`}>
                      <Button className="w-full gap-2">
                        <Code2 className="h-4 w-4" />
                        Try Playground
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
