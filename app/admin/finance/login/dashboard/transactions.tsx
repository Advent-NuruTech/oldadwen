"use client";

import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useMemo, useState } from "react";

import TransactionTable from "@/components/TransactionTable";
import { useAdminTransactions } from "@/hooks/useAdminTransactions";
import { useFinanceRealtimeData } from "@/hooks/useFinanceRealtimeData";
import { db } from "@/lib/firebase";
import { FinanceTransactionRecord } from "@/lib/financeTypes";
import { buildReceiptRecord, resolveHierarchyNames } from "@/lib/receiptEngine";

export default function FinanceTransactionsView() {
  const { categories, conferences, regions, churches, loading: lookupsLoading, error: lookupError } = useFinanceRealtimeData({
    includeTransactions: false,
    includeReceipts: false,
  });
  const { records, loading, error, filters, setFilter, canNext, canPrev, nextPage, prevPage, page } = useAdminTransactions();

  const [searchText, setSearchText] = useState("");
  const [manualCategoryId, setManualCategoryId] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualChurchId, setManualChurchId] = useState("");
  const [manualStatus, setManualStatus] = useState<"pending" | "confirmed">("pending");
  const [submittingManual, setSubmittingManual] = useState(false);

  const categoryById = useMemo(
    () => Object.fromEntries(categories.map((entry) => [entry.id, entry])),
    [categories],
  );
  const churchById = useMemo(
    () => Object.fromEntries(churches.map((entry) => [entry.id, entry])),
    [churches],
  );

  const viewRecords = useMemo(() => {
    const value = searchText.trim().toLowerCase();
    if (!value) return records;

    return records.filter((transaction) => {
      const categoryTitle = categoryById[transaction.categoryId || ""]?.title || "";
      const churchName = churchById[transaction.churchId || ""]?.name || "";

      return (
        (transaction.name || "").toLowerCase().includes(value) ||
        (transaction.phone || "").toLowerCase().includes(value) ||
        categoryTitle.toLowerCase().includes(value) ||
        churchName.toLowerCase().includes(value) ||
        transaction.amount.toString().includes(value)
      );
    });
  }, [records, searchText, categoryById, churchById]);

  const addManualEntry = async () => {
    const amount = Number(manualAmount);
    const category = categories.find((entry) => entry.id === manualCategoryId);
    const church = churches.find((entry) => entry.id === manualChurchId);
    const region = regions.find((entry) => entry.id === church?.regionId);
    const conference = conferences.find((entry) => entry.id === church?.conferenceId);

    if (!category || !church || !region || !conference || !Number.isFinite(amount) || amount <= 0) return;

    setSubmittingManual(true);
    try {
      await addDoc(collection(db, "finance_transactions"), {
        amount,
        type: category.type,
        categoryId: category.id,
        conferenceId: conference.id,
        regionId: region.id,
        churchId: church.id,
        donorType: "member",
        name: manualName.trim() || null,
        status: manualStatus,
        source: "manual",
        createdAt: serverTimestamp(),
        confirmedAt: manualStatus === "confirmed" ? serverTimestamp() : null,
      });

      setManualAmount("");
      setManualName("");
    } finally {
      setSubmittingManual(false);
    }
  };

  const confirmTransaction = async (transaction: FinanceTransactionRecord) => {
    if (transaction.status === "confirmed") return;

    await updateDoc(doc(db, "finance_transactions", transaction.id), {
      status: "confirmed",
      confirmedAt: serverTimestamp(),
    });

    const hierarchy = await resolveHierarchyNames({
      conferenceId: transaction.conferenceId,
      regionId: transaction.regionId,
      churchId: transaction.churchId,
    });

    const updatedTransaction: FinanceTransactionRecord = {
      ...transaction,
      status: "confirmed",
      confirmedAt: new Date(),
    };

    const receiptPayload = await buildReceiptRecord({
      transaction: updatedTransaction,
      conferenceName: hierarchy.conferenceName,
      conferenceCode: hierarchy.conferenceCode,
      regionName: hierarchy.regionName,
      churchName: hierarchy.churchName,
    });

    const receiptRef = await addDoc(collection(db, "receipts"), {
      ...receiptPayload,
      createdAt: serverTimestamp(),
      confirmedAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "finance_transactions", transaction.id), {
      receiptId: receiptRef.id,
    });
  };

  const resolveChurchLabel = (transaction: FinanceTransactionRecord) => {
    const church = churchById[transaction.churchId || ""];
    return church?.name || "Visitor / Other";
  };
  const resolveCategoryLabel = (transaction: FinanceTransactionRecord) => {
    const category = categoryById[transaction.categoryId || ""];
    return category?.title || "-";
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">Transactions</h2>

      {lookupsLoading && <p className="text-sm text-slate-600">Loading lookup data...</p>}
      {lookupError && <p className="text-sm text-red-600">{lookupError}</p>}

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Manual Finance Entry</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="block text-sm font-medium text-slate-700">
            <span>Category</span>
            <select value={manualCategoryId} onChange={(event) => setManualCategoryId(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            <span>Church</span>
            <select value={manualChurchId} onChange={(event) => setManualChurchId(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
              <option value="">Select Church</option>
              {churches.filter((church) => church.isActive).map((church) => (
                <option key={church.id} value={church.id}>
                  {church.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            <span>Status</span>
            <select value={manualStatus} onChange={(event) => setManualStatus(event.target.value as "pending" | "confirmed")} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            <span>Amount</span>
            <input type="number" value={manualAmount} onChange={(event) => setManualAmount(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            <span>Name</span>
            <input value={manualName} onChange={(event) => setManualName(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
        </div>

        <button type="button" onClick={addManualEntry} disabled={submittingManual} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {submittingManual ? "Adding..." : "Add Manual Entry"}
        </button>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          <label className="block text-xs font-medium text-slate-700">
            <span>Search</span>
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Name, phone, amount, category, church"
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
            />
          </label>

          <FilterSelect
            label="Identity"
            value={filters.donorType}
            onChange={(value) => setFilter("donorType", value as "all" | "member" | "visitor")}
            options={["all", "member", "visitor"]}
          />
          <FilterSelect
            label="Status"
            value={filters.status}
            onChange={(value) => setFilter("status", value as "all" | "pending" | "confirmed")}
            options={["all", "pending", "confirmed"]}
          />
          <label className="block text-xs font-medium text-slate-700">
            <span>From</span>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(event) => setFilter("fromDate", event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-slate-700">
            <span>To</span>
            <input
              type="date"
              value={filters.toDate}
              onChange={(event) => setFilter("toDate", event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
            />
          </label>
        </div>
      </section>

      {loading && <p className="text-sm text-slate-600">Loading transactions...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <TransactionTable
            transactions={viewRecords}
            resolveLabel={resolveChurchLabel}
            resolveCategory={resolveCategoryLabel}
            onConfirm={confirmTransaction}
          />

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-sm text-slate-600">Page {page}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prevPage}
                disabled={!canPrev}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextPage}
                disabled={!canNext}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block text-xs font-medium text-slate-700">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm">
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? "All" : option}
          </option>
        ))}
      </select>
    </label>
  );
}
