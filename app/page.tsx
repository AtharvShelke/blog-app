import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Edit3, Layout, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-linear-to-b from-background to-secondary/20 px-4 py-20 md:py-32">
        <div className="container max-w-6xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Modern Blogging Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Share Your Stories,
            <br />
            <span className="text-primary">Inspire the World</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A powerful, modern blogging platform built with Next.js, tRPC, and Drizzle ORM. 
            Create, manage, and share your content with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="min-w-[200px]">
              <Link href="/blog">
                Explore Blog
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="min-w-[200px]">
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built with modern technologies and best practices for a seamless experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Edit3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Markdown Editor</CardTitle>
                <CardDescription>
                  Write with powerful markdown support and live preview
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Layout className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Category Management</CardTitle>
                <CardDescription>
                  Organize your posts with flexible category system
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Beautiful Reading</CardTitle>
                <CardDescription>
                  Optimized reading experience with responsive design
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Start Writing?
          </h2>
          <p className="text-lg opacity-90">
            Join our platform and share your knowledge with the world
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/dashboard/posts/new">
              Create Your First Post
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
