export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithPostCount extends Category {
  _count?: {
    postCategories: number;
  };
}

export interface CreateCategoryInput {
  name: string;
  description?: string | null;
}

export interface UpdateCategoryInput {
  id: number;
  name?: string;
  description?: string | null;
}
