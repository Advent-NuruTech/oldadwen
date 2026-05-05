"use client";

import { ReceiptRecord } from "@/lib/financeTypes";

interface ReceiptViewerProps {
  receipt: ReceiptRecord;
}

export default function ReceiptViewer({ receipt }: ReceiptViewerProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Receipt {receipt.receiptNumber}</h3>
        <span className="text-xs text-slate-500">{receipt.createdAt?.toLocaleString("en-KE")}</span>
      </div>

      <div className="mt-3 grid gap-1 text-sm text-slate-700">
        <p>Name: {receipt.donorName || "Anonymous"}</p>
        <p>Phone: {receipt.phone || "-"}</p>
        <p>Amount: KES {receipt.amount.toLocaleString("en-KE")}</p>
        <p>Type: {receipt.type}</p>
        <p>Purpose: {receipt.purpose || "-"}</p>
        <p>
          Church: {receipt.churchName} | Region: {receipt.regionName} | Conference: {receipt.conferenceName}
        </p>
      </div>
    </article>
  );
}
