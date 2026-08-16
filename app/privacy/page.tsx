import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Brand } from "@/components/brand";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Molecular Frame handles pilot-request information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="legal-page">
      <div className="legal-page__shell">
        <div className="legal-page__top">
          <Brand />
          <Link href="/" className="text-link">
            <ArrowLeft aria-hidden="true" />
            Back to home
          </Link>
        </div>

        <article>
          <p className="section-kicker">Privacy</p>
          <h1>Clear, limited use of your information.</h1>
          <p className="legal-page__updated">Last updated August 16, 2026</p>

          <section>
            <h2>Information we collect</h2>
            <p>
              When you request a pilot, we collect the information you enter in
              the form, including your name, work email, company, role, therapy
              area, timeline, and project brief.
            </p>
          </section>

          <section>
            <h2>How we use it</h2>
            <p>
              We use this information to review your request, respond to you, and
              plan a potential engagement. We do not sell pilot-request data.
            </p>
          </section>

          <section>
            <h2>Service providers</h2>
            <p>
              The website is hosted on Vercel. Form delivery may use Resend. These
              providers process limited technical and submission data to operate
              the site and deliver your request.
            </p>
          </section>

          <section>
            <h2>Retention and requests</h2>
            <p>
              We retain inquiries only as long as needed for business follow-up,
              recordkeeping, and applicable legal obligations. To request access,
              correction, or deletion, use the pilot form and identify your note
              as a privacy request.
            </p>
            <Link href="/#pilot" className="text-link">
              Open the pilot form
            </Link>
          </section>

          <section>
            <h2>Important submission note</h2>
            <p>
              Do not submit patient information, protected health information, or
              confidential clinical data through the public pilot form.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
