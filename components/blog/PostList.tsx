'use client';

import { PostCard } from './PostCard';
import { Skeleton } from '@/components/ui/skeleton';

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

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
}

export function PostList({ posts, isLoading }: PostListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
