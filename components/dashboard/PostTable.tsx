'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trpc } from '@/lib/trpc/client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostTableProps {
    posts: Array<{
        id: number;
        title: string;
        slug: string;
        published: boolean;
        createdAt: Date;
        author: {
            name: string;
        };
        postCategories?: Array<{
            category: {
                name: string;
            };
        }>;
    }>;
}

export function PostTable({ posts }: PostTableProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const deleteMutation = trpc.post.delete.useMutation({
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Post deleted successfully',
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

    const togglePublishMutation = trpc.post.togglePublish.useMutation({
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Post status updated',
            });
            router.refresh();
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    if (posts.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No posts yet. Create your first post!</p>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Categories</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell className="font-medium max-w-xs truncate">
                                    {post.title}
                                </TableCell>
                                <TableCell>{post.author.name}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1 flex-wrap">
                                        {post.postCategories?.slice(0, 2).map((pc) => (
                                            <Badge key={pc.category.name} variant="outline" className="text-xs">
                                                {pc.category.name}
                                            </Badge>
                                        ))}
                                        {(post.postCategories?.length ?? 0) > 2 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{(post.postCategories?.length ?? 0) - 2}
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={post.published ? 'default' : 'secondary'}>
                                        {post.published ? 'Published' : 'Draft'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => togglePublishMutation.mutate({ id: post.id })}
                                            disabled={togglePublishMutation.isPending}
                                        >
                                            {post.published ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/dashboard/posts/${post.slug}/edit`}>                         <Edit className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setDeleteId(post.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the post.
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
        </>
    );
}
