import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import WidgetSaltTypes from '@/components/guides/WidgetSaltTypes';
import { SALT_TYPES_GUIDE } from '@/lib/content/guides';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/water-softener-salt-types/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return <GuideLayout slug={SLUG} copy={SALT_TYPES_GUIDE} widget={<WidgetSaltTypes />} />;
}
