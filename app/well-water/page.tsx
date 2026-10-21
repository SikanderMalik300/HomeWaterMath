import type { Metadata } from 'next';
import HubPage from '@/components/HubPage';
import { WELL_HUB } from '@/lib/content/site';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/well-water/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <HubPage
      slug={SLUG}
      intro={WELL_HUB.intro}
      whichTable={WELL_HUB.whichTable}
      faq={WELL_HUB.faq}
      tileSlugs={[
        '/well-pressure-tank-size-calculator/',
        '/well-pump-replacement-cost/',
        '/water-softener-size-calculator/',
        '/water-hardness-converter/',
      ]}
    />
  );
}
