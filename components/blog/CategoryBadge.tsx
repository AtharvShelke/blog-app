import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface CategoryBadgeProps {
  name: string;
  slug: string;
  variant?: 'default' | 'secondary' | 'outline';
  clickable?: boolean;
}

export function CategoryBadge({ 
  name, 
  slug, 
  variant = 'secondary',
  clickable = true 
}: CategoryBadgeProps) {
  if (clickable) {
    return (
      <Link href={`/blog?category=${slug}`}>
        <Badge 
          variant={variant}
          className="cursor-pointer hover:bg-primary/20 transition-colors"
        >
          {name}
        </Badge>
      </Link>
    );
  }

  return <Badge variant={variant}>{name}</Badge>;
}
