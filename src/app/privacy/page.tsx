import { PageHero } from "@/components/sections/page-hero";

export const metadata = {
  title: "Privacy Policy",
  description: "How PureMaids collects, uses, and protects your personal data in accordance with the GDPR.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="Your privacy matters to us. This policy explains how we handle your data."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />
      <section className="section">
        <div className="container max-w-3xl space-y-8 text-ink-600">
          <div>
            <h2 className="text-2xl font-bold text-ink-800">1. Introduction</h2>
            <p className="mt-3 leading-relaxed">
              PureMaids (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is committed to protecting your personal
              data and respecting your privacy. This policy explains how we collect, use,
              and safeguard your information in accordance with the UK GDPR and Data
              Protection Act 2018.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink-800">2. Data We Collect</h2>
            <p className="mt-3 leading-relaxed">
              When you use our website, we may collect: your name, email address, phone
              number, property address, postcode, and any information you provide in your
              enquiry or booking. We do not store payment card details — all payments are
              processed securely by Stripe.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink-800">3. How We Use Your Data</h2>
            <p className="mt-3 leading-relaxed">
              We use your data to process bookings and enquiries, arrange cleaning
              services, communicate with you about your booking, and improve our services.
              We will never sell your data to third parties.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink-800">4. Your Rights</h2>
            <p className="mt-3 leading-relaxed">
              Under the GDPR you have the right to access, correct, delete, or restrict the
              processing of your personal data. To exercise any of these rights, contact
              us at hello@puremaids.co.uk.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink-800">5. Contact</h2>
            <p className="mt-3 leading-relaxed">
              If you have any questions about this policy or how we handle your data, please
              email hello@puremaids.co.uk or write to PureMaids HQ, 71-75 Shelton Street,
              London, WC2H 9JQ.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
