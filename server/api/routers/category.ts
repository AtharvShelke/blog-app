import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { categories } from '@/server/db/schema';
import { eq, asc } from 'drizzle-orm';
import slugify from 'slugify';
import { TRPCError } from '@trpc/server';

const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).nullish(),
});

const updateCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullish(),
});

export const categoryRouter = createTRPCRouter({
  
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.categories.findMany({
      orderBy: [asc(categories.name)],
    });
  }),

  
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.slug, input.slug),
      });

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      return category;
    }),

 
  create: protectedProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
       
        let slug = slugify(input.name, { lower: true, strict: true });
        const existingCategory = await ctx.db.query.categories.findFirst({
          where: eq(categories.slug, slug),
        });

        if (existingCategory) {
          slug = `${slug}-${Date.now()}`;
        }

        const [newCategory] = await ctx.db
          .insert(categories)
          .values({
            name: input.name,
            description: input.description ?? null,
            slug,
          })
          .returning();

        return newCategory;
      } catch (error) {
        console.error('Error creating category:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create category',
          cause: error,
        });
      }
    }),

 
  update: protectedProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;

        const existingCategory = await ctx.db.query.categories.findFirst({
          where: eq(categories.id, id),
        });

        if (!existingCategory) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Category not found',
          });
        }

      
        const updateFields: Partial<typeof categories.$inferInsert> = {
          updatedAt: new Date(),
        };

        if (updateData.name !== undefined) {
          updateFields.name = updateData.name;
          updateFields.slug = slugify(updateData.name, { lower: true, strict: true });
        }
        if (updateData.description !== undefined) {
          updateFields.description = updateData.description ?? null;
        }

        const [updatedCategory] = await ctx.db
          .update(categories)
          .set(updateFields)
          .where(eq(categories.id, id))
          .returning();

        return updatedCategory;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Error updating category:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update category',
          cause: error,
        });
      }
    }),

 
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existingCategory = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input.id),
      });

      if (!existingCategory) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      await ctx.db.delete(categories).where(eq(categories.id, input.id));

      return { success: true };
    }),
});
