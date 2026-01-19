import { Metadata } from "next";
import Link from "next/link";
import { BackToHouse, Breadcrumbs } from "@/components/shared";
import { ChatInterface } from "@/components/entryway";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Wrench, Code2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Entryway",
  description:
    "Your AI guide to the Design Hub House. Ask questions and get personalized recommendations.",
};

export default function EntrywayPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <BackToHouse />
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: "Entryway" }]} />

        {/* Header */}
        <header className="my-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <span className="text-3xl">💬</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Entryway</h1>
              <p className="text-muted-foreground">Your AI House Guide</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Welcome to the Design Hub House! I&apos;m here to help you navigate
            our collection of demos and playgrounds. Ask me anything about The
            Engine Room, what&apos;s available, or where to start.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Chat Interface */}
          <ChatInterface />

          {/* Quick Links Sidebar */}
          <aside className="space-y-6">
            <Card className="quick-nav-panel">
              <CardHeader>
                <CardTitle className="text-lg">Quick Navigation</CardTitle>
                <CardDescription>Jump directly to other rooms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/workshop" className="block focus-visible:outline-none">
                  <div className="room-nav-item room-nav-item--workshop">
                    <Wrench className="h-5 w-5 room-nav-icon" />
                    <div className="flex-1">
                      <p className="room-nav-title">Workshop</p>
                      <p className="room-nav-desc">
                        Tool demos & tutorials
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 room-nav-arrow" />
                  </div>
                </Link>
                <Link href="/maker" className="block focus-visible:outline-none">
                  <div className="room-nav-item room-nav-item--maker">
                    <Code2 className="h-5 w-5 room-nav-icon" />
                    <div className="flex-1">
                      <p className="room-nav-title">Maker Studio</p>
                      <p className="room-nav-desc">
                        Coding playgrounds
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 room-nav-arrow" />
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="about-panel">
              <CardHeader>
                <CardTitle className="text-lg">About the Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  The House Guide uses AI to help you explore our content. It
                  knows about The Engine Room and all the demos and playgrounds
                  available in the Design Hub.
                </p>
                <p>
                  Try asking about specific topics like &ldquo;buttons&rdquo;,
                  &ldquo;forms&rdquo;, or &ldquo;animations&rdquo;, or ask for
                  recommendations based on your skill level.
                </p>
                <p className="text-xs">
                  Note: AI responses may not always be accurate. Always verify
                  important information.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
