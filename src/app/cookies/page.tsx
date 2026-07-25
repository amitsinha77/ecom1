import { PageHero } from "@/components/sections/page-hero";

export const metadata = {
  title: "Cookie Policy",
  description: "How PureMaids uses cookies on its website.",
};

export default function CookiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Cookie Policy"
        subtitle="How and why we use cookies on puremaids.co.uk."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cookie Policy" }]}
      />
      <section className="section">
        <div className="container max-w-3xl space-y-8 text-ink-600">
          <div>
            <h2 className="text-2xl font-bold text-ink-800">1. What are cookies?</h2>
            <p className="mt-3 leading-relaxed">
              Cookies are small text files stored on your device when you visit a website.
              They help us understand how you use our site so we can improve your experience.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink-800">2. Cookies we use</h2>
            <p className="mt-3 leading-relaxed">
              We use essential cookies to remember your cookie consent preference. We may
              also use analytics cookies to understand site usage. You can accept or reject
              non-essential cookies at any time using the banner shown on your first visit.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink-800">3. Managing cookies</h2>
            <p className="mt-3 leading-relaxed">
              You can control and delete cookies through your browser settings. Disabling
              cookies may affect some features of our website.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
