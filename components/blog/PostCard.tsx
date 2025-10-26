'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Clock, TrendingUp } from 'lucide-react';

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
    <Card className="h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group border border-border/50 bg-card">
      {/* Thumbnail Section */}
      <Link href={`/blog/${post.slug}`}>
        <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <TrendingUp className="w-16 h-16 text-primary/20" />
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <CardHeader className="space-y-3 pb-3">
        {/* Categories */}
        {post.postCategories && post.postCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {post.postCategories.slice(0, 2).map((pc) => (
              <Badge 
                key={pc.category.slug} 
                variant="secondary" 
                className="text-xs font-medium hover:bg-primary/20 transition-colors"
              >
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
        <CardTitle className="line-clamp-2 leading-snug text-xl">
          <Link 
            href={`/blog/${post.slug}`}
            className="hover:text-primary transition-colors duration-200"
          >
            {post.title}
          </Link>
        </CardTitle>

        {/* Excerpt */}
        {post.excerpt && (
          <CardDescription className="line-clamp-3 text-sm leading-relaxed">
            {post.excerpt}
          </CardDescription>
        )}
      </CardHeader>

      <CardFooter className="pt-0 flex items-center justify-between border-t border-border/50 mt-4 pt-4">
        {/* Author Info */}
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 border-2 border-border">
            <AvatarImage src={post.author.avatar || undefined} />
            <AvatarFallback className="text-xs bg-primary/10">
              {post.author.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-foreground">{post.author.name}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
