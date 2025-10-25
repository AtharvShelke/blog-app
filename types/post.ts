import { Category } from './category';
import { User } from './index';


export interface Post {
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
}

export interface PostWithRelations extends Post {
  author: User;
  postCategories: Array<{
    id: number;
    postId: number;
    categoryId: number;
    category: Category;
  }>;
}

export interface CreatePostInput {
  title: string;
  content: string;
  excerpt?: string | null;
  thumbnail?: string | null;
  published?: boolean;
  categoryIds?: number[];
}

export interface UpdatePostInput {
  id: number;
  title?: string;
  content?: string;
  excerpt?: string | null;
  thumbnail?: string | null;
  published?: boolean;
  categoryIds?: number[];
}

export interface PostFilter {
  published?: boolean;
  categoryId?: number;
  search?: string;
  limit?: number;
  offset?: number;
}
