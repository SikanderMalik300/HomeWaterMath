import type { Metadata } from 'next';
import ToolPage from '@/components/ToolPage';
import CalculatorWholeHouseFilter from '@/components/calc/CalculatorWholeHouseFilter';
import ReferenceTable from '@/components/ReferenceTable';
import { WHOLE_HOUSE, WHOLE_HOUSE_TABLE_TYPE, WHOLE_HOUSE_TABLE_PARTS } from '@/lib/content/tools2';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/whole-house-water-filter-cost/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <ToolPage
      slug={SLUG}
      copy={WHOLE_HOUSE}
      calculator={<CalculatorWholeHouseFilter />}
      referenceTables={
        <>
          <ReferenceTable table={WHOLE_HOUSE_TABLE_TYPE} />
          <ReferenceTable table={WHOLE_HOUSE_TABLE_PARTS} />
        </>
      }
    />
  );
}
