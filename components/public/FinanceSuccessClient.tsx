"use client";

import PaymentInstructions from "@/components/PaymentInstructions";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";

export default function FinanceSuccessClient() {
  const { methods, loading, error } = usePaymentMethods({ activeOnly: true });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Thank you for your contribution</h1>
          <p className="mt-2 text-sm text-slate-600">
            Your submission has been received and is pending finance office confirmation.
          </p>
        </section>

        {loading && <p className="text-sm text-slate-600">Loading payment methods...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && <PaymentInstructions methods={methods} />}
      </div>
    </main>
  );
}
