export interface Env {
  BREVO_API_KEY?: string;
  ADMIN_TOKEN?: string;
}

const ALLOWED_ORIGINS = ['https://truejoybirthing.com', 'https://www.truejoybirthing.com', 'http://localhost:4321'];

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const origin = request.headers.get('origin') || '';
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.some(o => origin === o) ? origin : ALLOWED_ORIGINS[0],
  };

  // Auth: require admin token
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  if (!env.BREVO_API_KEY) {
    return new Response(JSON.stringify({ error: 'Brevo not configured' }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  try {
    const status = url.searchParams.get('status') || 'all';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Fetch contacts from Brevo ambassador list (list 6)
    const brevoHeaders = { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json' };

    // Get contacts from list 6
    const listRes = await fetch(
      `https://api.brevo.com/v3/contacts/lists/6/contacts?limit=${limit}&offset=${offset}&sort=desc`,
      { headers: brevoHeaders }
    );

    if (!listRes.ok) {
      const errBody = await listRes.text();
      console.error('Brevo list fetch error:', listRes.status, errBody);
      return new Response(JSON.stringify({ error: 'Failed to fetch contacts', details: errBody }), {
        status: listRes.status,
        headers: corsHeaders,
      });
    }

    const listData = await listRes.json() as { contacts?: Array<{ id: number; email: string }>; count?: number };

    if (!listData.contacts || listData.contacts.length === 0) {
      return new Response(JSON.stringify({ contacts: [], total: 0 }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Fetch detailed contact data for each
    const contacts = [];
    for (const contact of listData.contacts) {
      try {
        const detailRes = await fetch(`https://api.brevo.com/v3/contacts/${contact.email}`, {
          headers: brevoHeaders,
        });
        if (detailRes.ok) {
          const detail = await detailRes.json() as {
            email: string;
            attributes?: Record<string, string>;
            created_at?: string;
            modified_at?: string;
            listIds?: number[];
          };
          contacts.push({
            email: detail.email,
            firstName: detail.attributes?.FIRSTNAME || '',
            lastName: detail.attributes?.LASTNAME || '',
            role: detail.attributes?.AMB_ROLE || '',
            city: detail.attributes?.AMB_CITY || '',
            instagram: detail.attributes?.AMB_INSTAGRAM || '',
            why: detail.attributes?.AMB_WHY || '',
            status: detail.attributes?.AMB_STATUS || 'applied',
            appliedAt: detail.attributes?.AMB_APPLIED_AT || '',
            createdAt: detail.created_at || '',
            modifiedAt: detail.modified_at || '',
            inList: detail.listIds?.includes(6) || false,
          });
        }
      } catch {
        // Skip contacts that fail to fetch individually
      }
    }

    // Filter by status if requested
    const filtered = status === 'all'
      ? contacts
      : contacts.filter(c => c.status === status);

    return new Response(JSON.stringify({
      contacts: filtered,
      total: listData.count || contacts.length,
    }), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (err) {
    console.error('Admin ambassadors error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

export const onRequestPut = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const origin = request.headers.get('origin') || '';
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.some(o => origin === o) ? origin : ALLOWED_ORIGINS[0],
  };

  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  if (!env.BREVO_API_KEY) {
    return new Response(JSON.stringify({ error: 'Brevo not configured' }), { status: 500, headers: corsHeaders });
  }

  try {
    const body = await request.json() as { email: string; status: string };
    if (!body.email || !body.status) {
      return new Response(JSON.stringify({ error: 'email and status required' }), { status: 400, headers: corsHeaders });
    }

    const validStatuses = ['applied', 'reviewing', 'active', 'paused', 'declined', 'left'];
    if (!validStatuses.includes(body.status)) {
      return new Response(JSON.stringify({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }), { status: 400, headers: corsHeaders });
    }

    const brevoHeaders = { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json' };

    const updateRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(body.email)}`, {
      method: 'PUT',
      headers: brevoHeaders,
      body: JSON.stringify({ attributes: { AMB_STATUS: body.status } }),
    });

    if (!updateRes.ok) {
      const errBody = await updateRes.text();
      return new Response(JSON.stringify({ error: 'Failed to update contact', details: errBody }), { status: updateRes.status, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true, email: body.email, status: body.status }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error('Admin ambassadors update error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: corsHeaders });
  }
};