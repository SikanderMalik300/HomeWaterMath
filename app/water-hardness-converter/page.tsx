import type { Metadata } from 'next';
import ToolPage from '@/components/ToolPage';
import CalculatorHardness from '@/components/calc/CalculatorHardness';
import ReferenceTable from '@/components/ReferenceTable';
import { HardnessQuickTable } from '@/components/tables';
import { HARDNESS, HARDNESS_TABLE_SCALE } from '@/lib/content/tools';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/water-hardness-converter/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <ToolPage
      slug={SLUG}
      copy={HARDNESS}
      calculator={<CalculatorHardness />}
      referenceTables={
        <>
          <ReferenceTable table={HARDNESS_TABLE_SCALE} />
          <HardnessQuickTable />
        </>
      }
    />
  );
}
