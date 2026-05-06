"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DocumentData,
  QueryConstraint,
  QueryDocumentSnapshot,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { normalizeTransaction } from "@/lib/financeEngine";
import { DonorType, FinanceTransactionRecord, TransactionStatus } from "@/lib/financeTypes";

export interface AdminTransactionFilters {
  donorType: DonorType | "all";
  status: TransactionStatus | "all";
  fromDate: string;
  toDate: string;
}

const PAGE_SIZE = 20;

export function useAdminTransactions() {
  const [records, setRecords] = useState<FinanceTransactionRecord[]>([]);
  const [filters, setFilters] = useState<AdminTransactionFilters>({
    donorType: "all",
    status: "all",
    fromDate: "",
    toDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<Array<QueryDocumentSnapshot<DocumentData> | null>>([null]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const page = cursorHistory.length;
  const currentCursor = cursorHistory[cursorHistory.length - 1] ?? null;

  const fetchPage = useCallback(
    async (cursor: QueryDocumentSnapshot<DocumentData> | null) => {
      setLoading(true);
      setError(null);

      try {
        // Firestore index suggestion for production:
        // createdAt desc + status + donorType (and createdAt range filters).
        const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

        if (filters.status !== "all") {
          constraints.push(where("status", "==", filters.status));
        }

        if (filters.donorType !== "all") {
          constraints.push(where("donorType", "==", filters.donorType));
        }

        if (filters.fromDate) {
          constraints.push(where("createdAt", ">=", new Date(`${filters.fromDate}T00:00:00`)));
        }

        if (filters.toDate) {
          constraints.push(where("createdAt", "<=", new Date(`${filters.toDate}T23:59:59`)));
        }

        if (cursor) {
          constraints.push(startAfter(cursor));
        }

        constraints.push(limit(PAGE_SIZE + 1));

        const snapshot = await getDocs(query(collection(db, "finance_transactions"), ...constraints));
        const docs = snapshot.docs;
        const hasMore = docs.length > PAGE_SIZE;
        const visibleDocs = hasMore ? docs.slice(0, PAGE_SIZE) : docs;
        const rows = visibleDocs.map((entry) => normalizeTransaction({ id: entry.id, ...entry.data() }));

        setRecords(rows);
        setHasNextPage(hasMore);
        setLastVisible(visibleDocs.length > 0 ? visibleDocs[visibleDocs.length - 1] : null);
      } catch (requestError) {
        const message = requestError instanceof Error ? requestError.message : "Failed to load transactions.";
        setError(message);
        setRecords([]);
        setHasNextPage(false);
        setLastVisible(null);
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    void fetchPage(currentCursor);
  }, [currentCursor, fetchPage]);

  useEffect(() => {
    setCursorHistory([null]);
    setLastVisible(null);
  }, [filters.donorType, filters.status, filters.fromDate, filters.toDate]);

  const nextPage = () => {
    if (!hasNextPage || !lastVisible) return;
    setCursorHistory((prev) => [...prev, lastVisible]);
  };

  const prevPage = () => {
    if (cursorHistory.length <= 1) return;
    setCursorHistory((prev) => prev.slice(0, -1));
  };

  const setFilter = <K extends keyof AdminTransactionFilters>(key: K, value: AdminTransactionFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    records,
    loading,
    error,
    filters,
    setFilter,
    page,
    canPrev: page > 1,
    canNext: hasNextPage,
    nextPage,
    prevPage,
    refresh: () => fetchPage(currentCursor),
  };
}
