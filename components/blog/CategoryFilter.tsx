'use client';

import { Badge } from '@/components/ui/badge';
import { CategoryFilterProps } from '@/types/category';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';
import { useTransition } from 'react';

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const [isPending, startTransition] = useTransition();

  const handleCategoryClick = (slug: string | null) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (slug === null || currentCategory === slug) {
        // Clear category filter and reset to page 1
        params.delete('category');
        params.delete('page');
        router.push('/blog');
      } else {
        // Set new category and reset to page 1
        params.set('category', slug);
        params.delete('page'); // Reset pagination when changing category
        router.push(`/blog?${params.toString()}`);
      }
    });
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">Filter:</span>
      </div>
      
      <Badge
        variant={!currentCategory ? 'default' : 'outline'}
        className={`cursor-pointer px-4 py-2 transition-all duration-200 ${
          isPending ? 'opacity-50' : 'hover:scale-105'
        }`}
        onClick={() => handleCategoryClick(null)}
      >
        All Posts
      </Badge>
      
      {categories.map((category) => (
        <Badge
          key={category.id}
          variant={currentCategory === category.slug ? 'default' : 'outline'}
          className={`cursor-pointer px-4 py-2 transition-all duration-200 ${
            isPending ? 'opacity-50' : 'hover:scale-105'
          }`}
          onClick={() => handleCategoryClick(category.slug)}
        >
          {category.name}
        </Badge>
      ))}
      
      {isPending && (
        <div className="ml-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
