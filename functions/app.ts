/**
 * CF Pages Function: GET /app — UA-aware app-store redirect (302)
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
 * Routing:
 *   iOS UA (iPhone/iPad/iPod, or Mac + touch points = iPad-as-desktop Safari)
 *     → App Store listing
 *   Android UA (only when APP_STORES.android.live)
 *     → Google Play listing
 *   Android UA while not live, desktop/unknown UA
 *     → /birth-plan-template/
 *
 * Query string (e.g. ?src=pdf-qr) is forwarded as utm params so clicks
 * stay measurable: src → utm_source, utm_* pass through untouched.
 */

import { APP_STORES } from '../src/config/app-stores';

interface EventContext {
  request: Request;
}

export const onRequestGet = async (context: EventContext) => {
  const req: Request = context.request;
  const url = new URL(req.url);
  const ua = req.headers.get('user-agent') || '';

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