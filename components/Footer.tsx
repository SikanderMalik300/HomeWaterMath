import Link from 'next/link';

const CALCULATORS = [
  { label: 'Water softener size calculator', href: '/water-softener-size-calculator/' },
  { label: 'Water softener cost calculator', href: '/water-softener-cost/' },
  { label: 'Water softener salt calculator', href: '/water-softener-salt-calculator/' },
  { label: 'Water hardness converter', href: '/water-hardness-converter/' },
  { label: 'Well pressure tank size calculator', href: '/well-pressure-tank-size-calculator/' },
];
const SITE = [
  { label: 'About', href: '/about/' },
  { label: 'How we calculate', href: '/how-we-calculate/' },
  { label: 'Editorial policy', href: '/editorial-policy/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'Sitemap', href: '/sitemap/' },
];
const LEGAL = [
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Terms', href: '/terms/' },
  { label: 'Disclaimer', href: '/disclaimer/' },
  { label: 'Affiliate disclosure', href: '/affiliate-disclosure/' },
];

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="mb-3 text-[14px] font-medium text-ink">{title}</h2>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} prefetch={false} className="text-[14px] text-muted hover:text-brand">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-band-4">
      <div className="container-hw py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <Column title="Calculators" links={CALCULATORS} />
          <Column title="Site" links={SITE} />
          <Column title="Legal" links={LEGAL} />
        </div>
        <div className="mt-8 border-t border-line pt-6 text-[14px] text-muted">
          <p>© 2026 HomeWaterMath · Sikander Mushtaq · hello@homewatermath.com</p>
          <p className="mt-1">
            Estimates only. Check your equipment&apos;s spec sheet and local plumbing code.
          </p>
        </div>
      </div>
    </footer>
  );
}
