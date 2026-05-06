"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { PaymentMethodRecord } from "@/lib/financeTypes";

interface UsePaymentMethodsOptions {
  activeOnly?: boolean;
}

export function usePaymentMethods(options: UsePaymentMethodsOptions = {}) {
  const { activeOnly = false } = options;
  const [methods, setMethods] = useState<PaymentMethodRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unSub = onSnapshot(
      query(collection(db, "payment_methods"), orderBy("label", "asc")),
      (snapshot) => {
        const rows = snapshot.docs
          .map((entry) => normalizePaymentMethod({ id: entry.id, ...entry.data() }))
          .filter((entry) => (activeOnly ? entry.isActive : true));

        setMethods(rows);
        setLoading(false);
        setError(null);
      },
      (snapshotError) => {
        setError(snapshotError.message || "Failed to load payment methods.");
        setLoading(false);
      },
    );

    return () => unSub();
  }, [activeOnly]);

  return useMemo(
    () => ({
      methods,
      loading,
      error,
    }),
    [methods, loading, error],
  );
}

function normalizePaymentMethod(value: Record<string, unknown>): PaymentMethodRecord {
  return {
    id: asText(value.id),
    label: asText(value.label),
    paybillNumber: optionalText(value.paybillNumber),
    accountNumber: optionalText(value.accountNumber),
    phoneNumber: optionalText(value.phoneNumber),
    isActive: value.isActive === true,
    createdAt: extractDate(value.createdAt),
    updatedAt: extractDate(value.updatedAt),
  };
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
