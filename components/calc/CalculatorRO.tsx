'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { roCost, type ROSystem, type ROInstaller, type ROEfficiency } from '@/lib/calc/roCost';
import { formatDollars, formatInt, formatDecimal } from '@/lib/calc/round';
import { Field, NumberField, SegmentedControl, useDebounced, parseNum } from './inputs';
import ResultCard, { type ResultRow } from './ResultCard';
import ShowTheMath from './ShowTheMath';
import CopyShareBar from './CopyShareBar';
import StickyResultBar from './StickyResultBar';
import { useToolEvents } from './useToolEvents';

const SLUG = '/reverse-osmosis-system-cost/';

interface Raw {
  system: ROSystem;
  installer: ROInstaller;
  people: string;
  gal: string;
  efficiency: ROEfficiency;
  customRatio: string;
  filters: string;
  rate: string;
  fridge: boolean;
  stoneHole: boolean;
  drain: boolean;
}
const DEFAULTS: Raw = {
  system: 'tank',
  installer: 'plumber',
  people: '4',
  gal: '1',
  efficiency: 'standard',
  customRatio: '3',
  filters: '50',
  rate: '',
  fridge: false,
  stoneHole: false,
  drain: false,
};

function compute(raw: Raw) {
  const people = parseNum(raw.people);
  const gal = parseNum(raw.gal);
  const filters = parseNum(raw.filters);
  const customRatio = parseNum(raw.customRatio);
  const valid =
    people !== null && people > 0 &&
    gal !== null && gal > 0 &&
    filters !== null && filters >= 0 &&
    (raw.efficiency !== 'custom' || (customRatio !== null && customRatio >= 0));
  const result = roCost({
    system: raw.system,
    installer: raw.installer,
    people: people ?? 0,
    galPerPersonDay: gal ?? 0,
    efficiency: raw.efficiency,
    customRatio: customRatio ?? 0,
    filtersPerYear: filters ?? 0,
    rate: raw.rate.trim() === '' ? null : parseNum(raw.rate),
    fridge: raw.fridge,
    stoneHole: raw.stoneHole,
    drain: raw.drain,
  });
  const params = new URLSearchParams({
    system: raw.system,
    installer: raw.installer,
    people: raw.people,
    gal: raw.gal,
    eff: raw.efficiency,
    ...(raw.efficiency === 'custom' ? { ratio: raw.customRatio } : {}),
    filters: raw.filters,
    ...(raw.rate.trim() ? { rate: raw.rate } : {}),
    ...(raw.fridge ? { fridge: '1' } : {}),
    ...(raw.stoneHole ? { stone: '1' } : {}),
    ...(raw.drain ? { drain: '1' } : {}),
  }).toString();
  return { valid, result, params, raw };
}

export default function CalculatorRO() {
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
      system: (q.get('system') as ROSystem) ?? r.system,
      installer: (q.get('installer') as ROInstaller) ?? r.installer,
      people: q.get('people') ?? r.people,
      gal: q.get('gal') ?? r.gal,
      efficiency: (q.get('eff') as ROEfficiency) ?? r.efficiency,
      customRatio: q.get('ratio') ?? r.customRatio,
      filters: q.get('filters') ?? r.filters,
      rate: q.get('rate') ?? r.rate,
      fridge: q.get('fridge') === '1' ? true : r.fridge,
      stoneHole: q.get('stone') === '1' ? true : r.stoneHole,
      drain: q.get('drain') === '1' ? true : r.drain,
    }));
  }, []);

  const r = shown.result;
  const isCounter = shown.raw.system === 'counter';
  const hasRate = shown.raw.rate.trim() !== '';
  const headline = formatDollars(r.upfront.typical);
  const subline = `${formatDollars(r.upfront.low)} to ${formatDollars(r.upfront.high)} upfront`;

  const rows: ResultRow[] = [
    { label: 'Filters', value: `${formatDollars(r.filtersPerYear)} a year` },
    { label: 'RO water', value: `${formatInt(r.product)} gallons a year` },
    {
      label: 'Sent to drain',
      value: `${formatInt(r.toDrain)} gallons a year (${formatDecimal(r.drainRatio, 1)} gal per gal)${hasRate ? `, about ${formatDollars(r.waterCost)} of water` : ''}`,
    },
    { label: '10-year total', value: formatDollars(r.tenYear) },
    { label: 'Cost per gallon of RO water', value: `${formatDecimal(r.centsPerGal, 1)}¢` },
  ];

  const mathLines = [
    `upfront = ${formatDollars(r.upfront.low)} to ${formatDollars(r.upfront.high)} (typical ${formatDollars(r.upfront.typical)})`,
    `RO water = ${shown.raw.people} × ${shown.raw.gal} × 365 = ${formatInt(r.product)} gal a year`,
    `drain ratio = ${formatDecimal(r.drainRatio, 1)}; sent to drain = ${formatInt(r.toDrain)} gal`,
    `10-year = ${formatDollars(r.upfront.typical)} + 10 × (${formatDollars(r.filtersPerYear)} + ${formatDollars(r.waterCost)}) = ${formatDollars(r.tenYear)}`,
    `cost per gallon = ${formatDollars(r.tenYear)} ÷ (10 × ${formatInt(r.product)}) = ${formatDecimal(r.centsPerGal, 1)}¢`,
  ];
  const copyText = `Reverse osmosis about ${formatDollars(r.upfront.typical)} upfront (${formatDollars(r.upfront.low)} to ${formatDollars(r.upfront.high)}), 10-year total ${formatDollars(r.tenYear)}, about ${formatDecimal(r.centsPerGal, 1)}¢ per gallon.`;

  return (
    <div id="calculator" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label="System">
          <SegmentedControl
            legend="System"
            value={raw.system}
            onChange={(v) => set('system', v)}
            options={[
              { value: 'tank', label: 'Under-sink with tank' },
              { value: 'tankless', label: 'Tankless under-sink' },
              { value: 'counter', label: 'Countertop' },
            ]}
          />
        </Field>
        {!isCounter ? (
          <Field label="Who installs it">
            <SegmentedControl
              legend="Who installs it"
              value={raw.installer}
              onChange={(v) => set('installer', v)}
              options={[{ value: 'diy', label: 'DIY' }, { value: 'plumber', label: 'Plumber' }]}
            />
          </Field>
        ) : (
          <Field label="Who installs it">
            <p className="text-[14px] text-muted">Countertop systems are DIY: no install.</p>
          </Field>
        )}
        <Field label="People in your home" htmlFor="ro-people">
          <NumberField id="ro-people" value={raw.people} onChange={(v) => set('people', v)} whole min={1} max={12} />
        </Field>
        <Field label="RO water per person per day, gallons" htmlFor="ro-gal" helper="Drinking and cooking. EPA uses 1 gallon.">
          <NumberField id="ro-gal" value={raw.gal} onChange={(v) => set('gal', v)} min={0} step={0.5} />
        </Field>
        <Field label="Efficiency">
          <SegmentedControl
            legend="Efficiency"
            value={raw.efficiency}
            onChange={(v) => set('efficiency', v)}
            options={[
              { value: 'standard', label: 'Standard (about 15%)' },
              { value: 'watersense', label: 'WaterSense labeled (30%)' },
              { value: 'custom', label: 'Enter drain ratio' },
            ]}
          />
        </Field>
        {raw.efficiency === 'custom' && (
          <Field label="Gallons to drain per gallon of RO water" htmlFor="ro-ratio">
            <NumberField id="ro-ratio" value={raw.customRatio} onChange={(v) => set('customRatio', v)} min={0} step={0.1} />
          </Field>
        )}
        <Field label="Filters per year, $" htmlFor="ro-filters">
          <NumberField id="ro-filters" value={raw.filters} onChange={(v) => set('filters', v)} min={0} />
        </Field>
        <Field label="Your water and sewer rate, $ per 1,000 gallons" htmlFor="ro-rate">
          <NumberField id="ro-rate" value={raw.rate} onChange={(v) => set('rate', v)} min={0} step={0.5} />
        </Field>
        <div className="mb-4 sm:col-span-2">
          <span className="mb-1.5 block text-[14px] font-medium text-ink">Extras</span>
          <div className="flex flex-wrap gap-4 text-[15px]">
            <label className="inline-flex min-h-[44px] items-center gap-2">
              <input type="checkbox" checked={raw.fridge} onChange={(e) => set('fridge', e.target.checked)} className="h-4 w-4" />
              Refrigerator or ice maker line
            </label>
            <label className="inline-flex min-h-[44px] items-center gap-2">
              <input type="checkbox" checked={raw.stoneHole} onChange={(e) => set('stoneHole', e.target.checked)} className="h-4 w-4" />
              Faucet hole drilled in a stone countertop
            </label>
            <label className="inline-flex min-h-[44px] items-center gap-2">
              <input type="checkbox" checked={raw.drain} onChange={(e) => set('drain', e.target.checked)} className="h-4 w-4" />
              New drain line
            </label>
          </div>
        </div>
      </div>

      <div ref={resultRef}>
        <ResultCard
          headline={headline}
          subline={subline}
          rows={rows}
          invalid={invalid}
          invalidMessage="Enter your household to price a system."
        >
          {r.showComparison && (
            <p className="mt-3 text-[15px] text-ink">
              A WaterSense-labeled system would send about {formatInt(r.waterSenseToDrain)} gallons a year to the drain instead.
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
