import 'dotenv/config';
import { db } from './index';
import { users, categories, posts, postCategories } from './schema';
import { DUMMY_USERS_FOR_SEED } from '@/lib/constants';
import slugify from 'slugify';

async function seed() {
  console.log('🌱 Seeding database...');
  
  // Verify DATABASE_URL is loaded
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file');
    process.exit(1);
  }

  // Insert dummy users
  const insertedUsers = await db.insert(users).values(DUMMY_USERS_FOR_SEED).returning();
  console.log(`✅ Inserted ${insertedUsers.length} users`);

  // Insert categories
  const categoriesData = [
    { name: 'Technology', description: 'Posts about technology and programming' },
    { name: 'Design', description: 'UI/UX and graphic design articles' },
    { name: 'Business', description: 'Business and entrepreneurship insights' },
    { name: 'Lifestyle', description: 'Lifestyle and personal development' },
    { name: 'Travel', description: 'Travel experiences and tips' },
  ];

  const insertedCategories = await db.insert(categories).values(
    categoriesData.map(cat => ({
      ...cat,
      slug: slugify(cat.name, { lower: true }),
    }))
  ).returning();
  console.log(`✅ Inserted ${insertedCategories.length} categories`);

  // Insert sample posts with placeholder thumbnails
  const postsData = [
    {
      title: 'Getting Started with Next.js 15',
      content: `# Introduction to Next.js 15

Next.js 15 brings amazing new features including improved App Router performance, enhanced server components, and better developer experience.

## Key Features

- **Turbopack**: Faster builds and hot module replacement
- **Partial Prerendering**: Improved rendering strategies
- **Server Actions**: Simplified data mutations

## Conclusion

Next.js 15 is a game-changer for modern web development.`,
      excerpt: 'Learn about the latest features in Next.js 15 and how they improve web development',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
      published: true,
      authorId: insertedUsers[0].id,
    },
    {
      title: 'The Art of UI Design in 2025',
      content: `# Design Principles for Modern Interfaces

Great design is about creating intuitive, accessible, and beautiful experiences.

## Core Principles

1. **Simplicity**: Less is more
2. **Consistency**: Maintain patterns
3. **Accessibility**: Design for everyone

Design trends continue to evolve with new technologies.`,
      excerpt: 'Essential principles for modern UI design that create exceptional user experiences',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=630&fit=crop',
      published: true,
      authorId: insertedUsers[1].id,
    },
    {
      title: 'Building a Startup in 2025',
      content: `# Entrepreneurship Guide

Starting a business requires planning, execution, and persistence.

## Steps to Success

- Validate your idea
- Build an MVP
- Get customer feedback
- Iterate quickly

The startup journey is challenging but rewarding.`,
      excerpt: 'A comprehensive guide to launching your startup in the modern era',
      thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=630&fit=crop',
      published: false,
      authorId: insertedUsers[0].id,
    },
    {
      title: 'Mastering TypeScript for React',
      content: `# TypeScript Best Practices

TypeScript adds type safety to JavaScript, making your React apps more robust.

## Benefits

- Catch errors early
- Better IDE support
- Improved refactoring

Start using TypeScript in your next project.`,
      excerpt: 'Learn TypeScript best practices for building type-safe React applications',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=630&fit=crop',
      published: true,
      authorId: insertedUsers[2].id,
    },
  ];

  const insertedPosts = await db.insert(posts).values(
    postsData.map(post => ({
      ...post,
      slug: slugify(post.title, { lower: true, strict: true }),
    }))
  ).returning();
  console.log(`✅ Inserted ${insertedPosts.length} posts`);

  // Link posts with categories
  await db.insert(postCategories).values([
    { postId: insertedPosts[0].id, categoryId: insertedCategories[0].id }, // Tech
    { postId: insertedPosts[1].id, categoryId: insertedCategories[1].id }, // Design
    { postId: insertedPosts[2].id, categoryId: insertedCategories[2].id }, // Business
    { postId: insertedPosts[3].id, categoryId: insertedCategories[0].id }, // Tech
  ]);
  console.log(`✅ Linked posts with categories`);

  console.log('🎉 Seeding complete!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
