'use client';

import { useEffect, useMemo, useState } from 'react';
import { saltBridge, type BridgeInput } from '@/lib/guides/saltBridge';
import { Field, SegmentedControl } from '@/components/calc/inputs';
import InlineText from '@/components/InlineText';
import { useToolEvents } from '@/components/calc/useToolEvents';

const SLUG = '/water-softener-salt-bridge/';

const QUESTIONS: { key: keyof BridgeInput; label: string }[] = [
  { key: 'q1', label: 'Has the salt level stayed the same for 2 weeks or more?' },
  { key: 'q2', label: 'Is your water hard even though the tank looks full of salt?' },
  { key: 'q3', label: 'When you push a broom handle down, does it hit a hard layer with empty space or loose salt below?' },
  { key: 'q4', label: 'Is there a thick sludge layer at the bottom of the tank?' },
];

export default function WidgetSaltBridge() {
  const [answers, setAnswers] = useState<BridgeInput>({ q1: false, q2: false, q3: false, q4: false });
  const { onInteract, onResult } = useToolEvents(SLUG);
  const result = useMemo(() => saltBridge(answers), [answers]);

  useEffect(() => {
    onResult(result.key);
  }, [result.key, onResult]);

  return (
    <div id="widget" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      {QUESTIONS.map((q) => (
        <Field key={q.key} label={q.label}>
          <SegmentedControl
            legend={q.label}
            value={answers[q.key] ? 'yes' : 'no'}
            onChange={(v) => {
              onInteract();
              setAnswers((a) => ({ ...a, [q.key]: v === 'yes' }));
            }}
            options={[
              { value: 'no', label: 'No' },
              { value: 'yes', label: 'Yes' },
            ]}
          />
        </Field>
      ))}

      <div className="mt-4 border-t border-line pt-4" aria-live="polite">
        <p className="text-[17px] font-semibold text-ink">
          <InlineText text={result.message} />
        </p>
      </div>
    </div>
  );
}
