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


export interface CategoryFilterProps {
  categories: Category[];
}
export interface CategoryManagerProps {
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date;
  }>;
}

export interface CategoryFormProps {
  category?: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
  };
  onSuccess?: () => void;
}