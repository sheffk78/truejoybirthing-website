/**
 * CF Pages Function: Reverse proxy /admin/* to Railway backend
 *
 * Routes all /admin/ requests (SPA + API) to the TJB backend on Railway.
 * The full admin dashboard (React SPA + dashboard API + GA4 analytics)
 * lives on Railway at truejoybirthing-app-production.up.railway.app.
 *
 * This function handles:
 * - /admin/           → SPA index.html
 * - /admin/login      → SPA client-side routing
 * - /admin/assets/*   → JS/CSS/font assets
 * - /admin/api/*      → Dashboard API endpoints
 */

const RAILWAY_BACKEND = 'https://truejoybirthing-app-production.up.railway.app';

interface EventContext {
  request: Request;
}

export const onRequest = async (context: EventContext) => {
  const req: Request = context.request;
  const url = new URL(req.url);
  const targetUrl = `${RAILWAY_BACKEND}${url.pathname}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    // Clone the response so we can modify headers
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy response headers
    response.headers.forEach((value: string, key: string) => {
      // Skip content-encoding since CF will re-compress
      if (key.toLowerCase() !== 'content-encoding') {
        newResponse.headers.set(key, value);
      }
    });

    // Add CORS headers for same-origin
    newResponse.headers.set('Access-Control-Allow-Origin', 'https://truejoybirthing.com');

    return newResponse;
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Admin proxy failed', detail: String(error) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};