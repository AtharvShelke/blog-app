// middleware.ts (with IP from headers)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store for demo (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

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

function isRateLimited(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const key = `${ip}:${windowStart}`;
  
  const current = rateLimitMap.get(key) || { count: 0, resetTime: windowStart + windowMs };
  
  if (now >= current.resetTime) {
    // Reset for new window
    rateLimitMap.set(key, { count: 1, resetTime: windowStart + windowMs });
    return false;
  }
  
  if (current.count >= limit) {
    return true;
  }
  
  current.count++;
  rateLimitMap.set(key, current);
  return false;
}

export default function middleware(request: NextRequest) {
  // Rate limiting for API routes only
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = getClientIP(request);
    
    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too many requests', 
          message: 'Rate limit exceeded. Please try again later.' 
        }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
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