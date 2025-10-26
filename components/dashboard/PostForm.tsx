'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { MarkdownPreview } from '@/components/editor/MarkdownPreview';
import { UploadButton } from '@/lib/uploadthing';
import { Loader2, Upload, X, Save, Eye } from 'lucide-react';
import Image from 'next/image';
import { PostFormProps } from '@/types/post';
import { useEditorStore } from '@/store/editorStore';

export function PostForm({ post, categories }: PostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { content, setContent } = useEditorStore();

  const [title, setTitle] = useState(post?.title || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [thumbnail, setThumbnail] = useState(post?.thumbnail || '');
  const [published, setPublished] = useState(post?.published || false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    post?.postCategories?.map((pc) => pc.categoryId) || []
  );

  const createPost = trpc.post.create.useMutation();
  const updatePost = trpc.post.update.useMutation();

  // Initialize editor content - FIXED VERSION
  useEffect(() => {
    if (post?.content && content !== post.content) {
      setContent(post.content);
    }
  }, [post?.content]); // Only run when post.content changes


  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title,
      content,
      excerpt: excerpt || null,
      thumbnail: thumbnail || null,
      published,
      categoryIds: selectedCategories,
    };

    startTransition(async () => {
      try {
        if (post) {
          await updatePost.mutateAsync({ id: post.id, ...data });
        } else {
          await createPost.mutateAsync(data);
        }
        router.push('/dashboard/posts');
        router.refresh();
      } catch (error) {
        console.error('Error saving post:', error);
      }
    });
  };

  const isLoading = isPending || createPost.isPending || updatePost.isPending;
  const error = createPost.error || updatePost.error;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an engaging title..."
              required
              maxLength={200}
              disabled={isLoading}
              className="text-lg font-semibold"
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/200 characters
            </p>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Input
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary (shown in cards)..."
              maxLength={200}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {excerpt.length}/200 characters
            </p>
          </div>

          {/* Content Editor with Preview */}
          <div className="space-y-2">
            <Label>Content *</Label>
            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="edit">
                  <Upload className="w-4 h-4 mr-2" />
                  Edit
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="mt-4">
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your content in markdown..."
                />
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <MarkdownPreview content={content} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published" className="cursor-pointer">
                  Publish Status
                </Label>
                <Checkbox
                  id="published"
                  checked={published}
                  onCheckedChange={(checked) => setPublished(checked as boolean)}
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {published
                  ? 'Post will be visible to everyone'
                  : 'Post will be saved as draft'}
              </p>
            </CardContent>
          </Card>

          {/* Thumbnail */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Label>Thumbnail Image</Label>

              {thumbnail ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border group">
                  <Image
                    src={thumbnail}
                    alt="Thumbnail"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setThumbnail('')}
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-3">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <div>
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]?.url) {
                          setThumbnail(res[0].url);
                        }
                      }}
                      onUploadError={(error: Error) => {
                        alert(`Upload failed: ${error.message}`);
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended: 1200x630px
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Categories */}
          {categories.length > 0 && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Label>Categories</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <Checkbox
                        id={`cat-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor={`cat-${category.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              {post ? 'Update Post' : 'Create Post'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
