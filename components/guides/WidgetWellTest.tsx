'use client';

import { useEffect, useMemo, useState } from 'react';
import { wellTestChecker, type MonthsCategory, type WellTestInput } from '@/lib/guides/wellTestChecker';
import { Field, SelectField } from '@/components/calc/inputs';
import { useToolEvents } from '@/components/calc/useToolEvents';

const SLUG = '/well-water-test-kit/';

interface Raw {
  months: MonthsCategory;
  flooding: boolean;
  repair: boolean;
  tasteColorSmell: boolean;
  babyOrPregnant: boolean;
  construction: boolean;
}
const DEFAULTS: Raw = {
  months: '12plus',
  flooding: false,
  repair: false,
  tasteColorSmell: false,
  babyOrPregnant: false,
  construction: false,
};

const BOXES: { key: keyof Raw; label: string }[] = [
  { key: 'flooding', label: 'Flooding or heavy rain near the well' },
  { key: 'repair', label: 'Well repair or new pump' },
  { key: 'tasteColorSmell', label: 'Change in taste, color or smell' },
  { key: 'babyOrPregnant', label: 'Someone pregnant, or a baby in the home' },
  { key: 'construction', label: 'Nearby construction, farming or septic work' },
];

export default function WidgetWellTest() {
  const [raw, setRaw] = useState<Raw>(DEFAULTS);
  const { onInteract, onResult } = useToolEvents(SLUG);
  const set = <K extends keyof Raw>(k: K, v: Raw[K]) => {
    onInteract();
    setRaw((r) => ({ ...r, [k]: v }));
  };
  const r = useMemo(() => wellTestChecker(raw as WellTestInput), [raw]);
  useEffect(() => {
    onResult(r.message + r.tests.join(','));
  }, [r, onResult]);

  return (
    <div id="widget" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <Field label="Months since last lab test" htmlFor="wt-months">
        <SelectField
          id="wt-months"
          ariaLabel="Months since last lab test"
          value={raw.months}
          onChange={(v) => set('months', v as MonthsCategory)}
          options={[
            { value: 'under12', label: 'Under 12' },
            { value: '12plus', label: '12 or more' },
            { value: 'never', label: 'Never' },
          ]}
        />
      </Field>
      <fieldset className="mt-2">
        <legend className="mb-1.5 text-[14px] font-medium text-ink">Anything changed recently?</legend>
        <div className="flex flex-col gap-1 text-[15px]">
          {BOXES.map((b) => (
            <label key={b.key} className="inline-flex min-h-[44px] items-center gap-2">
              <input
                type="checkbox"
                checked={raw[b.key] as boolean}
                onChange={(e) => set(b.key, e.target.checked as Raw[typeof b.key])}
                className="h-4 w-4"
              />
              {b.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 border-t border-line pt-4" aria-live="polite">
        <p className="text-[18px] font-semibold text-ink">{r.message}</p>
        {r.tests.length > 0 && (
          <>
            <p className="mt-3 text-[15px] font-medium text-ink">Tests to run</p>
            <ul className="mt-1 list-disc pl-6 text-[15px]">
              {r.tests.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </>
        )}
        {r.notes.map((n) => (
          <p key={n} className="mt-2 text-[14px] text-muted">
            {n}
          </p>
        ))}
      </div>
    </div>
  );
}
