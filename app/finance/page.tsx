"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import CampaignBanner from "@/components/CampaignBanner";
import FinanceForm, { FinanceFormSubmitPayload } from "@/components/FinanceForm";
import { useFinanceRealtimeData } from "@/hooks/useFinanceRealtimeData";
import { db } from "@/lib/firebase";

export default function FinancePage() {
  const router = useRouter();

  const { conferences, regions, churches, categories, loading, error } =
    useFinanceRealtimeData();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  const activeCampaigns = useMemo(() => {
    return categories
      .filter((c) => c.isActive && c.isPublic && c.type === "campaign")
      .sort((a, b) => a.priority - b.priority);
  }, [categories]);

  const visibleCategories = useMemo(() => {
    return categories
      .filter((c) => c.isActive && c.isPublic)
      .sort((a, b) => a.priority - b.priority);
  }, [categories]);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  /* FINAL SUBMIT */
  const submitFinal = async () => {
    setSubmitting(true);

    try {
      await addDoc(collection(db, "finance_transactions"), {
        ...formData,
        status: "pending",
        source: "online",
        createdAt: serverTimestamp(),
      });

      router.push("/finance/success");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white px-4 pt-24 pb-10">

      <div className="mx-auto max-w-5xl space-y-8">

        {/* HEADER */}
        <header className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-xl">
          <h1 className="text-3xl font-bold">
            Church <span className="text-cyan-400">Finance Portal</span>
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Real-time giving for tithes, offerings, and donations.
          </p>
        </header>

        {/* CAMPAIGN BANNER */}
        <CampaignBanner campaigns={activeCampaigns} />

        {/* LOADING */}
        {loading && <p className="text-sm text-slate-400">Loading...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        {/* WIZARD */}
        {!loading && !error && visibleCategories.length > 0 && (

          <div className="space-y-6">

            {/* STEP INDICATOR */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded-full ${
                    step >= s ? "bg-cyan-500" : "bg-white/10"
                  }`}
                />
              ))}
            </div>

            {/* STEPS */}
            <AnimatePresence mode="wait">

              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  className="bg-[#0B1220] border border-white/10 rounded-2xl p-6"
                >
                  <FinanceForm
                    conferences={conferences}
                    regions={regions}
                    churches={churches}
                    categories={visibleCategories}
                    onSubmit={async (data: FinanceFormSubmitPayload) => {
                      setFormData(data);
                    }}
                    submitting={submitting}
                  />

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={next}
                      className="bg-cyan-500 px-5 py-2 rounded-lg"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 - REVIEW */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  className="bg-[#0B1220] border border-white/10 rounded-2xl p-6"
                >
                  <h2 className="text-xl font-bold">Review Details</h2>

                  <pre className="text-sm text-slate-300 mt-4">
                    {JSON.stringify(formData, null, 2)}
                  </pre>

                  <div className="flex justify-between mt-6">
                    <button onClick={prev}>Back</button>
                    <button onClick={next} className="bg-cyan-500 px-5 py-2 rounded-lg">
                      Confirm
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 - PAYMENT */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  className="bg-[#0B1220] border border-white/10 rounded-2xl p-6"
                >
                  <h2 className="text-xl font-bold">Payment Details</h2>

                  <p className="text-slate-400 mt-3">
                    Pay via M-Pesa Paybill (details shown here)
                  </p>

                  <button className="mt-4 w-full py-3 bg-cyan-500 rounded-lg">
                    Mark as Paid
                  </button>

                  <div className="flex justify-between mt-6">
                    <button onClick={prev}>Back</button>
                    <button onClick={next} className="border px-5 py-2 rounded-lg">
                      Next
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4 - FINAL */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 text-center"
                >
                  <h2 className="text-xl font-bold">Final Submission</h2>

                  <p className="text-slate-400 mt-3">
                    Submit your transaction for confirmation
                  </p>

                  <button
                    onClick={submitFinal}
                    className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-xl"
                  >
                    Submit
                  </button>

                  <button onClick={prev} className="mt-3 text-sm text-slate-400">
                    Go Back
                  </button>
                </motion.div>
              )}

            </AnimatePresence>

          </div>
        )}

      </div>
    </div>
  );
}