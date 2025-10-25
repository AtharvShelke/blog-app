'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { User, Calendar } from 'lucide-react';

interface PostCardProps {
  post: {
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
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* ⭐ NEW: Thumbnail Section */}
      {post.thumbnail && (
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader className="space-y-3">
        {/* Categories */}
        {post.postCategories && post.postCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {post.postCategories.slice(0, 2).map((pc) => (
              <Badge key={pc.category.slug} variant="secondary" className="text-xs">
                {pc.category.name}
              </Badge>
            ))}
            {post.postCategories.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{post.postCategories.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Title */}
        <CardTitle className="line-clamp-2 leading-snug">
          <Link 
            href={`/blog/${post.slug}`} 
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </CardTitle>

        {/* Excerpt */}
        {post.excerpt && (
          <CardDescription className="line-clamp-3 text-sm">
            {post.excerpt}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{post.author.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}