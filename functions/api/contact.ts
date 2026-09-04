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
    let source = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      name = (body.name || '').trim();
      email = (body.email || '').trim();
      message = (body.message || '').trim();
      subject = (body.subject || '').trim();
      source = (body.source || '').trim();
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
    // `source` (e.g. birth_plan_pdf, faq_lead, walkthrough) is forwarded as a
    // custom_field so MailerCloud automations can segment the nurture sequence.
    const contactFields: {
      email: string;
      first_name: string;
      last_name: string;
      custom_fields?: Record<string, string>;
    } = {
      email,
      first_name: firstName,
      last_name: name && name.split(' ').slice(1).join(' ') || '',
    };
    if (source) contactFields.custom_fields = { source };
    if (env.MC_API_KEY) {
      try {
        await fetch('https://cloudapi.mailercloud.com/v1/contacts/upsert', {
          method: 'POST',
          headers: {
            'Authorization': env.MC_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...contactFields, list_id: 'uaEauf' }),
        });
        // Also add to Free Birth Plan list (wHHZHy) if not already there
        await fetch('https://cloudapi.mailercloud.com/v1/contacts/upsert', {
          method: 'POST',
          headers: {
            'Authorization': env.MC_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...contactFields, list_id: 'wHHZHy' }),
        });
      } catch (mcErr) {
        console.error('MailerCloud contact sync error (non-fatal):', mcErr);
      }
    }

    // ── Visitor delivery: transactional birth plan email via Postmark ──
    // Non-blocking: any failure is logged and the client still gets { success: true }.
    // Skipped for obvious test addresses (no guard existed before; added 2026-09-04).
    const looksLikeTestEmail = /\+test|\.test@|@test\.|@example\.(com|org)|@fake|@invalid|mailinator|guerrillamail|10minutemail|throwaway/i.test(email);

    if (env.POSTMARK_SERVER_TOKEN && !looksLikeTestEmail) {
      const pdfUrl = 'https://truejoybirthing.com/true-joy-birth-plan.pdf?src=email';
      const appUrl = 'https://truejoybirthing.com/app';
      const deliverySubject = 'Your free birth plan';
      const deliveryText = [
        `Hi ${firstName || 'there'},`,
        ``,
        `Your free birth plan is ready. Download it here:`,
        pdfUrl,
        ``,
        `Congratulations on getting this done — it's a real step toward the birth you want. Print it or save it, and bring it to your next appointment. Every plan looks a little different, and yours should sound like you.`,
        ``,
        `If you'd like to keep editing it as things change, the free True Joy Birthing app saves your plan in one place: ${appUrl}`,
        ``,
        `Reply if anything is unclear — I read every reply.`,
        ``,
        `Warmly,`,
        `Shelbi`,
        `True Joy Birthing`,
      ].join('\n');
      const deliveryHtml = [
        `<p>Hi ${firstName || 'there'},</p>`,
        `<p>Your free birth plan is ready. <a href="${pdfUrl}">Download it here</a>.</p>`,
        `<p>Congratulations on getting this done — it's a real step toward the birth you want. Print it or save it, and bring it to your next appointment. Every plan looks a little different, and yours should sound like you.</p>`,
        `<p>If you'd like to keep editing it as things change, the free True Joy Birthing app saves your plan in one place: <a href="${appUrl}">truejoybirthing.com/app</a></p>`,
        `<p>Reply if anything is unclear — I read every reply.</p>`,
        `<p>Warmly,<br>Shelbi<br>True Joy Birthing</p>`,
      ].join('\n');

      try {
        await fetch('https://api.postmarkapp.com/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'X-Postmark-Server-Token': env.POSTMARK_SERVER_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            From: 'support@truejoybirthing.com',
            To: email,
            Subject: deliverySubject,
            TextBody: deliveryText,
            HtmlBody: deliveryHtml,
          }),
        }).catch((pmErr) => {
          console.error('Postmark delivery email failed (non-blocking):', pmErr);
        });
      } catch (deliveryErr) {
        console.error('Postmark delivery email error (non-blocking):', deliveryErr);
      }
    } else if (!env.POSTMARK_SERVER_TOKEN) {
      console.error('POSTMARK_SERVER_TOKEN not set; skipping visitor delivery email');
    }

    // ── Secondary: Postmark notification → support@truejoybirthing.com ──
    // Routes to the VPS support inbox (support@ → kenneth mailbox) via MX.
    // Replaces the removed AgentMail API call (2026-08-13).
    const emailSubject = subject || `New contact form from ${name || email}`;
    const emailBody = [
      `New contact form submission from truejoybirthing.com`,
      ``,
      `Name: ${name || 'Not provided'}`,
      `Email: ${email}`,
      `Message:`,
      message,
    ].join('\n');

    if (env.POSTMARK_SERVER_TOKEN) {
      await fetch('https://api.postmarkapp.com/email', {
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
      }).catch((pmErr) => {
        console.error('Postmark notify failed (non-blocking):', pmErr);
      });
    } else {
      console.error('POSTMARK_SERVER_TOKEN not set; skipping form notification');
    }

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