import { FeaturedPost } from './FeaturedPost';
import { PostCard } from './PostCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  thumbnail?: string | null;
  createdAt: Date;
  author: {
    name: string;
    avatar?: string | null;
  };
  postCategories?: Array<{
    category: {
      name: string;
      slug: string;
    };
  }>;
}

interface FeaturedSectionProps {
  featuredPost: Post;
  recentPosts: Post[];
}

export function FeaturedSection({ featuredPost, recentPosts }: FeaturedSectionProps) {
  return (
    <section className="space-y-16">
      {/* Featured Hero Post */}
      <div className="animate-in fade-in duration-700">
        <FeaturedPost post={featuredPost} />
      </div>

      {/* Recent Posts Section */}
      {recentPosts.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Latest Stories
              </h2>
              <p className="text-muted-foreground mt-2">
                Fresh perspectives and insights
              </p>
            </div>
            <Link 
              href="/blog" 
              className="hidden md:flex items-center gap-2 text-primary hover:underline"
            >
              View all articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Mobile View All */}
          <div className="md:hidden flex justify-center pt-4">
            <Link 
              href="/blog" 
              className="flex items-center gap-2 text-primary hover:underline"
            >
              View all articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}