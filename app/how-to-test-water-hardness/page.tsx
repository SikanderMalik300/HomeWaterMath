import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import WidgetStripDecoder from '@/components/guides/WidgetStripDecoder';
import { HARDNESS_TEST } from '@/lib/content/guides';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/how-to-test-water-hardness/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return <GuideLayout slug={SLUG} copy={HARDNESS_TEST} widget={<WidgetStripDecoder />} />;
}
