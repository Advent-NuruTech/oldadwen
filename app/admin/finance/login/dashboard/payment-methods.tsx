"use client";

import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";

import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { db } from "@/lib/firebase";

export default function FinancePaymentMethodsView() {
  const { methods, loading, error } = usePaymentMethods();
  const [label, setLabel] = useState("");
  const [paybillNumber, setPaybillNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addPaymentMethod = async () => {
    if (!label.trim()) return;
    if (!paybillNumber.trim() && !accountNumber.trim() && !phoneNumber.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "payment_methods"), {
        label: label.trim(),
        paybillNumber: paybillNumber.trim() || null,
        accountNumber: accountNumber.trim() || null,
        phoneNumber: phoneNumber.trim() || null,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setLabel("");
      setPaybillNumber("");
      setAccountNumber("");
      setPhoneNumber("");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await updateDoc(doc(db, "payment_methods", id), {
      isActive: !isActive,
      updatedAt: serverTimestamp(),
    });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">Payment Methods</h2>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Add Payment Method</h3>

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Label" value={label} onChange={setLabel} placeholder="M-Pesa Paybill" />
          <Field label="Paybill Number" value={paybillNumber} onChange={setPaybillNumber} placeholder="e.g. 522533" />
          <Field label="Account Number" value={accountNumber} onChange={setAccountNumber} placeholder="e.g. TITHE-001" />
          <Field label="Phone Number" value={phoneNumber} onChange={setPhoneNumber} placeholder="e.g. 07XXXXXXXX" />
        </div>

        <button
          type="button"
          onClick={addPaymentMethod}
          disabled={submitting}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Add Payment Method"}
        </button>
      </section>

      {loading && <p className="text-sm text-slate-600">Loading payment methods...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {methods.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Configured Methods</h3>
          <div className="space-y-2">
            {methods.map((method) => (
              <article key={method.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">{method.label}</p>
                    {method.paybillNumber && <p>Paybill: {method.paybillNumber}</p>}
                    {method.accountNumber && <p>Account: {method.accountNumber}</p>}
                    {method.phoneNumber && <p>Phone: {method.phoneNumber}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleActive(method.id, method.isActive)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${method.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}
                  >
                    {method.isActive ? "Active" : "Inactive"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
      />
    </label>
  );
}
