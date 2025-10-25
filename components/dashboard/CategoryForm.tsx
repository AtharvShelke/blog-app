'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CategoryFormProps {
  category?: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
  };
  onSuccess?: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');

  const createMutation = trpc.category.create.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
      router.refresh();
      onSuccess?.();
      setName('');
      setDescription('');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = trpc.category.update.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
      router.refresh();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (category) {
      updateMutation.mutate({
        id: category.id,
        name,
        description: description || null,
      });
    } else {
      createMutation.mutate({
        name,
        description: description || null,
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Technology"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Posts about technology and programming"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {category ? 'Update Category' : 'Create Category'}
      </Button>
    </form>
  );
}
