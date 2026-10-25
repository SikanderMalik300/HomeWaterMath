import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import WidgetNeedSoftener from '@/components/guides/WidgetNeedSoftener';
import { HARD_VS_SOFT } from '@/lib/content/guides';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/hard-water-vs-soft-water/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return <GuideLayout slug={SLUG} copy={HARD_VS_SOFT} widget={<WidgetNeedSoftener />} />;
}
