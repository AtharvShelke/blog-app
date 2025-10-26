import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

interface TrendingPostsProps {
  posts: Array<{
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    createdAt: Date;
    author: {
      name: string;
    } | null;
  }>;
}

export function TrendingPosts({ posts }: TrendingPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl border p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        Trending Now
      </h3>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block p-3 rounded-lg hover:bg-accent transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {post.author?.name || 'Unknown Author'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}