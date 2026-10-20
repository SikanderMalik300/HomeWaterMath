// Reserves nothing and renders nothing unless NEXT_PUBLIC_ADSENSE_ID is set.
// When on, reserves min-height (mobile 280, desktop 250) and shows a 12px label.
export default function AdSlot({ id }: { id: string }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  if (!adsenseId) return null;
  return (
    <div
      data-ad-slot={id}
      className="my-6 flex min-h-[280px] w-full items-center justify-center rounded-card border border-line md:min-h-[250px]"
    >
      <span className="text-[12px] text-muted">Advertisement</span>
    </div>
  );
}
