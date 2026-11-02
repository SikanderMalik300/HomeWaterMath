import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import WidgetSaltBridge from '@/components/guides/WidgetSaltBridge';
import { SALT_BRIDGE } from '@/lib/content/guides';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/water-softener-salt-bridge/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return <GuideLayout slug={SLUG} copy={SALT_BRIDGE} widget={<WidgetSaltBridge />} />;
}
