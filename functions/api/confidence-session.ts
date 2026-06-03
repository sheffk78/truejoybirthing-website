export interface Env {
  AGENTMAIL_API_KEY: string;
  BREVO_API_KEY?: string;
}

const ALLOWED_ORIGINS = ['https://truejoybirthing.com', 'https://www.truejoybirthing.com', 'http://localhost:4321'];

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const origin = request.headers.get('origin') || '';

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
    let phone = '';
    let dueDate = '';

    if (contentType.includes('application/json')) {
      const body = await request.json() as { name?: string; email?: string; phone?: string; dueDate?: string };
      name = (body.name || '').trim();
      email = (body.email || '').trim();
      phone = (body.phone || '').trim();
      dueDate = (body.dueDate || '').trim();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const form = await request.formData();
      name = (form.get('name') as string || '').trim();
      email = (form.get('email') as string || '').trim();
      phone = (form.get('phone') as string || '').trim();
      dueDate = (form.get('dueDate') as string || '').trim();
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported content type' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Validate required fields
    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Name and email are required' }), {
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

    const firstName = name.split(' ')[0];

    // ── Primary: Brevo contact sync (list 6 = Confidence Session leads) ──
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
              PHONE: phone || '',
              DUE_DATE: dueDate || '',
            },
            listIds: [2, 6], // 2 = general, 6 = Confidence Session leads
            updateEnabled: true,
          }),
        });
      } catch (brevoErr) {
        console.error('Brevo contact sync error (non-fatal):', brevoErr);
      }
    }

    // ── Send email notification to Shelbi via AgentMail ──
    const emailSubject = `Birth Plan Confidence Session Request — ${name}`;
    const emailBody = [
      `New Birth Plan Confidence Session request from truejoybirthing.com`,
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || 'Not provided'}`,
      `Due date: ${dueDate || 'Not provided'}`,
      '',
      `Please reach out within 1–2 business days to schedule the session and arrange payment.`,
      '',
      `---`,
      `Submitted via /birth-plan-confidence-session/ form`,
    ].join('\n');

    const agentmailResult = await fetch(`https://api.agentmail.to/v0/inboxes/shelbi@truejoybirthing.com/messages/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.AGENTMAIL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: ['shelbi@truejoybirthing.com'], subject: emailSubject, text: emailBody }),
    });

    if (!agentmailResult.ok) {
      console.error('AgentMail send failed:', agentmailResult.status, await agentmailResult.text());
      // Still return success to the user — we don't want to expose delivery failures
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (err) {
    console.error('Confidence session form error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};