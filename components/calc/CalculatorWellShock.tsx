'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { wellShock, galPerFt } from '@/lib/calc/wellShock';
import { formatTrim, formatDecimal } from '@/lib/calc/round';
import { Field, NumberField, SelectField, useDebounced, parseNum } from './inputs';
import ResultCard, { type ResultRow } from './ResultCard';
import ShowTheMath from './ShowTheMath';
import CopyShareBar from './CopyShareBar';
import StickyResultBar from './StickyResultBar';
import { useToolEvents } from './useToolEvents';
import { SHOCK_AGENCY_LINE } from '@/lib/content/tools4';

const SLUG = '/well-shock-chlorination-calculator/';

interface Raw {
  wellDepth: string;
  staticLevel: string;
  dia: number;
  tankGal: string;
  heaterGal: string;
  toilets: string;
  ppm: number;
  bleachPct: number;
}

const DEFAULTS: Raw = {
  wellDepth: '200',
  staticLevel: '50',
  dia: 6,
  tankGal: '20',
  heaterGal: '50',
  toilets: '2',
  ppm: 100,
  bleachPct: 6,
};

interface Computed {
  valid: boolean;
  depthError: boolean;
  result: ReturnType<typeof wellShock>;
  raw: Raw;
  params: string;
}

function compute(raw: Raw): Computed {
  const wellDepth = parseNum(raw.wellDepth);
  const staticLevel = parseNum(raw.staticLevel);
  const tank = parseNum(raw.tankGal);
  const heater = parseNum(raw.heaterGal);
  const toilets = parseNum(raw.toilets);
  const result = wellShock({
    wellDepth: wellDepth ?? NaN,
    staticLevel: staticLevel ?? NaN,
    dia: raw.dia,
    tankGal: tank ?? 0,
    heaterGal: heater ?? 0,
    toilets: toilets ?? 0,
    ppm: raw.ppm,
    bleachPct: raw.bleachPct,
  });
  const depthError = wellDepth != null && staticLevel != null && staticLevel >= wellDepth;
  const params = new URLSearchParams({
    depth: raw.wellDepth,
    static: raw.staticLevel,
    dia: String(raw.dia),
    tank: raw.tankGal,
    heater: raw.heaterGal,
    toilets: raw.toilets,
    ppm: String(raw.ppm),
    pct: String(raw.bleachPct),
  }).toString();
  return { valid: result.valid, depthError, result, raw, params };
}

export default function CalculatorWellShock() {
  const [raw, setRaw] = useState<Raw>(DEFAULTS);
  const { onInteract, onResult } = useToolEvents(SLUG);
  const set = <K extends keyof Raw>(k: K, v: Raw[K]) => {
    onInteract();
    setRaw((r) => ({ ...r, [k]: v }));
  };
  const debounced = useDebounced(raw, 150);
  const computed = useMemo(() => compute(debounced), [debounced]);
  const [last, setLast] = useState<Computed>(() => compute(DEFAULTS));
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
      wellDepth: q.get('depth') ?? r.wellDepth,
      staticLevel: q.get('static') ?? r.staticLevel,
      dia: Number(q.get('dia')) || r.dia,
      tankGal: q.get('tank') ?? r.tankGal,
      heaterGal: q.get('heater') ?? r.heaterGal,
      toilets: q.get('toilets') ?? r.toilets,
      ppm: Number(q.get('ppm')) || r.ppm,
      bleachPct: Number(q.get('pct')) || r.bleachPct,
    }));
  }, []);

  const r = shown.result;
  const pct = shown.raw.bleachPct;
  const cupsStr = formatDecimal(r.bleachCups, 1);
  const galStr2 = formatDecimal(r.bleachGal, 2);

  const headline =
    r.bleachGal >= 1
      ? `Bleach needed: ${galStr2} gal (${cupsStr} cups) of ${pct}% bleach`
      : `Bleach needed: ${cupsStr} cups (${galStr2} gal) of ${pct}% bleach`;

  const rows: ResultRow[] = [
    { label: 'Water in the well', value: `${formatTrim(r.wellGal, 1)} gal` },
    { label: 'Water in your house', value: `${formatTrim(r.houseGal, 1)} gal` },
    { label: 'Total', value: `${formatTrim(r.totalGal, 1)} gal` },
    { label: 'Strength', value: `${shown.raw.ppm} ppm` },
    { label: 'Contact time', value: '12 to 24 hours' },
    { label: 'Retest', value: '7 to 14 days after flushing' },
  ];

  const warnings: string[] = [];
  if (r.highPpm) {
    warnings.push(
      "This is above the Minnesota Dept. of Health's 200 ppm maximum. Very strong chlorine can damage pumps, pipes and bladder pressure tanks.",
    );
  }
  if (r.dugWell) {
    warnings.push(
      'Dug wells hold a lot of water and often let surface water in. Shocking may only help for a while; have the well inspected.',
    );
  }
  if (r.fullCasing) {
    warnings.push('Assuming the casing is full of water. Enter the depth to water for a closer number.');
  }

  const mathLines = [
    `water in the well = (${shown.raw.wellDepth} − ${shown.raw.staticLevel}) × ${galPerFt(shown.raw.dia)} = ${formatTrim(r.wellGal, 1)} gal`,
    `water in the house = ${shown.raw.tankGal} + ${shown.raw.heaterGal} + ${shown.raw.toilets} × 3 + 10 = ${formatTrim(r.houseGal, 1)} gal`,
    `total = ${formatTrim(r.wellGal, 1)} + ${formatTrim(r.houseGal, 1)} = ${formatTrim(r.totalGal, 1)} gal`,
    `bleach = ${formatTrim(r.totalGal, 1)} × ${shown.raw.ppm} ÷ (${pct} × 10,000) = ${galStr2} gal`,
    `= ${formatDecimal(r.bleachQt, 1)} quarts, ${cupsStr} cups`,
  ];

  const copyText = `Shock a ${shown.raw.dia}-inch well: about ${cupsStr} cups (${galStr2} gal) of ${pct}% bleach for ${shown.raw.ppm} ppm in ${formatTrim(r.totalGal, 1)} gallons. Leave 12 to 24 hours, flush, retest in 7 to 14 days.`;

  const stickyHeadline = r.bleachGal >= 1 ? `${galStr2} gal of bleach` : `${cupsStr} cups of bleach`;

  const invalidMessage = computed.depthError
    ? 'Depth to water must be less than the well depth.'
    : 'Enter the well depth, casing size and bleach strength to see how much bleach you need.';

  return (
    <div id="calculator" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label="Well depth (ft)" htmlFor="shock-depth">
          <NumberField id="shock-depth" value={raw.wellDepth} onChange={(v) => set('wellDepth', v)} min={1} />
        </Field>
        <Field label="Depth to water (ft)" htmlFor="shock-static" helper="From your well log or a water level meter. If you don't know it, enter 0 to assume a full well; you'll use a little more bleach.">
          <NumberField id="shock-static" value={raw.staticLevel} onChange={(v) => set('staticLevel', v)} min={0} />
        </Field>
        <Field label="Casing diameter" htmlFor="shock-dia">
          <SelectField
            id="shock-dia"
            ariaLabel="Casing diameter"
            value={raw.dia}
            onChange={(v) => set('dia', v)}
            options={[
              { value: 2, label: '2 in' },
              { value: 4, label: '4 in' },
              { value: 5, label: '5 in' },
              { value: 6, label: '6 in' },
              { value: 8, label: '8 in' },
              { value: 24, label: '24 in (dug)' },
              { value: 36, label: '36 in (dug)' },
            ]}
          />
        </Field>
        <Field label="Pressure tank size (gal)" htmlFor="shock-tank">
          <NumberField id="shock-tank" value={raw.tankGal} onChange={(v) => set('tankGal', v)} min={0} />
        </Field>
        <Field label="Water heater (gal)" htmlFor="shock-heater">
          <NumberField id="shock-heater" value={raw.heaterGal} onChange={(v) => set('heaterGal', v)} min={0} />
        </Field>
        <Field label="Toilets" htmlFor="shock-toilets">
          <NumberField id="shock-toilets" value={raw.toilets} onChange={(v) => set('toilets', v)} whole min={0} max={10} />
        </Field>
        <Field label="Target strength" htmlFor="shock-ppm" helper={SHOCK_AGENCY_LINE}>
          <SelectField
            id="shock-ppm"
            ariaLabel="Target strength"
            value={raw.ppm}
            onChange={(v) => set('ppm', v)}
            options={[
              { value: 50, label: '50 ppm' },
              { value: 100, label: '100 ppm' },
              { value: 150, label: '150 ppm' },
              { value: 200, label: '200 ppm' },
              { value: 250, label: '250 ppm' },
            ]}
          />
        </Field>
        <Field label="Bleach strength" htmlFor="shock-pct">
          <SelectField
            id="shock-pct"
            ariaLabel="Bleach strength"
            value={raw.bleachPct}
            onChange={(v) => set('bleachPct', v)}
            options={[
              { value: 5.25, label: '5.25%' },
              { value: 6, label: '6%' },
              { value: 8.25, label: '8.25%' },
              { value: 12.5, label: '12.5% (pool chlorine)' },
            ]}
          />
        </Field>
      </div>

      <div ref={resultRef}>
        <ResultCard
          headline={headline}
          rows={rows}
          warnings={warnings}
          invalid={invalid}
          invalidMessage={invalidMessage}
        >
          <p className="mt-3 text-[14px] text-muted">Round up to the next cup.</p>
          <ShowTheMath lines={mathLines} />
          <CopyShareBar resultText={copyText} query={shown.params} tool={SLUG} />
        </ResultCard>
      </div>

      <StickyResultBar headline={stickyHeadline} watchRef={resultRef} />
    </div>
  );
}
