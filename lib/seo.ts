import type { Metadata } from 'next';
import {
  getPage,
  canonical,
  SITE_URL,
  SITE_NAME,
  SITE_EMAIL,
  AUTHOR_NAME,
  AUTHOR_SLUG,
  breadcrumbsFor,
  type PageMeta,
} from '@/lib/data/pages';
import { getPhotoForSlug } from '@/lib/data/photos';
import type { FaqItem } from '@/lib/content/types';

/** OG image file stem for a slug. */
export function ogName(slug: string): string {
  if (slug === '/') return 'home';
  return slug.replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
}

export function ogPath(slug: string): string {
  return `/og/${ogName(slug)}.png`;
}

export function buildMetadata(slug: string): Metadata {
  const page = getPage(slug);
  if (!page) return {};
  const url = canonical(slug);
  const image = `${SITE_URL}${ogPath(slug)}`;
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: page.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.metaDescription,
      images: [image],
    },
  };
}

// --- JSON-LD builders. Schema must match visible content. ---

const ORG_ID = `${SITE_URL}/#org`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PERSON_ID = `${SITE_URL}${AUTHOR_SLUG}#person`;

export function organizationLd() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo-512.png`,
    email: SITE_EMAIL,
    founder: { '@id': PERSON_ID },
    sameAs: [],
  };
}

export function websiteLd() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbLd(slug: string) {
  const crumbs = breadcrumbsFor(slug);
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.slug ? { item: canonical(c.slug) } : {}),
    })),
  };
}

/** Strip inline markdown links to plain text so schema matches the visible text. */
export function stripMarkdownLinks(s: string): string {
  return s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

export function faqLd(faq: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: stripMarkdownLinks(f.q),
      acceptedAnswer: { '@type': 'Answer', text: stripMarkdownLinks(f.a) },
    })),
  };
}

export function webApplicationLd(page: PageMeta) {
  return {
    '@type': 'WebApplication',
    name: page.h1,
    url: canonical(page.slug),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
    dateModified: page.lastUpdated,
  };
}

export function collectionPageLd(page: PageMeta) {
  return {
    '@type': 'CollectionPage',
    name: page.h1,
    url: canonical(page.slug),
    isPartOf: { '@id': WEBSITE_ID },
    dateModified: page.lastUpdated,
  };
}

export function profilePageLd() {
  return {
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: AUTHOR_NAME,
      url: canonical(AUTHOR_SLUG),
      jobTitle: 'Founder and calculator builder',
      worksFor: { '@id': ORG_ID },
    },
  };
}

export function articleLd(page: PageMeta) {
  return {
    '@type': 'Article',
    headline: page.h1,
    url: canonical(page.slug),
    mainEntityOfPage: canonical(page.slug),
    author: { '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
    datePublished: page.published,
    dateModified: page.lastUpdated,
    image: `${SITE_URL}${ogPath(page.slug)}`,
  };
}

export function webPageLd(page: PageMeta) {
  return {
    '@type': 'WebPage',
    name: page.h1,
    url: canonical(page.slug),
    isPartOf: { '@id': WEBSITE_ID },
    dateModified: page.lastUpdated,
  };
}

/** Wrap one or more node objects into a @graph document. */
export function graph(...nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

// --- Unified per-page graph (fix-04): Organization + WebSite + Person +
// WebPage (+ main entity + BreadcrumbList + FAQPage), all @ids resolving. ---

export function personLd() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: AUTHOR_NAME,
    url: canonical(AUTHOR_SLUG),
    jobTitle: 'Founder',
    worksFor: { '@id': ORG_ID },
  };
}

function stripSuffix(title: string): string {
  return title.replace(/\s*\|\s*HomeWaterMath\s*$/, '');
}

function webPageTypeFor(page: PageMeta): string {
  if (page.type === 'hub') return 'CollectionPage';
  if (page.slug === '/about/') return 'AboutPage';
  if (page.slug === '/contact/') return 'ContactPage';
  if (page.slug === AUTHOR_SLUG) return 'ProfilePage';
  return 'WebPage';
}

function primaryImageUrl(slug: string): string | null {
  const photo = getPhotoForSlug(slug);
  if (!photo || photo.status !== 'approved') return null;
  const w = photo.kind === 'hero' ? 1280 : 600;
  return `${SITE_URL}/photos/${photo.baseName}-${w}.jpg`;
}

/** Full JSON-LD @graph for a page. Every @id reference resolves within it. */
export function pageJsonLd(slug: string, opts: { faq?: FaqItem[] } = {}) {
  const page = getPage(slug);
  if (!page) return graph(organizationLd(), websiteLd());
  const url = canonical(slug);
  const imageUrl = primaryImageUrl(slug);
  const imageId = `${url}#primaryimage`;

  const nodes: object[] = [organizationLd(), websiteLd(), personLd()];

  if (imageUrl) {
    nodes.push({
      '@type': 'ImageObject',
      '@id': imageId,
      url: imageUrl,
      contentUrl: imageUrl,
    });
  }

  const webpage: Record<string, unknown> = {
    '@type': webPageTypeFor(page),
    '@id': `${url}#webpage`,
    url,
    name: stripSuffix(page.title),
    isPartOf: { '@id': WEBSITE_ID },
    breadcrumb: { '@id': `${url}#breadcrumb` },
    author: { '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
    datePublished: page.published,
    dateModified: page.lastUpdated,
    inLanguage: 'en-US',
  };
  if (imageUrl) webpage.primaryImageOfPage = { '@id': imageId };

  if (page.type === 'tool') {
    nodes.push({ ...webApplicationLd(page), '@id': `${url}#app` });
    webpage.mainEntity = { '@id': `${url}#app` };
  } else if (page.type === 'guide') {
    nodes.push({ ...articleLd(page), '@id': `${url}#article` });
    webpage.mainEntity = { '@id': `${url}#article` };
  } else if (page.slug === AUTHOR_SLUG) {
    webpage.mainEntity = { '@id': PERSON_ID };
  }

  nodes.push(webpage);
  nodes.push({ ...breadcrumbLd(slug), '@id': `${url}#breadcrumb` });
  if (opts.faq && opts.faq.length > 0) {
    nodes.push({ ...faqLd(opts.faq), '@id': `${url}#faq` });
  }

  return graph(...nodes);
}
