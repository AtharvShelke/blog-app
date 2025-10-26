'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { User, Calendar, ArrowRight, Clock } from 'lucide-react';

interface FeaturedPostProps {
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

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl group border border-border/50">
      {/* Hero Image */}
      <div className="relative w-full h-[600px] bg-gradient-to-br from-muted to-muted/50">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center">
            <div className="text-8xl font-bold text-primary/20">FEATURED</div>
          </div>
        )}
        
        {/* Sophisticated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        {/* Accent Border Effect */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
        <div className="max-w-4xl">
          {/* Featured Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold mb-6 animate-pulse">
            ⭐ Featured Article
          </div>

          {/* Categories */}
          {post.postCategories && post.postCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {post.postCategories.slice(0, 3).map((pc) => (
                <Badge 
                  key={pc.category.slug} 
                  variant="secondary" 
                  className="bg-white/15 backdrop-blur-md text-white border-white/20 hover:bg-white/25 transition-colors"
                >
                  {pc.category.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <Link 
              href={`/blog/${post.slug}`}
              className="hover:text-primary transition-colors duration-300 bg-gradient-to-r from-white to-gray-200 bg-clip-text hover:from-primary hover:to-primary/80"
            >
              {post.title}
            </Link>
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg md:text-xl text-gray-200 mb-8 line-clamp-2 max-w-3xl leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta Info & CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
            </div>

            {/* CTA Button */}
            <Link href={`/blog/${post.slug}`}>
              <Button 
                size="lg"
                className="group/btn bg-white text-black hover:bg-white/90 font-semibold shadow-lg"
              >
                Read Full Story
                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
