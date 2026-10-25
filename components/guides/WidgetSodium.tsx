'use client';

import { useEffect, useMemo, useState } from 'react';
import { sodium, SODIUM_EPA_FLAG, SODIUM_TASTE_FLAG } from '@/lib/guides/sodium';
import { formatDecimal, formatInt } from '@/lib/calc/round';
import { HARDNESS_UNITS, type HardnessUnit } from '@/lib/calc/hardness';
import { Field, NumberField, SelectField, parseNum } from '@/components/calc/inputs';
import { useToolEvents } from '@/components/calc/useToolEvents';

const SLUG = '/can-you-drink-softened-water/';

export default function WidgetSodium() {
  const [hardness, setHardness] = useState('15');
  const [unit, setUnit] = useState<HardnessUnit>('gpg');
  const [liters, setLiters] = useState('2');
  const { onInteract, onResult } = useToolEvents(SLUG);

  const r = useMemo(
    () => sodium(parseNum(hardness) ?? 0, unit, parseNum(liters) ?? 0),
    [hardness, unit, liters],
  );

  useEffect(() => {
    onResult(`${hardness}-${unit}-${liters}`);
  }, [hardness, unit, liters, onResult]);

  return (
    <div id="widget" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label="Hardness removed" htmlFor="sodium-hardness">
          <div className="flex gap-2">
            <div className="flex-1">
              <NumberField id="sodium-hardness" value={hardness} onChange={(v) => { onInteract(); setHardness(v); }} min={0} />
            </div>
            <div className="w-36">
              <SelectField ariaLabel="Hardness unit" value={unit} onChange={(v) => { onInteract(); setUnit(v); }} options={HARDNESS_UNITS} />
            </div>
          </div>
        </Field>
        <Field label="Water you drink per day (liters)" htmlFor="sodium-liters">
          <NumberField id="sodium-liters" value={liters} onChange={(v) => { onInteract(); setLiters(v); }} min={0} max={10} step={0.5} />
        </Field>
      </div>

      <div className="mt-4 border-t border-line pt-4" aria-live="polite">
        <p className="text-[17px] font-semibold text-ink tnum">{formatDecimal(r.mgPerL, 1)} mg/L of sodium</p>
        <p className="mt-1 text-[15px] text-ink tnum">{formatInt(r.mgPerDay)} mg a day</p>
        <p className="mt-1 text-[15px] text-ink tnum">
          {formatInt(r.pct2300)}% of 2,300 mg and {formatInt(r.pct1500)}% of the 1,500 mg ideal.
        </p>
        {r.aboveEpaGuidance && <p className="mt-2 text-[14px] text-warn-ink">{SODIUM_EPA_FLAG}</p>}
        {r.mayTasteSalty && <p className="mt-1 text-[14px] text-warn-ink">{SODIUM_TASTE_FLAG}</p>}
      </div>
    </div>
  );
}
