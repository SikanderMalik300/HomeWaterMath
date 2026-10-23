'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { softenerSize, type SoftenerSizeResult } from '@/lib/calc/softenerSize';
import { toGpg, HARDNESS_UNITS, type HardnessUnit } from '@/lib/calc/hardness';
import { formatInt, formatDecimal, formatGpg } from '@/lib/calc/round';
import { Field, NumberField, SegmentedControl, SelectField, useDebounced, parseNum } from './inputs';
import ResultCard, { type ResultRow } from './ResultCard';
import ShowTheMath from './ShowTheMath';
import CopyShareBar from './CopyShareBar';
import StickyResultBar from './StickyResultBar';
import { useToolEvents } from './useToolEvents';

const SLUG = '/water-softener-size-calculator/';

interface Raw {
  people: string;
  gal: number;
  hardness: string;
  unit: HardnessUnit;
  iron: string;
  allow: number;
  days: string;
  salt: number;
}

const DEFAULTS: Raw = {
  people: '4',
  gal: 75,
  hardness: '15',
  unit: 'gpg',
  iron: '0',
  allow: 4,
  days: '7',
  salt: 9,
};

interface Computed {
  valid: boolean;
  result: SoftenerSizeResult;
  hardnessGpg: number;
  people: number;
  gal: number;
  iron: number;
  allow: number;
  days: number;
  salt: number;
  params: string;
}

function compute(raw: Raw): Computed {
  const people = parseNum(raw.people);
  const hardness = parseNum(raw.hardness);
  const iron = parseNum(raw.iron);
  const days = parseNum(raw.days);
  const valid =
    people !== null && people > 0 &&
    hardness !== null && hardness >= 0 &&
    iron !== null && iron >= 0 &&
    days !== null && days > 0;

  const p = people ?? 0;
  const h = hardness ?? 0;
  const fe = iron ?? 0;
  const d = days ?? 0;
  const hardnessGpg = toGpg(h, raw.unit);
  const result = softenerSize({
    people: p,
    galPerPerson: raw.gal,
    hardnessGpg,
    ironPpm: fe,
    ironAllowance: raw.allow,
    daysBetweenRegen: d,
    salt: raw.salt,
  });
  const params = new URLSearchParams({
    people: raw.people,
    gal: String(raw.gal),
    hardness: raw.hardness,
    unit: raw.unit,
    iron: raw.iron,
    allow: String(raw.allow),
    days: raw.days,
    salt: String(raw.salt),
  }).toString();

  return { valid, result, hardnessGpg, people: p, gal: raw.gal, iron: fe, allow: raw.allow, days: d, salt: raw.salt, params };
}

export default function CalculatorSize({ embed = false }: { embed?: boolean }) {
  const [raw, setRaw] = useState<Raw>(DEFAULTS);
  const { onInteract, onResult } = useToolEvents(SLUG, !embed);
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

  // Read shareable query params on mount.
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
      days: q.get('days') ?? r.days,
      salt: Number(q.get('salt')) || r.salt,
    }));
  }, []);

  const r = shown.result;
  const label = r.recommended?.label ?? 0;

  let headline: string;
  let subline: string | undefined;
  if (r.state === 'soft') {
    headline = "Your water is already soft (under 1 gpg). A softener won't change much.";
  } else if (r.state === 'oversize') {
    headline = 'Larger than a standard 96,000-grain tank at this setting.';
  } else {
    headline = `${formatInt(label)}-grain softener`;
    subline = `${r.recommended?.cuFt} cu ft of resin`;
  }

  const rows: ResultRow[] = [];
  if (r.state === 'oversize') {
    rows.push({ label: 'Grains needed between regenerations', value: formatInt(r.grainsNeeded) });
    rows.push({ label: 'Grains used per day', value: formatInt(r.grainsPerDay) });
    rows.push({ label: 'Hardness used (with iron allowance)', value: `${formatGpg(r.compensatedGpg)} gpg` });
  } else {
    rows.push({ label: 'Grains needed between regenerations', value: formatInt(r.grainsNeeded) });
    rows.push({ label: 'Grains used per day', value: formatInt(r.grainsPerDay) });
    rows.push({ label: 'Hardness used (with iron allowance)', value: `${formatGpg(r.compensatedGpg)} gpg` });
    rows.push({ label: `Real capacity of this size at ${shown.salt} lb`, value: `${formatInt(r.realCapacity)} grains` });
    rows.push({ label: 'Lasts about', value: `${formatDecimal(r.daysItLasts, 1)} days in your home` });
    rows.push({ label: 'Salt per regeneration', value: `${formatDecimal(r.saltPerRegenLb, 1)} lb` });
  }

  const warnings: string[] = [];
  if (r.ironWarning) {
    warnings.push(
      'Most softeners are rated for up to 2 ppm of iron. Above that, treat the iron first with an iron filter, then soften.',
    );
  }
  if (r.state === 'oversize') {
    warnings.push(
      r.days96 >= 3
        ? `A 96,000-grain unit at this setting lasts ${r.days96} days for your home. Shorten the days between regenerations to that number, raise the salt setting, or ask a dealer about a twin-tank system.`
        : 'Ask a dealer about a twin-tank system.',
    );
  }

  const stickyHeadline =
    r.state === 'ok' ? `${formatInt(label)}-grain softener` : r.state === 'soft' ? 'Already soft' : 'Over 96,000 grains';

  const mathLines = [
    shown.iron > 0
      ? `compensated hardness = ${formatGpg(shown.hardnessGpg)} + ${formatGpg(shown.iron)} × ${shown.allow} = ${formatGpg(r.compensatedGpg)} gpg`
      : `hardness = ${formatGpg(r.compensatedGpg)} gpg`,
    `grains per day = ${shown.people} × ${shown.gal} × ${formatGpg(r.compensatedGpg)} = ${formatInt(r.grainsPerDay)}`,
    `grains needed = ${formatInt(r.grainsPerDay)} × ${shown.days} = ${formatInt(r.grainsNeeded)}`,
    `capacity per cu ft at ${shown.salt} lb = ${formatInt(r.capacityPerCuFt)}`,
    r.recommended
      ? `${formatInt(r.recommended.label)} (${r.recommended.cuFt} cu ft) gives ${formatInt(r.realCapacity)} grains, lasts ${formatDecimal(r.daysItLasts, 1)} days`
      : `96,000 (3.0 cu ft) gives ${formatInt(r.realCapacity96)} grains, lasts ${r.days96} days`,
  ];

  const copyText =
    r.state === 'ok'
      ? `${formatInt(label)}-grain softener (${r.recommended?.cuFt} cu ft). Grains needed ${formatInt(r.grainsNeeded)}. Lasts about ${formatDecimal(r.daysItLasts, 1)} days. Salt ${formatDecimal(r.saltPerRegenLb, 1)} lb per regeneration.`
      : headline;

  return (
    <div id="calculator" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label="People in your home" htmlFor="size-people">
          <NumberField id="size-people" value={raw.people} onChange={(v) => set('people', v)} whole min={1} max={12} />
        </Field>
        <Field label="Days between regenerations" htmlFor="size-days">
          <NumberField id="size-days" value={raw.days} onChange={(v) => set('days', v)} whole min={3} max={14} />
        </Field>
        <Field label="Water use per person per day" helper="75 is the figure softener makers size with. Pick 60 for a low-flow home, 80 to match EPA's average including outdoor use.">
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
        <Field label="Iron (ppm, from your water test)" htmlFor="size-iron">
          <NumberField id="size-iron" value={raw.iron} onChange={(v) => set('iron', v)} min={0} max={10} step={0.1} />
        </Field>
        <Field label="Water hardness" htmlFor="size-hardness">
          <div className="flex gap-2">
            <div className="flex-1">
              <NumberField id="size-hardness" value={raw.hardness} onChange={(v) => set('hardness', v)} min={0} />
            </div>
            <div className="w-36">
              <SelectField
                ariaLabel="Hardness unit"
                value={raw.unit}
                onChange={(v) => set('unit', v)}
                options={HARDNESS_UNITS}
              />
            </div>
          </div>
        </Field>
        <Field label="Iron allowance" helper="Makers add 4 or 5 gpg of hardness for every 1 ppm of clear-water iron.">
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
        <Field label="Salt setting" htmlFor="size-salt">
          <SelectField
            id="size-salt"
            ariaLabel="Salt setting"
            value={raw.salt}
            onChange={(v) => set('salt', v)}
            options={[
              { value: 6, label: '6 lb per cu ft (most salt-efficient)' },
              { value: 9, label: '9 lb per cu ft (balanced)' },
              { value: 12, label: '12 lb per cu ft' },
              { value: 15, label: '15 lb per cu ft (maximum capacity)' },
            ]}
          />
        </Field>
      </div>

      <div ref={resultRef}>
        <ResultCard
          headline={headline}
          subline={subline}
          rows={rows}
          warnings={warnings}
          invalid={invalid}
          invalidMessage="Enter the people, hardness and days to see a size."
        >
          <ShowTheMath lines={mathLines} />
          {!embed && <CopyShareBar resultText={copyText} query={shown.params} tool={SLUG} />}
        </ResultCard>

        <div className="mt-6 overflow-x-auto rounded-card border border-line">
          <table className="w-full border-collapse text-[14px]">
            <caption className="sr-only">All standard sizes for your home at this salt setting</caption>
            <thead>
              <tr>
                <th scope="col" className="border-b border-line px-3 py-2 text-left text-[13px] font-medium text-muted">Size</th>
                <th scope="col" className="border-b border-line px-3 py-2 text-right text-[13px] font-medium text-muted tnum">Real capacity</th>
                <th scope="col" className="border-b border-line px-3 py-2 text-right text-[13px] font-medium text-muted tnum">Days it lasts</th>
                <th scope="col" className="border-b border-line px-3 py-2 text-left text-[13px] font-medium text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {r.rows.map((row) => {
                const isRec = r.recommended?.label === row.label;
                return (
                  <tr key={row.label} className={isRec ? 'bg-band-1' : ''}>
                    <td className="border-b border-line px-3 py-2 tnum">{formatInt(row.label)}</td>
                    <td className="border-b border-line px-3 py-2 text-right tnum">{formatInt(row.realCapacity)}</td>
                    <td className="border-b border-line px-3 py-2 text-right tnum">{formatDecimal(row.daysItLasts, 1)}</td>
                    <td className="border-b border-line px-3 py-2">
                      {isRec ? (
                        <span className="font-medium text-brand">Recommended</span>
                      ) : !row.fits ? (
                        <span className="text-muted">Too small</span>
                      ) : (
                        ''
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {!embed && <StickyResultBar headline={stickyHeadline} watchRef={resultRef} />}
    </div>
  );
}
