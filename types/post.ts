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

export interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}
export interface EditPostPageProps {
  params: Promise<{
    slug: string;  
  }>;
}

export interface PostFormProps {
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

export interface PostTableProps {
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