"use client";

import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { FinanceTransactionRecord, ReceiptRecord } from "@/lib/financeTypes";
import { buildReceiptRecord, resolveHierarchyNames } from "@/lib/receiptEngine";

interface ReceiptGeneratorProps {
  transaction: FinanceTransactionRecord;
  onGenerated: (receipt: ReceiptRecord) => void;
}

export default function ReceiptGenerator({ transaction, onGenerated }: ReceiptGeneratorProps) {
  const generate = async () => {
    if (transaction.status !== "confirmed") return;

    const hierarchy = await resolveHierarchyNames({
      conferenceId: transaction.conferenceId,
      regionId: transaction.regionId,
      churchId: transaction.churchId,
    });

    const receiptPayload = await buildReceiptRecord({
      transaction,
      conferenceName: hierarchy.conferenceName,
      conferenceCode: hierarchy.conferenceCode,
      regionName: hierarchy.regionName,
      churchName: hierarchy.churchName,
    });

    const receiptRef = await addDoc(collection(db, "receipts"), {
      ...receiptPayload,
      createdAt: serverTimestamp(),
      confirmedAt: receiptPayload.confirmedAt ? serverTimestamp() : null,
    });

    await updateDoc(doc(db, "finance_transactions", transaction.id), {
      receiptId: receiptRef.id,
    });

    onGenerated({
      id: receiptRef.id,
      ...receiptPayload,
      createdAt: new Date(),
      confirmedAt: transaction.confirmedAt || new Date(),
    });
  };

  return (
    <button
      type="button"
      onClick={generate}
      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
    >
      Generate Receipt
    </button>
  );
}
