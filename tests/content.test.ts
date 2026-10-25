import { describe, it, expect } from 'vitest';
import * as tools from '@/lib/content/tools';
import * as tools2 from '@/lib/content/tools2';
import * as tools3 from '@/lib/content/tools3';
import * as guides from '@/lib/content/guides';
import * as gIron from '@/lib/guides/ironPicker';
import * as gStrip from '@/lib/guides/stripDecoder';
import * as gWell from '@/lib/guides/wellTestChecker';
import * as gRepair from '@/lib/guides/repairOrReplace';
import * as gCleaner from '@/lib/guides/cleanerDose';
import * as gTds from '@/lib/guides/tds';
import * as gNeed from '@/lib/guides/needSoftener';
import * as gSodium from '@/lib/guides/sodium';
import * as site from '@/lib/content/site';
import * as trust from '@/lib/content/trust';
import { PAGES } from '@/lib/data/pages';

// Banned words and phrases from build spec A13.
const BANNED = [
  'delve',
  'dive in',
  'tapestry',
  'testament',
  'realm',
  'landscape',
  'navigate',
  'journey',
  'embark',
  'unlock',
  'unleash',
  'elevate',
  'empower',
  'harness',
  'leverage',
  'utilize',
  'foster',
  'streamline',
  'supercharge',
  'seamless',
  'robust',
  'comprehensive',
  'ultimate',
  'crucial',
  'pivotal',
  'vital',
  'essential',
  'cutting-edge',
  'game-changer',
  'versatile',
  'myriad',
  'plethora',
  'bustling',
  'vibrant',
  'meticulous',
  'nuanced',
  'intricate',
  'indeed',
  'moreover',
  'furthermore',
  'additionally',
  'notably',
  'ultimately',
  'overall',
  'in conclusion',
  'in summary',
  'to sum up',
  "in today's fast-paced world",
  "whether you're a beginner or a pro",
  'look no further',
  "it's important to note",
  "it's worth noting",
  'when it comes to',
];

/** Recursively collect every string value from a module's exports. */
function collectStrings(value: unknown, out: string[]): void {
  if (typeof value === 'string') {
    out.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectStrings(v, out));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((v) => collectStrings(v, out));
  }
}

function allPageText(): string[] {
  const out: string[] = [];
  collectStrings(tools, out);
  collectStrings(tools2, out);
  collectStrings(tools3, out);
  collectStrings(guides, out);
  collectStrings(gIron, out);
  collectStrings(gStrip, out);
  collectStrings(gWell, out);
  collectStrings(gRepair, out);
  collectStrings(gCleaner, out);
  collectStrings(gTds, out);
  collectStrings(gNeed, out);
  collectStrings(gSodium, out);
  collectStrings(site, out);
  collectStrings(trust, out);
  // Also scan registry-visible strings (titles, metas, h1, blurbs).
  PAGES.forEach((p) => {
    out.push(p.title, p.metaDescription, p.h1);
    if (p.cardBlurb) out.push(p.cardBlurb);
  });
  return out;
}

describe('content style (A13)', () => {
  const texts = allPageText();

  it('has collected a meaningful amount of page text', () => {
    expect(texts.length).toBeGreaterThan(100);
  });

  it('contains no em dash anywhere in page text', () => {
    const offenders = texts.filter((t) => t.includes('—'));
    expect(offenders, offenders.join(' || ')).toHaveLength(0);
  });

  it('contains none of the banned words or phrases', () => {
    // Proper product names in exact source/spec text that legitimately contain a
    // banned word; stripped before scanning so they do not false-positive.
    const ALLOWED = ['Safe Home Ultimate', 'Essential Well Water Test'];
    const scrub = (t: string) => ALLOWED.reduce((s, phrase) => s.split(phrase).join(''), t);
    const joinedByWord = (word: string) => {
      // word-boundary, case-insensitive; escape regex specials
      const esc = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = /^[a-z]/.test(word)
        ? new RegExp(`\\b${esc}\\b`, 'i')
        : new RegExp(esc, 'i');
      return pattern;
    };
    const hits: string[] = [];
    for (const word of BANNED) {
      const re = joinedByWord(word);
      for (const t of texts) {
        if (re.test(scrub(t))) hits.push(`"${word}" in: ${t.slice(0, 80)}`);
      }
    }
    expect(hits, hits.join('\n')).toHaveLength(0);
  });

  it('every tool has 7 or more FAQ items with questions and answers', () => {
    [tools.SIZE, tools.SALT, tools.HARDNESS, tools.COST, tools.PRESSURE].forEach((t) => {
      expect(t.faq.length).toBeGreaterThanOrEqual(6);
      t.faq.forEach((f) => {
        expect(f.q.length).toBeGreaterThan(0);
        expect(f.a.length).toBeGreaterThan(0);
      });
    });
  });
});
