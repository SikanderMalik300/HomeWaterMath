import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import WidgetSoftenerTroubleshoot from '@/components/guides/WidgetSoftenerTroubleshoot';
import { SOFTENER_NOT_WORKING } from '@/lib/content/guides';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/water-softener-not-working/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return <GuideLayout slug={SLUG} copy={SOFTENER_NOT_WORKING} widget={<WidgetSoftenerTroubleshoot />} />;
}
