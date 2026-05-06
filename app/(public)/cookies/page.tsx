"use client";

export default function CookiesPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#1F1A16] px-6 py-12">
      <section className="max-w-5xl mx-auto space-y-12">

        {/* Title */}
        <header className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-[#F6F1EA]">
            Cookies Policy
          </h1>
          <p className="text-lg text-gray-700 dark:text-[#D8C9B4] max-w-3xl mx-auto md:mx-0">
            This Cookies Policy explains how Old SDA Organization uses cookies to enhance your experience.
          </p>
        </header>

        {/* Content Sections */}
        <div className="space-y-8">

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#F6F1EA]">What Are Cookies</h2>
            <p className="text-gray-700 dark:text-[#D8C9B4]">
              Cookies are small text files stored on your device to help websites function efficiently and remember preferences.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#F6F1EA]">How We Use Cookies</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-[#D8C9B4] space-y-1">
              <li>Improve site performance</li>
              <li>Understand visitor interactions</li>
              <li>Maintain secure and reliable services</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#F6F1EA]">Managing Cookies</h2>
            <p className="text-gray-700 dark:text-[#D8C9B4]">
              You can control or disable cookies through your browser settings. Disabling cookies may affect site functionality.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#F6F1EA]">Policy Updates</h2>
            <p className="text-gray-700 dark:text-[#D8C9B4]">
              This policy may be updated as technology or regulations change.
            </p>
          </section>

        </div>
      </section>
    </main>
  );
}
