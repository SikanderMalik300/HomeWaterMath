import type { Metadata } from 'next';
import ToolPage from '@/components/ToolPage';
import CalculatorSettings from '@/components/calc/CalculatorSettings';
import { CapacityBySizeTable } from '@/components/tables';
import { SETTINGS } from '@/lib/content/tools3';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/water-softener-settings/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <ToolPage
      slug={SLUG}
      copy={SETTINGS}
      calculator={<CalculatorSettings />}
      referenceTables={<CapacityBySizeTable />}
    />
  );
}
