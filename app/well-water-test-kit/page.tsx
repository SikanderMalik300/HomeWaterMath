import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import WidgetWellTest from '@/components/guides/WidgetWellTest';
import { WELL_TEST } from '@/lib/content/guides';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/well-water-test-kit/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return <GuideLayout slug={SLUG} copy={WELL_TEST} widget={<WidgetWellTest />} />;
}
