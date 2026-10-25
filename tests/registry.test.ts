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

  it('every title is 30 to 60 characters', () => {
    PAGES.forEach((p) => {
      expect(p.title.length, `${p.slug} title "${p.title}"`).toBeGreaterThanOrEqual(30);
      expect(p.title.length, `${p.slug} title "${p.title}"`).toBeLessThanOrEqual(60);
    });
  });

  it('every meta description is 110 to 160 characters', () => {
    PAGES.forEach((p) => {
      expect(p.metaDescription.length, `${p.slug} meta len ${p.metaDescription.length}`).toBeGreaterThanOrEqual(110);
      expect(p.metaDescription.length, `${p.slug} meta len ${p.metaDescription.length}`).toBeLessThanOrEqual(160);
    });
  });

  it('exactly one home page and three hubs', () => {
    expect(PAGES.filter((p) => p.type === 'home')).toHaveLength(1);
    expect(PAGES.filter((p) => p.type === 'hub')).toHaveLength(3);
  });

  it('there are 35 pages total, 11 tools and 9 guides', () => {
    expect(PAGES).toHaveLength(35);
    expect(toolPages).toHaveLength(11);
    expect(PAGES.filter((p) => p.type === 'guide')).toHaveLength(9);
  });

  it("every tool's photoId, when its slot exists, is a valid photo entry", () => {
    // Batch-02 photos may still be pending (mist square), so a tool may point at
    // a slot that is not yet approved or not yet present. Only validate entries
    // that do exist.
    toolPages.forEach((p) => {
      if (!p.photoId) return;
      const photo = PHOTOS[p.photoId];
      if (!photo) return; // pending slot not added yet -> mist square
      expect(['approved', 'pending'], p.slug).toContain(photo.status);
      if (photo.status === 'approved') {
        expect(photo.baseName.length, p.slug).toBeGreaterThan(0);
        expect(photo.photographer.length, p.slug).toBeGreaterThan(0);
      }
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
