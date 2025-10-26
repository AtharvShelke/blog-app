import { FeaturedPost } from './FeaturedPost';
import { PostCard } from './PostCard';

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
    <div className="mb-16 space-y-16 animate-in fade-in duration-700">
      {/* Featured Hero Post */}
      <div>
        <FeaturedPost post={featuredPost} />
      </div>

      {/* Recent Posts Section */}
      {recentPosts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Recent Articles</h2>
              <p className="text-muted-foreground mt-1">Fresh content just for you</p>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent ml-8" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
