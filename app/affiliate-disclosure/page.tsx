import type { Metadata } from 'next';
import TrustLayout from '@/components/TrustLayout';
import Blocks from '@/components/Blocks';
import { AFFILIATE } from '@/lib/content/trust';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/affiliate-disclosure/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <TrustLayout slug={SLUG}>
      <Blocks blocks={AFFILIATE} />
    </TrustLayout>
  );
}
