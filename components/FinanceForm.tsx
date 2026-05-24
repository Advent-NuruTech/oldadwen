"use client";

import { useMemo } from "react";

import StructureSelector from "@/components/StructureSelector";
import {
  ChurchRecord,
  ConferenceRecord,
  FinanceCategoryRecord,
  RegionRecord,
} from "@/lib/financeTypes";

export interface FinanceFormSubmitPayload {
  selectedCategoryIds?: string[];
  categoryAmounts?: Record<string, number>;
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

  const selectedCategoryIds = value.selectedCategoryIds || [];
  const categoryAmounts = value.categoryAmounts || {};

  const selectedCategories = orderedCategories.filter((entry) => selectedCategoryIds.includes(entry.id));
  const totalAmount = selectedCategories.reduce((sum, category) => {
    const amount = categoryAmounts[category.id];
    return sum + (typeof amount === "number" && Number.isFinite(amount) ? amount : 0);
  }, 0);

  const toggleCategory = (categoryId: string) => {
    const selected = selectedCategoryIds.includes(categoryId);
    const nextIds = selected
      ? selectedCategoryIds.filter((id) => id !== categoryId)
      : [...selectedCategoryIds, categoryId];
    const nextAmounts = { ...categoryAmounts };

    if (selected) {
      delete nextAmounts[categoryId];
    }

    onChange({ selectedCategoryIds: nextIds, categoryAmounts: nextAmounts, donorType });
  };

  const updateCategoryAmount = (categoryId: string, rawValue: string) => {
    const nextAmounts = { ...categoryAmounts };
    if (!rawValue.trim()) {
      delete nextAmounts[categoryId];
      onChange({ categoryAmounts: nextAmounts, donorType });
      return;
    }

    const amount = Number(rawValue);
    if (!Number.isFinite(amount)) {
      return;
    }

    nextAmounts[categoryId] = amount;
    onChange({ categoryAmounts: nextAmounts, donorType });
  };

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

      <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <h3 className="font-semibold text-slate-900 text-base sm:text-lg">Choose Categories and Enter Amounts</h3>
          <p className="text-xs text-slate-500">Check one or more categories, then type the amount for each selected category.</p>
        </div>

        <div className="mt-4 space-y-3">
          {orderedCategories.map((category) => {
            const selected = selectedCategoryIds.includes(category.id);

            return (
              <div key={category.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleCategory(category.id)}
                      className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{category.title}</p>
                      {category.description && <p className="text-xs text-slate-500 truncate">{category.description}</p>}
                    </div>
                  </label>

                  <span className="rounded-full bg-slate-200 px-2 py-1 text-xs uppercase text-slate-700">{category.type}</span>
                </div>

                {selected && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-[1fr_170px] gap-3">
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={categoryAmounts[category.id] !== undefined ? String(categoryAmounts[category.id]) : ""}
                      onChange={(event) => updateCategoryAmount(category.id, event.target.value)}
                      placeholder={`Enter amount for ${category.title}`}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    />
                    <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
                      <p className="font-medium text-slate-900">Entered</p>
                      <p>
                        {typeof categoryAmounts[category.id] === "number" && Number.isFinite(categoryAmounts[category.id])
                          ? `KES ${categoryAmounts[category.id].toLocaleString("en-KE")}`
                          : "Not entered yet"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedCategories.length > 0 && (
          <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Contribution summary</p>
            <div className="mt-3 space-y-2">
              {selectedCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between text-sm text-slate-700">
                  <span>{category.title}</span>
                  <span>
                    {typeof categoryAmounts[category.id] === "number" && Number.isFinite(categoryAmounts[category.id])
                      ? `KES ${categoryAmounts[category.id].toLocaleString("en-KE")}`
                      : "Not entered yet"}
                  </span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-3 text-sm font-semibold text-slate-900 flex items-center justify-between">
                <span>Total</span>
                <span>KES {totalAmount.toLocaleString("en-KE")}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700">Purpose (optional)</label>
          <textarea
            placeholder="Optional note (example: camp meeting support)"
            value={value.purpose || ""}
            onChange={(event) => onChange({ purpose: event.target.value, donorType })}
            rows={3}
            className="w-full mt-3 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
          />
        </div>
      </section>


      {/* Personal Details Section - Always visible with responsive grid */}
      <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 text-base sm:text-lg mb-3">Your Details</h3>

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
