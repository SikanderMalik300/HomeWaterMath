'use client';

import { useState, useId, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';

interface SearchItem {
  label: string;
  href: string;
  keywords: string;
}

const ITEMS: SearchItem[] = [
  { label: 'Water softener size calculator', href: '/water-softener-size-calculator/', keywords: 'softener size grains household hardness' },
  { label: 'Water softener cost calculator', href: '/water-softener-cost/', keywords: 'softener cost price install 10 year quote' },
  { label: 'Water softener salt calculator', href: '/water-softener-salt-calculator/', keywords: 'salt bags per month year usage' },
  { label: 'Water hardness converter', href: '/water-hardness-converter/', keywords: 'hardness converter ppm gpg mg/l mmol german french degrees' },
  { label: 'Well pressure tank size calculator', href: '/well-pressure-tank-size-calculator/', keywords: 'well pressure tank drawdown psi pump gpm' },
  { label: 'Water softener calculators', href: '/water-softeners/', keywords: 'water softeners hub' },
  { label: 'Well water calculators', href: '/well-water/', keywords: 'well water hub' },
];

function filterItems(q: string): SearchItem[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  return ITEMS.filter(
    (it) => it.label.toLowerCase().includes(query) || it.keywords.includes(query),
  );
}

export function HeroSearch({ placeholder }: { placeholder: string }) {
  const [q, setQ] = useState('');
  const listId = useId();
  const results = filterItems(q);
  return (
    <div className="relative w-full max-w-md">
      <div className="flex h-12 items-center gap-2 rounded-pill border border-line bg-surface px-4">
        <Search className="h-5 w-5 shrink-0 text-muted" strokeWidth={1.5} aria-hidden="true" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          aria-label="Search calculators"
          aria-controls={listId}
          className="h-full w-full bg-transparent text-[16px] outline-none placeholder:text-muted"
        />
      </div>
      <div id={listId} aria-live="polite" className="relative">
        {results.length > 0 && (
          <ul className="absolute left-0 right-0 top-2 z-10 overflow-hidden rounded-card border border-line bg-surface shadow-card">
            {results.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  prefetch={false}
                  className="block px-4 py-2.5 text-[15px] text-ink hover:bg-band-1"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const results = filterItems(q);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Search calculators"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-11 items-center justify-center rounded-pill text-ink hover:text-brand"
      >
        {open ? (
          <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Search className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-20 w-72 rounded-card border border-line bg-surface p-2 shadow-card">
          <div className="flex h-11 items-center gap-2 rounded-pill border border-line px-3">
            <Search className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.5} aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search calculators"
              aria-label="Search calculators"
              aria-controls={listId}
              className="h-full w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
            />
          </div>
          <ul id={listId} aria-live="polite" className="mt-1">
            {results.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="block rounded px-3 py-2 text-[14px] text-ink hover:bg-band-1"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
