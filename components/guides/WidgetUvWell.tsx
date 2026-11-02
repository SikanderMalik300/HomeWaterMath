'use client';

import { useEffect, useMemo, useState } from 'react';
import { preCheck, uvCost } from '@/lib/guides/uvWell';
import { formatDollars } from '@/lib/calc/round';
import { Field, NumberField, SegmentedControl, parseNum } from '@/components/calc/inputs';
import InlineText from '@/components/InlineText';
import { useToolEvents } from '@/components/calc/useToolEvents';

const SLUG = '/uv-light-for-well-water/';

export default function WidgetUvWell() {
  const [iron, setIron] = useState('0.1');
  const [manganese, setManganese] = useState('0');
  const [hardness, setHardness] = useState('5');
  const [tannins, setTannins] = useState('0');
  const [turbidity, setTurbidity] = useState('');
  const [uvt, setUvt] = useState('');

  const [flow, setFlow] = useState('7');
  const [unitPrice, setUnitPrice] = useState('685');
  const [install, setInstall] = useState<'diy' | 'plumber'>('plumber');
  const [outlet, setOutlet] = useState<'no' | 'yes'>('no');
  const [lampPrice, setLampPrice] = useState('135');
  const [sleevePrice, setSleevePrice] = useState('49');
  const [watts, setWatts] = useState('35');
  const [rate, setRate] = useState('0.17');

  const { onInteract, onResult } = useToolEvents(SLUG);

  const rows = useMemo(
    () =>
      preCheck({
        iron: parseNum(iron),
        manganese: parseNum(manganese),
        hardness: parseNum(hardness),
        tannins: parseNum(tannins),
        turbidity: parseNum(turbidity),
        uvt: parseNum(uvt),
      }),
    [iron, manganese, hardness, tannins, turbidity, uvt],
  );

  const cost = useMemo(
    () =>
      uvCost({
        unitPrice: parseNum(unitPrice) ?? 0,
        install: install === 'plumber' ? 500 : 0,
        outlet: outlet === 'yes' ? 250 : 0,
        lampPrice: parseNum(lampPrice) ?? 0,
        sleevePrice: parseNum(sleevePrice) ?? 0,
        watts: parseNum(watts) ?? 0,
        rate: parseNum(rate) ?? 0,
      }),
    [unitPrice, install, outlet, lampPrice, sleevePrice, watts, rate],
  );

  useEffect(() => {
    onResult(`${flow}-${install}`);
  }, [flow, install, onResult]);

  const num = (v: string, set: (s: string) => void, id: string, label: string, step = 0.1, helper?: string) => (
    <Field label={label} htmlFor={id} helper={helper}>
      <NumberField id={id} value={v} onChange={(x) => { onInteract(); set(x); }} min={0} step={step} />
    </Field>
  );

  return (
    <div id="widget" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <p className="mb-3 text-[15px] font-medium text-ink">Part A: pre-treatment check</p>
      <div className="grid gap-x-6 sm:grid-cols-2">
        {num(iron, setIron, 'uv-iron', 'Iron (ppm)')}
        {num(manganese, setManganese, 'uv-mn', 'Manganese (ppm)', 0.01)}
        {num(hardness, setHardness, 'uv-hard', 'Hardness (gpg)', 1)}
        {num(tannins, setTannins, 'uv-tannins', 'Tannins (ppm)', 0.1)}
        {num(turbidity, setTurbidity, 'uv-turb', 'Turbidity (NTU, optional)', 0.1)}
        {num(uvt, setUvt, 'uv-uvt', 'UV transmittance (%, optional)', 1)}
      </div>

      <dl className="mt-2 divide-y divide-line border-y border-line" aria-live="polite">
        {rows.map((row) => (
          <div key={row.key} className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="text-[15px] text-muted">{row.label}</dt>
            <dd className="text-right text-[15px] font-medium text-ink">
              {row.status === 'ok' && 'OK'}
              {row.status === 'untested' && <span className="text-muted">Not tested</span>}
              {row.status === 'treat' && row.fix && (
                <span className="text-warn-ink">
                  Treat first: <InlineText text={row.fix} />
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mb-3 mt-6 text-[15px] font-medium text-ink">Part B: size and 10-year cost</p>
      <div className="grid gap-x-6 sm:grid-cols-2">
        {num(flow, setFlow, 'uv-flow', 'Pump flow (gpm)', 1, 'Pick a system rated for at least this flow at 40 mJ/cm².')}
        {num(unitPrice, setUnitPrice, 'uv-unit', 'UV unit price ($)', 5, 'VIQUA VH200, 7 gpm at 40 mJ/cm², at ESP Water, Oct 2026.')}
        <Field label="Installation">
          <SegmentedControl
            legend="Installation"
            value={install}
            onChange={(v) => { onInteract(); setInstall(v); }}
            options={[
              { value: 'diy', label: 'DIY' },
              { value: 'plumber', label: 'Plumber ($500)' },
            ]}
          />
        </Field>
        <Field label="New GFCI outlet needed">
          <SegmentedControl
            legend="New GFCI outlet needed"
            value={outlet}
            onChange={(v) => { onInteract(); setOutlet(v); }}
            options={[
              { value: 'no', label: 'No' },
              { value: 'yes', label: 'Yes ($250)' },
            ]}
          />
        </Field>
        {num(lampPrice, setLampPrice, 'uv-lamp', 'Lamp ($ a year)', 1)}
        {num(sleevePrice, setSleevePrice, 'uv-sleeve', 'Sleeve ($ every 3 years)', 1)}
        {num(watts, setWatts, 'uv-watts', 'Lamp watts', 1)}
        {num(rate, setRate, 'uv-rate', 'Electricity ($ per kWh)', 0.01, 'Check your bill.')}
      </div>

      <dl className="mt-4 divide-y divide-line border-y border-line" aria-live="polite">
        <div className="flex items-baseline justify-between gap-4 py-2.5">
          <dt className="text-[15px] text-muted">Lamps over 10 years</dt>
          <dd className="text-right text-[15px] font-medium text-ink tnum">{formatDollars(cost.lampsOver10)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-2.5">
          <dt className="text-[15px] text-muted">Sleeves over 10 years</dt>
          <dd className="text-right text-[15px] font-medium text-ink tnum">{formatDollars(cost.sleevesOver10)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-2.5">
          <dt className="text-[15px] text-muted">Power over 10 years</dt>
          <dd className="text-right text-[15px] font-medium text-ink tnum">{formatDollars(cost.power10)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-2.5">
          <dt className="text-[15px] font-medium text-ink">10-year total</dt>
          <dd className="text-right text-[17px] font-semibold text-ink tnum">{formatDollars(cost.total10)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-2.5">
          <dt className="text-[15px] text-muted">About</dt>
          <dd className="text-right text-[15px] font-medium text-ink tnum">{formatDollars(cost.perYear)} a year</dd>
        </div>
      </dl>
    </div>
  );
}
