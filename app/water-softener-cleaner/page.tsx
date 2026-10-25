import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import WidgetCleanerDose from '@/components/guides/WidgetCleanerDose';
import { SOFTENER_CLEANER } from '@/lib/content/guides';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/water-softener-cleaner/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return <GuideLayout slug={SLUG} copy={SOFTENER_CLEANER} widget={<WidgetCleanerDose />} />;
}
