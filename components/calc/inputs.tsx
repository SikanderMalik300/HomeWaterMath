'use client';

import { useEffect, useState, useId } from 'react';

/** Debounce a value; returns the initial value synchronously (SSR-safe). */
export function useDebounced<T>(value: T, delay = 150): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function Field({
  label,
  htmlFor,
  helper,
  children,
}: {
  label: string;
  htmlFor?: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="mb-1.5 block text-[14px] font-medium text-ink">
        {label}
      </label>
      {children}
      {helper && <p className="mt-1 text-[13px] text-muted">{helper}</p>}
    </div>
  );
}

export function NumberField({
  value,
  onChange,
  whole = false,
  min,
  max,
  step,
  id,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  whole?: boolean;
  min?: number;
  max?: number;
  step?: number;
  id?: string;
  ariaLabel?: string;
}) {
  return (
    <input
      id={id}
      type="number"
      inputMode={whole ? 'numeric' : 'decimal'}
      value={value}
      min={min}
      max={max}
      step={step ?? (whole ? 1 : 'any')}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-card border border-line bg-surface px-3 text-[16px] tnum outline-none focus:border-brand"
    />
  );
}

export interface Option<T extends string | number> {
  value: T;
  label: string;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  legend,
}: {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  legend: string;
}) {
  const name = useId();
  return (
    <div role="radiogroup" aria-label={legend} className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <label
            key={String(opt.value)}
            className={`flex min-h-[44px] cursor-pointer items-center rounded-pill border px-4 text-[14px] font-medium transition-colors ${
              selected
                ? 'border-brand bg-brand text-white'
                : 'border-line bg-surface text-ink hover:border-brand'
            }`}
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={selected}
              onChange={() => onChange(opt.value)}
            />
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}

export function SelectField<T extends string | number>({
  options,
  value,
  onChange,
  id,
  ariaLabel,
}: {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  id?: string;
  ariaLabel?: string;
}) {
  return (
    <select
      id={id}
      aria-label={ariaLabel}
      value={String(value)}
      onChange={(e) => {
        const raw = e.target.value;
        const match = options.find((o) => String(o.value) === raw);
        if (match) onChange(match.value);
      }}
      className="h-12 w-full rounded-card border border-line bg-surface px-3 text-[16px] outline-none focus:border-brand"
    >
      {options.map((opt) => (
        <option key={String(opt.value)} value={String(opt.value)}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

/** Parse a raw numeric string into a finite number, or null if empty/invalid. */
export function parseNum(raw: string): number | null {
  if (raw.trim() === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}
