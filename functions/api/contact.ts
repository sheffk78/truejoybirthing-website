// API route: /api/contact
// Receives email + optional name from truejoybirthing.com contact form
// Forwards to MailerCloud via POST /contacts/upsert

export const onRequestPost = async (context) => {
  const { request, env } = context;
  const origin = request.headers.get('origin') || '';

  // CORS preflight
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

  // Validate origin
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
    const contentType = request.headers.get('content-type') || '';
    let name = '';
    let email = '';
    let message = '';
    let subject = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      name = (body.name || '').trim();
      email = (body.email || '').trim();
      message = (body.message || '').trim();
      subject = (body.subject || '').trim();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const form = await request.formData();
      name = (form.get('name') || '').trim();
      email = (form.get('email') || '').trim();
      message = (form.get('message') || '').trim();
      subject = (form.get('subject') || '').trim();
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported content type' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Validate required fields
    if (!email || !message) {
      return new Response(JSON.stringify({ error: 'Email and message are required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (message.length > 5000) {
      return new Response(JSON.stringify({ error: 'Message too long' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const contactName = name || email;
    const firstName = name ? name.split(' ')[0] : '';

    // ── Primary: MailerCloud contact upsert (list IDs from migration) ──
    // Mailercloud uses alphanumeric string list IDs (NOT Brevo numeric IDs).
    // uaEauf = True Joy Birthing Subscribers (general), wHHZHy = Free Birth Plan
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
            last_name: name && name.split(' ').slice(1).join(' ') || '',
            list_id: 'uaEauf',
          }),
        });
        // Also add to Free Birth Plan list (wHHZHy) if not already there
        await fetch('https://cloudapi.mailercloud.com/v1/contacts/upsert', {
          method: 'POST',
          headers: {
            'Authorization': env.MC_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            first_name: firstName,
            last_name: name && name.split(' ').slice(1).join(' ') || '',
            list_id: 'wHHZHy',
          }),
        });
      } catch (mcErr) {
        console.error('MailerCloud contact sync error (non-fatal):', mcErr);
      }
    }

    // ── Secondary: AgentMail inbox notification (fire-and-forget) ──
    const inboxId = 'support@truejoybirthing.com';
    const emailSubject = subject || `New contact from ${name || email}`;
    const emailBody = [
      `New contact form submission from truejoybirthing.com`,
      '',
      `Name: ${name || 'Not provided'}`,
      `Email: ${email}`,
      `Message:`,
      message,
    ].join('\n');

    fetch(`https://api.agentmail.to/v0/inboxes/${inboxId}/messages/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.AGENTMAIL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: [inboxId], subject: emailSubject, text: emailBody }),
    }).catch((agentErr) => {
      console.error('AgentMail send failed (non-blocking):', agentErr);
    });

    // Return success — lead is captured
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};