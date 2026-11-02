'use client';

import { useEffect, useMemo, useState } from 'react';
import { SALT_TYPES, saltTypeCost } from '@/lib/guides/saltTypes';
import { formatInt, formatDollars } from '@/lib/calc/round';
import { Field, NumberField, parseNum } from '@/components/calc/inputs';
import InlineText from '@/components/InlineText';
import { useToolEvents } from '@/components/calc/useToolEvents';

const SLUG = '/water-softener-salt-types/';

export default function WidgetSaltTypes() {
  const [lb, setLb] = useState('600');
  const [prices, setPrices] = useState<Record<string, string>>(
    Object.fromEntries(SALT_TYPES.map((t) => [t.id, String(t.defaultPrice)])),
  );
  const { onInteract, onResult } = useToolEvents(SLUG);

  const lbNum = parseNum(lb) ?? 0;
  const rows = useMemo(
    () =>
      SALT_TYPES.map((t) => ({
        t,
        ...saltTypeCost(lbNum, parseNum(prices[t.id]) ?? 0, t.factor),
      })),
    [lbNum, prices],
  );

  useEffect(() => {
    onResult(lb);
  }, [lb, onResult]);

  return (
    <div id="widget" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <Field label="Salt used per year (lb)" htmlFor="st-lb">
        <NumberField id="st-lb" value={lb} onChange={(v) => { onInteract(); setLb(v); }} whole min={0} />
      </Field>
      <p className="-mt-2 mb-4 text-[13px] text-muted">
        <InlineText text="A family of 4 at 15 gpg uses about 600 lb a year at a 9 lb salt setting. Get yours from the [salt calculator](/water-softener-salt-calculator/)." />
      </p>

      <div className="overflow-x-auto rounded-card border border-line" aria-live="polite">
        <table className="w-full border-collapse text-[14px]">
          <caption className="sr-only">Yearly salt cost by type at your usage</caption>
          <thead>
            <tr>
              <th scope="col" className="border-b border-line px-3 py-2 text-left text-[13px] font-medium text-muted">Type</th>
              <th scope="col" className="border-b border-line px-3 py-2 text-left text-[13px] font-medium text-muted">Price / 40 lb</th>
              <th scope="col" className="border-b border-line px-3 py-2 text-right text-[13px] font-medium text-muted tnum">Pounds a year</th>
              <th scope="col" className="border-b border-line px-3 py-2 text-right text-[13px] font-medium text-muted tnum">Bags a year</th>
              <th scope="col" className="border-b border-line px-3 py-2 text-right text-[13px] font-medium text-muted tnum">Cost a year</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ t, poundsYear, bagsYear, costYear }) => (
              <tr key={t.id}>
                <td className="border-b border-line px-3 py-2">{t.label}</td>
                <td className="border-b border-line px-3 py-2">
                  <div className="w-24">
                    <NumberField
                      ariaLabel={`Price per 40 lb bag of ${t.label}`}
                      value={prices[t.id]}
                      onChange={(v) => { onInteract(); setPrices((p) => ({ ...p, [t.id]: v })); }}
                      min={0}
                      step={0.01}
                    />
                  </div>
                </td>
                <td className="border-b border-line px-3 py-2 text-right tnum">{formatInt(poundsYear)}</td>
                <td className="border-b border-line px-3 py-2 text-right tnum">{formatInt(bagsYear)}</td>
                <td className="border-b border-line px-3 py-2 text-right tnum">{formatDollars(costYear)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[13px] text-muted">
        Prices are 40 lb bags at Home Depot, Walmart and Tractor Supply on October 26, 2026. Your store may differ; edit the prices above.
      </p>
    </div>
  );
}
