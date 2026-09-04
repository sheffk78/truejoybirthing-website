// analytics-funnel.ts — PDF/app funnel event helpers.
// Every event goes to GA4 (window.dataLayer) AND PostHog (window.posthog) when present.
// GA4 reads dataLayer pushes with an `event` key; PostHog gets the same name + params.

type FunnelParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    posthog?: { capture?: (name: string, props?: Record<string, unknown>) => void };
  }
}

function track(name: string, params: FunnelParams = {}): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  try {
    window.posthog?.capture?.(name, params);
  } catch {
    /* PostHog not loaded — GA4 still gets the event */
  }
}

/** PDF download event. source: 'direct_btn' | 'lead_success' | 'bypass_link' */
export function trackPdfDownload(source = 'direct_btn'): void {
  track('pdf_download', { source, page_location: window.location.href });
}

/** First user interaction with a form (keeps our own form_start comparable across forms). */
export function trackFormStart(formId: string): void {
  track('form_start', { form_id: formId });
}

/** Successful submit of a lead/PDF form. */
export function trackFormSubmit(formId: string, source = ''): void {
  track('form_submit', { form_id: formId, source, page_location: window.location.href });
}

/** Lead captured (success state shown). Superset of form_submit with source. */
export function trackLeadCaptured(formId: string, source = ''): void {
  track('lead_captured', { form_id: formId, source, page_location: window.location.href });
}

/** Success-state app CTA seen. source: 'lead_form' | 'city_lead_form' | 'pdf_direct' */
export function trackPdfSuccessView(source: string): void {
  track('pdf_success_view', { source, page_location: window.location.href });
}