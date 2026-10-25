'use client';

import { useEffect, useMemo, useState } from 'react';
import { cleanerDose, cleanerProduct, CLEANER_PRODUCTS } from '@/lib/guides/cleanerDose';
import { formatInt, formatDecimal, roundTo } from '@/lib/calc/round';
import { formatCups } from '@/lib/guides/cleanerDose';
import { Field, SelectField, SegmentedControl, NumberField, parseNum } from '@/components/calc/inputs';
import { useToolEvents } from '@/components/calc/useToolEvents';

const SLUG = '/water-softener-cleaner/';

const SIZE_OPTIONS = [
  { value: 24000, label: '24,000 (0.75 cu ft)' },
  { value: 32000, label: '32,000 (1.0)' },
  { value: 48000, label: '48,000 (1.5)' },
  { value: 64000, label: '64,000 (2.0)' },
  { value: 80000, label: '80,000 (2.5)' },
  { value: 96000, label: '96,000 (3.0)' },
];

const ozStr = (x: number) => String(roundTo(x, 2));

export default function WidgetCleanerDose() {
  const [productId, setProductId] = useState('resCare');
  const [size, setSize] = useState(48000);
  const [dose, setDose] = useState<'first' | 'maintenance'>('first');
  const [regens, setRegens] = useState('44');
  const { onInteract, onResult } = useToolEvents(SLUG);

  const product = cleanerProduct(productId);
  const r = useMemo(() => cleanerDose(productId, size, parseNum(regens) ?? 0), [productId, size, regens]);

  useEffect(() => {
    onResult(`${productId}-${size}-${dose}`);
  }, [productId, size, dose, onResult]);

  const lines: string[] = [];
  if (dose === 'first') {
    if (r.type === 'powder') {
      lines.push('First clean: 1 cup dissolved in ½ gallon of cold water, poured into the brine well, then a regeneration.');
    } else {
      lines.push(`First clean: ${formatInt(r.firstOz)} oz (${formatCups(r.firstCups)}) poured into the brine well, then a regeneration.`);
    }
  } else {
    if (r.type === 'powder') {
      lines.push('Maintenance: ¼ cup with every 40 lb bag of salt.');
    } else {
      lines.push(
        `Maintenance: ${ozStr(r.maintOzLow)}${r.hasRange ? ` to ${ozStr(r.maintOzHigh)}` : ''} oz per regeneration.`,
      );
      lines.push(
        `${formatInt(r.maintYearLow)}${r.hasRange ? ` to ${formatInt(r.maintYearHigh)}` : ''} oz a year at this rate.`,
      );
      lines.push(
        `A 1-gallon bottle lasts about ${formatDecimal(r.gallonYearsLow, 1)}${r.hasRange ? ` to ${formatDecimal(r.gallonYearsHigh, 1)}` : ''} years.`,
      );
    }
  }

  return (
    <div id="widget" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label="Cleaner" htmlFor="cleaner-product">
          <SelectField
            id="cleaner-product"
            ariaLabel="Cleaner"
            value={productId}
            onChange={(v) => {
              onInteract();
              setProductId(v);
            }}
            options={CLEANER_PRODUCTS.map((p) => ({ value: p.id, label: p.label }))}
          />
        </Field>
        <Field label="Softener size" htmlFor="cleaner-size">
          <SelectField
            id="cleaner-size"
            ariaLabel="Softener size"
            value={size}
            onChange={(v) => {
              onInteract();
              setSize(v);
            }}
            options={SIZE_OPTIONS}
          />
        </Field>
        <Field label="Dose">
          <SegmentedControl
            legend="Dose"
            value={dose}
            onChange={(v) => {
              onInteract();
              setDose(v);
            }}
            options={[
              { value: 'first', label: 'First (deep) clean' },
              { value: 'maintenance', label: 'Maintenance (each regeneration)' },
            ]}
          />
        </Field>
        <Field label="Regenerations per year" htmlFor="cleaner-regens" helper="From the salt calculator; about 44 for a family of 4 at 15 gpg.">
          <NumberField id="cleaner-regens" value={regens} onChange={(v) => { onInteract(); setRegens(v); }} whole min={1} max={365} />
        </Field>
      </div>

      <div className="mt-4 border-t border-line pt-4" aria-live="polite">
        <p className="text-[17px] font-semibold text-ink tnum">{lines[0]}</p>
        {lines.slice(1).map((l, i) => (
          <p key={i} className="mt-1 text-[15px] text-ink tnum">
            {l}
          </p>
        ))}
        <p className="mt-2 text-[13px] text-muted">1 cup = 8 oz. Pour cleaner into the brine well, not on top of the salt.</p>
      </div>
    </div>
  );
}
