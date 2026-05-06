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

interface UseFinanceRealtimeDataOptions {
  includeTransactions?: boolean;
  includeReceipts?: boolean;
}

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

export function useFinanceRealtimeData(options: UseFinanceRealtimeDataOptions = {}): FinanceRealtimeData {
  const { includeTransactions = true, includeReceipts = true } = options;

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
    setLoading(true);
    setError(null);

    let pendingStreams = 4 + (includeTransactions ? 1 : 0) + (includeReceipts ? 1 : 0);
    const completed = new Set<string>();

    const markReady = (key: string) => {
      if (completed.has(key)) return;
      completed.add(key);
      pendingStreams -= 1;
      if (pendingStreams <= 0) {
        setLoading(false);
      }
    };

    const markError = (message: string) => {
      setError(message);
      setLoading(false);
    };

    unsubs.push(
      onSnapshot(
        query(collection(db, "conferences"), orderBy("name", "asc")),
        (snapshot) => {
          setConferences(snapshot.docs.map((entry) => normalizeConference({ id: entry.id, ...entry.data() })));
          markReady("conferences");
        },
        (snapshotError) => markError(snapshotError.message || "Failed to load conferences."),
      ),
    );

    unsubs.push(
      onSnapshot(
        query(collection(db, "regions"), orderBy("name", "asc")),
        (snapshot) => {
          setRegions(snapshot.docs.map((entry) => normalizeRegion({ id: entry.id, ...entry.data() })));
          markReady("regions");
        },
        (snapshotError) => markError(snapshotError.message || "Failed to load regions."),
      ),
    );

    unsubs.push(
      onSnapshot(
        query(collection(db, "churches"), orderBy("name", "asc")),
        (snapshot) => {
          setChurches(snapshot.docs.map((entry) => normalizeChurch({ id: entry.id, ...entry.data() })));
          markReady("churches");
        },
        (snapshotError) => markError(snapshotError.message || "Failed to load churches."),
      ),
    );

    unsubs.push(
      onSnapshot(
        query(collection(db, "finance_categories"), orderBy("priority", "asc")),
        (snapshot) => {
          setCategories(snapshot.docs.map((entry) => normalizeCategory({ id: entry.id, ...entry.data() })));
          markReady("categories");
        },
        (snapshotError) => markError(snapshotError.message || "Failed to load categories."),
      ),
    );

    if (includeTransactions) {
      unsubs.push(
        onSnapshot(
          query(collection(db, "finance_transactions"), orderBy("createdAt", "desc")),
          (snapshot) => {
            setTransactions(snapshot.docs.map((entry) => normalizeTransaction({ id: entry.id, ...entry.data() })));
            markReady("transactions");
          },
          (snapshotError) => markError(snapshotError.message || "Failed to load transactions."),
        ),
      );
    } else {
      setTransactions([]);
    }

    if (includeReceipts) {
      unsubs.push(
        onSnapshot(
          query(collection(db, "receipts"), orderBy("createdAt", "desc")),
          (snapshot) => {
            setReceipts(snapshot.docs.map((entry) => normalizeReceipt({ id: entry.id, ...entry.data() })));
            markReady("receipts");
          },
          (snapshotError) => markError(snapshotError.message || "Failed to load receipts."),
        ),
      );
    } else {
      setReceipts([]);
    }

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [includeTransactions, includeReceipts]);

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
