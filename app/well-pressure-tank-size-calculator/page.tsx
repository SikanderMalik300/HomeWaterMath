import type { Metadata } from 'next';
import ToolPage from '@/components/ToolPage';
import CalculatorPressureTank from '@/components/calc/CalculatorPressureTank';
import { DrawdownTable, MinTankTable } from '@/components/tables';
import { PRESSURE } from '@/lib/content/tools';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/well-pressure-tank-size-calculator/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <ToolPage
      slug={SLUG}
      copy={PRESSURE}
      calculator={<CalculatorPressureTank />}
      referenceTables={
        <>
          <DrawdownTable />
          <MinTankTable />
        </>
      }
    />
  );
}
