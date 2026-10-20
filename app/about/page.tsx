import type { Metadata } from 'next';
import TrustLayout from '@/components/TrustLayout';
import Blocks from '@/components/Blocks';
import { ABOUT } from '@/lib/content/trust';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/about/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <TrustLayout slug={SLUG}>
      <Blocks blocks={ABOUT} />
    </TrustLayout>
  );
}
