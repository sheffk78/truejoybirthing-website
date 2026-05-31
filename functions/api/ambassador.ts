export interface Env {
  AGENTMAIL_API_KEY: string;
  BREVO_API_KEY?: string;
}

const ALLOWED_ORIGINS = ['https://truejoybirthing.com', 'https://www.truejoybirthing.com', 'http://localhost:4321'];

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const origin = request.headers.get('origin') || '';

  if (!ALLOWED_ORIGINS.some(o => origin === o || origin.endsWith('.truejoybirthing.com'))) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
  };

  try {
    const body = await request.json() as {
      name?: string;
      email?: string;
      role?: string;
      city?: string;
      instagram?: string;
      why?: string;
    };

    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const role = (body.role || '').trim();
    const city = (body.city || '').trim();
    const instagram = (body.instagram || '').trim();
    const why = (body.why || '').trim();

    // Validate required fields
    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400, headers: corsHeaders });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Valid email is required' }), { status: 400, headers: corsHeaders });
    }
    if (!role) {
      return new Response(JSON.stringify({ error: 'Role is required' }), { status: 400, headers: corsHeaders });
    }
    if (!city) {
      return new Response(JSON.stringify({ error: 'City is required' }), { status: 400, headers: corsHeaders });
    }

    const firstName = name.split(' ')[0];
    const lastName = name.includes(' ') ? name.split(' ').slice(1).join(' ') : '';

    // ── Brevo: Add to ambassador list (list 7) with full attributes ──
    // Brevo list 7 = TJB Ambassador Program
    // Brevo dashboard IS the admin — filter by list, see all attributes, manage status
    if (env.BREVO_API_KEY) {
      try {
        await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'api-key': env.BREVO_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            attributes: {
              FIRSTNAME: firstName,
              LASTNAME: lastName,
              AMB_ROLE: role,
              AMB_CITY: city,
              AMB_INSTAGRAM: instagram,
              AMB_WHY: why,
              AMB_STATUS: 'applied',
              AMB_APPLIED_AT: new Date().toISOString(),
            },
            listIds: [6],
            updateEnabled: true,
          }),
        });
      } catch (brevoErr) {
        console.error('Brevo ambassador contact error (non-fatal):', brevoErr);
      }
    }

    // ── AgentMail: Notify team of new application ──
    // Using support@ inbox until ambassador@ inbox is created in AgentMail
    const inboxId = 'support@truejoybirthing.com';
    const emailSubject = `[Ambassador] New Application: ${name} (${role})`;
    const emailBody = [
      `New ambassador application from truejoybirthing.com/ambassador`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      `Role: ${role}`,
      `City: ${city}`,
      `Instagram/Website: ${instagram || 'Not provided'}`,
      `Why TJB: ${why || 'Not provided'}`,
      ``,
      `View all ambassador contacts in Brevo: https://app.brevo.com/contacts → List "TJB Ambassadors"`,
    ].join('\n');

    fetch(`https://api.agentmail.to/v0/inboxes/${inboxId}/messages/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.AGENTMAIL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: [inboxId], subject: emailSubject, text: emailBody }),
    }).catch((agentErr) => {
      console.error('AgentMail ambassador notification failed (non-blocking):', agentErr);
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (err) {
    console.error('Ambassador form error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};