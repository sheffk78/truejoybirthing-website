export interface Env {
  AGENTMAIL_API_KEY: string;
  BREVO_API_KEY?: string;
}

const ALLOWED_ORIGINS = ['https://truejoybirthing.com', 'https://www.truejoybirthing.com', 'http://localhost:4321'];

export const onRequestPost = async (context: { request: Request; env: Env }) => {
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
    const contentType = request.headers.get('content-type') || '';
    let name = '';
    let email = '';
    let message = '';
    let subject = '';

    if (contentType.includes('application/json')) {
      const body = await request.json() as { name?: string; email?: string; message?: string; subject?: string };
      name = (body.name || '').trim();
      email = (body.email || '').trim();
      message = (body.message || '').trim();
      subject = (body.subject || '').trim();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const form = await request.formData();
      name = (form.get('name') as string || '').trim();
      email = (form.get('email') as string || '').trim();
      message = (form.get('message') as string || '').trim();
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

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Rate limit: max 5000 chars for message
    if (message.length > 5000) {
      return new Response(JSON.stringify({ error: 'Message too long' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const brevoContactName = name || email;
    const firstName = name ? name.split(' ')[0] : '';

    // ── Primary: Brevo contact sync + welcome email ──
    // Brevo is the critical path — list signup + welcome email with PDF link.
    // AgentMail (inbox notification) is secondary — fire-and-forget.
    if (env.BREVO_API_KEY) {
      try {
        // 1. Create/update contact in list 2 (general) + list 5 (Free Birth Plan)
        await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'api-key': env.BREVO_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            attributes: { FIRSTNAME: brevoContactName },
            listIds: [2, 5],
            updateEnabled: true,
          }),
        });
        // Contact created (or already exists) — that's sufficient. Proceed to send email.
      } catch (brevoErr) {
        console.error('Brevo contact sync error (non-fatal):', brevoErr);
        // Don't block — continue to try sending welcome email anyway
      }

      // 2. Send welcome email with birth plan PDF (template 7)
      try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': env.BREVO_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            templateId: 7,
            to: [{ email, name: brevoContactName }],
            params: { FIRSTNAME: firstName || brevoContactName },
          }),
        });
      } catch (sendErr) {
        console.error('Brevo welcome email send error (non-fatal):', sendErr);
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