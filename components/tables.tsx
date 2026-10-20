// Reference tables generated from the calc functions at build time. The Vitest
// suite pins these against the spec's literal values.

import ReferenceTable from './ReferenceTable';
import type { SimpleTable } from '@/lib/content/types';
import { sizeChartCell } from '@/lib/calc/softenerSize';
import { saltPerYearForTable } from '@/lib/calc/salt';
import { convertHardness } from '@/lib/calc/hardness';
import { pressureTank, drawdownFactor } from '@/lib/calc/pressureTank';
import { PRESSURE_TANKS } from '@/lib/data/constants';
import { formatInt, formatDecimal } from '@/lib/calc/round';

export function SizeChartTable() {
  const hardness = [5, 10, 15, 20, 25];
  const rows = [1, 2, 3, 4, 5, 6].map((p) => [
    String(p),
    ...hardness.map((h) => {
      const c = sizeChartCell(p, h);
      return c === null ? 'Over 96,000' : formatInt(c);
    }),
  ]);
  const table: SimpleTable = {
    caption: 'Water softener size chart (75 gal per person, 7 days, 9 lb salt setting)',
    headers: ['People', '5 gpg', '10 gpg', '15 gpg', '20 gpg', '25 gpg'],
    rows,
    numericCols: [0, 1, 2, 3, 4, 5],
  };
  return <ReferenceTable table={table} />;
}

export function SaltYearlyTable() {
  const hardness = [5, 10, 15, 20, 25];
  const rows = [2, 3, 4, 5].map((p) => [
    String(p),
    ...hardness.map((h) => {
      const { lbYear, bags40 } = saltPerYearForTable(p, h);
      return `${formatInt(lbYear)} (${bags40})`;
    }),
  ]);
  const table: SimpleTable = {
    caption:
      'Yearly salt by household and hardness (48,000-grain softener, 9 lb setting, metered, 75 gal per person)',
    captionBelow: 'Each cell is pounds of salt per year, with 40 lb bags in brackets.',
    headers: ['People', '5 gpg', '10 gpg', '15 gpg', '20 gpg', '25 gpg'],
    rows,
    numericCols: [0, 1, 2, 3, 4, 5],
  };
  return <ReferenceTable table={table} />;
}

export function HardnessQuickTable() {
  const gpgValues = [1, 3, 5, 7, 10, 12, 15, 20, 25, 30];
  const rows = gpgValues.map((g) => {
    const r = convertHardness(g, 'gpg');
    return [
      String(g),
      formatDecimal(r.mgl, 1),
      formatDecimal(r.mmol, 2),
      formatDecimal(r.dh, 1),
    ];
  });
  const table: SimpleTable = {
    caption: 'Quick conversions',
    headers: ['gpg', 'mg/L (ppm)', 'mmol/L', '°dH'],
    rows,
    numericCols: [0, 1, 2, 3],
  };
  return <ReferenceTable table={table} />;
}

export function DrawdownTable() {
  const switches: [number, number][] = [
    [20, 40],
    [30, 50],
    [40, 60],
  ];
  const rows = PRESSURE_TANKS.map((t) => [
    String(t),
    ...switches.map(([ci, co]) => formatDecimal(t * drawdownFactor(ci, co), 1)),
  ]);
  const table: SimpleTable = {
    caption: 'Drawdown by tank size and switch setting (gallons)',
    captionBelow:
      "Calculated with Boyle's law, pre-charge 2 psi below cut-in, at sea level. Goulds publishes 5.3 gallons for its 19.9-gallon tank at 40/60 and 22.8 for its 84.9-gallon tank.",
    headers: ['Tank (gal)', '20/40', '30/50', '40/60'],
    rows,
    numericCols: [0, 1, 2, 3],
  };
  return <ReferenceTable table={table} />;
}

export function MinTankTable() {
  const pumps: { label: string; gpm: number; hp: number }[] = [
    { label: '5 gpm, 1/2 hp', gpm: 5, hp: 0.5 },
    { label: '7 gpm, 1/2 hp', gpm: 7, hp: 0.5 },
    { label: '10 gpm, 3/4 hp', gpm: 10, hp: 0.75 },
    { label: '10 gpm, 1 hp', gpm: 10, hp: 1 },
    { label: '12 gpm, 1 hp', gpm: 12, hp: 1 },
    { label: '15 gpm, 1 1/2 hp', gpm: 15, hp: 1.5 },
    { label: '20 gpm, 2 hp', gpm: 20, hp: 2 },
  ];
  const cell = (gpm: number, hp: number, cutIn: number, cutOut: number) => {
    const r = pressureTank({ gpm, hp, runOverride: null, cutIn, cutOut });
    return r.recommended ? `${r.recommended}` : `${r.multipleCount} × 119`;
  };
  const rows = pumps.map((p) => [p.label, cell(p.gpm, p.hp, 30, 50), cell(p.gpm, p.hp, 40, 60)]);
  const table: SimpleTable = {
    caption: 'Minimum tank size for common pumps (1 minute up to 3/4 hp, 2 minutes above)',
    headers: ['Pump', '30/50', '40/60'],
    rows,
    numericCols: [1, 2],
  };
  return <ReferenceTable table={table} />;
}
