import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import WidgetSodium from '@/components/guides/WidgetSodium';
import { DRINK_SOFTENED } from '@/lib/content/guides';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/can-you-drink-softened-water/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return <GuideLayout slug={SLUG} copy={DRINK_SOFTENED} widget={<WidgetSodium />} />;
}
