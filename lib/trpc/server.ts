import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';
import { headers } from 'next/headers';

export const createServerTRPC = async () => {
  return appRouter.createCaller(
    await createTRPCContext({
      headers: await headers(),
    })
  );
};

export const trpc = {
  post: {
    getAll: async (input: Parameters<Awaited<ReturnType<typeof createServerTRPC>>['post']['getAll']>[0]) => {
      const caller = await createServerTRPC();
      return caller.post.getAll(input);
    },
    getFeatured: async (input: Parameters<Awaited<ReturnType<typeof createServerTRPC>>['post']['getFeatured']>[0]) => {
      const caller = await createServerTRPC();
      return caller.post.getFeatured(input);
    },
    getBySlug: async (input: Parameters<Awaited<ReturnType<typeof createServerTRPC>>['post']['getBySlug']>[0]) => {
      const caller = await createServerTRPC();
      return caller.post.getBySlug(input);
    },
    getById: async (input: Parameters<Awaited<ReturnType<typeof createServerTRPC>>['post']['getById']>[0]) => {
      const caller = await createServerTRPC();
      return caller.post.getById(input);
    },
  },
  category: {
    getAll: async () => {
      const caller = await createServerTRPC();
      return caller.category.getAll();
    },
    getBySlug: async (input: Parameters<Awaited<ReturnType<typeof createServerTRPC>>['category']['getBySlug']>[0]) => {
      const caller = await createServerTRPC();
      return caller.category.getBySlug(input);
    },
  },
};
