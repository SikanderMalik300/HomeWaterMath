import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import WidgetRepairOrReplace from '@/components/guides/WidgetRepairOrReplace';
import { SOFTENER_LIFESPAN } from '@/lib/content/guides';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/how-long-do-water-softeners-last/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return <GuideLayout slug={SLUG} copy={SOFTENER_LIFESPAN} widget={<WidgetRepairOrReplace />} />;
}
