"use client";

import { useSearchParams } from "next/navigation";
import PaymentInstructions from "@/components/PaymentInstructions";

export default function FinanceSuccessClient() {
  const params = useSearchParams();

  const paybill = params.get("paybill") || "XXXXXXX";
  const account = params.get("account") || "VIS/GENERAL";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Thank you for your contribution
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Your submission has been received and is pending finance office confirmation.
          </p>
        </section>

        <PaymentInstructions paybill={paybill} account={account} />
      </div>
    </main>
  );
}