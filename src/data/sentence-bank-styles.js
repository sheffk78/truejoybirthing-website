// Hospital Sentence Bank — card CSS (print-optimized, shared by page + PDF build)
// US Letter card geometry per plan §2.2; palette per TJB brand (cream/lavender/rose, sepia text)
export const CARD_CSS = `
  :root {
    --cream: #FAF0DC; --cream-soft: #FDF7EA;
    --lavender: #8E8CB5; --lavender-light: #C5C3DB; --lavender-wash: #EDECF4;
    --rose: #B87AA0; --rose-light: #E8CFDF;
    --sepia: #5C3A2E; --sepia-soft: #7A5A4A;
  }
  .sb-card {
    background: var(--cream);
    border: 1.5pt solid var(--sepia);
    border-radius: 14px;
    padding: 28px 30px 22px;
    position: relative;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .sb-card__cat {
    font-size: 10pt; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--lavender); font-weight: 600; margin-bottom: 14px;
  }
  .sb-card__sentence {
    font-size: 15.5pt; line-height: 1.42; color: var(--sepia);
    font-weight: 600; margin-bottom: 16px; font-style: italic;
  }
  .sb-card__fields { display: grid; grid-template-columns: 1fr; gap: 10px; }
  .sb-card__field { font-size: 10.5pt; line-height: 1.5; color: var(--sepia-soft); }
  .sb-card__field b { color: var(--sepia); font-weight: 700; font-style: normal; }
  .sb-card__illo {
    position: absolute; top: 20px; right: 24px; width: 74px; height: 74px;
    object-fit: cover; border-radius: 12px; opacity: 0.92;
  }
  .sb-card__id {
    position: absolute; bottom: 14px; right: 22px;
    font-size: 8.5pt; color: var(--lavender); font-weight: 600; letter-spacing: 0.08em;
  }
  .sb-card__disclaimer {
    margin-top: 14px; padding-top: 10px; border-top: 0.75pt dashed var(--lavender-light);
    font-size: 7.8pt; line-height: 1.45; color: var(--sepia-soft); font-style: italic;
  }
  .sb-divider { text-align: center; padding: 34px 0 22px; break-before: page; }
  .sb-divider img { width: 130px; height: 130px; border-radius: 20px; object-fit: cover; margin: 0 auto 14px; }
  .sb-divider h2 { font-size: 19pt; color: var(--sepia); font-weight: 700; }
  .sb-divider p { font-size: 10pt; color: var(--sepia-soft); max-width: 420px; margin: 6px auto 0; }
  .sb-cover { text-align: center; padding: 60px 30px 30px; break-after: page; }
  .sb-cover img { width: 320px; border-radius: 24px; margin: 0 auto 24px; display: block; }
  .sb-cover h1 { font-size: 27pt; color: var(--sepia); font-weight: 700; line-height: 1.2; margin-bottom: 10px; }
  .sb-cover .cred { font-size: 11pt; color: var(--sepia-soft); margin-bottom: 18px; }
  .sb-howto { break-after: page; padding: 30px; color: var(--sepia-soft); font-size: 11pt; line-height: 1.6; }
  .sb-howto h2 { color: var(--sepia); font-size: 17pt; margin-bottom: 12px; }
  .sb-cta { text-align: center; padding: 48px 30px; break-before: page; }
  .sb-cta .btn { display: inline-block; background: var(--rose); color: #fff; padding: 13px 30px; border-radius: 999px; font-weight: 700; font-size: 12.5pt; }
`;
export const DISCLAIMER = "True Joy Birthing provides birth education, not medical advice. These sentences are communication tools to help you talk with your care team — they are not a substitute for your provider's guidance. Your care team knows your unique situation best; always follow their recommendations for medical decisions.";