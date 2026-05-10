"use client";

import { useMemo, useState } from "react";

import ReceiptGenerator from "@/components/ReceiptGenerator";
import ReceiptViewer from "@/components/ReceiptViewer";
import WhatsAppLink from "@/components/WhatsAppLink";
import { useFinanceRealtimeData } from "@/hooks/useFinanceRealtimeData";
import { ReceiptRecord } from "@/lib/financeTypes";

export default function FinanceReceiptsView() {
  const { receipts, transactions } = useFinanceRealtimeData({ includeTransactions: true, includeReceipts: true });
  const [generatedReceipt, setGeneratedReceipt] = useState<ReceiptRecord | null>(null);

  const eligible = useMemo(
    () => transactions.filter((tx) => tx.status === "confirmed" && !tx.receiptId),
    [transactions],
  );

  const allReceipts = useMemo(() => {
    if (!generatedReceipt) return receipts;
    if (receipts.some((receipt) => receipt.id === generatedReceipt.id)) return receipts;
    return [generatedReceipt, ...receipts];
  }, [receipts, generatedReceipt]);

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">Receipts</h2>

      {eligible.length > 0 && (
        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-semibold text-slate-900">Generate Missing Receipts</h3>
          <div className="space-y-2">
            {eligible.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div className="text-sm text-slate-700">
                  <p className="font-semibold">{transaction.name || "Anonymous"}</p>
                  <p>{transaction.type} | KES {transaction.amount.toLocaleString("en-KE")}</p>
                </div>
                <ReceiptGenerator transaction={transaction} onGenerated={setGeneratedReceipt} />
              </div>
            ))}
          </div>
        </section>
      )}

      {allReceipts.length > 0 && (
        <section className="space-y-3">
          {allReceipts.map((receipt) => (
            <div key={receipt.id} className="space-y-2">
              <ReceiptViewer receipt={receipt} />
              <WhatsAppLink phone={receipt.phone} message={receipt.messageTemplate} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

