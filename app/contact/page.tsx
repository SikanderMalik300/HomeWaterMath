import type { Metadata } from 'next';
import TrustLayout from '@/components/TrustLayout';
import ContactForm from '@/components/ContactForm';
import { CONTACT_INTRO } from '@/lib/content/trust';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/contact/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <TrustLayout slug={SLUG}>
      <p className="mt-4 text-[16px]">{CONTACT_INTRO}</p>
      <ContactForm />
    </TrustLayout>
  );
}
