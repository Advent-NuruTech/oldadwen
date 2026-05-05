"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { normalizeTransaction } from "@/lib/financeEngine";
import {
  ChurchRecord,
  ConferenceRecord,
  FinanceCategoryRecord,
  ReceiptRecord,
  RegionRecord,
} from "@/lib/financeTypes";
import { normalizeChurch, normalizeConference, normalizeRegion } from "@/lib/hierarchyUtils";

interface FinanceRealtimeData {
  conferences: ConferenceRecord[];
  regions: RegionRecord[];
  churches: ChurchRecord[];
  categories: FinanceCategoryRecord[];
  transactions: ReturnType<typeof normalizeTransaction>[];
  receipts: ReceiptRecord[];
  loading: boolean;
  error: string | null;
}

export function useFinanceRealtimeData(): FinanceRealtimeData {
  const [conferences, setConferences] = useState<ConferenceRecord[]>([]);
  const [regions, setRegions] = useState<RegionRecord[]>([]);
  const [churches, setChurches] = useState<ChurchRecord[]>([]);
  const [categories, setCategories] = useState<FinanceCategoryRecord[]>([]);
  const [transactions, setTransactions] = useState<ReturnType<typeof normalizeTransaction>[]>([]);
  const [receipts, setReceipts] = useState<ReceiptRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubs: Array<() => void> = [];

    unsubs.push(
      onSnapshot(query(collection(db, "conferences"), orderBy("name", "asc")), (snapshot) => {
        setConferences(snapshot.docs.map((doc) => normalizeConference({ id: doc.id, ...doc.data() })));
      }),
    );

    unsubs.push(
      onSnapshot(query(collection(db, "regions"), orderBy("name", "asc")), (snapshot) => {
        setRegions(snapshot.docs.map((doc) => normalizeRegion({ id: doc.id, ...doc.data() })));
      }),
    );

    unsubs.push(
      onSnapshot(query(collection(db, "churches"), orderBy("name", "asc")), (snapshot) => {
        setChurches(snapshot.docs.map((doc) => normalizeChurch({ id: doc.id, ...doc.data() })));
      }),
    );

    unsubs.push(
      onSnapshot(query(collection(db, "finance_categories"), orderBy("priority", "asc")), (snapshot) => {
        setCategories(snapshot.docs.map((doc) => normalizeCategory({ id: doc.id, ...doc.data() })));
      }),
    );

    unsubs.push(
      onSnapshot(query(collection(db, "finance_transactions"), orderBy("createdAt", "desc")), (snapshot) => {
        setTransactions(snapshot.docs.map((doc) => normalizeTransaction({ id: doc.id, ...doc.data() })));
      }),
    );

    unsubs.push(
      onSnapshot(query(collection(db, "receipts"), orderBy("createdAt", "desc")), (snapshot) => {
        setReceipts(snapshot.docs.map((doc) => normalizeReceipt({ id: doc.id, ...doc.data() })));
        setLoading(false);
        setError(null);
      }, (snapshotError) => {
        setError(snapshotError.message || "Failed to load finance data.");
        setLoading(false);
      }),
    );

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  return useMemo(
    () => ({ conferences, regions, churches, categories, transactions, receipts, loading, error }),
    [conferences, regions, churches, categories, transactions, receipts, loading, error],
  );
}

function normalizeCategory(value: Record<string, unknown>): FinanceCategoryRecord {
  return {
    id: asText(value.id),
    title: asText(value.title),
    description: optionalText(value.description),
    type: normalizeType(value.type),
    isActive: value.isActive === true,
    isPublic: value.isPublic !== false,
    priority: typeof value.priority === "number" ? value.priority : 100,
    createdAt: extractDate(value.createdAt),
  };
}

function normalizeReceipt(value: Record<string, unknown>): ReceiptRecord {
  return {
    id: asText(value.id),
    transactionId: asText(value.transactionId),
    receiptNumber: asText(value.receiptNumber),
    donorName: optionalText(value.donorName),
    phone: optionalText(value.phone),
    amount: typeof value.amount === "number" ? value.amount : 0,
    type: normalizeType(value.type),
    purpose: optionalText(value.purpose),
    churchName: asText(value.churchName) || "Visitor / Other",
    regionName: asText(value.regionName) || "Visitor / Other",
    conferenceName: asText(value.conferenceName) || "Visitor / Other",
    conferenceCode: asText(value.conferenceCode) || "VIS",
    messageTemplate: asText(value.messageTemplate),
    status: value.status === "confirmed" ? "confirmed" : "pending",
    createdAt: extractDate(value.createdAt),
    confirmedAt: extractDate(value.confirmedAt),
    pdfUrl: optionalText(value.pdfUrl),
  };
}

function normalizeType(value: unknown): "tithe1" | "tithe2" | "offering" | "donation" | "campaign" {
  if (value === "tithe1" || value === "tithe2" || value === "offering" || value === "donation" || value === "campaign") {
    return value;
  }
  return "donation";
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(value: unknown): string | undefined {
  const text = asText(value);
  return text || undefined;
}

function extractDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate();
  }
  return null;
}
