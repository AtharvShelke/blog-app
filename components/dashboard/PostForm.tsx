'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UploadButton } from '@/lib/uploadthing';
import Image from 'next/image';
import { X, Upload, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface PostFormProps {
  post?: {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    thumbnail: string | null;
    published: boolean;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    postCategories?: Array<{
      id: number;
      postId: number;
      categoryId: number;
      category: {
        id: number;
        name: string;
        slug: string;
        description: string | null;
      };
    }>;
    author: {
      id: number;
      name: string;
      email: string;
      avatar: string | null;
      bio: string | null;
      createdAt: Date;
    };
  };
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export function PostForm({ post, categories }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [thumbnail, setThumbnail] = useState(post?.thumbnail || '');
  const [published, setPublished] = useState(post?.published || false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    post?.postCategories?.map(pc => pc.categoryId) || []
  );

  const createPost = trpc.post.create.useMutation();
  const updatePost = trpc.post.update.useMutation();

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (post) {
        await updatePost.mutateAsync({
          id: post.id,
          title,
          content,
          excerpt: excerpt || null,
          thumbnail: thumbnail || null,
          published,
          categoryIds: selectedCategories,
        });
      } else {
        await createPost.mutateAsync({
          title,
          content,
          excerpt: excerpt || null,
          thumbnail: thumbnail || null,
          published,
          categoryIds: selectedCategories,
        });
      }
      router.push('/dashboard/posts');
      router.refresh();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const isLoading = createPost.isPending || updatePost.isPending;
  const error = createPost.error || updatePost.error;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title..."
          required
          maxLength={200}
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief summary of your post..."
          rows={2}
          maxLength={500}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {excerpt.length}/500 characters
        </p>
      </div>

      {/* Thumbnail Upload Section */}
      <div className="space-y-4">
        <Label>Thumbnail Image</Label>
        
        {thumbnail ? (
          <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border group">
            <Image
              src={thumbnail}
              alt="Post thumbnail"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setThumbnail('')}
                className="gap-2"
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
                Remove Thumbnail
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Upload a thumbnail image for your post
            </p>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res?.[0]?.ufsUrl) {
                  setThumbnail(res[0].ufsUrl);
                  alert('✅ Thumbnail uploaded successfully!');
                }
              }}
              onUploadError={(error: Error) => {
                alert(`❌ Upload failed: ${error.message}`);
              }}
              appearance={{
                button: "ut-uploading:cursor-not-allowed bg-primary text-primary-foreground hover:bg-primary/90",
                container: "w-max mx-auto",
                allowedContent: "hidden",
              }}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Recommended: 1200x630px, Max 4MB
            </p>
          </div>
        )}
      </div>

      {/* ✅ FIXED: Categories Selection - Removed onClick from div */}
      {categories.length > 0 && (
        <div className="space-y-3">
          <Label>Categories</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-secondary/50"
              >
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                  disabled={isLoading}
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="cursor-pointer flex-1"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="content">Content (Markdown supported) *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content in Markdown..."
          required
          rows={20}
          className="font-mono text-sm"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Supports Markdown formatting
        </p>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Checkbox
            id="published"
            checked={published}
            onCheckedChange={(checked) => setPublished(checked as boolean)}
            disabled={isLoading}
          />
          <Label htmlFor="published" className="cursor-pointer">
            Publish immediately
          </Label>
        </div>
      </div>
    </form>
  );
}
