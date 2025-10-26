import { trpc } from '@/lib/trpc/server';
import { PostList } from '@/components/blog/PostList';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { FeaturedSection } from '@/components/blog/FeaturedSection';
import { Pagination } from '@/components/blog/Pagination';
import { Newsletter } from '@/components/blog/Newsletter';
import { TrendingPosts } from '@/components/blog/TrendingPosts';
import { Sparkles, TrendingUp, Users, Clock, Eye } from 'lucide-react';
import { Suspense } from 'react';
import { PostListSkeleton } from '@/components/blog/PostListSkeleton';

interface BlogPageProps {
  searchParams: Promise<{ 
    category?: string;
    page?: string;
  }>; 
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const categorySlug = params.category;
  
  try {
    // Fetch data in parallel
    const [categories, postsData, trendingPosts] = await Promise.all([
      trpc.category.getAll(),
      trpc.post.getAll({
        published: true,
        categorySlug,
        page: currentPage,
        limit: 9,
      }),
      // Now this will work with the proper implementation
      trpc.post.getTrending({ limit: 3 }),
    ]);

    const { posts, pagination } = postsData;

    // Determine if we should show featured section
    const showFeatured = !categorySlug && currentPage === 1;
    const featuredPosts = showFeatured 
      ? await trpc.post.getFeatured({ count: 3 })
      : [];

    const [featuredPost, ...recentPosts] = featuredPosts;

    // Stats for the header
    const stats = [
      { icon: Users, label: 'Active Readers', value: '50K+' },
      { icon: Clock, label: 'Avg. Read Time', value: '5 min' },
      { icon: Eye, label: 'Monthly Views', value: '1M+' },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Enhanced Category Filter */}
              <section className="bg-card/50 backdrop-blur-sm rounded-2xl border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Explore Topics
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    {categories.length} categories
                  </div>
                </div>
                <CategoryFilter categories={categories} />
              </section>

              {/* Featured Section */}
              {showFeatured && featuredPost && (
                <FeaturedSection 
                  featuredPost={featuredPost}
                  recentPosts={recentPosts}
                />
              )}

              {/* Main Content Header */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                      {categorySlug 
                        ? `${categories.find(c => c.slug === categorySlug)?.name || 'Category'} Articles`
                        : showFeatured ? 'More Stories' : 'All Articles'
                      }
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      {pagination.total} {pagination.total === 1 ? 'article' : 'articles'} • 
                      Page {currentPage} of {pagination.totalPages}
                    </p>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent ml-8 hidden lg:block" />
                </div>

                {/* Posts Grid */}
                <Suspense fallback={<PostListSkeleton count={9} />}>
                  <PostList posts={posts} />
                </Suspense>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center pt-8">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      categorySlug={categorySlug}
                    />
                  </div>
                )}

                {/* Empty State */}
                {posts.length === 0 && (
                  <div className="text-center py-16 bg-card/50 rounded-2xl border">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold mb-3">No articles found</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {categorySlug 
                        ? "We couldn't find any articles in this category. Try exploring other topics!"
                        : "Stay tuned! New content is coming soon."
                      }
                    </p>
                    {categorySlug && (
                      <button 
                        onClick={() => window.history.back()}
                        className="text-primary hover:underline"
                      >
                        View all categories
                      </button>
                    )}
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Trending Posts - Now with real data! */}
              <TrendingPosts posts={trendingPosts} />

              {/* Newsletter Signup */}
              <Newsletter />

              {/* Quick Stats */}
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Community Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Weekly Readers</span>
                    <span className="font-semibold">25K+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Articles Published</span>
                    <span className="font-semibold">{pagination.total}+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Expert Writers</span>
                    <span className="font-semibold">50+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading blog page:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
}