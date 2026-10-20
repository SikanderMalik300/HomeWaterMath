'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { convertHardness, HARDNESS_UNITS, type HardnessUnit } from '@/lib/calc/hardness';
import { formatDecimal } from '@/lib/calc/round';
import { Field, NumberField, SelectField, useDebounced, parseNum } from './inputs';
import ResultCard, { type ResultRow } from './ResultCard';
import ShowTheMath from './ShowTheMath';
import CopyShareBar from './CopyShareBar';
import StickyResultBar from './StickyResultBar';

interface Raw {
  value: string;
  unit: HardnessUnit;
}
const DEFAULTS: Raw = { value: '15', unit: 'gpg' };

function compute(raw: Raw) {
  const value = parseNum(raw.value);
  const valid = value !== null && value >= 0;
  const result = convertHardness(value ?? 0, raw.unit);
  const params = new URLSearchParams({ value: raw.value, unit: raw.unit }).toString();
  return { valid, result, params, raw };
}

export default function CalculatorHardness() {
  const [raw, setRaw] = useState<Raw>(DEFAULTS);
  const set = <K extends keyof Raw>(k: K, v: Raw[K]) => setRaw((r) => ({ ...r, [k]: v }));
  const debounced = useDebounced(raw, 150);
  const computed = useMemo(() => compute(debounced), [debounced]);
  const [last, setLast] = useState(() => compute(DEFAULTS));
  useEffect(() => {
    if (computed.valid) setLast(computed);
  }, [computed]);
  const shown = computed.valid ? computed : last;
  const invalid = !computed.valid;
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if ([...q.keys()].length === 0) return;
    setRaw((r) => ({
      value: q.get('value') ?? r.value,
      unit: (q.get('unit') as HardnessUnit) ?? r.unit,
    }));
  }, []);

  const r = shown.result;
  const sodium = Math.round(r.sodiumAddedMgPerL);
  const headline = `${formatDecimal(r.gpg, 2)} gpg`;

  const rows: ResultRow[] = [
    { label: 'mg/L (ppm)', value: formatDecimal(r.mgl, 1) },
    { label: 'mmol/L', value: formatDecimal(r.mmol, 3) },
    { label: 'German degrees (°dH)', value: formatDecimal(r.dh, 2) },
    { label: 'French degrees (°fH)', value: formatDecimal(r.fh, 1) },
    { label: 'WQA class', value: r.wqa },
    { label: 'USGS class', value: r.usgs },
  ];

  const mathLines = [
    `input ${shown.raw.value} ${HARDNESS_UNITS.find((u) => u.value === shown.raw.unit)?.label} = ${formatDecimal(r.mgl, 1)} mg/L as CaCO3`,
    `gpg = ${formatDecimal(r.mgl, 1)} ÷ 17.1181 = ${formatDecimal(r.gpg, 2)}`,
    `mmol/L = ${formatDecimal(r.mgl, 1)} ÷ 100.087 = ${formatDecimal(r.mmol, 3)}`,
    `°dH = ${formatDecimal(r.mgl, 1)} ÷ 17.848 = ${formatDecimal(r.dh, 2)}`,
    `°fH = ${formatDecimal(r.mgl, 1)} ÷ 10 = ${formatDecimal(r.fh, 1)}`,
    `sodium added = ${formatDecimal(r.gpg, 2)} × 7.864 = ${sodium} mg/L`,
  ];

  const copyText = `${formatDecimal(r.gpg, 2)} gpg = ${formatDecimal(r.mgl, 1)} mg/L = ${formatDecimal(r.mmol, 3)} mmol/L = ${formatDecimal(r.dh, 2)} °dH = ${formatDecimal(r.fh, 1)} °fH. WQA: ${r.wqa}; USGS: ${r.usgs}.`;

  return (
    <div id="calculator" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <Field label="Water hardness" htmlFor="hard-value">
        <div className="flex gap-2">
          <div className="flex-1">
            <NumberField id="hard-value" value={raw.value} onChange={(v) => set('value', v)} min={0} />
          </div>
          <div className="w-40">
            <SelectField ariaLabel="Hardness unit" value={raw.unit} onChange={(v) => set('unit', v)} options={HARDNESS_UNITS} />
          </div>
        </div>
      </Field>

      <div ref={resultRef}>
        <ResultCard
          headline={headline}
          subline={`${r.wqa} on the WQA scale`}
          rows={rows}
          invalid={invalid}
          invalidMessage="Enter a hardness value of zero or more."
        >
          <p className={`mt-3 text-[15px] text-muted ${invalid ? 'opacity-40' : ''}`}>
            If you soften this water, it adds about {sodium} mg of sodium per liter.
          </p>
          <ShowTheMath lines={mathLines} />
          <CopyShareBar resultText={copyText} query={shown.params} />
        </ResultCard>
      </div>

      <StickyResultBar headline={headline} watchRef={resultRef} />
    </div>
  );
}
