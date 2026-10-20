import { describe, it, expect } from 'vitest';
import { PAGES, toolPages } from '@/lib/data/pages';
import { SOURCES } from '@/lib/data/sources';
import { PHOTOS } from '@/lib/data/photos';
import { CONSTANTS_TABLE } from '@/lib/data/constants';

const slugs = PAGES.map((p) => p.slug);

describe('registry integrity', () => {
  it('every slug is unique', () => {
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every slug has a trailing slash', () => {
    PAGES.forEach((p) => expect(p.slug.endsWith('/')).toBe(true));
  });

  it('every related slug exists in the registry', () => {
    PAGES.forEach((p) =>
      p.related.forEach((r) => expect(slugs, `${p.slug} -> ${r}`).toContain(r)),
    );
  });

  it('every source id referenced by a page exists', () => {
    PAGES.forEach((p) =>
      p.sources.forEach((s) => expect(SOURCES[s], `${p.slug} -> ${s}`).toBeDefined()),
    );
  });

  it('every source id in the constants table exists', () => {
    CONSTANTS_TABLE.forEach((c) =>
      c.sources.forEach((s) => expect(SOURCES[s as keyof typeof SOURCES], c.key).toBeDefined()),
    );
  });

  it('every title is <= 60 characters', () => {
    PAGES.forEach((p) => expect(p.title.length, p.slug).toBeLessThanOrEqual(60));
  });

  it('every meta description is <= 155 characters', () => {
    PAGES.forEach((p) =>
      expect(p.metaDescription.length, p.slug).toBeLessThanOrEqual(155),
    );
  });

  it('exactly one home page and two hubs', () => {
    expect(PAGES.filter((p) => p.type === 'home')).toHaveLength(1);
    expect(PAGES.filter((p) => p.type === 'hub')).toHaveLength(2);
  });

  it('there are 18 pages total and 5 tools', () => {
    expect(PAGES).toHaveLength(18);
    expect(toolPages).toHaveLength(5);
  });

  it("every tool's photoId resolves to an approved photo", () => {
    toolPages.forEach((p) => {
      expect(p.photoId, p.slug).not.toBeNull();
      const photo = PHOTOS[p.photoId as string];
      expect(photo, p.slug).toBeDefined();
      expect(photo.status).toBe('approved');
    });
  });

  it('every photo usedOn slug exists in the registry', () => {
    Object.values(PHOTOS).forEach((photo) =>
      photo.usedOn.forEach((s) => expect(slugs, `${photo.id} -> ${s}`).toContain(s)),
    );
  });

  it('every tool has at least one source and a non-empty notCovered list', () => {
    toolPages.forEach((p) => {
      expect(p.sources.length, p.slug).toBeGreaterThan(0);
      expect(p.notCovered.length, p.slug).toBeGreaterThan(0);
    });
  });
});
