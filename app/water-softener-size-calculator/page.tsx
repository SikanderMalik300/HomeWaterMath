import type { Metadata } from 'next';
import ToolPage from '@/components/ToolPage';
import CalculatorSize from '@/components/calc/CalculatorSize';
import ReferenceTable from '@/components/ReferenceTable';
import { SizeChartTable } from '@/components/tables';
import { SIZE, SIZE_TABLE_CAPACITY, SIZE_TABLE_STANDARD } from '@/lib/content/tools';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/water-softener-size-calculator/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <ToolPage
      slug={SLUG}
      copy={SIZE}
      calculator={<CalculatorSize />}
      referenceTables={
        <>
          <ReferenceTable table={SIZE_TABLE_CAPACITY} />
          <SizeChartTable />
          <ReferenceTable table={SIZE_TABLE_STANDARD} />
        </>
      }
    />
  );
}
