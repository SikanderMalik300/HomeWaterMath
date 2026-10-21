'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { softenerInstallCost, type InstallSetup } from '@/lib/calc/softenerInstallCost';
import { formatDollars } from '@/lib/calc/round';
import type { Range } from '@/lib/calc/range';
import { Field, NumberField, SegmentedControl, useDebounced, parseNum } from './inputs';
import ResultCard, { type ResultRow } from './ResultCard';
import ShowTheMath from './ShowTheMath';
import CopyShareBar from './CopyShareBar';
import StickyResultBar from './StickyResultBar';
import { useToolEvents } from './useToolEvents';

const SLUG = '/water-softener-installation-cost/';

interface Raw {
  setup: InstallSetup;
  drainInReach: boolean;
  outletNear: boolean;
  permit: string;
  quote: string;
}
const DEFAULTS: Raw = { setup: 'replace', drainInReach: true, outletNear: true, permit: '0', quote: '' };

function rangeText(r: Range): string {
  return `${formatDollars(r.low)} to ${formatDollars(r.high)}`;
}

function compute(raw: Raw) {
  const permit = parseNum(raw.permit);
  const valid = permit !== null && permit >= 0;
  const result = softenerInstallCost({
    setup: raw.setup,
    drainInReach: raw.drainInReach,
    outletNear: raw.outletNear,
    permit: permit ?? 0,
    quote: raw.quote.trim() === '' ? null : parseNum(raw.quote),
  });
  const params = new URLSearchParams({
    setup: raw.setup,
    drain: raw.drainInReach ? '1' : '0',
    outlet: raw.outletNear ? '1' : '0',
    permit: raw.permit,
    ...(raw.quote.trim() ? { quote: raw.quote } : {}),
  }).toString();
  return { valid, result, params, raw };
}

const QUOTE_TEXT: Record<'below' | 'within' | 'above', string> = {
  below: "Your quote is below the usual range (ask what's included).",
  within: 'Your quote is within the usual range.',
  above: 'Your quote is above the usual range.',
};

export default function CalculatorSoftenerInstall() {
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
      setup: (q.get('setup') as InstallSetup) ?? r.setup,
      drainInReach: q.get('drain') ? q.get('drain') === '1' : r.drainInReach,
      outletNear: q.get('outlet') ? q.get('outlet') === '1' : r.outletNear,
      permit: q.get('permit') ?? r.permit,
      quote: q.get('quote') ?? r.quote,
    }));
  }, []);

  const r = shown.result;
  const headline = formatDollars(r.total.typical);
  const subline = `${rangeText(r.total)} total`;

  const rows: ResultRow[] = [{ label: 'Labor', value: rangeText(r.labor) }];
  if (r.removal) rows.push({ label: 'Removal of the old unit', value: rangeText(r.removal) });
  if (r.loop) rows.push({ label: 'New softener loop', value: rangeText(r.loop) });
  if (r.drain) rows.push({ label: 'New drain line', value: rangeText(r.drain) });
  if (r.outlet) rows.push({ label: 'New 120 V outlet', value: rangeText(r.outlet) });
  if (r.permit > 0) rows.push({ label: 'Permit', value: formatDollars(r.permit) });

  const mathLines = [
    `labor = ${rangeText(r.labor)} (typical ${formatDollars(r.labor.typical)})`,
    ...(r.removal ? [`removal = ${rangeText(r.removal)}`] : []),
    ...(r.loop ? [`loop = ${rangeText(r.loop)} (typical ${formatDollars(r.loop.typical)})`] : []),
    ...(r.drain ? [`drain = ${rangeText(r.drain)}`] : []),
    ...(r.outlet ? [`outlet = ${rangeText(r.outlet)}`] : []),
    ...(r.permit > 0 ? [`permit = ${formatDollars(r.permit)}`] : []),
    `total = ${rangeText(r.total)}, typical ${formatDollars(r.total.typical)}`,
  ];
  const copyText = `Water softener install about ${formatDollars(r.total.typical)} (${rangeText(r.total)}).`;

  return (
    <div id="calculator" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label="Your setup">
          <SegmentedControl
            legend="Your setup"
            value={raw.setup}
            onChange={(v) => set('setup', v)}
            options={[
              { value: 'replace', label: 'Replacing an old softener' },
              { value: 'loopInPlace', label: 'Loop in place, no softener yet' },
              { value: 'noLoop', label: 'No softener loop' },
            ]}
          />
        </Field>
        <Field label="Drain within reach (floor drain, laundry standpipe or sink)">
          <SegmentedControl
            legend="Drain within reach"
            value={raw.drainInReach ? 'yes' : 'no'}
            onChange={(v) => set('drainInReach', v === 'yes')}
            options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          />
        </Field>
        <Field label="Outlet near the softener">
          <SegmentedControl
            legend="Outlet near the softener"
            value={raw.outletNear ? 'yes' : 'no'}
            onChange={(v) => set('outletNear', v === 'yes')}
            options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          />
        </Field>
        <Field label="Permit fee, $" htmlFor="si-permit" helper="Check your city. Examples: $37 in La Habra, CA; from $84 in St. Paul, MN.">
          <NumberField id="si-permit" value={raw.permit} onChange={(v) => set('permit', v)} min={0} />
        </Field>
        <Field label="Quote you received ($)" htmlFor="si-quote">
          <NumberField id="si-quote" value={raw.quote} onChange={(v) => set('quote', v)} min={0} />
        </Field>
      </div>

      <div ref={resultRef}>
        <ResultCard
          headline={headline}
          subline={subline}
          rows={rows}
          invalid={invalid}
          invalidMessage="Enter a permit fee of zero or more to see the install cost."
        >
          <p className="mt-3 text-[14px] text-muted">
            Most installs take 2 to 4 hours. At $45 to $200 an hour, that&apos;s $90 to $800 of time; the rest of a quote is parts, travel and setup.
          </p>
          {r.quoteVerdict && <p className="mt-2 text-[15px] text-ink">{QUOTE_TEXT[r.quoteVerdict]}</p>}
          <ShowTheMath lines={mathLines} />
          <CopyShareBar resultText={copyText} query={shown.params} tool={SLUG} />
        </ResultCard>
      </div>

      <StickyResultBar headline={headline} watchRef={resultRef} />
    </div>
  );
}
