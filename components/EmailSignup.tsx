// Off by default. Renders only when NEXT_PUBLIC_EMAIL_ON=1. Provider decided later.
export default function EmailSignup() {
  if (process.env.NEXT_PUBLIC_EMAIL_ON !== '1') return null;
  return (
    <section className="my-6 rounded-card border border-line bg-band-4 p-5">
      <h3 className="mb-1 text-[16px] font-medium">Get a reminder when it&apos;s time to add salt</h3>
      <form className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="email-reminder">
          Email address
        </label>
        <input
          id="email-reminder"
          type="email"
          inputMode="email"
          placeholder="you@example.com"
          className="h-11 flex-1 rounded-pill border border-line px-4 text-[16px]"
        />
        <button
          type="submit"
          className="h-11 rounded-pill bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover"
        >
          Sign up
        </button>
      </form>
      <p className="mt-2 text-[13px] text-muted">
        We&apos;ll only email you salt and maintenance reminders. Unsubscribe any time.
      </p>
    </section>
  );
}
