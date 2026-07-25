import { PageHero } from "@/components/sections/page-hero";

export const metadata = {
  title: "Terms of Service",
  description: "The terms and conditions for using PureMaids cleaning services and website.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="The terms under which we provide our cleaning services."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]}
      />
      <section className="section">
        <div className="container max-w-3xl space-y-8 text-ink-600">
          <div>
            <h2 className="text-2xl font-bold text-ink-800">1. Services</h2>
            <p className="mt-3 leading-relaxed">
              PureMaids provides professional cleaning services across the UK. By booking
              a service, you agree to these terms and the service description provided at
              the time of booking.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink-800">2. Bookings & Cancellations</h2>
            <p className="mt-3 leading-relaxed">
              Regular cleaning plans can be paused or cancelled with 7 days&apos; notice. One-off
              cleans can be rescheduled free of charge up to 48 hours before the appointment.
              Cancellations within 48 hours may incur a fee.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink-800">3. Satisfaction Guarantee</h2>
            <p className="mt-3 leading-relaxed">
              If you are not 100% satisfied with a clean, contact us within 48 hours and we
              will return to put it right at no additional cost.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink-800">4. Liability</h2>
            <p className="mt-3 leading-relaxed">
              PureMaids holds £2 million public liability insurance. We are not liable for
              damage to items of extraordinary value unless disclosed in advance. Our
              liability is limited to the cost of the cleaning service provided.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink-800">5. Payments</h2>
            <p className="mt-3 leading-relaxed">
              All payments are processed securely via Stripe. We do not store card details.
              Prices are confirmed at the time of booking.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
