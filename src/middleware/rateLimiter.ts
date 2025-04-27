
// Simple in-memory rate limiter
class RateLimiter {
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 100, windowMs = 15 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  limit(ip: string): boolean {
    const now = Date.now();
    const entry = this.requestCounts.get(ip);

    if (entry && now < entry.resetTime) {
      if (entry.count >= this.maxRequests) {
        return false;
      }
      entry.count++;
    } else {
      this.requestCounts.set(ip, {
        count: 1,
        resetTime: now + this.windowMs
      });
    }

    return true;
  }
}

export const rateLimiter = new RateLimiter();

export function applyRateLimit(req: Request, ip: string) {
  if (!rateLimiter.limit(ip)) {
    return new Response(JSON.stringify({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.'
    }), { 
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return null;
}
