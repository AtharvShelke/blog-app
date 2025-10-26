'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { CategoryFormProps } from '@/types/category';

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');

  const createCategory = trpc.category.create.useMutation();
  const updateCategory = trpc.category.update.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (category) {
        await updateCategory.mutateAsync({
          id: category.id,
          name,
          description: description || null,
        });
      } else {
        await createCategory.mutateAsync({
          name,
          description: description || null,
        });
      }
      
      router.refresh();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const isLoading = createCategory.isPending || updateCategory.isPending;
  const error = createCategory.error || updateCategory.error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Technology, Design..."
          required
          maxLength={50}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this category..."
          rows={3}
          maxLength={200}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess?.()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {category ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
