// API route: /api/ambassador
// Receives TJB ambassador program applications
// Forwards to MailerCloud via POST /contacts/upsert

export const onRequestPost = async (context) => {
  const { request, env } = context;
  const origin = request.headers.get('origin') || '';

  if (!['https://truejoybirthing.com', 'https://www.truejoybirthing.com', 'http://localhost:4321']
    .some(o => origin === o || origin.endsWith('.truejoybirthing.com'))) {
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
    const body = await request.json();

    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const role = (body.role || '').trim();
    const city = (body.city || '').trim();
    const instagram = (body.instagram || '').trim();
    const audience = (body.audience || '').trim();
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

    // ── MailerCloud: Add to ambassador list (list 3 = TJB Ambassadors) ──
    if (env.MC_API_KEY) {
      try {
        await fetch('https://cloudapi.mailercloud.com/v1/contacts/upsert', {
          method: 'POST',
          headers: {
            'Authorization': env.MC_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            first_name: firstName,
            last_name: lastName,
            list_id: 3,
            tags: ['ambassador', 'applied'],
          }),
        });
      } catch (mcErr) {
        console.error('MailerCloud ambassador contact error (non-fatal):', mcErr);
      }
    }

    // ── AgentMail: Notify team of new application ──
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
      `Audience size: ${audience || 'Not provided'}`,
      `Why TJB: ${why || 'Not provided'}`,
      ``,
      `View all ambassador contacts in MailerCloud → TJB Ambassadors list`,
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