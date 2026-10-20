import type { Metadata } from 'next';
import TrustLayout from '@/components/TrustLayout';
import Blocks from '@/components/Blocks';
import { TERMS } from '@/lib/content/trust';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/terms/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <TrustLayout slug={SLUG}>
      <Blocks blocks={TERMS} />
    </TrustLayout>
  );
}
