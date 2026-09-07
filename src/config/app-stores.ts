// app-stores.ts — App store links + Android staged-rollout flag.
// Single source of truth for every app-store CTA on the site.
// Android APPROVED + live on Google Play 2026-09-07.
// Package name: com.truejoybirthing.app (the bare com.truejoybirthing URL 404s).
export const APP_STORES = {
  ios: {
    url: 'https://apps.apple.com/us/app/true-joy-birthing/id6760793180',
    live: true,
  },
  android: {
    url: 'https://play.google.com/store/apps/details?id=com.truejoybirthing.app',
    live: true,
  },
} as const;

export const APP_STORE_URL = APP_STORES.ios.url;
export const GOOGLE_PLAY_URL = APP_STORES.android.url;