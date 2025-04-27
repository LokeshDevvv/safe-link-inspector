
import { routes } from './api/routes';
import { applyRateLimit } from './middleware/rateLimiter';
import { validateApiKey } from './middleware/apiKeyAuth';

async function handleRequest(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  
  // Rate limit check
  const rateLimitResponse = applyRateLimit(req, ip);
  if (rateLimitResponse) return rateLimitResponse;

  // API Key validation
  const authResponse = validateApiKey(req);
  if (authResponse) return authResponse;

  // Route matching
  const url = new URL(req.url);
  const route = routes.find(
    r => r.path === url.pathname && r.method === req.method
  );

  if (route) {
    return await route.handler(req);
  }

  return new Response(JSON.stringify({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  }), { 
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}

export { handleRequest };
