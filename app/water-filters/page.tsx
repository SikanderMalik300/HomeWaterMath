import type { Metadata } from 'next';
import HubPage from '@/components/HubPage';
import { FILTERS_HUB } from '@/lib/content/site';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/water-filters/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <HubPage
      slug={SLUG}
      intro={FILTERS_HUB.intro}
      whichTable={FILTERS_HUB.whichTable}
      faq={FILTERS_HUB.faq}
      tileSlugs={[
        '/reverse-osmosis-system-cost/',
        '/whole-house-water-filter-cost/',
        '/water-softener-cost/',
      ]}
      guideSlugs={['/tds-meter-chart/']}
    />
  );
}
