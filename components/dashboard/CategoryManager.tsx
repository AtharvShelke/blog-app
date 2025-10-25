'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CategoryForm } from './CategoryForm';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Plus, FolderOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CategoryManagerProps {
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date;
  }>;
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [editCategory, setEditCategory] = useState<typeof categories[0] | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const deleteMutation = trpc.category.delete.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
      router.refresh();
      setDeleteId(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-muted-foreground">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'} total
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>
                Add a new category to organize your posts
              </DialogDescription>
            </DialogHeader>
            <CategoryForm onSuccess={() => setCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No categories yet</p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              Create Your First Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="outline" className="mt-2 text-xs">
                      /{category.slug}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Dialog open={editCategory?.id === category.id} onOpenChange={(open) => !open && setEditCategory(null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditCategory(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Category</DialogTitle>
                          <DialogDescription>
                            Update category information
                          </DialogDescription>
                        </DialogHeader>
                        <CategoryForm
                          category={category}
                          onSuccess={() => setEditCategory(null)}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(category.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {category.description && (
                <CardContent>
                  <CardDescription className="line-clamp-2">
                    {category.description}
                  </CardDescription>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
