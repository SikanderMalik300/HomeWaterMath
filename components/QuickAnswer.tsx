// Server-rendered, outside the client calculator (A5.3). Mist background, no
// left-border accent, no icon.
export default function QuickAnswer({ text }: { text: string }) {
  return (
    <div className="rounded-card bg-band-1 p-5 md:p-6">
      <p className="text-[17px] leading-relaxed text-ink">{text}</p>
    </div>
  );
}
