import type { Metadata } from 'next';
import ToolPage from '@/components/ToolPage';
import CalculatorWellShock from '@/components/calc/CalculatorWellShock';
import GuideBody from '@/components/GuideBody';
import { GalPerFtTable } from '@/components/tables';
import { SHOCK, SHOCK_BODY } from '@/lib/content/tools4';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/well-shock-chlorination-calculator/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <ToolPage
      slug={SLUG}
      copy={SHOCK}
      calculator={<CalculatorWellShock />}
      referenceTables={<GalPerFtTable />}
      body={<GuideBody blocks={SHOCK_BODY} />}
    />
  );
}
