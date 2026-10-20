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

export function faqLd(faq: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
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
