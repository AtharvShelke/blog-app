'use client';

import { Badge } from '@/components/ui/badge';
import { CategoryFilterProps } from '@/types/category';
import { useRouter, useSearchParams } from 'next/navigation';



export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  const handleCategoryClick = (slug: string) => {
    if (currentCategory === slug) {
      router.push('/blog');
    } else {
      router.push(`/blog?category=${slug}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={!currentCategory ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => router.push('/blog')}
      >
        All
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category.id}
          variant={currentCategory === category.slug ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => handleCategoryClick(category.slug)}
        >
          {category.name}
        </Badge>
      ))}
    </div>
  );
}
