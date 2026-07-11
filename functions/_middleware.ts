/**
 * CF Pages Function: Redirect middleware
 *
 * Handles 301 redirects for old WordPress URLs that exceed the
 * Cloudflare Pages _redirects 100-static-rule limit.
 *
 * Processes BEFORE static assets and _redirects.
 * Falls through to context.next() for all non-matching paths.
 */

const redirects: Record<string, string> = {
  // Old WordPress content pages → new Astro slugs
  "/free-birth-plan-template-for-a-joyful-delivery": "/birth-plan-template/",
  "/doula-support-birth-magic-unleashed": "/blog/doula-support/",
  "/benefits-of-having-a-doula-birth-outcomes": "/benefits-of-a-doula/",
  "/online-childbirth-education-for-first-time-moms": "/walkthrough/",
  "/birth-plan-app": "/",
  "/postpartum-doula-sleep-magic-solved": "/postpartum-doula/",
  "/one-on-one-with-shelbi": "/about/",
  "/postpartum-doula-support-for-new-families": "/postpartum-doula/",
  "/birth-your-way-landing": "/birth-plan-template/",
  "/doula-vs-midwife-birth-helper-showdown": "/doula-vs-midwife/",
  "/doula-reimbursement-medicaid-birth-pay": "/medicaid-doula-coverage/",
  "/debunking-doula-myths-hidden-birth-truths": "/blog/debunking-doula-myths/",
  "/blog-2": "/blog/",
  // Old Thrive Apprentice course pages → free content
  "/courses": "/birth-plan-template/",
  "/course/how-to-prepare-of-our-call": "/birth-plan-confidence-session/",
  "/course/foundations-of-empowered-birth": "/walkthrough/",
  "/courses/joyful-empowered-birth": "/walkthrough/",
  "/courses/birth-plan-confidence-session": "/birth-plan-confidence-session/",
  "/course/why-you-need-a-birth-plan": "/birth-plan-template/",
  "/course/understanding-your-birth-options": "/walkthrough/",
  "/course/filling-out-the-birth-plan": "/birth-plan-template/",
  // Unbuilt birth-support state pages → hub
  "/birth-support/ks": "/birth-support/",
  "/birth-support/mt": "/birth-support/",
  "/birth-support/nm": "/birth-support/",
  "/birth-support/sd": "/birth-support/",
  "/birth-support/wv": "/birth-support/",
  "/birth-support/wy": "/birth-support/",
  // Unbuilt birth-support city pages → hub
  "/birth-support/anchorage-ak": "/birth-support/",
  "/birth-support/ann-arbor-mi": "/birth-support/",
  "/birth-support/charleston-wv": "/birth-support/",
  "/birth-support/erie-pa": "/birth-support/",
  "/birth-support/fort-wayne-in": "/birth-support/",
  "/birth-support/gulfport-ms": "/birth-support/",
  "/birth-support/honolulu-hi": "/birth-support/",
  "/birth-support/lexington-ky": "/birth-support/",
  "/birth-support/omaha-ne": "/birth-support/",
  "/birth-support/sioux-falls-sd": "/birth-support/",
  "/birth-support/wilmington-nc": "/birth-support/",
  // Unbuilt city pages with existing state hub → state page
  "/birth-support/pflugerville-tx": "/birth-support/tx/",
  "/birth-support/santa-ana-ca": "/birth-support/ca/",
  // Existing redirects moved from _redirects (rules 101-118, past CF's 100-rule limit)
  "/birth-center-near": "/birth-center-near-me/",
  "/dallas": "/birth-support/dallas-tx/",
  "/houston": "/birth-support/houston-tx/",
  "/austin": "/birth-support/austin-tx/",
  "/san-antonio": "/birth-support/san-antonio-tx/",
  "/fort-worth": "/birth-support/fort-worth-tx/",
  "/birth-support/seattle-wa/ballard": "/birth-support/seattle-wa/",
  "/birth-support/chicago-il/evanston": "/birth-support/chicago-il/",
  "/birth-support/atlanta-ga/decatur": "/birth-support/atlanta-ga/",
  // Solo rules moved from _redirects (had no trailing-slash pair, now handled here)
  "/postpartum-doula": "/blog/postpartum-doula/",
  "/feed": "/blog/",
  "/plan": "/#download",
  "/course": "/#download",
  "/session": "/#download",
  "/consult": "/#download",
  "/book": "/#download",
  "/pro": "/new-doula-start-here/",
  "/doula": "/new-doula-start-here/",
  "/app": "/",
  "/download": "/#download",
  "/free": "/#download",
  "/help": "/faq/",
  "/support": "/faq/",
  "/template": "/birth-plan-template/",
  "/checklist": "/birth-plan-checklist/",
  "/cost": "/doula-cost/",
  "/postpartum": "/postpartum-doula/",
};

interface EventContext {
  request: Request;
  next: () => Promise<Response>;
}

export const onRequest = async (context: EventContext) => {
  const url = new URL(context.request.url);
  // Normalize: strip trailing slash (except root)
  const path = url.pathname.replace(/\/+$/, "") || "/";

  // Check exact match (normalized path)
  if (redirects[path]) {
    return Response.redirect(new URL(redirects[path], url.origin), 301);
  }

  // Not a redirect — pass through to static assets / _redirects / other functions
  return context.next();
};