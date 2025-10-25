'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Calendar } from 'lucide-react';

interface PostDetailProps {
  post: {
    id: number;
    title: string;
    content: string;
    excerpt: string | null;
    thumbnail: string | null;
    createdAt: Date;
    author: {
      name: string;
      avatar: string | null;
    };
    postCategories?: Array<{
      category: {
        name: string;
        slug: string;
      };
    }>;
  };
}

export function PostDetail({ post }: PostDetailProps) {
  return (
    <article className="space-y-8">
      {/* Thumbnail */}
      {post.thumbnail && (
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Categories */}
      {post.postCategories && post.postCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.postCategories.map((pc) => (
            <Badge key={pc.category.slug} variant="secondary">
              {pc.category.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-5xl font-bold leading-tight">
        {post.title}
      </h1>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-xl text-muted-foreground">
          {post.excerpt}
        </p>
      )}

      {/* Meta Info */}
      <div className="flex items-center gap-6 pb-8 border-b">
        <div className="flex items-center gap-2">
          {post.author.avatar ? (
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          )}
          <span className="font-medium">{post.author.name}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-5 h-5" />
          <span>
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
