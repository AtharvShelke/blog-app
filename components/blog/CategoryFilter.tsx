'use client';

import { Badge } from '@/components/ui/badge';
import { CategoryFilterProps } from '@/types/category';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';
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
        params.delete('category');
        params.delete('page');
        router.push('/blog');
      } else {
        params.set('category', slug);
        params.delete('page');
        router.push(`/blog?${params.toString()}`);
      }
    });
  };

  const activeCategory = categories.find(cat => cat.slug === currentCategory);

  return (
    <div className="space-y-4">
      {/* Active Filter Display */}
      {activeCategory && (
        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Viewing:</span>
            <Badge variant="secondary" className="text-primary border-primary/20">
              {activeCategory.name}
            </Badge>
          </div>
          <button
            onClick={() => handleCategoryClick(null)}
            className="p-1 hover:bg-background rounded transition-colors"
            disabled={isPending}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`p-3 rounded-xl border text-left transition-all duration-200 ${
            !currentCategory 
              ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105' 
              : 'bg-card/50 border-border hover:border-primary/50 hover:scale-105'
          } ${isPending ? 'opacity-50' : ''}`}
          disabled={isPending}
        >
          <div className="flex items-center gap-2 mb-1">
            <Filter className="w-4 h-4" />
            <span className="font-medium text-sm">All Posts</span>
          </div>
          <div className="text-xs text-muted-foreground">Everything</div>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.slug)}
            className={`p-3 rounded-xl border text-left transition-all duration-200 ${
              currentCategory === category.slug
                ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105' 
                : 'bg-card/50 border-border hover:border-primary/50 hover:scale-105'
            } ${isPending ? 'opacity-50' : ''}`}
            disabled={isPending}
          >
            <div className="font-medium text-sm mb-1">{category.name}</div>
            <div className="text-xs text-muted-foreground line-clamp-2">
              {category.description || 'Explore articles'}
            </div>
          </button>
        ))}
      </div>

      {/* Loading Indicator */}
      {isPending && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}