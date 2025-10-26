import { trpc } from '@/lib/trpc/server';
import { PostList } from '@/components/blog/PostList';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { FeaturedSection } from '@/components/blog/FeaturedSection';
import { Pagination } from '@/components/blog/Pagination';
import { Sparkles } from 'lucide-react';
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
  
  // Fetch categories
  const categories = await trpc.category.getAll();

  // Determine if we should show featured section
  const showFeatured = !categorySlug && currentPage === 1;

  // Fetch paginated posts
  const { posts, pagination } = await trpc.post.getAll({
    published: true,
    categorySlug,
    page: currentPage,
    limit: 12, // Adjust based on your needs
  });

  // Fetch featured posts only if needed
  const featuredPosts = showFeatured 
    ? await trpc.post.getFeatured({ count: 4 })
    : [];

  const [featuredPost, ...recentPosts] = featuredPosts;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 pt-16 pb-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Latest Insights & Stories</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Discover Our Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Dive into expert insights, tutorials, and stories that inspire innovation
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {/* Category Filter */}
        <div className="mb-12 flex justify-center">
          <div className="inline-block p-1 bg-muted/50 rounded-lg backdrop-blur-sm">
            <CategoryFilter categories={categories} />
          </div>
        </div>

        {/* Featured Section - Only show on first page without filters */}
        {showFeatured && featuredPost && (
          <FeaturedSection 
            featuredPost={featuredPost}
            recentPosts={recentPosts}
          />
        )}

        {/* Main Post Grid with Pagination */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {categorySlug ? 'Filtered Posts' : showFeatured ? 'More Articles' : 'All Posts'}
              </h2>
              <p className="text-muted-foreground mt-1">
                {pagination.total} {pagination.total === 1 ? 'post' : 'posts'} found
              </p>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent ml-8" />
          </div>

          <Suspense fallback={<PostListSkeleton count={12} />}>
            <PostList posts={posts} />
          </Suspense>

          {/* Pagination Component */}
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
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-6">
                {categorySlug 
                  ? "Try selecting a different category or view all posts" 
                  : "Check back soon for new content"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
