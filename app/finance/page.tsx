"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ReactNode, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import FinanceForm, { FinanceFormSubmitPayload } from "@/components/FinanceForm";
import { useFinanceRealtimeData } from "@/hooks/useFinanceRealtimeData";
import { db } from "@/lib/firebase";

const TOTAL_STEPS = 7;

export default function FinancePage() {
  const router = useRouter();
  const { conferences, regions, churches, categories, loading, error } = useFinanceRealtimeData({
    includeTransactions: false,
    includeReceipts: false,
  });

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FinanceFormSubmitPayload>>({
    donorType: undefined,
  });

  const selectedCategory = useMemo(
    () => categories.find((entry) => entry.id === formData.categoryId),
    [categories, formData.categoryId],
  );

  const selectedChurch = useMemo(
    () => churches.find((entry) => entry.id === formData.churchId),
    [churches, formData.churchId],
  );

  const stepLabel = useMemo(() => {
    if (step === 1) return "Welcome";
    if (step === 2) return "Donor Type";
    if (step === 3) return "Contribution Form";
    if (step === 4) return "Amount";
    if (step === 5) return "Personal Details";
    if (step === 6) return "Church Details";
    return "Final Review";
  }, [step]);

  const onFormChange = (patch: Partial<FinanceFormSubmitPayload>) => {
    setStepError(null);
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const canProceedFromStep = (currentStep: number): boolean => {
    if (currentStep !== 3) return true;

    if (!formData.categoryId) {
      setStepError("Select contribution type to continue.");
      return false;
    }

    if (!formData.amount || formData.amount <= 0) {
      setStepError("Enter a valid amount to continue.");
      return false;
    }

    return true;
  };

  const nextStep = () => {
    setStepError(null);
    if (!canProceedFromStep(step)) return;

    setStep((current) => {
      if (current === 5 && formData.donorType === "visitor") return 7;
      return Math.min(TOTAL_STEPS, current + 1);
    });
  };

  const previousStep = () => {
    setStepError(null);
    setStep((current) => {
      if (current === 7 && formData.donorType === "visitor") return 5;
      return Math.max(1, current - 1);
    });
  };

  const chooseDonorType = (donorType: "member" | "visitor") => {
    setStepError(null);
    setFormData((prev) => ({
      ...prev,
      donorType,
      conferenceId: donorType === "visitor" ? undefined : prev.conferenceId,
      regionId: donorType === "visitor" ? undefined : prev.regionId,
      churchId: donorType === "visitor" ? undefined : prev.churchId,
    }));
    setStep(3);
  };

  const submitFinal = async () => {
    if (!formData.donorType || !formData.categoryId || !formData.amount || formData.amount <= 0) {
      setStepError("Amount and contribution type are required before submit.");
      return;
    }

    setSubmitting(true);
    setStepError(null);

    try {
      const payload = {
        amount: formData.amount,
        categoryId: formData.categoryId,
        type: formData.type || selectedCategory?.type || "donation",
        purpose: formData.purpose || null,
        conferenceId: formData.donorType === "member" ? formData.conferenceId || null : null,
        regionId: formData.donorType === "member" ? formData.regionId || null : null,
        churchId: formData.donorType === "member" ? formData.churchId || null : null,
        donorType: formData.donorType,
        name: formData.name || null,
        phone: formData.phone || null,
        email: formData.email || null,
        message: formData.message || null,
        status: "pending",
        source: "online",
        createdAt: serverTimestamp(),
      };

      const transactionRef = await addDoc(collection(db, "finance_transactions"), payload);

      await addDoc(collection(db, "notifications"), {
        transactionId: transactionRef.id,
        donorName: payload.name || null,
        amount: payload.amount,
        categoryId: payload.categoryId,
        type: payload.type,
        status: "unread",
        createdAt: serverTimestamp(),
      });

      router.push("/finance/success");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Failed to submit contribution.";
      setStepError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen text-white bg-cover bg-center bg-fixed relative pt-28 pb-16 px-4"
      style={{ backgroundImage: "url('/images/nature1.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative max-w-5xl mx-auto space-y-8 z-10">
        <header className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-6 sticky top-0 z-40">
          <h1 className="text-3xl font-bold">
            Church <span className="text-cyan-400">Finance Portal</span>
          </h1>
          <p className="text-slate-300 text-sm mt-2">Transparent giving system for tithes, offerings, and donations.</p>
        </header>

        {loading && <p className="text-slate-300">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Step {step} of {TOTAL_STEPS}</span>
                <span>{stepLabel}</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((entry) => (
                  <div key={entry} className={`h-2 flex-1 rounded-full ${step >= entry ? "bg-cyan-500" : "bg-white/10"}`} />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <Card title="Welcome">
                  <p className="text-lg text-slate-200">Welcome to the Church Finance System. All contributions are recorded transparently.</p>
                  <Next onClick={nextStep} />
                </Card>
              )}

              {step === 2 && (
                <Card title="Are you a Member or Visitor?">
                  <div className="flex flex-wrap gap-4">
                    <ActionBtn onClick={() => chooseDonorType("member")}>Member</ActionBtn>
                    <ActionBtn onClick={() => chooseDonorType("visitor")}>Visitor</ActionBtn>
                  </div>
                  <div className="mt-6">
                    <Back onClick={previousStep} />
                  </div>
                </Card>
              )}

              {step === 3 && formData.donorType && (
                <Card title="Contribution Form">
                  <FinanceForm
                    conferences={conferences}
                    regions={regions}
                    churches={churches}
                    categories={categories}
                    donorType={formData.donorType}
                    value={formData}
                    onChange={onFormChange}
                  />

                  <div className="flex justify-between mt-6">
                    <Back onClick={previousStep} />
                    <Next onClick={nextStep} />
                  </div>
                </Card>
              )}

              {step === 4 && (
                <Card title="Confirm Amount">
                  <p className="text-3xl font-bold text-cyan-400">KES {(formData.amount || 0).toLocaleString("en-KE")}</p>
                  <div className="flex justify-between mt-6">
                    <Back onClick={previousStep} />
                    <Next onClick={nextStep} />
                  </div>
                </Card>
              )}

              {step === 5 && (
                <Card title="Personal Details">
                  <div className="space-y-2 text-slate-200">
                    <p>Name: {formData.name || "-"}</p>
                    <p>Phone: {formData.phone || "-"}</p>
                    <p>Email: {formData.email || "-"}</p>
                    <p>Type: {formData.donorType || "-"}</p>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Back onClick={previousStep} />
                    <Next onClick={nextStep} />
                  </div>
                </Card>
              )}

              {step === 6 && formData.donorType === "member" && (
                <Card title="Church Details">
                  <div className="space-y-2 text-slate-200">
                    <p>Church: {selectedChurch?.name || "Not selected"}</p>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Back onClick={previousStep} />
                    <Next onClick={nextStep} />
                  </div>
                </Card>
              )}

              {step === 7 && (
                <Card title="Final Review">
                  <div className="space-y-3 text-slate-200 text-sm">
                    <p>
                      Confirm the paying of {selectedCategory?.title?.toLowerCase() || "contribution"} of amount KES{" "}
                      {(formData.amount || 0).toLocaleString("en-KE")} to OLD SDA Organization.
                    </p>
                    <p className="font-semibold">Your details</p>
                    <p>Name: {formData.name || "-"}</p>
                    <p>Phone: {formData.phone || "-"}</p>
                    <p>Email: {formData.email || "-"}</p>
                    <p>Church: {formData.donorType === "visitor" ? "Visitor / Other" : selectedChurch?.name || "-"}</p>
                    <p>Amount: KES {(formData.amount || 0).toLocaleString("en-KE")}</p>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Back onClick={previousStep} />
                    <button
                      type="button"
                      onClick={submitFinal}
                      disabled={submitting}
                      className="bg-cyan-500 px-6 py-2 rounded-lg disabled:opacity-60"
                    >
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </Card>
              )}
            </AnimatePresence>

            {stepError && <p className="text-red-300 text-sm">{stepError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-6"
    >
      <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
      {children}
    </motion.div>
  );
}

function Next({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="bg-cyan-500 text-white px-5 py-2 rounded-lg mt-6">
      Next
    </button>
  );
}

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-slate-300">
      Back
    </button>
  );
}

function ActionBtn({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="bg-white text-black px-5 py-2 rounded-lg">
      {children}
    </button>
  );
}
