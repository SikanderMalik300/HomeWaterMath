import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Picture from '@/components/Picture';
import PhotoTile from '@/components/PhotoTile';
import { HeroSearch } from '@/components/SiteSearch';
import { buildMetadata } from '@/lib/seo';
import { HOME } from '@/lib/content/site';
import { PAGES, getPage } from '@/lib/data/pages';
import { PHOTOS, getPhoto, HERO_CREDIT } from '@/lib/data/photos';

export const metadata: Metadata = buildMetadata('/');

const POPULAR = [
  '/water-softener-size-calculator/',
  '/water-softener-cost/',
  '/water-softener-salt-calculator/',
  '/water-hardness-converter/',
];

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}, ${y}`;
}

export default function HomePage() {
  const hero = getPhoto('hero-home');
  const latest = PAGES.filter((p) => p.type === 'tool' || p.type === 'hub')
    .slice()
    .sort((a, b) => (a.lastUpdated < b.lastUpdated ? 1 : -1))
    .slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="grid md:grid-cols-[55%_45%]">
          <div className="order-1 bg-band-1">
            {/* Reserve the mobile block height so a web-font swap can't reflow
                the text and push the hero image (kills layout shift) and keeps
                the text block the largest element (LCP) on mobile. */}
            <div className="container-hw flex min-h-[640px] flex-col justify-center py-10 md:min-h-0 md:py-16">
              <h1 className="max-w-[16ch] text-[30px] font-medium leading-[1.15] tracking-[-0.01em] md:text-[40px]">
                {getPage('/')?.h1}
              </h1>
              <p className="mt-4 max-w-prose68 text-[17px] text-ink">{HOME.heroIntro}</p>
              <div className="mt-6">
                <HeroSearch placeholder={HOME.searchPlaceholder} />
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {HOME.chips.map((chip) => (
                  <li key={chip.href}>
                    <Link
                      href={chip.href}
                      prefetch={false}
                      className="inline-flex min-h-[40px] items-center rounded-pill border border-line bg-surface px-4 text-[14px] font-medium text-ink hover:border-brand"
                    >
                      {chip.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="order-2 bg-band-1">
            {hero && (
              <div className="relative h-[220px] w-full md:h-[440px]">
                {/* Preload so the hero paints fast and isn't deprioritized as a
                    lazy image (which inflated LCP). */}
                <link
                  rel="preload"
                  as="image"
                  type="image/avif"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...({
                    imageSrcSet: `/photos/${hero.baseName}-640.avif 640w, /photos/${hero.baseName}-1280.avif 1280w`,
                    imageSizes: '(min-width: 768px) 45vw, 100vw',
                    fetchPriority: 'high',
                  } as any)}
                />
                <Picture
                  baseName={hero.baseName}
                  alt={hero.alt}
                  kind="hero"
                  focalX={hero.focalX}
                  focalY={hero.focalY}
                  priority
                  className="block h-full w-full"
                  imgClassName="h-full w-full"
                />
              </div>
            )}
          </div>
        </div>
        {hero && (
          <div className="container-hw py-2">
            <p className="text-[12px] text-muted">{HERO_CREDIT}</p>
          </div>
        )}
      </section>

      {/* Most popular */}
      <section className="container-hw py-12 md:py-16" aria-labelledby="popular-heading">
        <h2 id="popular-heading" className="mb-6 text-[28px] font-medium">
          Most popular
        </h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {POPULAR.map((slug) => (
            <PhotoTile key={slug} slug={slug} />
          ))}
        </div>
      </section>

      {/* Water softeners band */}
      <section className="bg-band-1 py-12 md:py-16" aria-labelledby="softeners-heading">
        <div className="container-hw">
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <h2 id="softeners-heading" className="text-[28px] font-medium">
              Water softeners
            </h2>
            <Link href="/water-softeners/" prefetch={false} className="inline-flex items-center gap-1 text-[15px] font-medium text-brand hover:underline">
              View all <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
          <p className="mb-6 max-w-prose68 text-[16px] text-ink">{HOME.softenersIntro}</p>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {POPULAR.map((slug) => (
              <PhotoTile key={slug} slug={slug} />
            ))}
          </div>
        </div>
      </section>

      {/* Well water band */}
      <section className="bg-band-2 py-12 md:py-16" aria-labelledby="well-heading">
        <div className="container-hw">
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <h2 id="well-heading" className="text-[28px] font-medium">
              Well water
            </h2>
            <Link href="/well-water/" prefetch={false} className="inline-flex items-center gap-1 text-[15px] font-medium text-brand hover:underline">
              View all <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
          <p className="mb-6 max-w-prose68 text-[16px] text-ink">{HOME.wellIntro}</p>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            <PhotoTile slug="/well-pressure-tank-size-calculator/" />
          </div>
        </div>
      </section>

      {/* Popular answers band */}
      <section className="bg-band-4 py-12 md:py-16" aria-labelledby="answers-heading">
        <div className="container-hw">
          <h2 id="answers-heading" className="mb-6 text-[28px] font-medium">
            Popular answers
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {HOME.popularAnswers.map((a) => (
              <div key={a.href} className="rounded-card border border-line bg-surface p-6">
                <p className="text-[28px] font-semibold text-ink tnum">{a.number}</p>
                <p className="mt-2 text-[15px] text-ink">{a.text}</p>
                <Link href={a.href} prefetch={false} className="mt-3 inline-flex items-center gap-1 text-[15px] font-medium text-brand hover:underline">
                  {a.linkText} <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why trust */}
      <section className="container-hw py-12 md:py-16" aria-labelledby="trust-heading">
        <h2 id="trust-heading" className="mb-6 text-[28px] font-medium">
          Why trust these calculators
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {HOME.whyTrust.map((col) => (
            <div key={col.h}>
              <h3 className="mb-2 text-[20px] font-medium">{col.h}</h3>
              <p className="text-[16px] text-ink">{col.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-4 text-[15px]">
          <Link href="/how-we-calculate/" prefetch={false} className="link-brand">
            How we calculate
          </Link>
          <Link href="/about/" prefetch={false} className="link-brand">
            About
          </Link>
        </div>
      </section>

      {/* Latest updates */}
      <section className="container-hw pb-12 md:pb-16" aria-labelledby="latest-heading">
        <h2 id="latest-heading" className="mb-4 text-[28px] font-medium">
          Latest updates
        </h2>
        <ul className="divide-y divide-line border-y border-line">
          {latest.map((p) => (
            <li key={p.slug} className="flex items-center justify-between gap-4 py-3">
              <Link href={p.slug} prefetch={false} className="text-[16px] text-ink hover:text-brand hover:underline">
                {p.h1}
              </Link>
              <span className="shrink-0 text-[14px] text-muted">{formatDate(p.lastUpdated)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Photo credits */}
      <section className="container-hw pb-12" aria-labelledby="credits-heading">
        <h2 id="credits-heading" className="mb-3 text-[16px] font-medium text-ink">
          Photo credits
        </h2>
        <ul className="space-y-1 text-[13px] text-muted">
          {Object.values(PHOTOS).map((photo) => (
            <li key={photo.id}>
              <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="link-brand">
                {photo.alt}
              </a>{' '}
              by{' '}
              <a href={photo.photographerUrl} target="_blank" rel="noopener noreferrer" className="link-brand">
                {photo.photographer}
              </a>{' '}
              / {photo.source}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
