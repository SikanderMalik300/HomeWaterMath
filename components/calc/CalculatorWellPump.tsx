'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { wellPumpCost, type WellPumpInput, type PumpType } from '@/lib/calc/wellPumpCost';
import { formatDollars } from '@/lib/calc/round';
import type { Range } from '@/lib/calc/range';
import { Field, NumberField, SegmentedControl, SelectField, useDebounced, parseNum } from './inputs';
import ResultCard, { type ResultRow } from './ResultCard';
import ShowTheMath from './ShowTheMath';
import CopyShareBar from './CopyShareBar';
import StickyResultBar from './StickyResultBar';
import { useToolEvents } from './useToolEvents';

const SLUG = '/well-pump-replacement-cost/';

interface Raw {
  type: PumpType;
  depth: string;
  pipeWire: boolean;
  tank: boolean;
  afterHours: boolean;
  age: string;
  repair: string;
  replacement: string;
}
const DEFAULTS: Raw = {
  type: 'submersible',
  depth: '200',
  pipeWire: false,
  tank: false,
  afterHours: false,
  age: '12',
  repair: '',
  replacement: '',
};

function rangeText(r: Range): string {
  return `${formatDollars(r.low)} to ${formatDollars(r.high)}`;
}

function compute(raw: Raw) {
  const depth = parseNum(raw.depth);
  const age = parseNum(raw.age);
  const valid = depth !== null && depth > 0 && age !== null && age >= 0;
  const input: WellPumpInput = {
    type: raw.type,
    depth: depth ?? 0,
    pipeWire: raw.pipeWire,
    tank: raw.tank,
    afterHours: raw.afterHours,
    age: age ?? 0,
    repairQuote: raw.repair.trim() === '' ? null : parseNum(raw.repair),
    replacementQuote: raw.replacement.trim() === '' ? null : parseNum(raw.replacement),
  };
  const result = wellPumpCost(input);
  const params = new URLSearchParams({
    type: raw.type,
    depth: raw.depth,
    pipe: raw.pipeWire ? '1' : '0',
    tank: raw.tank ? '1' : '0',
    ah: raw.afterHours ? '1' : '0',
    age: raw.age,
    ...(raw.repair.trim() ? { repair: raw.repair } : {}),
    ...(raw.replacement.trim() ? { replacement: raw.replacement } : {}),
  }).toString();
  return { valid, result, params, raw, depth: depth ?? 0, age: age ?? 0 };
}

const WARN_TEXT: Record<'shallowJet' | 'deepJet', string> = {
  shallowJet:
    'Shallow-well jet pumps can lift water only about 25 ft at sea level. For a deeper water level you need a deep-well jet or a submersible pump.',
  deepJet:
    'Deep-well jet pumps are usually used to about 150 ft. Most deeper wells use a submersible pump.',
};
const QUOTE_TEXT: Record<'below' | 'within' | 'above', string> = {
  below: "Your replacement quote is below the usual range (ask what's included).",
  within: 'Your replacement quote is within the usual range.',
  above: 'Your replacement quote is above the usual range.',
};

export default function CalculatorWellPump() {
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
      type: (q.get('type') as PumpType) ?? r.type,
      depth: q.get('depth') ?? r.depth,
      pipeWire: q.get('pipe') ? q.get('pipe') === '1' : r.pipeWire,
      tank: q.get('tank') ? q.get('tank') === '1' : r.tank,
      afterHours: q.get('ah') ? q.get('ah') === '1' : r.afterHours,
      age: q.get('age') ?? r.age,
      repair: q.get('repair') ?? r.repair,
      replacement: q.get('replacement') ?? r.replacement,
    }));
  }, []);

  const r = shown.result;
  const headline = formatDollars(r.total.typical);
  const subline = `${rangeText(r.total)} installed`;

  const rows: ResultRow[] = [{ label: 'Pump installed', value: rangeText(r.pump) }];
  if (r.pipeWire) rows.push({ label: `Drop pipe and wire, ${shown.depth} ft`, value: rangeText(r.pipeWire) });
  if (r.tank) rows.push({ label: 'Pressure tank', value: rangeText(r.tank) });
  if (r.afterHours) rows.push({ label: 'After-hours call-out', value: rangeText(r.afterHours) });

  const warnings = r.warnings
    .filter((w): w is 'shallowJet' | 'deepJet' => w === 'shallowJet' || w === 'deepJet')
    .map((w) => WARN_TEXT[w]);

  const hoist = r.warnings.includes('hoist');

  let repairNote: string | null = null;
  if (r.repairVerdict === 'replace') {
    repairNote = `A ${formatDollars(parseNum(shown.raw.repair) ?? 0)} repair is ${r.repairPct}% of a typical ${formatDollars(r.total.typical)} replacement${shown.age >= 10 ? ` on a ${shown.age}-year-old pump` : ''}. Replacing usually makes more sense: repairs on an old pump tend to repeat.`;
  } else if (r.repairVerdict === 'repair') {
    repairNote = `A ${formatDollars(parseNum(shown.raw.repair) ?? 0)} repair is ${r.repairPct}% of a typical ${formatDollars(r.total.typical)} replacement. If the rest of the system is sound, repairing is usually the better deal.`;
  }

  const mathLines = [
    `pump installed = ${rangeText(r.pump)} (typical ${formatDollars(r.pump.typical)})`,
    ...(r.pipeWire ? [`pipe and wire, ${shown.depth} ft = ${rangeText(r.pipeWire)}`] : []),
    ...(r.tank ? [`pressure tank = ${rangeText(r.tank)}`] : []),
    ...(r.afterHours ? [`after-hours call-out = ${rangeText(r.afterHours)}`] : []),
    `total = ${rangeText(r.total)}, typical ${formatDollars(r.total.typical)}`,
  ];

  const copyText = `Well pump replacement about ${formatDollars(r.total.typical)} (${rangeText(r.total)}).`;

  return (
    <div id="calculator" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label="Pump type" htmlFor="wp-type">
          <SelectField
            id="wp-type"
            ariaLabel="Pump type"
            value={raw.type}
            onChange={(v) => set('type', v)}
            options={[
              { value: 'submersible', label: 'Submersible' },
              { value: 'shallowJet', label: 'Shallow-well jet' },
              { value: 'deepJet', label: 'Deep-well jet' },
              { value: 'constantPressure', label: 'Constant-pressure submersible' },
            ]}
          />
        </Field>
        <Field label="Well depth to the pump, feet" htmlFor="wp-depth">
          <NumberField id="wp-depth" value={raw.depth} onChange={(v) => set('depth', v)} whole min={10} max={1000} />
        </Field>
        <Field label="Replace the drop pipe and wire too">
          <SegmentedControl
            legend="Replace the drop pipe and wire too"
            value={raw.pipeWire ? 'yes' : 'no'}
            onChange={(v) => set('pipeWire', v === 'yes')}
            options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]}
          />
        </Field>
        <Field label="Replace the pressure tank at the same time">
          <SegmentedControl
            legend="Replace the pressure tank at the same time"
            value={raw.tank ? 'yes' : 'no'}
            onChange={(v) => set('tank', v === 'yes')}
            options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]}
          />
        </Field>
        <Field label="After-hours or weekend call-out">
          <SegmentedControl
            legend="After-hours or weekend call-out"
            value={raw.afterHours ? 'yes' : 'no'}
            onChange={(v) => set('afterHours', v === 'yes')}
            options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]}
          />
        </Field>
        <Field label="Pump age, years" htmlFor="wp-age">
          <NumberField id="wp-age" value={raw.age} onChange={(v) => set('age', v)} whole min={0} max={50} />
        </Field>
        <Field label="Repair quote you received ($)" htmlFor="wp-repair">
          <NumberField id="wp-repair" value={raw.repair} onChange={(v) => set('repair', v)} min={0} />
        </Field>
        <Field label="Replacement quote you received ($)" htmlFor="wp-replacement">
          <NumberField id="wp-replacement" value={raw.replacement} onChange={(v) => set('replacement', v)} min={0} />
        </Field>
      </div>

      <div ref={resultRef}>
        <ResultCard
          headline={headline}
          subline={subline}
          rows={rows}
          warnings={warnings}
          invalid={invalid}
          invalidMessage="Enter the well depth and pump age to price a replacement."
        >
          {hoist && (
            <p className="mt-3 text-[14px] text-muted">
              At 200 ft or deeper most crews use a pump hoist or truck to pull the pump, which can push labor toward the top of the range.
            </p>
          )}
          {repairNote && <p className="mt-3 text-[15px] text-ink">{repairNote}</p>}
          {r.quoteVerdict && <p className="mt-2 text-[15px] text-ink">{QUOTE_TEXT[r.quoteVerdict]}</p>}
          <p className="mt-2 text-[14px] text-muted">A pump usually lasts 8 to 15 years. Yours is {shown.age}.</p>
          <ShowTheMath lines={mathLines} />
          <CopyShareBar resultText={copyText} query={shown.params} tool={SLUG} />
        </ResultCard>
      </div>

      <StickyResultBar headline={headline} watchRef={resultRef} />
    </div>
  );
}
