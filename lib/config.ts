// lib/config.ts
export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Nexus',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    environment: process.env.NODE_ENV || 'development',
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
  upload: {
    maxFileSize: '4MB',
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
  },
  rateLimit: {
    max: 100, // 100 requests per window
    window: '1m', // 1 minute
  },
} as const;

// Runtime validation
export const validateConfig = () => {
  const required = ['DATABASE_URL', 'NEXTAUTH_SECRET'];
  
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
};