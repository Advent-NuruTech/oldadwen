"use client";

import { FinanceTransactionRecord } from "@/lib/financeTypes";

interface TransactionTableProps {
  transactions: FinanceTransactionRecord[];
  resolveLabel: (transaction: FinanceTransactionRecord) => string;
  resolveCategory?: (transaction: FinanceTransactionRecord) => string;
  onConfirm: (transaction: FinanceTransactionRecord) => Promise<void>;
}

export default function TransactionTable({ transactions, resolveLabel, resolveCategory, onConfirm }: TransactionTableProps) {
  if (transactions.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Church</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t border-slate-200">
              <td className="px-4 py-3">{transaction.name || "Anonymous"}</td>
              <td className="px-4 py-3">{resolveLabel(transaction)}</td>
              <td className="px-4 py-3">{resolveCategory ? resolveCategory(transaction) : transaction.categoryId || "-"}</td>
              <td className="px-4 py-3 uppercase">{transaction.type}</td>
              <td className="px-4 py-3">KES {transaction.amount.toLocaleString("en-KE")}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    transaction.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {transaction.status}
                </span>
              </td>
              <td className="px-4 py-3">{transaction.source}</td>
              <td className="px-4 py-3">{transaction.createdAt?.toLocaleString("en-KE") || "-"}</td>
              <td className="px-4 py-3">
                {transaction.status === "pending" ? (
                  <button
                    type="button"
                    onClick={() => onConfirm(transaction)}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                  >
                    Confirm
                  </button>
                ) : (
                  <span className="text-xs text-slate-500">Confirmed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
