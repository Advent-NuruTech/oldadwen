"use client";

import { useMemo, useState } from "react";

import StructureSelector from "@/components/StructureSelector";
import { ChurchRecord, ConferenceRecord, FinanceCategoryRecord, FinanceType, RegionRecord } from "@/lib/financeTypes";

export interface FinanceFormSubmitPayload {
  amount: number;
  categoryId: string;
  type: FinanceType;
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
  onSubmit: (payload: FinanceFormSubmitPayload) => Promise<void>;
  submitting?: boolean;
}

export default function FinanceForm({
  conferences,
  regions,
  churches,
  categories,
  onSubmit,
  submitting = false,
}: FinanceFormProps) {
  const [conferenceId, setConferenceId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [churchId, setChurchId] = useState("");
  const [isVisitor, setIsVisitor] = useState(false);

  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const filteredRegions = useMemo(
    () => regions.filter((region) => region.conferenceId === conferenceId),
    [regions, conferenceId],
  );

  const filteredChurches = useMemo(
    () => churches.filter((church) => church.regionId === regionId && church.isActive),
    [churches, regionId],
  );

  const orderedCategories = useMemo(() => {
    return [...categories]
      .filter((category) => category.isActive && category.isPublic)
      .sort((a, b) => {
        if (a.type === "campaign" && b.type !== "campaign") return -1;
        if (a.type !== "campaign" && b.type === "campaign") return 1;
        return a.priority - b.priority;
      });
  }, [categories]);

  const selectedCategory = orderedCategories.find((category) => category.id === categoryId);

  const handleConferenceChange = (value: string) => {
    setConferenceId(value);
    setRegionId("");
    setChurchId("");
  };

  const handleRegionChange = (value: string) => {
    setRegionId(value);
    setChurchId("");
  };

  const handleVisitorToggle = (value: boolean) => {
    setIsVisitor(value);
    if (value) {
      setConferenceId("");
      setRegionId("");
      setChurchId("");
    }
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (!categoryId || !selectedCategory) {
      setError("Select a contribution type.");
      return;
    }

    if (!isVisitor && (!conferenceId || !regionId || !churchId)) {
      setError("Please select conference, region, and church.");
      return;
    }

    await onSubmit({
      amount: numericAmount,
      categoryId,
      type: selectedCategory.type,
      purpose: purpose.trim() || undefined,
      conferenceId: isVisitor ? undefined : conferenceId,
      regionId: isVisitor ? undefined : regionId,
      churchId: isVisitor ? undefined : churchId,
      donorType: isVisitor ? "visitor" : "member",
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      message: message.trim() || undefined,
    });
  };

  return (
    <form onSubmit={submitForm} className="space-y-5">
      <StructureSelector
        conferences={conferences}
        regions={filteredRegions}
        churches={filteredChurches}
        conferenceId={conferenceId}
        regionId={regionId}
        churchId={churchId}
        isVisitor={isVisitor}
        onConferenceChange={handleConferenceChange}
        onRegionChange={handleRegionChange}
        onChurchChange={setChurchId}
        onVisitorToggle={handleVisitorToggle}
      />

      {orderedCategories.length > 0 && (
        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">Contribution Type</h3>
          <label className="block text-sm font-medium text-slate-700">
            <span>Category</span>
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            >
              <option value="">Select Category</option>
              {orderedCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </label>

          {(selectedCategory?.type === "donation" || selectedCategory?.type === "campaign") && (
            <label className="block text-sm font-medium text-slate-700">
              <span>Purpose (optional)</span>
              <input
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          )}
        </section>
      )}

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">Contribution Details</h3>

        <label className="block text-sm font-medium text-slate-700">
          <span>Amount (KES)</span>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <InputField label="Name (optional)" value={name} onChange={setName} />
          <InputField label="Phone (optional)" value={phone} onChange={setPhone} />
          <InputField label="Email (optional)" value={email} onChange={setEmail} />
          <InputField label="Message (optional)" value={message} onChange={setMessage} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Contribution"}
        </button>
      </section>
    </form>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function InputField({ label, value, onChange }: InputFieldProps) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
      />
    </label>
  );
}
