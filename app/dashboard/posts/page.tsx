import { trpc } from '@/lib/trpc/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PenSquare } from 'lucide-react';
import { PostTable } from '@/components/dashboard/PostTable';

export default async function PostsManagementPage() {
  const posts = await trpc.post.getAll({});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog posts
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/posts/new">
            <PenSquare className="w-4 h-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      <PostTable posts={posts} />
    </div>
  );
}
