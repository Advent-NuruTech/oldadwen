"use client";

import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useMemo, useState } from "react";

import TransactionTable from "@/components/TransactionTable";
import { useFinanceRealtimeData } from "@/hooks/useFinanceRealtimeData";
import { db } from "@/lib/firebase";
import { FinanceTransactionRecord, FinanceType } from "@/lib/financeTypes";
import { buildReceiptRecord, resolveHierarchyNames } from "@/lib/receiptEngine";

const FILTER_TYPES: Array<FinanceType | "all"> = ["all", "tithe1", "tithe2", "offering", "donation", "campaign"];

export default function FinanceTransactionsView() {
  const { transactions, categories, conferences, regions, churches } = useFinanceRealtimeData();

  const [typeFilter, setTypeFilter] = useState<FinanceType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed">("all");
  const [conferenceFilter, setConferenceFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [churchFilter, setChurchFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [manualCategoryId, setManualCategoryId] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualChurchId, setManualChurchId] = useState("");
  const [manualStatus, setManualStatus] = useState<"pending" | "confirmed">("pending");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (statusFilter !== "all" && tx.status !== statusFilter) return false;
      if (conferenceFilter && tx.conferenceId !== conferenceFilter) return false;
      if (regionFilter && tx.regionId !== regionFilter) return false;
      if (churchFilter && tx.churchId !== churchFilter) return false;

      if (fromDate && tx.createdAt) {
        const start = new Date(`${fromDate}T00:00:00`);
        if (tx.createdAt < start) return false;
      }

      if (toDate && tx.createdAt) {
        const end = new Date(`${toDate}T23:59:59`);
        if (tx.createdAt > end) return false;
      }

      return true;
    });
  }, [transactions, typeFilter, statusFilter, conferenceFilter, regionFilter, churchFilter, fromDate, toDate]);

  const addManualEntry = async () => {
    const amount = Number(manualAmount);
    const category = categories.find((entry) => entry.id === manualCategoryId);
    const church = churches.find((entry) => entry.id === manualChurchId);
    const region = regions.find((entry) => entry.id === church?.regionId);
    const conference = conferences.find((entry) => entry.id === church?.conferenceId);

    if (!category || !church || !region || !conference || !Number.isFinite(amount) || amount <= 0) return;

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
    const church = churches.find((entry) => entry.id === transaction.churchId);
    return church?.name || "Visitor / Other";
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">Transactions</h2>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Manual Finance Entry</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="block text-sm font-medium text-slate-700">
            <span>Category</span>
            <select value={manualCategoryId} onChange={(event) => setManualCategoryId(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.title}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            <span>Church</span>
            <select value={manualChurchId} onChange={(event) => setManualChurchId(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
              <option value="">Select Church</option>
              {churches.filter((church) => church.isActive).map((church) => (
                <option key={church.id} value={church.id}>{church.name}</option>
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

        <button type="button" onClick={addManualEntry} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Add Manual Entry</button>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6">
          <FilterSelect label="Type" value={typeFilter} onChange={(value) => setTypeFilter(value as FinanceType | "all")} options={FILTER_TYPES} />
          <FilterSelect label="Status" value={statusFilter} onChange={(value) => setStatusFilter(value as "all" | "pending" | "confirmed")} options={["all", "pending", "confirmed"]} />
          <FilterSelect label="Conference" value={conferenceFilter} onChange={setConferenceFilter} options={["", ...conferences.map((conference) => conference.id)]} labels={Object.fromEntries(conferences.map((conference) => [conference.id, conference.name]))} />
          <FilterSelect label="Region" value={regionFilter} onChange={setRegionFilter} options={["", ...regions.map((region) => region.id)]} labels={Object.fromEntries(regions.map((region) => [region.id, region.name]))} />
          <FilterSelect label="Church" value={churchFilter} onChange={setChurchFilter} options={["", ...churches.map((church) => church.id)]} labels={Object.fromEntries(churches.map((church) => [church.id, church.name]))} />
          <label className="block text-xs font-medium text-slate-700"><span>From</span><input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm" /></label>
          <label className="block text-xs font-medium text-slate-700"><span>To</span><input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm" /></label>
        </div>
      </section>

      <TransactionTable transactions={filteredTransactions} resolveLabel={resolveChurchLabel} onConfirm={confirmTransaction} />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  labels,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: Record<string, string>;
}) {
  return (
    <label className="block text-xs font-medium text-slate-700">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm">
        {options.map((option) => (
          <option key={option || "all"} value={option}>
            {option ? (labels?.[option] || option) : "All"}
          </option>
        ))}
      </select>
    </label>
  );
}
