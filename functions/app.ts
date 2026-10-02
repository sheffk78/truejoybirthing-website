/**
 * CF Pages Function: GET /app — smart routing between the landing page and
 * UA-aware app-store redirects (302)
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ ANDROID FLIP POINT — there is exactly ONE place to flip Android live:   │
 * │   1. src/config/app-stores.ts  → set android.live = true                │
 * │   2. THIS FILE reads that flag at build time (static import, no env var).│
 * │ Flip #1 only; this file needs no edit. While android.live is false,     │
 * │ Android user agents are sent to /birth-plan-template/ instead of a      │
 * │ dead Google Play listing.                                               │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * 2026-10-02 — /app/ is now a real branded landing page (src/pages/app.astro):
 * the in-app Share button links https://truejoybirthing.com/app and social
 * crawlers (iMessage, Facebook) must see its OG tags. So the UA-aware store
 * redirect only fires when it is actually wanted:
 *
 *   /app?src=… or ?utm_…  → UA-aware 302 (QR stamps / campaign links keep
 *                           their one-tap store behavior + attribution)
 *   crawler UAs (facebookexternalhit, iMessage, Slack, Twitterbot, Applebot,
 *   WhatsApp, LinkedIn, Discord, Telegram, Pinterest) → fall through to the
 *   static landing page so OG tags render
 *   /app, /app/ with no query from a normal browser → static landing page
 *
 * iOS users who want the store directly: the landing page's own buttons link
 * both stores (with ?ct=web_app-landing attribution), so dropping the plain
 * 302 loses nothing and gains the brand moment for every share.
 *
 * Query string (e.g. ?src=pdf-qr) is forwarded as utm params so clicks
 * stay measurable: src → utm_source, utm_* pass through untouched.
 */

import { APP_STORES } from '../src/config/app-stores';

interface EventContext {
  request: Request;
  next: () => Promise<Response>;
}

// Social/messaging crawlers that fetch a URL to render its link preview.
// They must see the landing page's OG tags, never a 302 to a store.
const CRAWLER_UA_RE =
  /facebookexternalhit|Twitterbot|Slack(?:-ImgProxy)?|iMessage|Applebot|WhatsApp|LinkedInBot|Discordbot|TelegramBot|Pinterestbot|embedly|quora link preview|outbrain|vkshare|W3C_Validator/i;

export const onRequestGet = async (context: EventContext) => {
  const req: Request = context.request;
  const url = new URL(req.url);
  const ua = req.headers.get('user-agent') || '';

  const hasCampaignQuery = url.searchParams.has('src') || [...url.searchParams.keys()].some((k) => k.startsWith('utm_'));

  // No campaign query, or a link-preview crawler asking → static landing page.
  if (!hasCampaignQuery || CRAWLER_UA_RE.test(ua)) {
    return context.next();
  }

  const isAppleDevice = /iPhone|iPad|iPod/.test(ua);
  // iPadOS 13+ reports as desktop Safari (Macintosh); touch points give it away.
  const isMacWithTouch = /Macintosh/.test(ua) && /\bTouch\b|MaxTouchPoints/i.test(ua);
  const isAndroid = /Android/.test(ua);

  let target: string;
  if (isAppleDevice || isMacWithTouch) {
    target = APP_STORES.ios.url;
  } else if (isAndroid) {
    target = APP_STORES.android.live
      ? APP_STORES.android.url
      : 'https://truejoybirthing.com/birth-plan-template/';
  } else {
    target = 'https://truejoybirthing.com/birth-plan-template/';
  }

  // Forward tracking params: src=foo → utm_source=foo; utm_* pass through.
  // Anything else in the query string is dropped silently.
  const incoming = url.searchParams;
  const forward = new URLSearchParams();
  const src = incoming.get('src');
  if (src) forward.set('utm_source', src);
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const val = incoming.get(key);
    if (val) forward.set(key, val);
  }
  const qs = forward.toString();
  const finalUrl = qs ? `${target}${target.includes('?') ? '&' : '?'}${qs}` : target;

  return new Response(null, {
    status: 302,
    headers: {
      Location: finalUrl,
      'Cache-Control': 'no-store',
    },
  });
};