// components/blog/PostViewTracker.tsx
'use client';

import { useEffect } from 'react';
import { trpc } from '@/lib/trpc/client';

interface PostViewTrackerProps {
  postId: number;
  userId?: number;
}

export function PostViewTracker({ postId, userId }: PostViewTrackerProps) {
  const recordView = trpc.post.recordView.useMutation();

  useEffect(() => {
    // Record view when component mounts
    recordView.mutate({ postId, userId });
  }, [postId, userId]);

  return null; // This component doesn't render anything
}