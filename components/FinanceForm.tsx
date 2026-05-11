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

  // Only show structure selector for members
  const showStructureSelector = donorType === "member";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Church structure - ONLY for members */}
      {showStructureSelector && (
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
      )}

      {/* Contribution Type Section */}
      <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 text-base sm:text-lg">Contribution Type</h3>

        <select
          value={value.categoryId || ""}
          onChange={(event) => {
            const categoryId = event.target.value;
            const category = orderedCategories.find((entry) => entry.id === categoryId);
            onChange({ categoryId, type: category?.type, donorType });
          }}
          className="w-full mt-3 border border-slate-300 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            placeholder="Purpose "
            value={value.purpose || ""}
            onChange={(event) => onChange({ purpose: event.target.value, donorType })}
            className="w-full mt-3 border border-slate-300 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        )}
      </section>

      {/* Amount Section */}
      <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 text-base sm:text-lg">Amount (required)</h3>

        <input
          type="number"
          min={1}
          value={value.amount ? String(value.amount) : ""}
          onChange={(event) => onChange({ amount: Number(event.target.value), donorType })}
          className="w-full mt-3 border border-slate-300 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter amount"
        />
      </section>

      {/* Personal Details Section - Always visible with responsive grid */}
      <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 text-base sm:text-lg mb-3">Personal Details (.)</h3>

        {/* Improved responsive grid - always shows inputs properly */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium text-slate-700">Full Name</label>
            <input
              placeholder="Enter your name"
              value={value.name || ""}
              onChange={(event) => onChange({ name: event.target.value, donorType })}
              className="w-full border border-slate-300 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium text-slate-700">Phone Number</label>
            <input
              placeholder="Enter your phone"
              value={value.phone || ""}
              onChange={(event) => onChange({ phone: event.target.value, donorType })}
              className="w-full border border-slate-300 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={value.email || ""}
              onChange={(event) => onChange({ email: event.target.value, donorType })}
              className="w-full border border-slate-300 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs sm:text-sm font-medium text-slate-700">Message (Optional)</label>
            <textarea
              placeholder="Write your message here..."
              value={value.message || ""}
              onChange={(event) => onChange({ message: event.target.value, donorType })}
              rows={3}
              className="w-full border border-slate-300 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
            />
          </div>
        </div>
      </section>
    </div>
  );
}