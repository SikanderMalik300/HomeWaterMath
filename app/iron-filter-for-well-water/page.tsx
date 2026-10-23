import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import WidgetIronPicker from '@/components/guides/WidgetIronPicker';
import { IRON_FILTER } from '@/lib/content/guides';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/iron-filter-for-well-water/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return <GuideLayout slug={SLUG} copy={IRON_FILTER} widget={<WidgetIronPicker />} />;
}
