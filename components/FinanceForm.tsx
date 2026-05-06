"use client";

import { useMemo } from "react";

import StructureSelector from "@/components/StructureSelector";
import {
  ChurchRecord,
  ConferenceRecord,
  FinanceCategoryRecord,
  FinanceType,
  RegionRecord,
} from "@/lib/financeTypes";

export interface FinanceFormSubmitPayload {
  amount: number;
  categoryId: string;
  type?: FinanceType;
  purpose?: string;

  conferenceId?: string;
  regionId?: string;
  churchId?: string;
  donorType: "member" | "visitor";

  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

interface FinanceFormProps {
  conferences: ConferenceRecord[];
  regions: RegionRecord[];
  churches: ChurchRecord[];
  categories: FinanceCategoryRecord[];
  donorType: "member" | "visitor";
  value: Partial<FinanceFormSubmitPayload>;
  onChange: (patch: Partial<FinanceFormSubmitPayload>) => void;
}

export default function FinanceForm({
  conferences,
  regions,
  churches,
  categories,
  donorType,
  value,
  onChange,
}: FinanceFormProps) {
  const filteredRegions = useMemo(
    () => regions.filter((entry) => entry.conferenceId === (value.conferenceId || "")),
    [regions, value.conferenceId],
  );

  const filteredChurches = useMemo(
    () => churches.filter((entry) => entry.regionId === (value.regionId || "") && entry.isActive),
    [churches, value.regionId],
  );

  const orderedCategories = useMemo(
    () =>
      [...categories]
        .filter((entry) => entry.isActive && entry.isPublic)
        .sort((a, b) => {
          if (a.type === "campaign" && b.type !== "campaign") return -1;
          if (a.type !== "campaign" && b.type === "campaign") return 1;
          return a.priority - b.priority;
        }),
    [categories],
  );

  const selectedCategory = orderedCategories.find((entry) => entry.id === value.categoryId);

  return (
    <div className="space-y-6">
      <StructureSelector
        conferences={conferences}
        regions={filteredRegions}
        churches={filteredChurches}
        conferenceId={value.conferenceId || ""}
        regionId={value.regionId || ""}
        churchId={value.churchId || ""}
        donorType={donorType}
        onConferenceChange={(conferenceId) => onChange({ conferenceId, regionId: "", churchId: "", donorType })}
        onRegionChange={(regionId) => onChange({ regionId, churchId: "", donorType })}
        onChurchChange={(churchId) => onChange({ churchId, donorType })}
      />

      <section className="bg-white rounded-2xl p-5 border border-slate-200">
        <h3 className="font-semibold text-slate-900">Contribution Type</h3>

        <select
          value={value.categoryId || ""}
          onChange={(event) => {
            const categoryId = event.target.value;
            const category = orderedCategories.find((entry) => entry.id === categoryId);
            onChange({ categoryId, type: category?.type, donorType });
          }}
          className="w-full mt-3 border rounded-lg p-2"
        >
          <option value="">Select Type</option>
          {orderedCategories.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.title}
            </option>
          ))}
        </select>

        {(selectedCategory?.type === "campaign" || selectedCategory?.type === "donation") && (
          <input
            placeholder="Purpose (optional)"
            value={value.purpose || ""}
            onChange={(event) => onChange({ purpose: event.target.value, donorType })}
            className="w-full mt-3 border rounded-lg p-2"
          />
        )}
      </section>

      <section className="bg-white rounded-2xl p-5 border border-slate-200">
        <h3 className="font-semibold text-slate-900">Amount (required)</h3>

        <input
          type="number"
          min={1}
          value={value.amount ? String(value.amount) : ""}
          onChange={(event) => onChange({ amount: Number(event.target.value), donorType })}
          className="w-full mt-3 border rounded-lg p-2"
          placeholder="Enter amount"
        />
      </section>

      <section className="bg-white rounded-2xl p-5 border border-slate-200">
        <h3 className="font-semibold text-slate-900">Personal Details (optional)</h3>

        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <input
            placeholder="Name"
            value={value.name || ""}
            onChange={(event) => onChange({ name: event.target.value, donorType })}
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="Phone"
            value={value.phone || ""}
            onChange={(event) => onChange({ phone: event.target.value, donorType })}
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="Email"
            value={value.email || ""}
            onChange={(event) => onChange({ email: event.target.value, donorType })}
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="Message"
            value={value.message || ""}
            onChange={(event) => onChange({ message: event.target.value, donorType })}
            className="border p-2 rounded-lg"
          />
        </div>
      </section>
    </div>
  );
}
