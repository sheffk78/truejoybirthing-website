export interface Env {
  STRIPE_SECRET_KEY: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  
  // CORS
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = ['https://truejoybirthing.com', 'https://*.truejoybirthing.com', 'http://localhost:4321'];
  const isAllowed = allowedOrigins.some(o => {
    if (o.includes('*')) {
      const base = o.replace('*.', '');
      return origin.endsWith(base);
    }
    return origin === o;
  });
  
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const body = await request.json() as { priceId: string; page?: string };
    const { priceId } = body;

    if (!priceId || !priceId.startsWith('price_')) {
      return new Response(JSON.stringify({ error: 'Invalid price ID' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin,
        },
      });
    }

    const session = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'payment_method_types[]': 'card',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'success_url': `https://truejoybirthing.com/thanks?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `https://truejoybirthing.com/cancel`,
        'automatic_tax[enabled]': 'false',
        'allow_promotion_codes': 'true',
      }).toString(),
    });

    const sessionData = await session.json() as { url?: string; error?: { message: string } };

    if (!session.ok || sessionData.error) {
      return new Response(JSON.stringify({ error: sessionData.error?.message || 'Failed to create checkout session' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin,
        },
      });
    }

    return new Response(JSON.stringify({ url: sessionData.url }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message || 'Internal error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
      },
    });
  }
};