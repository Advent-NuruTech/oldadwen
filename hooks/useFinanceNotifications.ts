"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { FinanceNotificationRecord, FinanceNotificationType } from "@/lib/financeTypes";

interface UseFinanceNotificationsOptions {
  limitToUnread?: boolean;
}

export function useFinanceNotifications(options: UseFinanceNotificationsOptions = {}) {
  const { limitToUnread = false } = options;
  const [notifications, setNotifications] = useState<FinanceNotificationRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unSub = onSnapshot(
      query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(100)),
      (snapshot) => {
        const rows = snapshot.docs
          .map((entry) => normalizeNotification({ id: entry.id, ...entry.data() }))
          .filter((entry) => (limitToUnread ? entry.status === "unread" : true));

        setNotifications(rows);
        setLoading(false);
        setError(null);
      },
      (snapshotError) => {
        setError(snapshotError.message || "Failed to load notifications.");
        setLoading(false);
      },
    );

    const unreadUnsub = onSnapshot(
      query(collection(db, "notifications"), where("status", "==", "unread")),
      (snapshot) => {
        setUnreadCount(snapshot.size);
      },
      () => {
        setUnreadCount(0);
      },
    );

    return () => {
      unSub();
      unreadUnsub();
    };
  }, [limitToUnread]);

  const markAsRead = useCallback(async (id: string) => {
    await updateDoc(doc(db, "notifications", id), {
      status: "read",
      readAt: serverTimestamp(),
    });
  }, []);

  return useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      loading,
      error,
    }),
    [notifications, unreadCount, markAsRead, loading, error],
  );
}

function normalizeNotification(value: Record<string, unknown>): FinanceNotificationRecord {
  return {
    id: asText(value.id),
    transactionId: optionalText(value.transactionId),
    commentId: optionalText(value.commentId),
    reportId: optionalText(value.reportId),
    donorName: optionalText(value.donorName),
    actorName: optionalText(value.actorName),
    amount: typeof value.amount === "number" ? value.amount : undefined,
    categoryId: optionalText(value.categoryId),
    type: normalizeType(value.type),
    message: optionalText(value.message),
    status: value.status === "read" ? "read" : "unread",
    createdAt: extractDate(value.createdAt),
    readAt: extractDate(value.readAt),
  };
}

function normalizeType(value: unknown): FinanceNotificationType {
  if (
    value === "tithe1" ||
    value === "tithe2" ||
    value === "offering" ||
    value === "donation" ||
    value === "campaign" ||
    value === "report_comment"
  ) {
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
