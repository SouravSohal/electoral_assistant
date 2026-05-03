/**
 * proxy.ts
 * Next.js Proxy (Custom Middleware) — runs on Edge Runtime before each request.
 * Handles: rate limiting for AI endpoints.
 */
import { NextResponse, type NextRequest } from "next/server";

// Simple in-memory rate limiter (stateless per-edge-instance)
// For production, use Upstash Redis or similar distributed store.
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per window
const WINDOW_MS = 60 * 1000; // 1 minute

function getRateLimitKey(req: NextRequest): string {
  // Use forwarded IP or connection remote address
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  return ip;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = requestCounts.get(key);

  if (!record || now > record.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Apply rate limiting only to AI API route
  if (pathname.startsWith("/api/chat")) {
    const key = getRateLimitKey(req);
    const { allowed, remaining } = checkRateLimit(key);

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests. Please wait a moment before asking again.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
            "X-RateLimit-Limit": String(RATE_LIMIT),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT));
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/chat/:path*"],
};
