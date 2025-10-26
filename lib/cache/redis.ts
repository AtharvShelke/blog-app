import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Use rediss:// for TLS connections
const redisUrl = `rediss://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@redis-18667.c74.us-east-1-4.ec2.redns.redis-cloud.com:18667`;

const client = createClient({
  url: redisUrl,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

client.on('error', (err) => console.error('Redis Client Error:', err));

await client.connect();


const CACHE_TTL = {
  SHORT: 60 * 5,       // 5 minutes
  MEDIUM: 60 * 30,     // 30 minutes
  LONG: 60 * 60 * 24,  // 24 hours
} as const;

export const cache = {
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const data = await client.get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  set: async <T>(key: string, value: T, ttl: number = CACHE_TTL.MEDIUM): Promise<void> => {
    try {
      await client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },

  invalidate: async (pattern: string): Promise<void> => {
    try {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  },
};

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
