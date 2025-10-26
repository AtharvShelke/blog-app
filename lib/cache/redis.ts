import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const CACHE_TTL = {
  SHORT: 60 * 5, // 5 minutes
  MEDIUM: 60 * 30, // 30 minutes
  LONG: 60 * 60 * 24, // 24 hours
} as const;

export const cache = {
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const data = await redis.get(key);
      return data as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  set: async <T>(key: string, value: T, ttl: number = CACHE_TTL.MEDIUM): Promise<void> => {
    try {
      await redis.setex(key, ttl, value);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },

  invalidate: async (pattern: string): Promise<void> => {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  },
};

// Cache keys
export const cacheKeys = {
  posts: {
    all: (filters: any) => `posts:${JSON.stringify(filters)}`,
    bySlug: (slug: string) => `post:${slug}`,
    featured: () => 'posts:featured',
  },
  categories: {
    all: 'categories:all',
    bySlug: (slug: string) => `category:${slug}`,
  },
};