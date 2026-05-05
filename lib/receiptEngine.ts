import {
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { FinanceTransactionRecord, ReceiptRecord } from "@/lib/financeTypes";
import { getMessageTemplate } from "@/lib/whatsappService";

export async function generateReceiptNumber(conferenceCode: string, year: number): Promise<string> {
  const safeCode = (conferenceCode || "GEN").toUpperCase().slice(0, 3);
  const sequenceDocId = `${safeCode}_${year}`;
  const sequenceRef = doc(db, "receipt_sequences", sequenceDocId);

  const sequence = await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(sequenceRef);

    if (!snapshot.exists()) {
      transaction.set(sequenceRef, {
        conferenceCode: safeCode,
        year,
        next: 2,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return 1;
    }

    const current = Number(snapshot.data().next || 1);
    transaction.update(sequenceRef, {
      next: current + 1,
      updatedAt: serverTimestamp(),
    });
    return current;
  });

  return `${safeCode}-${year}-${String(sequence).padStart(6, "0")}`;
}

export async function buildReceiptRecord(input: {
  transaction: FinanceTransactionRecord;
  conferenceName: string;
  conferenceCode: string;
  regionName: string;
  churchName: string;
}): Promise<Omit<ReceiptRecord, "id">> {
  const now = new Date();
  const year = now.getFullYear();
  const receiptNumber = await generateReceiptNumber(input.conferenceCode, year);

  const base: Omit<ReceiptRecord, "id"> = {
    transactionId: input.transaction.id,
    receiptNumber,
    donorName: input.transaction.name,
    phone: input.transaction.phone,
    amount: input.transaction.amount,
    type: input.transaction.type,
    purpose: input.transaction.purpose,
    churchName: input.churchName,
    regionName: input.regionName,
    conferenceName: input.conferenceName,
    conferenceCode: input.conferenceCode,
    messageTemplate: "",
    status: "confirmed",
    createdAt: now,
    confirmedAt: input.transaction.confirmedAt || now,
  };

  return {
    ...base,
    messageTemplate: formatReceiptMessage(base),
  };
}

export function formatReceiptMessage(receipt: Omit<ReceiptRecord, "id"> | ReceiptRecord): string {
  return getMessageTemplate(receipt.type, {
    ...receipt,
    id: "preview",
  });
}

export async function resolveHierarchyNames(input: {
  conferenceId?: string;
  regionId?: string;
  churchId?: string;
}): Promise<{ conferenceName: string; conferenceCode: string; regionName: string; churchName: string }> {
  const conferenceRef = input.conferenceId ? doc(collection(db, "conferences"), input.conferenceId) : null;
  const regionRef = input.regionId ? doc(collection(db, "regions"), input.regionId) : null;
  const churchRef = input.churchId ? doc(collection(db, "churches"), input.churchId) : null;

  const [conferenceSnap, regionSnap, churchSnap] = await Promise.all([
    conferenceRef ? getDoc(conferenceRef) : Promise.resolve(null),
    regionRef ? getDoc(regionRef) : Promise.resolve(null),
    churchRef ? getDoc(churchRef) : Promise.resolve(null),
  ]);

  const conferenceName = conferenceSnap?.exists() ? String(conferenceSnap.data().name || "Visitor / Other") : "Visitor / Other";
  const conferenceCode = conferenceSnap?.exists() ? String(conferenceSnap.data().code || "VIS") : "VIS";
  const regionName = regionSnap?.exists() ? String(regionSnap.data().name || "Visitor / Other") : "Visitor / Other";
  const churchName = churchSnap?.exists() ? String(churchSnap.data().name || "Visitor / Other") : "Visitor / Other";

  return { conferenceName, conferenceCode, regionName, churchName };
}
