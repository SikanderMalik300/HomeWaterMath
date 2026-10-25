'use client';

import { useEffect, useMemo, useState } from 'react';
import { needSoftener } from '@/lib/guides/needSoftener';
import { formatGpg } from '@/lib/calc/round';
import { HARDNESS_UNITS, type HardnessUnit } from '@/lib/calc/hardness';
import { Field, NumberField, SelectField, parseNum } from '@/components/calc/inputs';
import InlineText from '@/components/InlineText';
import { useToolEvents } from '@/components/calc/useToolEvents';

const SLUG = '/hard-water-vs-soft-water/';

export default function WidgetNeedSoftener() {
  const [hardness, setHardness] = useState('15');
  const [unit, setUnit] = useState<HardnessUnit>('gpg');
  const [iron, setIron] = useState('0');
  const { onInteract, onResult } = useToolEvents(SLUG);

  const r = useMemo(
    () => needSoftener(parseNum(hardness) ?? 0, unit, parseNum(iron) ?? 0),
    [hardness, unit, iron],
  );

  useEffect(() => {
    onResult(`${hardness}-${unit}`);
  }, [hardness, unit, onResult]);

  return (
    <div id="widget" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label="Water hardness" htmlFor="need-hardness">
          <div className="flex gap-2">
            <div className="flex-1">
              <NumberField id="need-hardness" value={hardness} onChange={(v) => { onInteract(); setHardness(v); }} min={0} />
            </div>
            <div className="w-36">
              <SelectField ariaLabel="Hardness unit" value={unit} onChange={(v) => { onInteract(); setUnit(v); }} options={HARDNESS_UNITS} />
            </div>
          </div>
        </Field>
        <Field label="Iron (ppm, from your water test)" htmlFor="need-iron">
          <NumberField id="need-iron" value={iron} onChange={(v) => { onInteract(); setIron(v); }} min={0} max={10} step={0.1} />
        </Field>
      </div>

      <div className="mt-4 border-t border-line pt-4" aria-live="polite">
        <p className="text-[17px] font-semibold text-ink">
          <InlineText text={r.recommendation} />
        </p>
        <p className="mt-2 text-[15px] text-muted tnum">
          {formatGpg(r.gpg)} gpg, {r.wqa} (WQA).
        </p>
        {r.ironNote && (
          <p className="mt-2 text-[15px] text-ink">
            <InlineText text={r.ironNote} />
          </p>
        )}
        <p className="mt-2 text-[15px] text-ink tnum">{r.sodiumNote}</p>
      </div>
    </div>
  );
}
