import Link from 'next/link';
import { Fragment } from 'react';

// Renders text with inline [label](href) markdown links. Internal links use
// next/link with prefetch disabled; mailto and external links use <a>.
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

export default function InlineText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const label = m[1];
    const href = m[2];
    if (href.startsWith('/')) {
      parts.push(
        <Link key={m.index} href={href} prefetch={false} className="link-brand">
          {label}
        </Link>,
      );
    } else {
      const external = !href.startsWith('mailto:');
      parts.push(
        <a
          key={m.index}
          href={href}
          className="link-brand"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {label}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  );
}
