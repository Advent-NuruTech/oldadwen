"use client";

import PaymentInstructions from "@/components/PaymentInstructions";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";

export default function FinanceSuccessClient() {
  const { methods, loading, error } = usePaymentMethods({ activeOnly: true });

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed relative px-4 pt-24 pb-10 sm:px-6 lg:px-10"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/dg7jxs7st/image/upload/v1777989764/nature2_ojkjf7.jpg')",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative z-10 mx-auto max-w-2xl space-y-6">
        {/* Success Card */}
        
        {/* Loading State */}
        {loading && (
          <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-6 text-center shadow-lg">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
            <p className="mt-3 text-slate-700 text-base">
              Loading payment methods...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-2xl bg-red-500/10 backdrop-blur-sm border border-red-500/30 p-6 shadow-lg">
            <p className="text-red-700 text-base">{error}</p>
          </div>
        )}

        {/* Payment Instructions */}
        {!loading && !error && (
          <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-6 md:p-8 shadow-xl border border-white/20">
            <PaymentInstructions methods={methods} />
          </div>
        )}


        <section className="rounded-2xl bg-white/95 backdrop-blur-sm p-6 md:p-8 shadow-xl border border-white/20">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Thank you for your contribution
          </h1>

          <p className="mt-2 text-base md:text-lg text-slate-700">
            Your submission has been received and is pending finance office confirmation.
          </p>

          <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 md:p-5">
            <p className="text-slate-800 leading-relaxed text-base md:text-lg">
              Your generosity helps us continue our mission and serve the community.
              <br />
              A confirmation email has been sent to your provided email address.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}