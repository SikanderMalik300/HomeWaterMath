'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'ok' | 'error';

export default function ContactForm() {
  const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  const [status, setStatus] = useState<Status>('idle');

  // Without a key configured, show only the email address (A6.9 /contact/).
  if (!key) {
    return (
      <p className="mt-6 text-[16px]">
        Email us at{' '}
        <a href="mailto:hello@homewatermath.com" className="link-brand">
          hello@homewatermath.com
        </a>
        .
      </p>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append('access_key', key);
    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setStatus('ok');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClass = 'h-12 w-full rounded-card border border-line bg-surface px-3 text-[16px] outline-none focus:border-brand';

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-md space-y-4">
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-[14px] font-medium text-ink">
          Name
        </label>
        <input id="contact-name" name="name" type="text" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-[14px] font-medium text-ink">
          Email
        </label>
        <input id="contact-email" name="email" type="email" inputMode="email" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-[14px] font-medium text-ink">
          Message
        </label>
        <textarea id="contact-message" name="message" required rows={5} className="w-full rounded-card border border-line bg-surface px-3 py-2 text-[16px] outline-none focus:border-brand" />
      </div>
      {/* Hidden fields so messages are identifiable in a shared Web3Forms inbox. */}
      <input type="hidden" name="subject" value="New message from HomeWaterMath" />
      <input type="hidden" name="from_name" value="HomeWaterMath contact form" />
      {/* Honeypot */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="h-11 rounded-pill bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending...' : 'Send message'}
      </button>
      {status === 'ok' && (
        <p role="status" className="text-[15px] text-brand">
          Thanks, your message is on its way.
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="text-[15px] text-warn-ink">
          Something went wrong. Email hello@homewatermath.com instead.
        </p>
      )}
    </form>
  );
}
