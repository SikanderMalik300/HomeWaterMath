import type { Metadata } from 'next';
import ToolPage from '@/components/ToolPage';
import CalculatorWellPump from '@/components/calc/CalculatorWellPump';
import ReferenceTable from '@/components/ReferenceTable';
import {
  WELL_PUMP,
  WELL_PUMP_TABLE_TYPE,
  WELL_PUMP_TABLE_HP,
  WELL_PUMP_TABLE_WATER,
  WELL_PUMP_TABLE_REPAIRS,
} from '@/lib/content/tools2';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/well-pump-replacement-cost/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <ToolPage
      slug={SLUG}
      copy={WELL_PUMP}
      calculator={<CalculatorWellPump />}
      referenceTables={
        <>
          <ReferenceTable table={WELL_PUMP_TABLE_TYPE} />
          <ReferenceTable table={WELL_PUMP_TABLE_HP} />
          <ReferenceTable table={WELL_PUMP_TABLE_WATER} />
          <ReferenceTable table={WELL_PUMP_TABLE_REPAIRS} />
        </>
      }
    />
  );
}
