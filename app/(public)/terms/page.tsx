"use client";

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0b1220] to-[#020617] text-white px-6 py-16">

      <section className="max-w-6xl mx-auto space-y-14">

        {/* TITLE */}
        <header className="text-center md:text-left space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Terms of Use
          </h1>

          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full mx-auto md:mx-0" />

          <p className="text-blue-200 text-lg max-w-3xl">
            Welcome to{" "}
            <span className="text-cyan-300 font-semibold">
              Old Seventh Day Adventists
            </span>
            . By accessing our platform, you agree to these Terms of Use.
            If you do not agree, discontinue use immediately.
          </p>
        </header>

        {/* SECTIONS */}
        <div className="space-y-6">

          <Block title="1. Acceptance of Terms">
            By using this platform, you confirm that you have read and agree
            to these Terms. They apply to all visitors, users, and participants.
            If you do not agree, you must not use the platform.
          </Block>

          <Block title="2. Definitions">
            <ul className="list-disc pl-6 space-y-2 text-blue-100">
              <li><b>We / Us / Our</b> — Old Seventh Day Adventists ministry and affiliates.</li>
              <li><b>Platform</b> — Website, apps, digital resources, and services.</li>
              <li><b>Content</b> — All teachings, media, documents, and materials.</li>
              <li><b>User</b> — Any individual accessing or using the platform.</li>
              <li><b>User Content</b> — Any submissions such as messages or forms.</li>
            </ul>
          </Block>

          <Block title="3. Purpose of Content">
            All content is provided for spiritual, educational, and informational
            purposes only. It is not medical, legal, or professional advice.
          </Block>

          <Block title="4. Spiritual Responsibility">
            Users are encouraged to study and discern teachings responsibly.
            Agreement is not required to access content.
          </Block>

          <Block title="5. Intellectual Property">
            All original materials are protected by copyright and may not be
            reused commercially without permission. Educational sharing with
            attribution is allowed.
          </Block>

          <Block title="6. User Conduct">
            <ul className="list-disc pl-6 space-y-2 text-blue-100">
              <li>Use the platform respectfully and lawfully</li>
              <li>Do not impersonate or harm others</li>
              <li>Do not attempt unauthorized access</li>
              <li>Do not misuse content or systems</li>
            </ul>
          </Block>

          <Block title="7. User Content">
            By submitting content, you grant us permission to use it for ministry
            purposes. We may remove content that is harmful or inappropriate.
          </Block>

          <Block title="8. AI & Automated Services">
            Some tools may use automation or AI systems. These support learning
            but do not replace personal judgment or spiritual discernment.
          </Block>

          <Block title="9. Donations">
            Donations are voluntary and support ministry work. They are generally
            non-refundable and do not guarantee outcomes.
          </Block>

          <Block title="10. External Links">
            We are not responsible for third-party websites or their content,
            policies, or services.
          </Block>

          <Block title="11. Limitation of Liability">
            We are not liable for any damages arising from the use of this platform
            or reliance on its content.
          </Block>

          <Block title="12. Indemnification">
            You agree to protect and hold harmless the ministry, staff, and affiliates
            from claims arising from misuse of the platform.
          </Block>

          <Block title="13. Changes to Terms">
            These Terms may be updated at any time. Continued use means acceptance
            of updated Terms.
          </Block>

          <Block title="14. Governing Law">
            These Terms are governed by applicable laws and legal frameworks.
          </Block>

          {/* CONTACT */}
          <div className="bg-white/5 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-2xl font-bold mb-2">Contact</h2>
            <p className="text-blue-200">
              For questions about these Terms, contact:
            </p>
            <p className="mt-3 text-cyan-300 font-semibold">
              gspublicationsmissions@gmail.com
            </p>
          </div>

        </div>

      </section>
    </main>
  );
}

/* ================= BLOCK COMPONENT ================= */
function Block({ title, children }: any) {
  return (
    <section className="bg-white/5 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-md space-y-3">

      <h2 className="text-xl md:text-2xl font-bold text-white">
        {title}
      </h2>

      <div className="text-blue-100 leading-relaxed">
        {children}
      </div>

    </section>
  );
}