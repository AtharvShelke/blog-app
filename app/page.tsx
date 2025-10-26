import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  BookOpen,
  Edit3,
  Layout,
  Sparkles,
  Zap,
  Users,
  Shield,
  Globe,
  Rocket,
  TrendingUp,
  Code,
  Palette,
  Eye
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden px-4 py-20 md:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="container max-w-6xl text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>Next-Gen Blogging Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Craft Your
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Digital Legacy
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into compelling stories with our AI-powered platform.
            Built for creators who demand excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button size="lg" asChild className="min-w-[200px] group relative overflow-hidden">
              <Link href="/blog">
                <span className="relative z-10 flex items-center">
                  Explore Content
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="min-w-[200px] border-2">
              <Link href="/dashboard">
                <Zap className="w-4 h-4 mr-2" />
                Launch Dashboard
              </Link>
            </Button>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-2xl mx-auto">
            {[
              { label: 'Active Writers', value: '10K+' },
              { label: 'Articles', value: '50K+' },
              { label: 'Categories', value: '200+' },
              { label: 'Countries', value: '150+' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/30">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Why Creators Choose Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every tool you need to build, grow, and monetize your audience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Edit3,
                title: 'Smart Editor',
                description: 'AI-assisted writing with real-time suggestions and seamless markdown support',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Layout,
                title: 'Visual Builder',
                description: 'Drag-and-drop interface with customizable templates and components',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Military-grade encryption and automated backup for your content',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: TrendingUp,
                title: 'Performance Analytics',
                description: 'Deep insights into reader engagement and content performance',
                gradient: 'from-orange-500 to-red-500'
              },
              {
                icon: Users,
                title: 'Community Building',
                description: 'Built-in tools to grow and engage your reader community',
                gradient: 'from-indigo-500 to-purple-500'
              },
              {
                icon: Globe,
                title: 'Global CDN',
                description: 'Lightning-fast content delivery across 200+ countries worldwide',
                gradient: 'from-cyan-500 to-blue-500'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Built with Modern Excellence</h3>
            <p className="text-muted-foreground">Powered by cutting-edge technology for unparalleled performance</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            {['Next.js', 'TypeScript', 'tRPC', 'Tailwind', 'Drizzle', 'PostgreSQL'].map((tech) => (
              <div key={tech} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
                <Code className="w-4 h-4" />
                <span className="font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-background via-background to-primary/10">
        {/* Background Elements that work in both themes */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-primary/5" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="container max-w-4xl text-center space-y-8 relative z-10">
          {/* Theme-consistent badge - Already centered */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm">
            <Rocket className="w-4 h-4" />
            <span>Ready to Launch?</span>
          </div>

          {/* Theme-consistent typography - Already centered */}
          <h2 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Start Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Journey Today
            </span>
          </h2>

          {/* Paragraph - Already centered with mx-auto */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of creators who are already building their digital legacy
          </p>

          {/* Buttons - Already centered with justify-center */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              asChild
              className="min-w-[200px] group"
            >
              <Link href="/dashboard/posts/new">
                <Palette className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Create First Post
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="min-w-[200px]"
            >
              <Link href="/blog">
                <Eye className="w-4 h-4 mr-2" />
                Explore Stories
              </Link>
            </Button>
          </div>

          {/* Trust indicators - Already centered with justify-center */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>10,000+ Creators</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>50,000+ Articles</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>98% Satisfaction</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}