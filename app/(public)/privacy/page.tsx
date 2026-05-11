"use client";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0b1220] to-[#020617] px-6 py-24 text-white">

      <section className="max-w-5xl mx-auto space-y-14">

        {/* TITLE */}
        <header className="text-center md:text-left space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Privacy Policy
          </h1>

          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full mx-auto md:mx-0" />

          <p className="text-blue-200 text-lg max-w-3xl">
            Old Seventh Day Adventists is committed to respecting your privacy and handling your information with integrity, transparency, and care.
          </p>
        </header>

        {/* SECTION */}
        <Block title="Information We Do Not Collect">
          Our services are designed to function without collecting personal identification data by default.
          We do not intentionally collect or store IP tracking data, behavioral profiling, or unnecessary personal identifiers for visitors browsing our platform.
        </Block>

        {/* SECTION */}
        <Block title="Voluntarily Provided Information">
          You may choose to provide limited personal information when:
          <ul className="list-disc pl-6 mt-3 space-y-1 text-blue-100">
            <li>Submitting a prayer request</li>
            <li>Contacting us via email</li>
            <li>Requesting follow-up communication</li>
          </ul>

          <p className="mt-3">
            This information is used only for ministry communication and support purposes.
          </p>
        </Block>

        {/* SECTION */}
        <Block title="Donations and Payments">
          We use third-party payment processors such as PayPal. We do not store or process payment card details.

          <p className="mt-3 text-blue-100">
            All payment data is handled securely by PayPal under their privacy policy.
          </p>

          <a
            href="https://www.paypal.com/privacy"
            target="_blank"
            className="inline-block mt-3 text-cyan-300 hover:underline font-semibold"
          >
            View PayPal Privacy Policy →
          </a>
        </Block>

        {/* SECTION */}
        <Block title="How Information Is Used">
          Any information you voluntarily provide is strictly used for communication, prayer support, and ministry-related purposes.
          It is never sold, rented, or shared for commercial gain.
        </Block>

        {/* SECTION */}
        <Block title="Data Security">
          We apply reasonable safeguards to protect information you share.
          However, no digital system is completely risk-free, and users acknowledge this limitation when using online services.
        </Block>

        {/* SECTION */}
        <Block title="Changes to This Policy">
          This Privacy Policy may be updated periodically to reflect improvements or operational changes.
          Users are encouraged to review this page occasionally.
        </Block>

        {/* CONTACT */}
        <div className="bg-white/5 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
          <p className="text-blue-200">
            For questions regarding this Privacy Policy, contact us at:
          </p>
          <p className="mt-3 font-semibold text-cyan-300">
            gspublicationsmissions@gmail.com
          </p>
        </div>

      </section>
    </main>
  );
}

/* ================= REUSABLE BLOCK ================= */
function Block({ title, children }: any) {
  return (
    <section className="bg-white/5 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-md space-y-3">

      <h2 className="text-2xl font-bold text-white">
        {title}
      </h2>

      <div className="text-blue-100 leading-relaxed">
        {children}
      </div>

    </section>
  );
}