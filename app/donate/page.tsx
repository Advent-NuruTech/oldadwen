export default function DonatePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-xl bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Support Old SDA Organization
        </h1>

        <p className="text-gray-600 leading-relaxed mb-6">
          Your support enables gospel outreach, media evangelism,
          and mission work. May God bless you for partnering with us.
        </p>

        <a
          href="https://www.paypal.me/pondezedd@gmail.com"
          target="_blank"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-lg transition"
        >
          Donate via PayPal
        </a>

        <p className="text-sm text-gray-500 mt-6">
          Secure payment handled by PayPal
        </p>
      </div>
    </main>
  );
}
