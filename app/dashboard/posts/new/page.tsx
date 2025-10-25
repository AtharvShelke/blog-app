import { PostForm } from '@/components/dashboard/PostForm';
import { trpc } from '@/lib/trpc/server';

export default async function NewPostPage() {
  const categories = await trpc.category.getAll();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground">
          Write and publish your next blog post
        </p>
      </div>

      <PostForm categories={categories} />
    </div>
  );
}
