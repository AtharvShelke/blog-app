// components/optimized/PostList.tsx
'use client';

import { memo, useCallback } from 'react';
import { PostCard } from '@/components/blog/PostCard';


interface PostListProps {
  posts: Array<{
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
  }>;
}

export const PostList = memo(function PostList({ posts }: PostListProps) {
  const renderPost = useCallback((post: typeof posts[0]) => (
    <PostCard key={post.id} post={post} />
  ), []);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(renderPost)}
    </div>
  );
});