import { trpc } from '@/lib/trpc/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Calendar } from 'lucide-react';

interface PostPageProps {
  params: Promise<{    
    slug: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const { slug } = await params;
    const post = await trpc.post.getBySlug({ slug }); 

    return (
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8">
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
          <div className="flex flex-wrap gap-2 mb-4">
            {post.postCategories.map((pc) => (
              <Badge key={pc.category.slug} variant="secondary">
                {pc.category.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-muted-foreground mb-8">
            {post.excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span className="font-medium">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-2">
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
  } catch (error) {
    notFound();
  }
}
