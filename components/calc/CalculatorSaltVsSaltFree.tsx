'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { saltVsSaltFree } from '@/lib/calc/saltVsSaltFree';
import { toGpg, HARDNESS_UNITS, type HardnessUnit } from '@/lib/calc/hardness';
import { type Installer } from '@/lib/calc/softenerCost';
import { formatDollars, formatDecimal, formatInt, formatGpg } from '@/lib/calc/round';
import { TriangleAlert } from 'lucide-react';
import { Field, NumberField, SegmentedControl, SelectField, useDebounced, parseNum } from './inputs';
import ShowTheMath from './ShowTheMath';
import CopyShareBar from './CopyShareBar';
import StickyResultBar from './StickyResultBar';
import { useToolEvents } from './useToolEvents';

const SLUG = '/water-softener-vs-salt-free-cost/';

interface Raw {
  people: string;
  hardness: string;
  unit: HardnessUnit;
  iron: string;
  installer: Installer;
  price: string;
  regen: string;
  rate: string;
  mediaLife: string;
  mediaCost: string;
  prefilter: string;
}
const DEFAULTS: Raw = {
  people: '4',
  hardness: '15',
  unit: 'gpg',
  iron: '0',
  installer: 'plumber',
  price: '7',
  regen: '50',
  rate: '',
  mediaLife: '1000000',
  mediaCost: '1548',
  prefilter: '27',
};

function compute(raw: Raw) {
  const people = parseNum(raw.people);
  const hardness = parseNum(raw.hardness);
  const iron = parseNum(raw.iron);
  const price = parseNum(raw.price);
  const regen = parseNum(raw.regen);
  const mediaLife = parseNum(raw.mediaLife);
  const mediaCost = parseNum(raw.mediaCost);
  const prefilter = parseNum(raw.prefilter);
  const valid =
    people !== null && people > 0 &&
    hardness !== null && hardness >= 0 &&
    iron !== null && iron >= 0 &&
    price !== null && price >= 0 &&
    regen !== null && regen >= 0 &&
    mediaLife !== null && mediaLife > 0 &&
    mediaCost !== null && mediaCost >= 0 &&
    prefilter !== null && prefilter >= 0;

  const result = saltVsSaltFree({
    people: people ?? 0,
    hardnessGpg: toGpg(hardness ?? 0, raw.unit),
    ironPpm: iron ?? 0,
    installer: raw.installer,
    pricePerBag: price ?? 0,
    waterPerRegen: regen ?? 0,
    rate: raw.rate.trim() === '' ? null : parseNum(raw.rate),
    mediaLife: mediaLife ?? 1,
    mediaCost: mediaCost ?? 0,
    prefilterPerYear: prefilter ?? 0,
  });
  const params = new URLSearchParams({
    people: raw.people,
    hardness: raw.hardness,
    unit: raw.unit,
    iron: raw.iron,
    installer: raw.installer,
    price: raw.price,
    regen: raw.regen,
    ...(raw.rate.trim() ? { rate: raw.rate } : {}),
  }).toString();
  return { valid, result, params, raw };
}

const WARN: Record<'saltFreeGpg' | 'saltFreeIron' | 'ironMax', string> = {
  saltFreeGpg: 'Salt-free systems are usually rated to about 75 gpg. Above that, a salt-based softener is the safer choice.',
  saltFreeIron: 'Salt-free systems need iron at or below 0.3 ppm. Treat the iron first, or choose a salt-based softener (rated to about 2 ppm).',
  ironMax: 'Most softeners are rated for up to 2 ppm of iron. Above that, treat the iron first with an iron filter, then soften.',
};

function Column({ title, upfront, perYear, tenYear }: { title: string; upfront: number; perYear: number; tenYear: number }) {
  return (
    <div className="rounded-card border border-line p-4">
      {/* Styled as a paragraph, not a heading, so the result card does not add
          an h3 before the page's first h2 (sequential heading order a11y). */}
      <p className="text-[16px] font-medium text-ink">{title}</p>
      <dl className="mt-3 space-y-2 text-[15px]">
        <div className="flex justify-between gap-4"><dt className="text-muted">Upfront</dt><dd className="font-medium tnum">{formatDollars(upfront)}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-muted">Per year</dt><dd className="font-medium tnum">{formatDollars(perYear)}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-muted">10-year total</dt><dd className="text-[18px] font-semibold tnum">{formatDollars(tenYear)}</dd></div>
      </dl>
    </div>
  );
}

export default function CalculatorSaltVsSaltFree() {
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
      ...r,
      people: q.get('people') ?? r.people,
      hardness: q.get('hardness') ?? r.hardness,
      unit: (q.get('unit') as HardnessUnit) ?? r.unit,
      iron: q.get('iron') ?? r.iron,
      installer: (q.get('installer') as Installer) ?? r.installer,
      price: q.get('price') ?? r.price,
      regen: q.get('regen') ?? r.regen,
      rate: q.get('rate') ?? r.rate,
    }));
  }, []);

  const r = shown.result;
  const cheaperLabel = r.cheaper === 'salt' ? 'salt-based softener' : 'salt-free system';
  const hasRate = shown.raw.rate.trim() !== '';

  const mathLines = [
    `salt-based 10-year = ${formatDollars(r.salt.upfront)} + 10 × ${formatDollars(r.salt.yearly)} = ${formatDollars(r.salt.tenYear)}`,
    `salt-free 10-year = ${formatDollars(r.saltFree.upfront)} + 10 × ${formatDollars(r.saltFree.yearly)} + ${formatDollars(r.saltFree.media)} media = ${formatDollars(r.saltFree.tenYear)}`,
    `regeneration water = ${formatDecimal(r.salt.regensPerYear, 1)} × ${shown.raw.regen} = ${formatInt(r.salt.regenGal)} gal a year`,
    `salt-free gallons in 10 years = ${formatInt(r.saltFree.gal10)} (media life ${formatInt(Number(shown.raw.mediaLife))})`,
  ];
  const copyText = `Over 10 years: salt-based about ${formatDollars(r.salt.tenYear)}, salt-free about ${formatDollars(r.saltFree.tenYear)}. The ${cheaperLabel} costs about ${formatDollars(r.difference)} less.`;
  const stickyHeadline = `Salt ${formatDollars(r.salt.tenYear)} vs free ${formatDollars(r.saltFree.tenYear)}`;

  return (
    <div id="calculator" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label="People in your home" htmlFor="sf-people">
          <NumberField id="sf-people" value={raw.people} onChange={(v) => set('people', v)} whole min={1} max={12} />
        </Field>
        <Field label="Iron, ppm" htmlFor="sf-iron">
          <NumberField id="sf-iron" value={raw.iron} onChange={(v) => set('iron', v)} min={0} max={10} step={0.1} />
        </Field>
        <Field label="Water hardness" htmlFor="sf-hardness">
          <div className="flex gap-2">
            <div className="flex-1">
              <NumberField id="sf-hardness" value={raw.hardness} onChange={(v) => set('hardness', v)} min={0} />
            </div>
            <div className="w-36">
              <SelectField ariaLabel="Hardness unit" value={raw.unit} onChange={(v) => set('unit', v)} options={HARDNESS_UNITS} />
            </div>
          </div>
        </Field>
        <Field label="Who installs it">
          <SegmentedControl
            legend="Who installs it"
            value={raw.installer}
            onChange={(v) => set('installer', v)}
            options={[{ value: 'diy', label: 'DIY' }, { value: 'plumber', label: 'Plumber' }, { value: 'dealer', label: 'Dealer' }]}
          />
        </Field>
        <Field label="Salt price per 40 lb bag ($)" htmlFor="sf-price">
          <NumberField id="sf-price" value={raw.price} onChange={(v) => set('price', v)} min={0} step={0.5} />
        </Field>
        <Field label="Water per regeneration, gallons" htmlFor="sf-regen" helper="Most softeners use 20 to 70 gallons. Check your manual.">
          <NumberField id="sf-regen" value={raw.regen} onChange={(v) => set('regen', v)} whole min={0} max={200} />
        </Field>
        <Field label="Your water and sewer rate, $ per 1,000 gallons" htmlFor="sf-rate" helper="On your water bill. Leave empty to skip.">
          <NumberField id="sf-rate" value={raw.rate} onChange={(v) => set('rate', v)} min={0} step={0.5} />
        </Field>
        <Field label="Salt-free media life, gallons" htmlFor="sf-media-life">
          <NumberField id="sf-media-life" value={raw.mediaLife} onChange={(v) => set('mediaLife', v)} whole min={1} />
        </Field>
        <Field label="Salt-free media replacement cost ($)" htmlFor="sf-media-cost">
          <NumberField id="sf-media-cost" value={raw.mediaCost} onChange={(v) => set('mediaCost', v)} min={0} />
        </Field>
        <Field label="Pre-filter cost per year ($)" htmlFor="sf-prefilter">
          <NumberField id="sf-prefilter" value={raw.prefilter} onChange={(v) => set('prefilter', v)} min={0} />
        </Field>
      </div>

      <div ref={resultRef} className="mt-6 border-t border-line pt-6">
        <div aria-live="polite" className={invalid ? 'opacity-40' : ''}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Column title="Salt-based softener" upfront={r.salt.upfront} perYear={r.salt.yearly} tenYear={r.salt.tenYear} />
            <Column title="Salt-free conditioner" upfront={r.saltFree.upfront} perYear={r.saltFree.yearly} tenYear={r.saltFree.tenYear} />
          </div>
          <p className="mt-4 text-[16px] font-medium text-ink">
            Over 10 years the {cheaperLabel} costs about {formatDollars(r.difference)} less.
          </p>

          <dl className="mt-4 divide-y divide-line border-y border-line text-[15px]">
            {r.salt.sizeLabel && (
              <div className="flex justify-between gap-4 py-2.5"><dt className="text-muted">Softener size</dt><dd className="font-medium tnum text-right">{formatInt(r.salt.sizeLabel)} grains</dd></div>
            )}
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-muted">Regenerations</dt>
              <dd className="font-medium tnum text-right">
                {formatDecimal(r.salt.regensPerYear, 1)} a year, about {formatInt(r.salt.regenGal)} gallons
                {hasRate ? ` (about ${formatDollars(r.salt.waterCost)} of water)` : ' (enter your water rate to price it)'}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5"><dt className="text-muted">Salt</dt><dd className="font-medium tnum text-right">{formatInt(r.salt.bags)} bags, {formatDollars(r.salt.saltCostPerYear)} a year</dd></div>
            <div className="flex justify-between gap-4 py-2.5"><dt className="text-muted">Electricity</dt><dd className="font-medium text-right">about 26 kWh a year for the softener&apos;s valve</dd></div>
            <div className="flex justify-between gap-4 py-2.5"><dt className="text-muted">Salt-free media</dt><dd className="font-medium tnum text-right">first change in year {formatDecimal(r.saltFree.mediaYear, 1)}, {formatDollars(r.saltFree.media)} inside 10 years</dd></div>
            <div className="flex justify-between gap-4 py-2.5"><dt className="text-muted">Does it soften?</dt><dd className="font-medium text-right">Salt-based: yes, to under 1 gpg. Salt-free: no, hardness stays {formatGpg(r.hardnessGpg)} gpg.</dd></div>
          </dl>
        </div>

        {r.warnings.map((w) => (
          <div key={w} className="mt-3 flex gap-2 rounded-card bg-warn-bg p-3 text-[14px] text-warn-ink">
            <TriangleAlert className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <span>{WARN[w]}</span>
          </div>
        ))}

        <ShowTheMath lines={mathLines} />
        <CopyShareBar resultText={copyText} query={shown.params} tool={SLUG} />
      </div>

      <StickyResultBar headline={stickyHeadline} watchRef={resultRef} />
    </div>
  );
}
