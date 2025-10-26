'use client';

import { PostCard } from './PostCard';
import { PostListSkeleton } from './PostListSkeleton';


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
    return <PostListSkeleton count={12} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {posts.map((post, index) => (
        <div
          key={post.id}
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'backwards',
          }}
        >
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
