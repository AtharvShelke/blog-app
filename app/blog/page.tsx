import { trpc } from '@/lib/trpc/server';
import { PostList } from '@/components/blog/PostList';
import { CategoryFilter } from '@/components/blog/CategoryFilter';

export default async function BlogPage() {

  const posts = await trpc.post.getAll({ published: true });
  const categories = await trpc.category.getAll();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground">
          Explore our latest articles and insights
        </p>
      </div>

      <div className="mb-8">
        <CategoryFilter categories={categories} />
      </div>

      <PostList posts={posts} />
    </div>
  );
}