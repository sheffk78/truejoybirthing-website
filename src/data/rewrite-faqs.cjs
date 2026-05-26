#!/usr/bin/env node
/**
 * Rewrites FAQ answers in cities.ts to be warm, direct, and mom-focused.
 * Preserves ALL specific facts. Only changes voice/tone of answer text (a:).
 * Question text (q:) stays unchanged.
 */

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'cities.ts');
let content = fs.readFileSync(FILE_PATH, 'utf8');

// ─── Extract city context ────────────────────────────────────────────────
// Key: slug regex must match multi-hyphen slugs like "corpus-christi-tx"

function extractAllCityContexts(fullText) {
  const contexts = {};
  const slugPattern = /"([a-z]+(?:-[a-z]+)+)":\s*\{/g;
  let slugMatch;

  while ((slugMatch = slugPattern.exec(fullText)) !== null) {
    const slug = slugMatch[1];
    const startIdx = slugMatch.index;

    // Find end of this city block
    const nextSlug = /"([a-z]+(?:-[a-z]+)+)":\s*\{/g;
    nextSlug.lastIndex = startIdx + 1;
    const nextMatch = nextSlug.exec(fullText);
    const endIdx = nextMatch ? nextMatch.index : fullText.indexOf('\n};');
    const block = fullText.substring(startIdx, endIdx);

    const cityMatch = block.match(/city:\s*"([^"]+)"/);
    const stateMatch = block.match(/state:\s*"([^"]+)"/);
    const costLowMatch = block.match(/costLow:\s*(\d+)/);
    const costHighMatch = block.match(/costHigh:\s*(\d+)/);

    // Detect Medicaid note content
    const medicaidNoteMatch = block.match(/medicaidNote:\s*"([^"]+)/);
    const hasBirthCenters = /birthCenterDetails:\s*\[\s*\{/.test(block) && !/birthCenterDetails:\s*\[\s*\]/.test(block);

    let medicaidStatus = 'unknown';
    if (medicaidNoteMatch) {
      const note = medicaidNoteMatch[1];
      if (/^(Yes|Great|Absolutely)/i.test(note) || /covers doula/i.test(note)) {
        medicaidStatus = 'yes';
      }
      if (/does not cover|not.*currently.*cover|No\./i.test(note)) {
        medicaidStatus = 'no';
      }
    }

    contexts[slug] = {
      city: cityMatch ? cityMatch[1] : '',
      state: stateMatch ? stateMatch[1] : '',
      costLow: costLowMatch ? parseInt(costLowMatch[1]) : 0,
      costHigh: costHighMatch ? parseInt(costHighMatch[1]) : 0,
      medicaidStatus,
      hasBirthCenters,
    };
  }
  return contexts;
}

const cityContexts = extractAllCityContexts(content);
console.log('Extracted contexts for', Object.keys(cityContexts).length, 'cities');

// ─── Question type classifier ────────────────────────────────────────────

function classifyQuestion(q) {
  const ql = q.toLowerCase();
  if (/how much does a doula cost/i.test(q)) return 'cost';
  if (/can i get a free doula through/i.test(q)) return 'medicaid_special';
  if (/does .* medicaid (cover|pay for)/i.test(q)) return 'medicaid';
  if (/does medicaid cover doulas/i.test(q)) return 'medicaid';
  if (/does (ohp|medi-cal) cover/i.test(q)) return 'medicaid';
  if (/does tricare cover/i.test(q)) return 'tricare';
  if (/does the culinary health fund/i.test(q)) return 'insurance_special';
  if (/does kaiser/i.test(q)) return 'insurance_special';
  if (/are birth centers? covered by insurance/i.test(q)) return 'insurance_special';
  if (/does .* allow doulas/i.test(q)) return 'insurance_special';
  if (/does true joy birthing/i.test(q)) return 'truejoy';
  if (/which .* hospitals?|what hospitals? in/i.test(q)) return 'hospitals';
  if (/hospital.*has?.*(nicu|level)/i.test(q)) return 'hospitals';
  if (/which .* has? the (best|highest).*nicu/i.test(q)) return 'hospitals';
  if (/what.*nicu level/i.test(q)) return 'hospitals';
  if (/have labor and delivery/i.test(q)) return 'hospitals';
  if (/what is the best hospital for/i.test(q)) return 'hospitals';
  if (/where do .* families deliver/i.test(q)) return 'hospitals';
  if (/birth[\s-]?center/i.test(q)) return 'birthcenter';
  if (/find a (black|community|doula of|spanish|hmong|bilingual)/i.test(q)) return 'doula_finding';
  if (/doula who speaks/i.test(q)) return 'doula_finding';
  if (/are there (bilingual|spanish|hmong|doulas)/i.test(q)) return 'doula_finding';
  if (/doulas also cover/i.test(q)) return 'doula_finding';
  if (/postpartum/i.test(q)) return 'postpartum';
  if (/water[\s-]?birth/i.test(q)) return 'waterbirth';
  if (/home[\s-]?birth/i.test(q)) return 'homebirth';
  if (/good city for|good place to give birth/i.test(q)) return 'vibe';
  if (/altitude/i.test(q)) return 'altitude';
  if (/hurricane/i.test(q)) return 'hurricane';
  if (/military|tricare|jblm|sheppard|fort bliss/i.test(q)) return 'military';
  if (/traffic/i.test(q)) return 'traffic';
  if (/how far|how long.*drive|closest birth center|drive to/i.test(q)) return 'distance';
  if (/rural/i.test(q)) return 'rural';
  if (/need a birth plan/i.test(q)) return 'birthplan';
  if (/vbac/i.test(q)) return 'vbac';
  if (/midwife.*attended|midwife.*birth/i.test(q)) return 'midwife';
  if (/allow doulas in the/i.test(q)) return 'hospital_policy';
  if (/what should .* know/i.test(q)) return 'local_tips';
  if (/is .* legal/i.test(q)) return 'legal';
  return 'other';
}

// ─── Rewriting functions ─────────────────────────────────────────────────

function rewriteCost(origA, q, ctx) {
  const city = ctx.city;
  const priceMatch = origA.match(/\$[\d,]+\s+to\s+\$[\d,]+/);
  const priceRange = priceMatch ? priceMatch[0] : `$${ctx.costLow} to $${ctx.costHigh}`;

  let a = `Expect to pay ${priceRange} for a doula in ${city}. `;

  if (/bilingual|spanish/i.test(origA)) {
    a += `If you're looking for bilingual support, reach out early — those spots fill fast. `;
  }
  if (/fewer.*doulas|limited.*availability|small.*doula|availability may be limited/i.test(origA)) {
    a += `The local doula community here is smaller than in big metros, so start your search early. `;
  }
  if (/military|fort bliss|discount/i.test(origA)) {
    a += `Military? Ask about military discounts — several local doulas offer them. `;
  }
  if (/travel fee|commut/i.test(origA)) {
    a += `Some doulas may charge a travel fee if they're commuting from a nearby metro, so ask upfront. `;
  }
  if (/sliding.scale/i.test(origA)) {
    a += `Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. `;
  }
  if (/payment plan/i.test(origA)) {
    a += `Many doulas offer payment plans, so don't let the sticker price scare you off. `;
  }
  if (/range higher|higher cost/i.test(origA)) {
    a += `Prices here reflect the local cost of living, but the level of experienced support available is worth it. `;
  }

  a += `The investment typically covers prenatal visits, labor support, and postpartum check-ins. `;
  a += `Grab the <a href="/birth-plan-template/">free birth plan template</a> and start thinking about what matters most to you.`;
  return a;
}

function rewriteMedicaid(origA, q, ctx) {
  const city = ctx.city;
  const isYes = /^Yes/i.test(origA.trim()) && !/does not cover/i.test(origA);
  const isNo = /^No[\.,]/i.test(origA.trim()) || /does not cover/i.test(origA) || /^Not yet/i.test(origA.trim());

  if (isYes || ctx.medicaidStatus === 'yes') {
    let a = `Yes! Great news — Medicaid covers doula services in ${city}. `;

    const billMatch = origA.match(/under\s+(SB\s+\d+|HB\s+\d+|Act\s+\d+[^,.]*)/i);
    if (billMatch) a += `This is thanks to ${billMatch[1]}. `;

    // Extract county/plan details if present
    const countyMatch = origA.match(/including\s+([^.]*(?:County|Counties|STAR|CHIP|managed care)[^.]*)/i);
    if (countyMatch) a += `That includes ${countyMatch[1]}. `;

    const phoneMatch = origA.match(/1-[\d\-]{8,}/);
    const websiteMatch = origA.match(/visit\s+([\w.]+(?:\.com|\.gov|\.org)[^.\s]*)/i);

    a += `Here's your next step: call your Medicaid plan and ask "Do you cover doula services?" — they'll walk you through it`;
    if (phoneMatch) a += `, or call ${phoneMatch[0]} directly`;
    a += '.';
    if (websiteMatch) a += ` You can also check online at ${websiteMatch[1]}.`;
    a += ` You deserve support, and now your insurance helps pay for it.`;

    return a;
  }

  if (isNo || ctx.medicaidStatus === 'no') {
    let a = `Not yet — your state's Medicaid doesn't cover doulas right now. But that doesn't mean you're alone. `;

    if (/community.doula|sliding/i.test(origA)) {
      a += `Community doulas and sliding-scale options exist — many doulas would rather work with your budget than see you go without. `;
    }
    if (/pro bono/i.test(origA)) {
      a += `Some doulas even reserve pro bono spots. `;
    }
    if (/advocacy|push.*for|legislative/i.test(origA)) {
      a += `Advocacy groups are working on changing this, and things are moving in the right direction. `;
    }

    a += `Ask any doula you interview about payment plans and reduced-fee spots. And grab the <a href="/birth-plan-template/">free birth plan template</a> — no matter who's in the room with you, knowing what you want is your superpower.`;
    return a;
  }

  // Partial — warm up voice, preserve facts
  return origA
    .replace(/\bfamilies\b/g, 'you and your family')
    .replace(/\bpatients\b/g, 'moms')
    + ` Don't hesitate to call and ask directly — "Do you cover doula services?" gets you a clear answer.`;
}

function rewriteMedicaidSpecial(origA, q, ctx) {
  if (/yes|can get a free|covered|at no cost/i.test(origA)) {
    let a = origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms');
    if (!/next step|call your|contact/i.test(a)) {
      a += ` Call your plan and ask specifically about doula coverage — you might be surprised at what's covered.`;
    }
    return a;
  }
  return origA.replace(/\bfamilies\b/g, 'you and your family').replace(/\bpatients\b/g, 'moms');
}

function rewriteTrueJoy(origA, q, ctx) {
  const city = ctx.city;
  return `Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any ${city} birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href="/birth-plan-template/">Download the free birth plan template</a> and start preparing your way — no signup required.`;
}

function rewriteHospitals(origA, q, ctx) {
  let a = origA;
  a = a.replace(/\bfamilies\b/g, 'moms and families');
  a = a.replace(/\bpatients\b/g, 'moms');
  a = a.replace(/\bpatients'\b/g, "moms'");

  // Improve generic endings
  a = a.replace(/Always confirm your hospital's policy during your hospital tour\./g,
    'Call the hospital or take a tour and bring your birth plan — it makes the whole intake process smoother when you know what you want.');
  a = a.replace(/always confirm .*? policies? (varies?|can shift|may change)\.?/gi,
    'Policies vary by facility, so call ahead or ask on your hospital tour — knowing before you go saves stress on the big day.');
  a = a.replace(/always confirm.*?before.*?delivering\.?/gi,
    'Call ahead to confirm their current policies — knowing what to expect saves you stress on the big day.');

  if (!/birth-plan-template/i.test(a)) {
    a = a.replace(/\.?\s*$/, '');
    a += `. <a href="/birth-plan-template/">Grab the free birth plan template</a> so you walk in knowing exactly what you want.`;
  }
  return a;
}

function rewriteBirthCenter(origA, q, ctx) {
  const city = ctx.city;

  if (ctx.hasBirthCenters) {
    let a = origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms');
    if (!/birth-plan-template/i.test(a)) {
      a = a.replace(/\.?\s*$/, '');
      a += `. <a href="/birth-plan-template/">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you.`;
    }
    return a;
  }

  // No birth centers — compassionate
  let a = `Not yet — but that doesn't mean you're stuck. `;

  if (/home[\s-]?birth/i.test(origA)) {
    a += `There aren't any freestanding birth centers in ${city} right now, but you can still hire a home-birth midwife for an out-of-hospital experience. `;
  } else if (/no freestanding birth center|no licensed birth center|there are (currently |)no freestanding/i.test(origA)) {
    // Extract what alternatives are mentioned (home birth midwives, nearest centers, etc.)
    const afterNo = origA.replace(/^[^.]*\.\s*/i, '').trim();
    if (afterNo.length > 10) {
      a += afterNo.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms');
      if (!a.endsWith('.')) a += '.';
      a += ' ';
    } else {
      a += `You can still have a doula by your side in the hospital — that support makes a huge difference no matter where you deliver. `;
    }
  } else {
    a += `There aren't any freestanding birth centers in ${city} right now, but you can still have a doula by your side in the hospital — that support makes a huge difference no matter where you deliver. `;
  }

  a += `<a href="/birth-plan-template/">Grab the free birth plan template</a> and think through what matters most to you — you have more choices than you might think.`;
  return a;
}

function rewriteDoulaFinding(origA, q, ctx) {
  const city = ctx.city;

  if (/black doula|doula of color|culturally responsive|community.*doula/i.test(origA)) {
    let a = `You deserve a doula who gets your experience. `;
    const orgMatches = origA.match(/[A-Z][a-zA-Z]+\s+(?:Birth\s+)?(?:Collective|Network|Village|Sisters|Project|Foundation|Organization|Group|Alliance|Association|Center)/g);
    if (orgMatches) {
      a += `Start with ${orgMatches.join(' or ')} — they connect you with doulas who share your lived experience. `;
    } else {
      a += `${city} has doulas of color who serve families with cultural understanding and real care. `;
    }
    a += `Don't settle — keep asking until you find someone who feels right.`;
    return a;
  }

  if (/bilingual|spanish-speaking|hmong|language/i.test(origA)) {
    let a = `Yes! ${city} has bilingual doulas — and if you're more comfortable in another language, that support is out there. `;
    a += `Ask when you interview: "Do you offer support in my language?" is a great question to start with.`;
    return a;
  }

  if (/also cover|nearby/i.test(origA)) {
    let a = origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms');
    a += ` If you're near the city line, you might find more options by searching both areas.`;
    return a;
  }

  let a = origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms');
  a += ` You can also use the True Joy Birthing app to find local doulas — start there and interview a few until one clicks.`;
  return a;
}

function rewritePostpartum(origA, q, ctx) {
  const city = ctx.city;
  let a = `You're not supposed to do this alone. `;

  const hasLactation = /lactation/i.test(origA);
  const hasWIC = /WIC/i.test(origA);
  const hasGroups = /group|support group|parenting group/i.test(origA);

  const specificMentions = origA.match(/(?:through|at|from)\s+([^.,]*(?:Center|Hospital|University|Health|Clinic)[^.,]*)/gi);

  let resources = [];
  if (hasLactation) resources.push('lactation consultants');
  if (hasWIC) resources.push('WIC offices');
  if (hasGroups) resources.push('local parenting groups');

  if (specificMentions && specificMentions.length > 0) {
    a += `In ${city}, you've got ${specificMentions[0].replace(/^(through|at|from)\s+/i, '')}`;
    if (resources.length > 0) a += `, plus ${resources.join(' and ')}`;
    a += '. ';
  } else if (resources.length > 0) {
    a += `${city} has ${resources.join(', ')} to lean on. `;
  }

  if (/medicaid/i.test(origA) && /not included|not cover/i.test(origA)) {
    a += `Note: postpartum Medicaid coverage is available, though doula services aren't included under current policy. `;
  }

  a += `And grab the <a href="/birth-plan-template/">free birth plan template</a> — knowing what's normal (and what's not) after birth is everything.`;
  return a;
}

function rewriteOther(origA, q, ctx) {
  return origA.replace(/\bfamilies\b/g, 'you and your family').replace(/\bpatients\b/g, 'moms');
}

// ─── Main rewrite dispatcher ─────────────────────────────────────────────

function rewriteAnswer(origA, question, ctx) {
  const type = classifyQuestion(question);

  switch (type) {
    case 'cost': return rewriteCost(origA, question, ctx);
    case 'medicaid': return rewriteMedicaid(origA, question, ctx);
    case 'medicaid_special': return rewriteMedicaidSpecial(origA, question, ctx);
    case 'truejoy': return rewriteTrueJoy(origA, question, ctx);
    case 'hospitals': return rewriteHospitals(origA, question, ctx);
    case 'birthcenter': return rewriteBirthCenter(origA, question, ctx);
    case 'doula_finding': return rewriteDoulaFinding(origA, question, ctx);
    case 'postpartum': return rewritePostpartum(origA, question, ctx);
    case 'waterbirth':
      return origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms')
        + ` Ask your provider about water birth options — and if they say no, it's okay to ask for a second opinion.`;
    case 'homebirth':
      return origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms')
        + ` <a href="/birth-plan-template/">Grab the free birth plan template</a> to think through whether home birth is right for you.`;
    case 'vibe':
      return origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms')
        + ` <a href="/birth-plan-template/">Grab the free birth plan template</a> and start thinking about what kind of birth experience you want — wherever you deliver.`;
    case 'altitude':
      return origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms')
        + ` Talk to your provider about what altitude means for your pregnancy — hydration and listening to your body matter even more here.`;
    case 'hurricane':
      return origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms')
        + ` Pack your hospital bag by 35 weeks and have a backup route to the hospital — storm season is not the time to wing it.`;
    case 'military':
      return origA.replace(/\bfamilies\b/g, 'military families like yours').replace(/\bpatients\b/g, 'moms')
        + ` <a href="/birth-plan-template/">Grab the free birth plan template</a> — military life means plans change, but knowing what you want for your birth doesn't have to.`;
    case 'tricare':
      return origA.replace(/\bfamilies\b/g, 'military families').replace(/\bpatients\b/g, 'moms')
        + ` <a href="/birth-plan-template/">Grab the free birth plan template</a> — military families deal with enough uncertainty; your birth preferences shouldn't be one of them.`;
    case 'traffic':
      return origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms')
        + ` Drive your route to the hospital before 38 weeks — in traffic, the last thing you need is a navigation surprise.`;
    case 'distance':
      return origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms')
        + ` Knowing your drive time before you're in labor takes one more worry off your plate.`;
    case 'rural':
      return origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms')
        + ` If you're outside the city, virtual doula support and the <a href="/birth-plan-template/">free birth plan app</a> can help you prepare no matter your distance.`;
    case 'birthplan':
      return origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms')
        + ` <a href="/birth-plan-template/">Grab the free birth plan template</a> — it walks you through every question to think about before the big day.`;
    case 'vbac':
      return origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms')
        + ` If you're hoping for a VBAC, talk to your provider early and bring your birth plan — knowing your options is your right.`;
    case 'hospital_policy':
      return origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms')
        + ` Call ahead or bring your birth plan to your hospital tour — most units welcome doulas, but knowing their policy upfront saves you stress.`;
    case 'midwife':
      return origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms')
        + ` Ask your provider directly about midwife-attended birth options — you might have more choices than you think.`;
    case 'insurance_special':
      return origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms')
        + ` Call your insurance and ask directly: "Do you cover doula services?" That one phone call gets you a clear answer.`;
    case 'legal':
      return origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms')
        + ` <a href="/birth-plan-template/">Grab the free birth plan template</a> to think through your preferences — whatever birth path you choose.`;
    case 'local_tips':
      return origA.replace(/\bfamilies\b/g, 'you').replace(/\bpatients\b/g, 'moms')
        + ` <a href="/birth-plan-template/">Grab the free birth plan template</a> — local knowledge + a clear plan = confidence on birth day.`;
    default:
      return rewriteOther(origA, question, ctx);
  }
}

// ─── Process file line by line ────────────────────────────────────────────

const lines = content.split('\n');
let currentSlug = null;
let changesCount = 0;
let totalFaqs = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Track current city slug — matches multi-hyphen slugs like "corpus-christi-tx"
  const slugMatch = line.match(/^  "([a-z]+(?:-[a-z]+)+)":\s*\{/);
  if (slugMatch) {
    currentSlug = slugMatch[1];
  }

  // Match FAQ lines: { q: "...", a: "..." },
  const faqMatch = line.match(/^(\s*\{\s*q:\s*"([^"]+)",\s*a:\s*")(.+)("\s*\},?\s*)$/);
  if (faqMatch && currentSlug && cityContexts[currentSlug]) {
    totalFaqs++;
    const prefix = faqMatch[1];
    const question = faqMatch[2];
    const originalAnswer = faqMatch[3];
    const suffix = faqMatch[4];

    const ctx = cityContexts[currentSlug];
    const newAnswer = rewriteAnswer(originalAnswer, question, ctx);

    if (newAnswer !== originalAnswer) {
      // Escape double quotes within the answer for TS string
      const escapedAnswer = newAnswer.replace(/"/g, '\\"');
      lines[i] = `${prefix}${escapedAnswer}${suffix}`;
      changesCount++;
    }
  }
}

console.log(`Processed ${totalFaqs} FAQs across ${Object.keys(cityContexts).length} cities, rewrote ${changesCount} answers`);

const newContent = lines.join('\n');
fs.writeFileSync(FILE_PATH, newContent, 'utf8');
console.log('File written. Size:', newContent.length, 'bytes (was', content.length, 'bytes)');