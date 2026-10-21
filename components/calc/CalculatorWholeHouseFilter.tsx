'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { wholeHouseFilterCost, type WHFSystem } from '@/lib/calc/wholeHouseFilterCost';
import { CARTRIDGE_SET, SEDIMENT_ONLY, UV_LAMP } from '@/lib/data/constants';
import { formatDollars, formatInt, formatDecimal } from '@/lib/calc/round';
import { Field, NumberField, SegmentedControl, useDebounced, parseNum } from './inputs';
import ResultCard, { type ResultRow } from './ResultCard';
import ShowTheMath from './ShowTheMath';
import CopyShareBar from './CopyShareBar';
import StickyResultBar from './StickyResultBar';
import { useToolEvents } from './useToolEvents';

const SLUG = '/whole-house-water-filter-cost/';

interface Raw {
  system: WHFSystem;
  uv: boolean;
  people: string;
  gal: string;
}
const DEFAULTS: Raw = { system: 'cartridge', uv: false, people: '4', gal: '82' };

function compute(raw: Raw) {
  const people = parseNum(raw.people);
  const gal = parseNum(raw.gal);
  const valid = people !== null && people > 0 && gal !== null && gal > 0;
  const result = wholeHouseFilterCost({
    system: raw.system,
    uv: raw.uv,
    people: people ?? 0,
    galPerPerson: gal ?? 0,
  });
  const params = new URLSearchParams({
    system: raw.system,
    uv: raw.uv ? '1' : '0',
    people: raw.people,
    gal: raw.gal,
  }).toString();
  return { valid, result, params, raw };
}

export default function CalculatorWholeHouseFilter() {
  const [raw, setRaw] = useState<Raw>(DEFAULTS);
  const { onInteract, onResult } = useToolEvents(SLUG);
  const set = <K extends keyof Raw>(k: K, v: Raw[K]) => {
    onInteract();
    setRaw((r) => ({ ...r, [k]: v }));
  };
  const debounced = useDebounced(raw, 150);
  const computed = useMemo(() => compute(debounced), [debounced]);
  const [last, setLast] = useState(() => compute(DEFAULTS));
  useEffect(() => {
    if (computed.valid) setLast(computed);
  }, [computed]);
  const shown = computed.valid ? computed : last;
  const invalid = !computed.valid;
  useEffect(() => {
    onResult(shown.params);
  }, [shown.params, onResult]);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if ([...q.keys()].length === 0) return;
    setRaw((r) => ({
      system: (q.get('system') as WHFSystem) ?? r.system,
      uv: q.get('uv') ? q.get('uv') === '1' : r.uv,
      people: q.get('people') ?? r.people,
      gal: q.get('gal') ?? r.gal,
    }));
  }, []);

  const r = shown.result;
  const headline = formatDollars(r.upfront.typical);
  const subline = `${formatDollars(r.upfront.low)} to ${formatDollars(r.upfront.high)} installed`;

  const rows: ResultRow[] = [{ label: 'Water through the filter', value: `${formatInt(r.gal)} gallons a year` }];
  if (r.system === 'cartridge') {
    rows.push({ label: 'Cartridge sets', value: `${formatDecimal(r.setsPerYear, 1)} a year, ${formatDollars(r.setsPerYear * CARTRIDGE_SET)}` });
  } else if (r.system === 'well') {
    rows.push({ label: 'Pre-filter sets', value: `${formatDecimal(r.setsPerYear, 1)} a year, ${formatDollars(r.setsPerYear * SEDIMENT_ONLY)}` });
  } else {
    rows.push({
      label: 'Media change due',
      value: r.media > 0 ? `year ${formatDecimal(r.mediaYears, 1)}, ${formatDollars(r.media)}` : `year ${formatDecimal(r.mediaYears, 1)}, not within 10 years`,
    });
  }
  if (r.uv) rows.push({ label: 'UV lamp', value: `${formatDollars(UV_LAMP)} a year` });
  rows.push({ label: '10-year total', value: formatDollars(r.tenYear) });

  const mathLines = [
    `gallons a year = ${shown.raw.people} × ${shown.raw.gal} × 365 = ${formatInt(r.gal)}`,
    r.system === 'cartridge'
      ? `cartridges = ${formatDecimal(r.setsPerYear, 1)} sets × $${CARTRIDGE_SET} = ${formatDollars(r.setsPerYear * CARTRIDGE_SET)} a year`
      : r.system === 'well'
        ? `pre-filters = ${formatDecimal(r.setsPerYear, 1)} sets × $${SEDIMENT_ONLY} = ${formatDollars(r.setsPerYear * SEDIMENT_ONLY)} a year`
        : `media change ${r.media > 0 ? `in year ${formatDecimal(r.mediaYears, 1)} = ${formatDollars(r.media)}` : 'not within 10 years'}`,
    ...(r.uv ? [`UV lamp = ${formatDollars(UV_LAMP)} a year`] : []),
    `10-year total = ${formatDollars(r.upfront.typical)} + 10 × ${formatDollars(r.yearly)} + ${formatDollars(r.media)} = ${formatDollars(r.tenYear)}`,
  ];
  const copyText = `Whole house filter about ${formatDollars(r.upfront.typical)} installed (${formatDollars(r.upfront.low)} to ${formatDollars(r.upfront.high)}), 10-year total ${formatDollars(r.tenYear)}.`;

  return (
    <div id="calculator" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label="System">
          <SegmentedControl
            legend="System"
            value={raw.system}
            onChange={(v) => set('system', v)}
            options={[
              { value: 'cartridge', label: 'Cartridge filters, sediment + carbon (city water)' },
              { value: 'carbonTank', label: 'Carbon tank (city water)' },
              { value: 'well', label: 'Well water system (iron, sulfur, sediment)' },
            ]}
          />
        </Field>
        <Field label="Add UV disinfection">
          <SegmentedControl
            legend="Add UV disinfection"
            value={raw.uv ? 'yes' : 'no'}
            onChange={(v) => set('uv', v === 'yes')}
            options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]}
          />
        </Field>
        <Field label="People in your home" htmlFor="whf-people">
          <NumberField id="whf-people" value={raw.people} onChange={(v) => set('people', v)} whole min={1} max={12} />
        </Field>
        <Field label="Gallons per person per day" htmlFor="whf-gal" helper="EPA average for all home use.">
          <NumberField id="whf-gal" value={raw.gal} onChange={(v) => set('gal', v)} whole min={1} max={200} />
        </Field>
      </div>

      <div ref={resultRef}>
        <ResultCard
          headline={headline}
          subline={subline}
          rows={rows}
          invalid={invalid}
          invalidMessage="Enter your household to price a system."
        >
          <p className="mt-3 text-[14px] text-muted">Installing it yourself saves the labor, usually $200 to $600.</p>
          {r.system === 'well' && (
            <p className="mt-2 text-[14px] text-muted">
              Well systems also need media replaced every 5 to 12 years depending on type. Ask for the media price with your quote.
            </p>
          )}
          <ShowTheMath lines={mathLines} />
          <CopyShareBar resultText={copyText} query={shown.params} tool={SLUG} />
        </ResultCard>
      </div>

      <StickyResultBar headline={headline} watchRef={resultRef} />
    </div>
  );
}
