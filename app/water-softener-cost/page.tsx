import type { Metadata } from 'next';
import ToolPage from '@/components/ToolPage';
import CalculatorCost from '@/components/calc/CalculatorCost';
import ReferenceTable from '@/components/ReferenceTable';
import { COST, COST_TABLE_BY_TYPE, COST_TABLE_RUNNING } from '@/lib/content/tools';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/water-softener-cost/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <ToolPage
      slug={SLUG}
      copy={COST}
      calculator={<CalculatorCost />}
      referenceTables={
        <>
          <ReferenceTable table={COST_TABLE_BY_TYPE} />
          <ReferenceTable table={COST_TABLE_RUNNING} />
        </>
      }
    />
  );
}
