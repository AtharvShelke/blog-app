import { CategoryManager } from '@/components/dashboard/CategoryManager';
import { trpc } from '@/lib/trpc/server';

export default async function CategoriesPage() {
  const categories = await trpc.category.getAll();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">
          Organize your blog content
        </p>
      </div>

      <CategoryManager categories={categories} />
    </div>
  );
}
