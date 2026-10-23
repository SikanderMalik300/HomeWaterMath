'use client';

import { useEffect, useMemo, useState } from 'react';
import { stripDecode, STRIP_BLOCKS, STRIP_NOTE, STRIP_CONFIRM } from '@/lib/guides/stripDecoder';
import { formatDecimal, formatInt } from '@/lib/calc/round';
import { Field, SegmentedControl } from '@/components/calc/inputs';
import { useToolEvents } from '@/components/calc/useToolEvents';

const SLUG = '/how-to-test-water-hardness/';

export default function WidgetStripDecoder() {
  const [block, setBlock] = useState(120);
  const { onInteract, onResult } = useToolEvents(SLUG);
  const r = useMemo(() => stripDecode(block), [block]);
  useEffect(() => {
    onResult(String(block));
  }, [block, onResult]);

  const message =
    r.high == null
      ? `${formatInt(r.block)} ppm (${formatDecimal(r.blockGpg, 1)} gpg) means about ${formatInt(r.low)} ppm and up, about ${formatDecimal(r.lowGpg, 1)} gpg and up.`
      : `${formatInt(r.block)} ppm (${formatDecimal(r.blockGpg, 1)} gpg) means somewhere between ${formatInt(r.low)} and ${formatInt(r.high)} ppm, about ${formatDecimal(r.lowGpg, 1)} to ${formatDecimal(r.highGpg ?? 0, 1)} gpg.`;

  return (
    <div id="widget" className="rounded-card border border-line bg-surface p-4 md:max-w-calc md:p-6">
      <Field label="Your strip's color block">
        <SegmentedControl
          legend="Your strip's color block (ppm)"
          value={block}
          onChange={(v) => {
            onInteract();
            setBlock(v);
          }}
          options={STRIP_BLOCKS.map((b) => ({ value: b, label: `${b} ppm` }))}
        />
      </Field>
      <div className="mt-4 border-t border-line pt-4" aria-live="polite">
        <p className="text-[17px] font-semibold text-ink tnum">{message}</p>
        <p className="mt-2 text-[15px] text-muted">{r.usgsClass} on the USGS scale.</p>
        <p className="mt-2 text-[15px] text-ink">{STRIP_CONFIRM}</p>
      </div>
      <p className="mt-3 text-[13px] text-muted">{STRIP_NOTE}</p>
    </div>
  );
}
