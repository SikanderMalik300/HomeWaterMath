'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { salt, type SaltResult } from '@/lib/calc/salt';
import { toGpg, HARDNESS_UNITS, type HardnessUnit } from '@/lib/calc/hardness';
import { SIZES } from '@/lib/data/constants';
import { formatInt, formatDecimal, formatDollars } from '@/lib/calc/round';
import { Field, NumberField, SegmentedControl, SelectField, useDebounced, parseNum } from './inputs';
import ResultCard, { type ResultRow } from './ResultCard';
import ShowTheMath from './ShowTheMath';
import CopyShareBar from './CopyShareBar';
import StickyResultBar from './StickyResultBar';

interface Raw {
  people: string;
  gal: number;
  hardness: string;
  unit: HardnessUnit;
  iron: string;
  allow: number;
  size: number; // label grains
  salt: number;
  metered: boolean;
  timerDays: string;
  bag: number;
  price: string;
}

const DEFAULTS: Raw = {
  people: '4',
  gal: 75,
  hardness: '15',
  unit: 'gpg',
  iron: '0',
  allow: 4,
  size: 48000,
  salt: 9,
  metered: true,
  timerDays: '7',
  bag: 40,
  price: '7',
};

function cuFtFor(label: number): number {
  return SIZES.find((s) => s.label === label)?.cuFt ?? 1.5;
}

interface Computed {
  valid: boolean;
  result: SaltResult;
  cuFt: number;
  comparison: { setting: number; lbYear: number }[];
  params: string;
  raw: Raw;
}

function compute(raw: Raw): Computed {
  const people = parseNum(raw.people);
  const hardness = parseNum(raw.hardness);
  const iron = parseNum(raw.iron);
  const price = parseNum(raw.price);
  const timerDays = parseNum(raw.timerDays);
  const valid =
    people !== null && people > 0 &&
    hardness !== null && hardness >= 0 &&
    iron !== null && iron >= 0 &&
    price !== null && price >= 0 &&
    (raw.metered || (timerDays !== null && timerDays > 0));

  const cuFt = cuFtFor(raw.size);
  const hardnessGpg = toGpg(hardness ?? 0, raw.unit);
  const common = {
    people: people ?? 0,
    galPerPerson: raw.gal,
    hardnessGpg,
    ironPpm: iron ?? 0,
    ironAllowance: raw.allow,
    cuFt,
    bagLb: raw.bag,
    pricePerBag: price ?? 0,
  };
  const result = salt({ ...common, salt: raw.salt, metered: raw.metered, timerDays: timerDays ?? 7 });
  const comparison = [6, 9, 12, 15].map((setting) => ({
    setting,
    lbYear: salt({ ...common, salt: setting, metered: true, timerDays: timerDays ?? 7 }).saltPerYearLb,
  }));
  const params = new URLSearchParams({
    people: raw.people,
    gal: String(raw.gal),
    hardness: raw.hardness,
    unit: raw.unit,
    iron: raw.iron,
    allow: String(raw.allow),
    size: String(raw.size),
    salt: String(raw.salt),
    valve: raw.metered ? 'metered' : 'timer',
    days: raw.timerDays,
    bag: String(raw.bag),
    price: raw.price,
  }).toString();

  return { valid, result, cuFt, comparison, params, raw };
}

export default function CalculatorSalt() {
  const [raw, setRaw] = useState<Raw>(DEFAULTS);
  const set = <K extends keyof Raw>(k: K, v: Raw[K]) => setRaw((r) => ({ ...r, [k]: v }));
  const debounced = useDebounced(raw, 150);
  const computed = useMemo(() => compute(debounced), [debounced]);
  const [last, setLast] = useState<Computed>(() => compute(DEFAULTS));
  useEffect(() => {
    if (computed.valid) setLast(computed);
  }, [computed]);
  const shown = computed.valid ? computed : last;
  const invalid = !computed.valid;
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if ([...q.keys()].length === 0) return;
    setRaw((r) => ({
      people: q.get('people') ?? r.people,
      gal: Number(q.get('gal')) || r.gal,
      hardness: q.get('hardness') ?? r.hardness,
      unit: (q.get('unit') as HardnessUnit) ?? r.unit,
      iron: q.get('iron') ?? r.iron,
      allow: Number(q.get('allow')) || r.allow,
      size: Number(q.get('size')) || r.size,
      salt: Number(q.get('salt')) || r.salt,
      metered: q.get('valve') ? q.get('valve') === 'metered' : r.metered,
      timerDays: q.get('days') ?? r.timerDays,
      bag: Number(q.get('bag')) || r.bag,
      price: q.get('price') ?? r.price,
    }));
  }, []);

  const r = shown.result;
  const headline = `${formatInt(r.saltPerYearLb)} lb of salt a year`;

  const rows: ResultRow[] = [
    { label: 'About', value: `${formatDecimal(r.saltPerMonthLb, 1)} lb a month` },
    { label: `Bags of ${shown.raw.bag} lb a year`, value: formatInt(r.bagsPerYear) },
    { label: 'About', value: `${formatDollars(r.costPerYear)} a year` },
    { label: 'Regenerations a year', value: `${formatDecimal(r.regensPerYear, 1)}, every ${formatDecimal(r.daysBetween, 1)} days` },
    { label: 'Salt per regeneration', value: `${formatDecimal(r.saltPerRegenLb, 1)} lb` },
  ];

  const warnings: string[] = [];
  if (r.warning === 'meteredOver14') {
    warnings.push(
      "At this size your softener would go more than 2 weeks between regenerations. Many makers recommend regenerating at least every 2 weeks; check your manual's maximum days setting.",
    );
  } else if (r.warning === 'timerTooLong') {
    warnings.push(
      `Your timer interval is longer than the softener can cover. Hard water will get through before it regenerates. Shorten the interval to ${r.timerSuggestDays} days or less.`,
    );
  }

  const mathLines = [
    `salt per regeneration = ${shown.cuFt} × ${shown.raw.salt} = ${formatDecimal(r.saltPerRegenLb, 1)} lb`,
    shown.raw.metered
      ? `regenerations per year = 365 × ${formatInt(r.grainsPerDay)} ÷ ${formatInt(r.capacity)} = ${formatDecimal(r.regensPerYear, 1)}`
      : `regenerations per year = 365 ÷ ${shown.raw.timerDays} = ${formatDecimal(r.regensPerYear, 1)}`,
    `salt per year = ${formatDecimal(r.regensPerYear, 1)} × ${formatDecimal(r.saltPerRegenLb, 1)} = ${formatInt(r.saltPerYearLb)} lb`,
    `bags = ceil(${formatInt(r.saltPerYearLb)} ÷ ${shown.raw.bag}) = ${formatInt(r.bagsPerYear)}`,
  ];

  const copyText = `${formatInt(r.saltPerYearLb)} lb of salt a year, about ${formatDecimal(r.saltPerMonthLb, 1)} lb a month, ${formatInt(r.bagsPerYear)} bags of ${shown.raw.bag} lb, about ${formatDollars(r.costPerYear)} a year.`;

  return (
    <div id="calculator" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label="People in your home" htmlFor="salt-people">
          <NumberField id="salt-people" value={raw.people} onChange={(v) => set('people', v)} whole min={1} max={12} />
        </Field>
        <Field label="Iron (ppm, from your water test)" htmlFor="salt-iron">
          <NumberField id="salt-iron" value={raw.iron} onChange={(v) => set('iron', v)} min={0} max={10} step={0.1} />
        </Field>
        <Field label="Water use per person per day">
          <SegmentedControl
            legend="Water use per person per day"
            value={raw.gal}
            onChange={(v) => set('gal', v)}
            options={[
              { value: 60, label: '60 gal' },
              { value: 75, label: '75 gal' },
              { value: 80, label: '80 gal' },
            ]}
          />
        </Field>
        <Field label="Iron allowance">
          <SegmentedControl
            legend="Iron allowance"
            value={raw.allow}
            onChange={(v) => set('allow', v)}
            options={[
              { value: 4, label: '4 gpg per ppm' },
              { value: 5, label: '5 gpg per ppm' },
            ]}
          />
        </Field>
        <Field label="Water hardness" htmlFor="salt-hardness">
          <div className="flex gap-2">
            <div className="flex-1">
              <NumberField id="salt-hardness" value={raw.hardness} onChange={(v) => set('hardness', v)} min={0} />
            </div>
            <div className="w-36">
              <SelectField ariaLabel="Hardness unit" value={raw.unit} onChange={(v) => set('unit', v)} options={HARDNESS_UNITS} />
            </div>
          </div>
        </Field>
        <Field label="Softener size" htmlFor="salt-size">
          <SelectField
            id="salt-size"
            ariaLabel="Softener size"
            value={raw.size}
            onChange={(v) => set('size', v)}
            options={[
              { value: 24000, label: '24,000 (0.75 cu ft)' },
              { value: 32000, label: '32,000 (1.0)' },
              { value: 48000, label: '48,000 (1.5)' },
              { value: 64000, label: '64,000 (2.0)' },
              { value: 80000, label: '80,000 (2.5)' },
              { value: 96000, label: '96,000 (3.0)' },
            ]}
          />
          <p className="mt-1 text-[13px] text-muted">
            Not sure?{' '}
            <Link href="/water-softener-size-calculator/" prefetch={false} className="link-brand">
              Use the size calculator.
            </Link>
          </p>
        </Field>
        <Field label="Salt setting" htmlFor="salt-setting">
          <SelectField
            id="salt-setting"
            ariaLabel="Salt setting"
            value={raw.salt}
            onChange={(v) => set('salt', v)}
            options={[
              { value: 6, label: '6 lb per cu ft' },
              { value: 9, label: '9 lb per cu ft' },
              { value: 12, label: '12 lb per cu ft' },
              { value: 15, label: '15 lb per cu ft' },
            ]}
          />
        </Field>
        <Field label="Valve type">
          <SegmentedControl
            legend="Valve type"
            value={raw.metered ? 'metered' : 'timer'}
            onChange={(v) => set('metered', v === 'metered')}
            options={[
              { value: 'metered', label: 'Metered (regenerates when needed)' },
              { value: 'timer', label: 'Timer (fixed schedule)' },
            ]}
          />
        </Field>
        {!raw.metered && (
          <Field label="Regenerates every N days" htmlFor="salt-timerdays">
            <NumberField id="salt-timerdays" value={raw.timerDays} onChange={(v) => set('timerDays', v)} whole min={1} max={14} />
          </Field>
        )}
        <Field label="Bag size">
          <SegmentedControl
            legend="Bag size"
            value={raw.bag}
            onChange={(v) => set('bag', v)}
            options={[
              { value: 40, label: '40 lb' },
              { value: 50, label: '50 lb' },
            ]}
          />
        </Field>
        <Field label="Price per bag ($)" htmlFor="salt-price">
          <NumberField id="salt-price" value={raw.price} onChange={(v) => set('price', v)} min={0} step={0.5} />
        </Field>
      </div>

      <div ref={resultRef}>
        <ResultCard
          headline={headline}
          rows={rows}
          warnings={warnings}
          invalid={invalid}
          invalidMessage="Enter your household, hardness and settings to see salt use."
        >
          <ShowTheMath lines={mathLines} />
          <CopyShareBar resultText={copyText} query={shown.params} />
        </ResultCard>

        <div className="mt-6">
          <p className="mb-2 text-[14px] font-medium text-ink">Salt a year for this home at each setting (metered)</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {shown.comparison.map((c) => (
              <div key={c.setting} className="rounded-card border border-line p-3 text-center">
                <div className="text-[13px] text-muted">{c.setting} lb</div>
                <div className="text-[18px] font-semibold text-ink tnum">{formatInt(c.lbYear)} lb</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StickyResultBar headline={headline} watchRef={resultRef} />
    </div>
  );
}
