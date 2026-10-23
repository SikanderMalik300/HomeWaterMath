'use client';

import { useEffect, useState } from 'react';
import { SOFTENER_SYMPTOMS, getSymptom, DEFAULT_SYMPTOM_ID } from '@/lib/guides/softenerTroubleshoot';
import { Field, SelectField } from '@/components/calc/inputs';
import { useToolEvents } from '@/components/calc/useToolEvents';

const SLUG = '/water-softener-not-working/';

export default function WidgetSoftenerTroubleshoot() {
  const [id, setId] = useState(DEFAULT_SYMPTOM_ID);
  const { onInteract, onResult } = useToolEvents(SLUG);
  const symptom = getSymptom(id);

  useEffect(() => {
    onResult(String(id));
  }, [id, onResult]);

  return (
    <div id="widget" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <Field label="What's happening?" htmlFor="st-symptom">
        <SelectField
          id="st-symptom"
          ariaLabel="What's happening?"
          value={id}
          onChange={(v) => {
            onInteract();
            setId(v);
          }}
          options={SOFTENER_SYMPTOMS.map((s) => ({ value: s.id, label: s.label }))}
        />
      </Field>
      <div className="mt-4 border-t border-line pt-4" aria-live="polite">
        <p className="text-[15px] font-medium text-ink">Check these in order</p>
        <p className="mt-2 text-[15px] text-ink">{symptom.checks}</p>
        <p className="mt-3 text-[14px] text-muted">
          Typical repair cost if you call a pro: {symptom.proCost}
        </p>
      </div>
    </div>
  );
}
