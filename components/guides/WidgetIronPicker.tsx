'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ironPicker, IRON_MESSAGES, type IronInput } from '@/lib/guides/ironPicker';
import { Field, NumberField, SegmentedControl, useDebounced, parseNum } from '@/components/calc/inputs';
import { useToolEvents } from '@/components/calc/useToolEvents';

const SLUG = '/iron-filter-for-well-water/';

interface Raw {
  iron: string;
  manganese: string;
  h2s: boolean;
  ph: string;
  slime: boolean;
  peak: string;
}
const DEFAULTS: Raw = { iron: '3', manganese: '0', h2s: false, ph: '7.0', slime: false, peak: '9' };

function compute(raw: Raw) {
  const input: IronInput = {
    iron: parseNum(raw.iron) ?? 0,
    manganese: parseNum(raw.manganese) ?? 0,
    h2s: raw.h2s,
    ph: parseNum(raw.ph) ?? 7,
    slime: raw.slime,
    peakFlow: parseNum(raw.peak) ?? 0,
  };
  return ironPicker(input);
}

export default function WidgetIronPicker() {
  const [raw, setRaw] = useState<Raw>(DEFAULTS);
  const { onInteract, onResult } = useToolEvents(SLUG);
  const set = <K extends keyof Raw>(k: K, v: Raw[K]) => {
    onInteract();
    setRaw((r) => ({ ...r, [k]: v }));
  };
  const debounced = useDebounced(raw, 150);
  const r = useMemo(() => compute(debounced), [debounced]);
  useEffect(() => {
    onResult(r.recommendation + r.combined);
  }, [r, onResult]);

  return (
    <div id="widget" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label="Iron, ppm" htmlFor="ip-iron">
          <NumberField id="ip-iron" value={raw.iron} onChange={(v) => set('iron', v)} min={0} max={50} step={0.1} />
        </Field>
        <Field label="Manganese, ppm" htmlFor="ip-mn">
          <NumberField id="ip-mn" value={raw.manganese} onChange={(v) => set('manganese', v)} min={0} max={10} step={0.01} />
        </Field>
        <Field label="Rotten-egg smell (hydrogen sulfide)">
          <SegmentedControl
            legend="Rotten-egg smell"
            value={raw.h2s ? 'yes' : 'no'}
            onChange={(v) => set('h2s', v === 'yes')}
            options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]}
          />
        </Field>
        <Field label="pH" htmlFor="ip-ph">
          <NumberField id="ip-ph" value={raw.ph} onChange={(v) => set('ph', v)} min={4} max={10} step={0.1} />
        </Field>
        <Field label="Red or brown slime in the toilet tank">
          <SegmentedControl
            legend="Red or brown slime in the toilet tank"
            value={raw.slime ? 'yes' : 'no'}
            onChange={(v) => set('slime', v === 'yes')}
            options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]}
          />
        </Field>
        <Field label="Peak flow, gpm" htmlFor="ip-peak">
          <NumberField id="ip-peak" value={raw.peak} onChange={(v) => set('peak', v)} min={1} max={40} step={0.5} />
        </Field>
      </div>

      <div className="mt-4 border-t border-line pt-4" aria-live="polite">
        {r.slimeNote && <p className="mb-3 rounded-card bg-warn-bg p-3 text-[14px] text-warn-ink">{r.slimeNote}</p>}
        <p className="text-[18px] font-semibold text-ink">{r.message}</p>
        {r.isSoftener && (
          <p className="mt-2 text-[15px]">
            <Link href="/water-softener-size-calculator/" prefetch={false} className="link-brand">
              Size a softener with the iron included.
            </Link>
          </p>
        )}
        <dl className="mt-3 divide-y divide-line border-y border-line text-[15px]">
          <div className="flex justify-between gap-4 py-2.5"><dt className="text-muted">Birm media</dt><dd className="font-medium text-right">{r.birmMessage}</dd></div>
          {r.manganeseNote && (
            <div className="py-2.5 text-[14px] text-ink">{r.manganeseNote}</div>
          )}
          {r.tank && (
            <div className="flex justify-between gap-4 py-2.5"><dt className="text-muted">Filter tank</dt><dd className="font-medium tnum text-right">{r.tank.label}, {r.tank.cuFt} cu ft, {r.tank.backwash} gpm backwash</dd></div>
          )}
          {r.tankOver && <div className="py-2.5 text-[14px] text-ink">{IRON_MESSAGES.tankOver}</div>}
        </dl>
        {r.backwashLine && <p className="mt-3 text-[14px] text-muted">{r.backwashLine}</p>}
        {r.costLine && <p className="mt-2 text-[14px] text-muted">{r.costLine}</p>}
      </div>
    </div>
  );
}
