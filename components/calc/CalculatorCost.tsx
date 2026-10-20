'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { softenerCost, type CostResult, type SystemType, type Installer } from '@/lib/calc/softenerCost';
import { toGpg, HARDNESS_UNITS, type HardnessUnit } from '@/lib/calc/hardness';
import { formatInt, formatDollars } from '@/lib/calc/round';
import { Field, NumberField, SegmentedControl, SelectField, useDebounced, parseNum } from './inputs';
import ResultCard, { type ResultRow } from './ResultCard';
import ShowTheMath from './ShowTheMath';
import CopyShareBar from './CopyShareBar';
import StickyResultBar from './StickyResultBar';

interface Raw {
  type: SystemType;
  installer: Installer;
  people: string;
  hardness: string;
  unit: HardnessUnit;
  price: string;
  proService: boolean;
  quote: string;
}
const DEFAULTS: Raw = {
  type: 'single',
  installer: 'plumber',
  people: '4',
  hardness: '15',
  unit: 'gpg',
  price: '7',
  proService: false,
  quote: '',
};

const INSTALLER_LABEL: Record<Installer, string> = {
  diy: 'DIY',
  plumber: 'Plumber',
  dealer: 'Dealer',
};

function compute(raw: Raw) {
  const people = parseNum(raw.people);
  const hardness = parseNum(raw.hardness);
  const price = parseNum(raw.price);
  const quote = parseNum(raw.quote);
  const saltBased = raw.type !== 'saltFree';
  const valid =
    people !== null && people > 0 &&
    (!saltBased || (hardness !== null && hardness >= 0)) &&
    (!saltBased || (price !== null && price >= 0));

  const result = softenerCost({
    type: raw.type,
    installer: raw.installer,
    people: people ?? 0,
    hardnessGpg: toGpg(hardness ?? 0, raw.unit),
    pricePerBag: price ?? 0,
    proService: raw.proService,
    quote: raw.quote.trim() === '' ? null : quote,
  });
  const params = new URLSearchParams({
    type: raw.type,
    installer: raw.installer,
    people: raw.people,
    hardness: raw.hardness,
    unit: raw.unit,
    price: raw.price,
    service: raw.proService ? 'pro' : 'self',
    ...(raw.quote.trim() !== '' ? { quote: raw.quote } : {}),
  }).toString();
  return { valid, result, params, raw };
}

const QUOTE_TEXT: Record<'below' | 'within' | 'above', string> = {
  below: "Your quote is below the usual range (ask what's included).",
  within: 'Your quote is within the usual range.',
  above: 'Your quote is above the usual range.',
};

export default function CalculatorCost() {
  const [raw, setRaw] = useState<Raw>(DEFAULTS);
  const set = <K extends keyof Raw>(k: K, v: Raw[K]) => setRaw((r) => ({ ...r, [k]: v }));
  const debounced = useDebounced(raw, 150);
  const computed = useMemo(() => compute(debounced), [debounced]);
  const [last, setLast] = useState(() => compute(DEFAULTS));
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
      type: (q.get('type') as SystemType) ?? r.type,
      installer: (q.get('installer') as Installer) ?? r.installer,
      people: q.get('people') ?? r.people,
      hardness: q.get('hardness') ?? r.hardness,
      unit: (q.get('unit') as HardnessUnit) ?? r.unit,
      price: q.get('price') ?? r.price,
      proService: q.get('service') ? q.get('service') === 'pro' : r.proService,
      quote: q.get('quote') ?? r.quote,
    }));
  }, []);

  const r: CostResult = shown.result;
  const saltBased = shown.raw.type !== 'saltFree';
  const headline = formatDollars(r.upfront.typical);
  const subline = `${formatDollars(r.upfront.low)} to ${formatDollars(r.upfront.high)} upfront`;

  const rows: ResultRow[] = [];
  if (saltBased && r.recommendedLabel) {
    rows.push({ label: 'Recommended size', value: `${formatInt(r.recommendedLabel)} grains` });
  }
  if (saltBased) {
    rows.push({ label: 'Salt', value: `about ${formatDollars(r.saltCostPerYear)} a year (${formatInt(r.bagsPerYear)} bags)` });
  } else {
    rows.push({ label: 'Salt', value: '$0 (no salt used)' });
  }
  rows.push({
    label: 'Service',
    value: shown.raw.proService ? `${formatDollars(200)} a year (range $100 to $300)` : '$0 a year',
  });
  rows.push({ label: '10-year total', value: formatDollars(r.tenYearTotal) });
  if (r.quoteVerdict) {
    rows.push({ label: 'Your quote', value: QUOTE_TEXT[r.quoteVerdict] });
  }

  const mathLines = [
    `upfront typical = ${formatDollars(r.upfront.typical)} (range ${formatDollars(r.upfront.low)} to ${formatDollars(r.upfront.high)})`,
    saltBased
      ? `salt = ${formatInt(r.bagsPerYear)} bags × $${shown.raw.price} = ${formatDollars(r.saltCostPerYear)} a year`
      : 'salt = $0 a year',
    `service = ${formatDollars(r.serviceCostPerYear)} a year`,
    `10-year total = ${formatDollars(r.upfront.typical)} + 10 × (${formatDollars(r.saltCostPerYear)} + ${formatDollars(r.serviceCostPerYear)}) = ${formatDollars(r.tenYearTotal)}`,
  ];

  const copyText = `${INSTALLER_LABEL[shown.raw.installer]}-installed: about ${formatDollars(r.upfront.typical)} upfront (${formatDollars(r.upfront.low)} to ${formatDollars(r.upfront.high)}), 10-year total about ${formatDollars(r.tenYearTotal)}.`;

  return (
    <div id="calculator" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label="System type">
          <SegmentedControl
            legend="System type"
            value={shown.raw.type}
            onChange={(v) => set('type', v)}
            options={[
              { value: 'single', label: 'Salt-based, single tank' },
              { value: 'dual', label: 'Salt-based, dual tank' },
              { value: 'saltFree', label: 'Salt-free conditioner' },
            ]}
          />
        </Field>
        <Field label="Who installs it">
          <SegmentedControl
            legend="Who installs it"
            value={shown.raw.installer}
            onChange={(v) => set('installer', v)}
            options={[
              { value: 'diy', label: "I'll install it (DIY)" },
              { value: 'plumber', label: 'Plumber installs a unit I buy' },
              { value: 'dealer', label: 'Dealer supplies and installs' },
            ]}
          />
        </Field>
        <Field label="People in your home" htmlFor="cost-people">
          <NumberField id="cost-people" value={raw.people} onChange={(v) => set('people', v)} whole min={1} max={12} />
        </Field>
        {saltBased && (
          <Field label="Water hardness" htmlFor="cost-hardness">
            <div className="flex gap-2">
              <div className="flex-1">
                <NumberField id="cost-hardness" value={raw.hardness} onChange={(v) => set('hardness', v)} min={0} />
              </div>
              <div className="w-36">
                <SelectField ariaLabel="Hardness unit" value={raw.unit} onChange={(v) => set('unit', v)} options={HARDNESS_UNITS} />
              </div>
            </div>
          </Field>
        )}
        {saltBased && (
          <Field label="Salt price per 40 lb bag ($)" htmlFor="cost-price">
            <NumberField id="cost-price" value={raw.price} onChange={(v) => set('price', v)} min={0} step={0.5} />
          </Field>
        )}
        <Field label="Yearly service">
          <SegmentedControl
            legend="Yearly service"
            value={shown.raw.proService ? 'pro' : 'self'}
            onChange={(v) => set('proService', v === 'pro')}
            options={[
              { value: 'self', label: "I'll do it myself" },
              { value: 'pro', label: 'Pro service each year' },
            ]}
          />
        </Field>
        <Field label="Quote you received ($)" htmlFor="cost-quote">
          <NumberField id="cost-quote" value={raw.quote} onChange={(v) => set('quote', v)} min={0} />
        </Field>
      </div>

      {!saltBased && (
        <p className="mt-2 text-[14px] text-muted">
          Salt-free conditioners use no salt. Cartridge or media replacement isn&apos;t included here; check the maker&apos;s schedule.
        </p>
      )}

      <div ref={resultRef}>
        <ResultCard
          headline={headline}
          subline={subline}
          rows={rows}
          invalid={invalid}
          invalidMessage="Enter your household and hardness to see a cost."
        >
          <ShowTheMath lines={mathLines} />
          <CopyShareBar resultText={copyText} query={shown.params} />
        </ResultCard>

        <div className="mt-6 overflow-x-auto rounded-card border border-line">
          <table className="w-full border-collapse text-[14px]">
            <caption className="sr-only">Typical upfront and 10-year totals by installer</caption>
            <thead>
              <tr>
                <th scope="col" className="border-b border-line px-3 py-2 text-left text-[13px] font-medium text-muted">Install</th>
                <th scope="col" className="border-b border-line px-3 py-2 text-right text-[13px] font-medium text-muted tnum">Typical upfront</th>
                <th scope="col" className="border-b border-line px-3 py-2 text-right text-[13px] font-medium text-muted tnum">10-year total</th>
              </tr>
            </thead>
            <tbody>
              {(['diy', 'plumber', 'dealer'] as Installer[]).map((inst) => (
                <tr key={inst} className={shown.raw.installer === inst ? 'bg-band-1' : ''}>
                  <td className="border-b border-line px-3 py-2">{INSTALLER_LABEL[inst]}</td>
                  <td className="border-b border-line px-3 py-2 text-right tnum">{formatDollars(r.comparison[inst].upfront)}</td>
                  <td className="border-b border-line px-3 py-2 text-right tnum">{formatDollars(r.comparison[inst].tenYear)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StickyResultBar headline={headline} watchRef={resultRef} />
    </div>
  );
}
