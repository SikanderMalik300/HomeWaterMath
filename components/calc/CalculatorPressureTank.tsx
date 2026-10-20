'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { pressureTank, type PressureTankResult } from '@/lib/calc/pressureTank';
import { PRESSURE_SWITCHES } from '@/lib/data/constants';
import { formatDecimal, formatTrim } from '@/lib/calc/round';
import { Field, NumberField, SegmentedControl, SelectField, useDebounced, parseNum } from './inputs';
import ResultCard, { type ResultRow } from './ResultCard';
import ShowTheMath from './ShowTheMath';
import CopyShareBar from './CopyShareBar';
import StickyResultBar from './StickyResultBar';

interface Raw {
  gpm: string;
  hp: number;
  run: 'rule' | '1' | '2';
  switchLabel: string;
}
const DEFAULTS: Raw = { gpm: '10', hp: 1, run: 'rule', switchLabel: '40/60' };

function switchFor(label: string) {
  return PRESSURE_SWITCHES.find((s) => s.label === label) ?? PRESSURE_SWITCHES[2];
}

function compute(raw: Raw) {
  const gpm = parseNum(raw.gpm);
  const valid = gpm !== null && gpm > 0;
  const sw = switchFor(raw.switchLabel);
  const override = raw.run === 'rule' ? null : Number(raw.run);
  const result = pressureTank({
    gpm: gpm ?? 0,
    hp: raw.hp,
    runOverride: override,
    cutIn: sw.cutIn,
    cutOut: sw.cutOut,
  });
  const params = new URLSearchParams({
    gpm: raw.gpm,
    hp: String(raw.hp),
    run: raw.run,
    switch: raw.switchLabel,
  }).toString();
  return { valid, result, params, raw, sw };
}

export default function CalculatorPressureTank() {
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
      gpm: q.get('gpm') ?? r.gpm,
      hp: Number(q.get('hp')) || r.hp,
      run: (q.get('run') as Raw['run']) ?? r.run,
      switchLabel: q.get('switch') ?? r.switchLabel,
    }));
  }, []);

  const r: PressureTankResult = shown.result;
  const headline = r.recommended
    ? `${r.recommended}-gallon tank`
    : `${r.multipleCount} × 119-gallon tanks`;

  const rows: ResultRow[] = [
    { label: 'Drawdown needed', value: `${formatTrim(r.drawdownNeeded, 1)} gal` },
    { label: `Usable drawdown at ${shown.raw.switchLabel}`, value: `${formatDecimal(r.factor * 100, 1)}% of tank volume` },
    { label: 'Minimum tank volume', value: `${formatDecimal(r.tankNeeded, 1)} gal` },
    { label: "This tank's drawdown about", value: `${formatDecimal(r.drawdownOfRecommended, 1)} gal` },
    { label: 'Pre-charge (air) pressure', value: `${r.preCharge} psi (tank empty of water)` },
  ];

  const mathLines = [
    `drawdown needed = ${shown.raw.gpm} gpm × ${r.runMinutes} min = ${formatTrim(r.drawdownNeeded, 1)} gal`,
    `usable share at ${shown.raw.switchLabel} = ${formatDecimal(r.factor * 100, 1)}%`,
    `minimum tank = ${formatTrim(r.drawdownNeeded, 1)} ÷ ${formatDecimal(r.factor, 4)} = ${formatDecimal(r.tankNeeded, 1)} gal`,
    r.recommended
      ? `${r.recommended}-gallon tank gives ${formatDecimal(r.drawdownOfRecommended, 1)} gal of drawdown`
      : `need ${r.multipleCount} × 119-gallon tanks`,
    `pre-charge = ${shown.sw.cutIn} - 2 = ${r.preCharge} psi`,
  ];

  const copyText = `${headline}. Drawdown needed ${formatTrim(r.drawdownNeeded, 1)} gal. Pre-charge ${r.preCharge} psi.`;

  return (
    <div id="calculator" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field label="Pump flow rate (gallons per minute)" htmlFor="pt-gpm">
          <NumberField id="pt-gpm" value={raw.gpm} onChange={(v) => set('gpm', v)} min={1} max={40} step={0.5} />
        </Field>
        <Field label="Pump horsepower" htmlFor="pt-hp">
          <SelectField
            id="pt-hp"
            ariaLabel="Pump horsepower"
            value={raw.hp}
            onChange={(v) => set('hp', v)}
            options={[
              { value: 0.5, label: '1/2' },
              { value: 0.75, label: '3/4' },
              { value: 1, label: '1' },
              { value: 1.5, label: '1 1/2' },
              { value: 2, label: '2' },
            ]}
          />
        </Field>
        <Field label="Override run time (optional)">
          <SegmentedControl
            legend="Override run time"
            value={shown.raw.run}
            onChange={(v) => set('run', v)}
            options={[
              { value: 'rule', label: 'Use the rule' },
              { value: '1', label: '1 minute' },
              { value: '2', label: '2 minutes' },
            ]}
          />
        </Field>
        <Field label="Pressure switch">
          <SegmentedControl
            legend="Pressure switch"
            value={shown.raw.switchLabel}
            onChange={(v) => set('switchLabel', v)}
            options={PRESSURE_SWITCHES.map((s) => ({ value: s.label, label: s.label }))}
          />
        </Field>
      </div>

      <div ref={resultRef}>
        <ResultCard
          headline={headline}
          rows={rows}
          invalid={invalid}
          invalidMessage="Enter a pump flow rate above zero to size a tank."
        >
          <ShowTheMath lines={mathLines} />
          <CopyShareBar resultText={copyText} query={shown.params} />
        </ResultCard>
      </div>

      <StickyResultBar headline={headline} watchRef={resultRef} />
    </div>
  );
}
