'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/data/pages';
import { HeaderSearch } from './SiteSearch';

function Wordmark() {
  return (
    <Link href="/" prefetch={false} className="flex items-center gap-2" aria-label="HomeWaterMath home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/icon.svg" width={32} height={32} alt="" />
      <span className="text-[22px] font-semibold leading-none">
        <span className="text-brand">HomeWater</span>
        <span className="text-ink">Math</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="border-b border-line bg-surface">
      <div className="container-hw flex h-16 items-center justify-between">
        <Wordmark />
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className="text-[15px] text-ink hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
          <HeaderSearch />
        </nav>
        <div className="flex items-center gap-1 md:hidden">
          <HeaderSearch />
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center rounded-pill text-ink hover:text-brand"
          >
            {menuOpen ? (
              <X className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav aria-label="Mobile" className="border-t border-line bg-surface md:hidden">
          <ul className="container-hw flex flex-col py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch={false}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-[16px] text-ink hover:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
