// middleware.ts (with Redis rate limiting)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cache } from '@/lib/cache/redis';

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 60000, // 1 minute
  MAX_REQUESTS: 100, // 100 requests per minute
} as const;

function getClientIP(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to a session-based identifier
  const sessionId = request.headers.get('x-session-id') || 'anonymous';
  return sessionId;
}

async function isRateLimited(
  ip: string, 
  limit: number = RATE_LIMIT_CONFIG.MAX_REQUESTS, 
  windowMs: number = RATE_LIMIT_CONFIG.WINDOW_MS
): Promise<{ limited: boolean; remaining: number; resetTime: number }> {
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const key = `rate_limit:${ip}:${windowStart}`;
  
  try {
    // Get current count
    const currentCount = await cache.get<number>(key) || 0;
    
    // Increment count
    const newCount = currentCount + 1;
    await cache.set(key, newCount, Math.ceil(windowMs / 1000));
    
    const remaining = Math.max(0, limit - newCount);
    const resetTime = windowStart + windowMs;
    
    return {
      limited: newCount > limit,
      remaining,
      resetTime
    };
  } catch (error) {
    console.error('Redis rate limit error:', error);
    // Fallback: allow request if Redis fails
    return {
      limited: false,
      remaining: limit,
      resetTime: now + windowMs
    };
  }
}

async function cleanupOldRateLimitKeys(): Promise<void> {
  // Clean up old rate limit keys periodically (runs ~1% of the time)
  if (Math.random() < 0.01) {
    try {
      const pattern = 'rate_limit:*';
      await cache.invalidate(pattern);
    } catch (error) {
      console.error('Rate limit cleanup error:', error);
    }
  }
}

export default async function middleware(request: NextRequest) {
  // Rate limiting for API routes only
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = getClientIP(request);
    
    const rateLimitResult = await isRateLimited(ip);
    
    if (rateLimitResult.limited) {
      // Clean up old keys in the background
      cleanupOldRateLimitKeys().catch(console.error);
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too many requests', 
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': RATE_LIMIT_CONFIG.MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime / 1000).toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }
  }

  const response = NextResponse.next();
  
  // Security Headers
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add rate limit headers for API responses
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = getClientIP(request);
    const rateLimitResult = await isRateLimited(ip);
    
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimitResult.resetTime / 1000).toString());
  }

  // Caching Headers
  if (request.nextUrl.pathname.startsWith('/_next/static')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};