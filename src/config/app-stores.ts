// app-stores.ts — App store links + Android staged-rollout flag.
// Single source of truth for every app-store CTA on the site.
// Android is in Google Play review (submitted 2026-09-04, decision ~Sep 9–11).
// To go live: flip android.live to true — that's the whole rollout.
// (Play listing/approval is Kenneth's lane; this flag is web-side, Kit flips it.)
export const APP_STORES = {
  ios: {
    url: 'https://apps.apple.com/us/app/true-joy-birthing/id6760793180',
    live: true,
  },
  android: {
    url: 'https://play.google.com/store/apps/details?id=com.truejoybirthing',
    live: false, // flip to true on Play approval (~Sep 9–11)
  },
} as const;

export const APP_STORE_URL = APP_STORES.ios.url;
export const GOOGLE_PLAY_URL = APP_STORES.android.url;