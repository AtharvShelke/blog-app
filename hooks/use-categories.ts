import { useQuery } from "@tanstack/react-query";

export const categoryKeys = {
  all: ["categories"] as const,
  detail: (slug: string) => [...categoryKeys.all, slug] as const,
};

async function fetchCategories() {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

async function fetchCategoryBySlug(slug: string) {
  const res = await fetch(`/api/categories/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
}

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: fetchCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 24 * 1000, // 24 hours
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => fetchCategoryBySlug(slug),
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!slug,
  });
}
