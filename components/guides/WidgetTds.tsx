'use client';

import { useEffect, useMemo, useState } from 'react';
import { tdsCheck } from '@/lib/guides/tds';
import { formatInt } from '@/lib/calc/round';
import { Field, NumberField, SegmentedControl, parseNum } from '@/components/calc/inputs';
import { useToolEvents } from '@/components/calc/useToolEvents';

const SLUG = '/tds-meter-chart/';

export default function WidgetTds() {
  const [reading, setReading] = useState('180');
  const [before, setBefore] = useState('');
  const [ec, setEc] = useState(false);
  const [factor, setFactor] = useState('0.50');
  const { onInteract, onResult } = useToolEvents(SLUG);

  const r = useMemo(
    () =>
      tdsCheck({
        reading: parseNum(reading) ?? 0,
        before: parseNum(before),
        ec,
        factor: parseNum(factor) ?? 0.5,
      }),
    [reading, before, ec, factor],
  );

  useEffect(() => {
    onResult(`${reading}-${ec ? 'ec' : 'ppm'}`);
  }, [reading, ec, onResult]);

  return (
    <div id="widget" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label={ec ? 'Your reading (µS/cm)' : 'Your reading (ppm)'} htmlFor="tds-reading">
          <NumberField id="tds-reading" value={reading} onChange={(v) => { onInteract(); setReading(v); }} min={0} />
        </Field>
        <Field label="Reading before an RO or filter (ppm, optional)" htmlFor="tds-before">
          <NumberField id="tds-before" value={before} onChange={(v) => { onInteract(); setBefore(v); }} min={0} />
        </Field>
        <Field label="What my meter shows">
          <SegmentedControl
            legend="What my meter shows"
            value={ec ? 'ec' : 'ppm'}
            onChange={(v) => { onInteract(); setEc(v === 'ec'); }}
            options={[
              { value: 'ppm', label: 'TDS (ppm)' },
              { value: 'ec', label: 'µS/cm (EC)' },
            ]}
          />
        </Field>
        {ec && (
          <Field label="EC to ppm factor" htmlFor="tds-factor" helper="Most pocket TDS meters use about 0.5.">
            <NumberField id="tds-factor" value={factor} onChange={(v) => { onInteract(); setFactor(v); }} min={0.5} max={0.82} step={0.01} />
          </Field>
        )}
      </div>

      <div className="mt-4 border-t border-line pt-4" aria-live="polite">
        <p className="text-[17px] font-semibold text-ink tnum">
          {formatInt(r.ppm)} ppm: {r.band} taste.
        </p>
        <p className="mt-1 text-[15px] text-ink">
          That&apos;s {r.aboveEpa ? 'above' : 'below'} EPA&apos;s 500 mg/L guideline.
        </p>
        {r.reductionPct != null && (
          <p className="mt-2 text-[15px] text-ink tnum">
            {r.roMeets
              ? `Your RO is removing ${formatInt(r.reductionPct)}% of dissolved solids. Certified RO systems remove at least 75%.`
              : `Below the 75% that certified RO systems must reach. Check the membrane and filters.`}
          </p>
        )}
      </div>
    </div>
  );
}
