import type { Metadata } from 'next';
import HubPage from '@/components/HubPage';
import { SOFTENERS_HUB } from '@/lib/content/site';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/water-softeners/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <HubPage
      slug={SLUG}
      intro={SOFTENERS_HUB.intro}
      whichTable={SOFTENERS_HUB.whichTable}
      faq={SOFTENERS_HUB.faq}
      tileSlugs={[
        '/water-softener-size-calculator/',
        '/water-softener-cost/',
        '/water-softener-salt-calculator/',
        '/water-hardness-converter/',
        '/water-softener-installation-cost/',
        '/water-softener-vs-salt-free-cost/',
      ]}
    />
  );
}
