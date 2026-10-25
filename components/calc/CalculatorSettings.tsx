'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { softenerSettings, capacityAtSalt } from '@/lib/calc/softenerSettings';
import { toGpg, HARDNESS_UNITS, type HardnessUnit } from '@/lib/calc/hardness';
import { formatInt, formatDecimal, formatGpg } from '@/lib/calc/round';
import { Field, NumberField, SegmentedControl, SelectField, useDebounced, parseNum } from './inputs';
import ResultCard, { type ResultRow } from './ResultCard';
import ShowTheMath from './ShowTheMath';
import CopyShareBar from './CopyShareBar';
import StickyResultBar from './StickyResultBar';
import InlineText from '@/components/InlineText';
import { useToolEvents } from './useToolEvents';
import { SETTINGS_VALVE_NOTE } from '@/lib/content/tools3';

const SLUG = '/water-softener-settings/';

interface Raw {
  people: string;
  gal: number;
  hardness: string;
  unit: HardnessUnit;
  iron: string;
  allow: number;
  size: number;
  salt: number;
  metered: boolean;
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
};

interface Computed {
  valid: boolean;
  result: ReturnType<typeof softenerSettings>;
  hardnessGpg: number;
  people: number;
  iron: number;
  params: string;
  raw: Raw;
}

function compute(raw: Raw): Computed {
  const people = parseNum(raw.people);
  const hardness = parseNum(raw.hardness);
  const iron = parseNum(raw.iron);
  const valid =
    people !== null && people > 0 && hardness !== null && hardness >= 0 && iron !== null && iron >= 0;
  const hardnessGpg = toGpg(hardness ?? 0, raw.unit);
  const result = softenerSettings({
    people: people ?? 0,
    galPerPerson: raw.gal,
    hardnessGpg,
    ironPpm: iron ?? 0,
    ironAllowance: raw.allow,
    sizeGrains: raw.size,
    salt: raw.salt,
    metered: raw.metered,
  });
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
  }).toString();
  return { valid, result, hardnessGpg, people: people ?? 0, iron: iron ?? 0, params, raw };
}

export default function CalculatorSettings() {
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
      people: q.get('people') ?? r.people,
      gal: Number(q.get('gal')) || r.gal,
      hardness: q.get('hardness') ?? r.hardness,
      unit: (q.get('unit') as HardnessUnit) ?? r.unit,
      iron: q.get('iron') ?? r.iron,
      allow: Number(q.get('allow')) || r.allow,
      size: Number(q.get('size')) || r.size,
      salt: Number(q.get('salt')) || r.salt,
      metered: q.get('valve') ? q.get('valve') === 'metered' : r.metered,
    }));
  }, []);

  const r = shown.result;
  const metered = shown.raw.metered;

  const headline = metered
    ? `Hardness setting: ${formatInt(r.hardnessSetting)} gpg`
    : `Regenerate every ${r.timerDays} days`;

  const rows: ResultRow[] = metered
    ? [
        { label: 'Capacity to enter', value: `${formatInt(r.capacity)} grains` },
        { label: 'Gallons between regenerations', value: formatInt(r.gallonsBetween) },
        { label: 'Reserve', value: `${formatInt(r.reserve)} gallons (one day of water)` },
        { label: 'Regenerates about every', value: `${r.dayOverride} days` },
        { label: 'Salt per regeneration', value: `${formatDecimal(r.saltPerRegenLb, 1)} lb` },
      ]
    : [
        { label: 'Hardness setting', value: `${formatInt(r.hardnessSetting)} gpg` },
        { label: 'Capacity', value: `${formatInt(r.capacity)} grains` },
        { label: 'Salt per regeneration', value: `${formatDecimal(r.saltPerRegenLb, 1)} lb` },
      ];

  const activeDays = metered ? r.dayOverride : r.timerDays;

  const warnings: string[] = [];
  if (r.ironWarning) {
    warnings.push(
      'Most softeners are rated for up to 2 ppm of iron. Above that, treat the iron first with an iron filter, then soften.',
    );
  }
  if (r.capped) {
    warnings.push('Many makers recommend regenerating at least every 14 days, so we cap it there.');
  }

  const smallSoftenerMsg = r.smallSoftener
    ? `This softener is small for your home at this salt setting. It would regenerate every ${activeDays} days or more often. Check the [size calculator](/water-softener-size-calculator/) or raise the salt setting.`
    : null;

  const compGpg = shown.hardnessGpg + shown.iron * shown.raw.allow;
  const mathLines = [
    shown.iron > 0
      ? `hardness setting = ${formatGpg(shown.hardnessGpg)} + ${formatGpg(shown.iron)} × ${shown.raw.allow} = ${formatGpg(compGpg)}, rounded up to ${formatInt(r.hardnessSetting)} gpg`
      : `hardness setting = ${formatInt(r.hardnessSetting)} gpg`,
    `capacity = ${r.cuFt} cu ft × ${formatInt(capacityAtSalt(shown.raw.salt))} = ${formatInt(r.capacity)} grains`,
    `gallons between = ${formatInt(r.capacity)} ÷ ${formatInt(r.hardnessSetting)} = ${formatInt(r.gallonsBetween)}`,
    `daily use = ${shown.people} × ${shown.raw.gal} = ${formatInt(r.dailyGallons)} gallons`,
    metered
      ? `day override = floor((${formatInt(r.gallonsBetween)} − ${formatInt(r.reserve)}) ÷ ${formatInt(r.dailyGallons)}) = ${r.dayOverride}`
      : `timer days = floor(${formatInt(r.capacity)} ÷ (${formatInt(r.dailyGallons)} × ${formatInt(r.hardnessSetting)})) = ${r.timerDays}`,
    `salt per regeneration = ${r.cuFt} × ${shown.raw.salt} = ${formatDecimal(r.saltPerRegenLb, 1)} lb`,
  ];

  const copyText = metered
    ? `Hardness setting ${formatInt(r.hardnessSetting)} gpg, capacity ${formatInt(r.capacity)} grains, reserve ${formatInt(r.reserve)} gallons, regenerates about every ${r.dayOverride} days, ${formatDecimal(r.saltPerRegenLb, 1)} lb of salt per regeneration.`
    : `Hardness setting ${formatInt(r.hardnessSetting)} gpg, capacity ${formatInt(r.capacity)} grains, regenerate every ${r.timerDays} days, ${formatDecimal(r.saltPerRegenLb, 1)} lb of salt per regeneration.`;

  const stickyHeadline = metered
    ? `Hardness ${formatInt(r.hardnessSetting)} gpg`
    : `Every ${r.timerDays} days`;

  return (
    <div id="calculator" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label="People in your home" htmlFor="set-people">
          <NumberField id="set-people" value={raw.people} onChange={(v) => set('people', v)} whole min={1} max={12} />
        </Field>
        <Field label="Water use per person per day" helper="75 gallons per person a day is the usual sizing figure.">
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
        <Field label="Water hardness" htmlFor="set-hardness">
          <div className="flex gap-2">
            <div className="flex-1">
              <NumberField id="set-hardness" value={raw.hardness} onChange={(v) => set('hardness', v)} min={0} />
            </div>
            <div className="w-36">
              <SelectField ariaLabel="Hardness unit" value={raw.unit} onChange={(v) => set('unit', v)} options={HARDNESS_UNITS} />
            </div>
          </div>
        </Field>
        <Field label="Iron (ppm, from your water test)" htmlFor="set-iron">
          <NumberField id="set-iron" value={raw.iron} onChange={(v) => set('iron', v)} min={0} max={10} step={0.1} />
        </Field>
        <Field label="Iron allowance" helper="Makers add 4 or 5 gpg of hardness for every 1 ppm of iron.">
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
        <Field label="Softener size" htmlFor="set-size">
          <SelectField
            id="set-size"
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
        </Field>
        <Field label="Salt setting" htmlFor="set-salt">
          <SelectField
            id="set-salt"
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
              { value: 'metered', label: 'Metered (demand)' },
              { value: 'timer', label: 'Timer (set days)' },
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
          invalidMessage="Enter your household, hardness and settings to see what to enter."
        >
          {smallSoftenerMsg && (
            <div className="mt-3 flex gap-2 rounded-card bg-warn-bg p-3 text-[14px] text-warn-ink">
              <TriangleAlert className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              <span>
                <InlineText text={smallSoftenerMsg} />
              </span>
            </div>
          )}
          <ShowTheMath lines={mathLines} />
          <CopyShareBar resultText={copyText} query={shown.params} tool={SLUG} />
        </ResultCard>

        <div className="mt-6 rounded-card border border-line bg-band-4 p-4">
          <p className="mb-1.5 text-[15px] font-medium text-ink">Where these go on common valves</p>
          <p className="text-[14px] text-muted">{SETTINGS_VALVE_NOTE}</p>
        </div>
      </div>

      <StickyResultBar headline={stickyHeadline} watchRef={resultRef} />
    </div>
  );
}
