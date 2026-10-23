'use client';

import { useEffect, useMemo, useState } from 'react';
import { repairOrReplace, type RepairInput } from '@/lib/guides/repairOrReplace';
import { Field, NumberField, useDebounced, parseNum } from '@/components/calc/inputs';
import { useToolEvents } from '@/components/calc/useToolEvents';

const SLUG = '/how-long-do-water-softeners-last/';

interface Raw {
  age: string;
  repair: string;
  newPrice: string;
}
const DEFAULTS: Raw = { age: '12', repair: '500', newPrice: '1500' };

function compute(raw: Raw) {
  const input: RepairInput = {
    age: parseNum(raw.age) ?? 0,
    repair: parseNum(raw.repair) ?? 0,
    newPrice: parseNum(raw.newPrice) ?? 1,
  };
  return repairOrReplace(input);
}

export default function WidgetRepairOrReplace() {
  const [raw, setRaw] = useState<Raw>(DEFAULTS);
  const { onInteract, onResult } = useToolEvents(SLUG);
  const set = <K extends keyof Raw>(k: K, v: Raw[K]) => {
    onInteract();
    setRaw((r) => ({ ...r, [k]: v }));
  };
  const debounced = useDebounced(raw, 150);
  const r = useMemo(() => compute(debounced), [debounced]);
  useEffect(() => {
    onResult(r.key + r.pct);
  }, [r, onResult]);

  return (
    <div id="widget" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-3">
        <Field label="Softener age, years" htmlFor="rr-age">
          <NumberField id="rr-age" value={raw.age} onChange={(v) => set('age', v)} whole min={0} max={40} />
        </Field>
        <Field label="Repair quote, $" htmlFor="rr-repair">
          <NumberField id="rr-repair" value={raw.repair} onChange={(v) => set('repair', v)} min={0} />
        </Field>
        <Field label="Price of a new softener, $" htmlFor="rr-new" helper="About $1,500 installed on average; see our cost calculator.">
          <NumberField id="rr-new" value={raw.newPrice} onChange={(v) => set('newPrice', v)} min={1} />
        </Field>
      </div>
      <div className="mt-4 border-t border-line pt-4" aria-live="polite">
        <p className="text-[18px] font-semibold text-ink">{r.message}</p>
      </div>
    </div>
  );
}
