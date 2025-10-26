import { trpc } from '@/lib/trpc/server';
import { PostForm } from '@/components/dashboard/PostForm';
import { notFound } from 'next/navigation';
import type { EditPostPageProps } from '@/types/post';



export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;  

  try {
    const post = await trpc.post.getBySlug({ slug }); 
    const categories = await trpc.category.getAll();

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Post</h1>
          <p className="text-muted-foreground">
            Update your blog post
          </p>
        </div>

        <PostForm post={post} categories={categories} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
