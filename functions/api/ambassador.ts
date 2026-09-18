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

    // ── MailerCloud: Add to ambassador list (wHHZHH = TJB Ambassadors) ──
    // 2026-09-18 fix: was list_id: 3 (Brevo-era numeric id) — MailerCloud 401'd
    // every submission and ambassador applications were silently dropped.
    if (env.MC_API_KEY) {
      try {
        const mcRes = await fetch('https://cloudapi.mailercloud.com/v1/contacts/upsert', {
          method: 'POST',
          headers: {
            'Authorization': env.MC_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            first_name: firstName,
            last_name: lastName,
            list_id: 'wHHZHH',
            tags: ['ambassador', 'applied'],
          }),
        });
        if (!mcRes.ok) {
          console.error('MailerCloud ambassador upsert failed:', mcRes.status, await mcRes.text());
        } else {
          console.log('MailerCloud ambassador upsert OK:', await mcRes.text());
        }
      } catch (mcErr) {
        console.error('MailerCloud ambassador contact error (non-fatal):', mcErr);
      }
    }

    // ── Postmark: Notify support of new application ──
    // 2026-09-18: AgentMail retired Aug 2026; now uses the Postmark path
    // contact.ts already uses in production.
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

    if (env.POSTMARK_SERVER_TOKEN) {
      try {
        const pmRes = await fetch('https://api.postmarkapp.com/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'X-Postmark-Server-Token': env.POSTMARK_SERVER_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            From: 'support@truejoybirthing.com',
            To: 'support@truejoybirthing.com',
            Subject: emailSubject,
            TextBody: emailBody,
          }),
        });
        if (!pmRes.ok) {
          console.error('Postmark ambassador notify failed:', pmRes.status, await pmRes.text());
        }
      } catch (pmErr) {
        console.error('Postmark ambassador notification failed (non-blocking):', pmErr);
      }
    } else {
      console.error('POSTMARK_SERVER_TOKEN not set; skipping ambassador notification email');
    }

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