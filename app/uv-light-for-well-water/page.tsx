import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import WidgetUvWell from '@/components/guides/WidgetUvWell';
import { UV_WELL } from '@/lib/content/guides';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/uv-light-for-well-water/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return <GuideLayout slug={SLUG} copy={UV_WELL} widget={<WidgetUvWell />} />;
}
