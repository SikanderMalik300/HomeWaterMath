import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import WidgetTds from '@/components/guides/WidgetTds';
import { TDS_GUIDE } from '@/lib/content/guides';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/tds-meter-chart/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return <GuideLayout slug={SLUG} copy={TDS_GUIDE} widget={<WidgetTds />} />;
}
