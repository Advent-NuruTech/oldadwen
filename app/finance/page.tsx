"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CampaignBanner from "@/components/CampaignBanner";
import FinanceForm, { FinanceFormSubmitPayload } from "@/components/FinanceForm";
import { useFinanceRealtimeData } from "@/hooks/useFinanceRealtimeData";
import { db } from "@/lib/firebase";

export default function FinancePage() {
  const router = useRouter();
  const { conferences, regions, churches, categories, loading, error } = useFinanceRealtimeData();
  const [submitting, setSubmitting] = useState(false);

  const activeCampaigns = useMemo(() => {
    return categories
      .filter((category) => category.isActive && category.isPublic && category.type === "campaign")
      .sort((a, b) => a.priority - b.priority);
  }, [categories]);

  const visibleCategories = useMemo(() => {
    return categories
      .filter((category) => category.isActive && category.isPublic)
      .sort((a, b) => a.priority - b.priority);
  }, [categories]);

  const onSubmit = async (payload: FinanceFormSubmitPayload) => {
    setSubmitting(true);

    try {
      await addDoc(collection(db, "finance_transactions"), {
        amount: payload.amount,
        type: payload.type,
        categoryId: payload.categoryId,
        purpose: payload.purpose || null,
        conferenceId: payload.conferenceId || null,
        regionId: payload.regionId || null,
        churchId: payload.churchId || null,
        donorType: payload.donorType,
        name: payload.name || null,
        phone: payload.phone || null,
        email: payload.email || null,
        message: payload.message || null,
        status: "pending",
        source: "online",
        createdAt: serverTimestamp(),
      });

      const category = categories.find((item) => item.id === payload.categoryId);
      const church = churches.find((item) => item.id === payload.churchId);

      const paybill = process.env.NEXT_PUBLIC_CHURCH_PAYBILL || "XXXXXXX";
      const account = `${church?.code || "VIS"}/${(category?.title || payload.type).toUpperCase().slice(0, 12)}`;

      router.push(`/finance/success?paybill=${encodeURIComponent(paybill)}&account=${encodeURIComponent(account)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Church Finance Portal</h1>
          <p className="mt-2 text-sm text-slate-600">
            Real-time giving for tithes, offerings, donations, and campaigns.
          </p>
        </header>

        <CampaignBanner campaigns={activeCampaigns} />

        {loading && <p className="text-sm text-slate-600">Loading finance setup...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && visibleCategories.length > 0 && (
          <FinanceForm
            conferences={conferences}
            regions={regions}
            churches={churches}
            categories={visibleCategories}
            onSubmit={onSubmit}
            submitting={submitting}
          />
        )}

        {!loading && !error && visibleCategories.length === 0 && (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            Finance categories are not yet active. Please check again later.
          </section>
        )}
      </div>
    </div>
  );
}
