// API route: /api/confidence-session
// Receives birth plan confidence session requests
// Forwards to MailerCloud via POST /contacts/upsert

export const onRequestPost = async (context) => {
  const { request, env } = context;
  const origin = request.headers.get('origin') || '';

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
    let phone = '';
    let dueDate = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      name = (body.name || '').trim();
      email = (body.email || '').trim();
      phone = (body.phone || '').trim();
      dueDate = (body.dueDate || '').trim();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const form = await request.formData();
      name = (form.get('name') || '').trim();
      email = (form.get('email') || '').trim();
      phone = (form.get('phone') || '').trim();
      dueDate = (form.get('dueDate') || '').trim();
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

    // ── Primary: MailerCloud contact upsert (HSEHyE = TJB Confidence Sessions) ──
    // 2026-09-18 fix: was list_id: 6 (Brevo-era numeric id) — MailerCloud 401'd
    // every submission and consult requests were silently dropped.
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
            list_id: 'HSEHyE',
            // Confidence Session custom fields mapped as tags
            tags: ['confidence-session'],
          }),
        });
      } catch (mcErr) {
        console.error('MailerCloud contact sync error (non-fatal):', mcErr);
      }
    }

    // ── Send notification to Shelbi via Postmark ──
    // 2026-09-18: AgentMail retired Aug 2026; now uses the Postmark path
    // contact.ts already uses in production.
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

    if (env.POSTMARK_SERVER_TOKEN) {
      const pmRes = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Postmark-Server-Token': env.POSTMARK_SERVER_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          From: 'support@truejoybirthing.com',
          To: 'shelbi@truejoybirthing.com',
          Subject: emailSubject,
          TextBody: emailBody,
        }),
      });
      if (!pmRes.ok) {
        console.error('Postmark send failed:', pmRes.status, await pmRes.text());
      }
    } else {
      console.error('POSTMARK_SERVER_TOKEN not set; skipping session notification email');
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