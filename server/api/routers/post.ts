import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { posts, postCategories, categories, users, postViews } from '@/server/db/schema'; // ✅ Added missing imports
import { eq, desc, and, or, like, sql, gt, count } from 'drizzle-orm'; // ✅ Added missing imports
import slugify from 'slugify';
import { TRPCError } from '@trpc/server';
import { headers } from 'next/headers'; // ✅ Added headers import

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required").max(50000),
  excerpt: z.string().max(500).nullish(),
  thumbnail: z.string().url().nullish().or(z.literal('')),
  published: z.boolean().default(false),
  categoryIds: z.array(z.number()).optional(),
});

const updatePostSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(50000).optional(),
  excerpt: z.string().max(500).nullish(),
  thumbnail: z.string().url().nullish().or(z.literal('')),
  published: z.boolean().optional(),
  categoryIds: z.array(z.number()).optional(),
});

export const postRouter = createTRPCRouter({
  // Enhanced getAll with pagination and proper filtering
  getAll: publicProcedure
    .input(
      z.object({
        published: z.boolean().optional(),
        categorySlug: z.string().optional(),
        search: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(12),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, published, categorySlug, search } = input;
      const offset = (page - 1) * limit;

      // Build WHERE conditions
      const conditions = [];
      if (published !== undefined) {
        conditions.push(eq(posts.published, published));
      }
      if (search) {
        conditions.push(
          or(
            like(posts.title, `%${search}%`),
            like(posts.content, `%${search}%`),
            like(posts.excerpt, `%${search}%`)
          )
        );
      }

      // Fetch all posts with relations
      let results = await ctx.db.query.posts.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        with: {
          author: true,
          postCategories: {
            with: {
              category: true,
            },
          },
        },
        orderBy: [desc(posts.createdAt)],
      });

      // Filter by category if provided (post-fetch filtering for many-to-many)
      if (categorySlug) {
        results = results.filter(post =>
          post.postCategories.some(pc => pc.category.slug === categorySlug)
        );
      }

      // Calculate pagination
      const total = results.length;
      const paginatedResults = results.slice(offset, offset + limit);

      return {
        posts: paginatedResults,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasMore: offset + limit < total,
        },
      };
    }),

  // ✅ FIXED: Trending posts with proper imports
  getTrending: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(5),
        days: z.number().min(1).max(30).default(7), // Trending from last 7 days
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, days } = input;
      
      // Calculate date threshold (last X days)
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);

      try {
        const trendingPosts = await ctx.db
          .select({
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            excerpt: posts.excerpt,
            thumbnail: posts.thumbnail,
            createdAt: posts.createdAt,
            published: posts.published,
            author: users,
            viewCount: count(postViews.id).as('viewCount'),
          })
          .from(posts)
          .where(
            and(
              eq(posts.published, true),
              gt(posts.createdAt, dateThreshold)
            )
          )
          .leftJoin(users, eq(posts.authorId, users.id))
          .leftJoin(postViews, and(
            eq(postViews.postId, posts.id),
            gt(postViews.createdAt, dateThreshold)
          ))
          .groupBy(posts.id, users.id)
          .orderBy(desc(count(postViews.id)), desc(posts.createdAt))
          .limit(limit);

        // Also fetch categories for each post
        const postsWithCategories = await Promise.all(
          trendingPosts.map(async (post) => {
            const postCategoriesData = await ctx.db.query.postCategories.findMany({
              where: eq(postCategories.postId, post.id),
              with: {
                category: true,
              },
            });

            return {
              ...post,
              postCategories: postCategoriesData,
            };
          })
        );

        return postsWithCategories;
      } catch (error) {
        console.error('Error fetching trending posts:', error);
        
        // Fallback to recent posts if trending query fails
        return await ctx.db.query.posts.findMany({
          where: (posts, { and, gt, eq }) => and(
            eq(posts.published, true),
            gt(posts.createdAt, dateThreshold)
          ),
          orderBy: (posts, { desc }) => [desc(posts.createdAt)],
          limit,
          with: {
            author: true,
            postCategories: {
              with: {
                category: true,
              },
            },
          },
        });
      }
    }),

  // ✅ FIXED: Record view with proper imports
  recordView: publicProcedure
    .input(
      z.object({
        postId: z.number(),
        userId: z.number().optional(), // Optional for logged-in users
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, userId } = input;
      
      try {
        // Get IP address from request
        const headersList = await headers();
        const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || 
                         headersList.get('x-real-ip') || 
                         'unknown';
        
        const userAgent = headersList.get('user-agent') || 'unknown';

        // Check if we should record this view (basic duplicate prevention)
        const recentView = await ctx.db.query.postViews.findFirst({
          where: (views, { and, eq, gt }) => and(
            eq(views.postId, postId),
            eq(views.ipAddress, ipAddress),
            gt(views.createdAt, new Date(Date.now() - 30 * 60 * 1000)) // 30 minutes
          ),
        });

        if (recentView) {
          return { success: true, message: 'View already recorded recently' };
        }

        // Record the view
        await ctx.db.insert(postViews).values({
          postId,
          userId: userId || null,
          ipAddress,
          userAgent,
        });

        return { success: true, message: 'View recorded' };
      } catch (error) {
        console.error('Error recording post view:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to record view',
        });
      }
    }),

  // Optimized method for just getting featured + recent (no pagination needed)
  getFeatured: publicProcedure
    .input(z.object({ 
      count: z.number().min(1).max(10).default(4) 
    }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db.query.posts.findMany({
        where: eq(posts.published, true),
        with: {
          author: true,
          postCategories: {
            with: {
              category: true,
            },
          },
        },
        orderBy: [desc(posts.createdAt)],
        limit: input.count,
      });

      return results;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.slug, input.slug),
        with: {
          author: true,
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      return post;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
        with: {
          author: true,
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      return post;
    }),

  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { categoryIds, ...postData } = input;

        let slug = slugify(postData.title, { lower: true, strict: true });
        const existingPost = await ctx.db.query.posts.findFirst({
          where: eq(posts.slug, slug),
        });

        if (existingPost) {
          slug = `${slug}-${Date.now()}`;
        }

        const [newPost] = await ctx.db
          .insert(posts)
          .values({
            title: postData.title,
            content: postData.content,
            excerpt: postData.excerpt ?? null,
            thumbnail: postData.thumbnail ?? null,
            published: postData.published,
            slug,
            authorId: ctx.user.id,
          })
          .returning();

        if (categoryIds && categoryIds.length > 0) {
          await ctx.db.insert(postCategories).values(
            categoryIds.map(categoryId => ({
              postId: newPost.id,
              categoryId,
            }))
          );
        }

        return newPost;
      } catch (error) {
        console.error('Error creating post:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create post',
          cause: error,
        });
      }
    }),

  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, categoryIds, ...updateData } = input;

        const existingPost = await ctx.db.query.posts.findFirst({
          where: eq(posts.id, id),
        });

        if (!existingPost) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
          });
        }

        if (existingPost.authorId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to update this post',
          });
        }

        const updateFields: Partial<typeof posts.$inferInsert> = {
          updatedAt: new Date(),
        };

        if (updateData.title !== undefined) {
          updateFields.title = updateData.title;
          updateFields.slug = slugify(updateData.title, { lower: true, strict: true });
        }
        if (updateData.content !== undefined) updateFields.content = updateData.content;
        if (updateData.excerpt !== undefined) updateFields.excerpt = updateData.excerpt ?? null;
        if (updateData.thumbnail !== undefined) updateFields.thumbnail = updateData.thumbnail ?? null;
        if (updateData.published !== undefined) updateFields.published = updateData.published;

        const [updatedPost] = await ctx.db
          .update(posts)
          .set(updateFields)
          .where(eq(posts.id, id))
          .returning();

        if (categoryIds !== undefined) {
          await ctx.db.delete(postCategories).where(eq(postCategories.postId, id));
          if (categoryIds.length > 0) {
            await ctx.db.insert(postCategories).values(
              categoryIds.map(categoryId => ({
                postId: id,
                categoryId,
              }))
            );
          }
        }

        return updatedPost;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Error updating post:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update post',
          cause: error,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existingPost = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });

      if (!existingPost) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      if (existingPost.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this post',
        });
      }

      await ctx.db.delete(posts).where(eq(posts.id, input.id));
      return { success: true };
    }),

  togglePublish: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      if (post.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to modify this post',
        });
      }

      const [updatedPost] = await ctx.db
        .update(posts)
        .set({
          published: !post.published,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, input.id))
        .returning();

      return updatedPost;
    }),
});