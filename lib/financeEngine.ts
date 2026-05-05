import {
  CollectionReference,
  DocumentData,
  QueryConstraint,
  Timestamp,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  DateRange,
  FinanceSummary,
  FinanceTransactionRecord,
  FinanceType,
  TransactionStatus,
} from "@/lib/financeTypes";

export const FINANCE_COLLECTIONS = {
  conferences: "conferences",
  regions: "regions",
  churches: "churches",
  categories: "finance_categories",
  transactions: "finance_transactions",
  receipts: "receipts",
} as const;

const ALL_TYPES: FinanceType[] = ["tithe1", "tithe2", "offering", "donation", "campaign"];

export interface AggregateByChurchResult {
  churchId: string;
  summary: FinanceSummary;
}

export interface AggregateByRegionResult {
  regionId: string;
  summary: FinanceSummary;
  churches: Array<{ churchId: string; summary: FinanceSummary }>;
}

export interface AggregateByConferenceResult {
  conferenceId: string;
  summary: FinanceSummary;
  regions: Array<{ regionId: string; summary: FinanceSummary }>;
}

export interface PaginationInput {
  pageSize?: number;
  cursorCreatedAt?: Date;
}

export interface PagedTransactionsResult {
  records: FinanceTransactionRecord[];
  nextCursor?: Date;
}

export function emptySummary(): FinanceSummary {
  return {
    tithe1: 0,
    tithe2: 0,
    offering: 0,
    donation: 0,
    campaign: 0,
    total: 0,
    confirmedCount: 0,
    pendingCount: 0,
    onlineTotal: 0,
    manualTotal: 0,
  };
}

export function summarizeTransactions(records: FinanceTransactionRecord[]): FinanceSummary {
  const summary = emptySummary();

  records.forEach((record) => {
    const amount = safeAmount(record.amount);
    if (record.status === "confirmed") {
      summary.confirmedCount += 1;
      summary.total += amount;
      summary[record.type] += amount;

      if (record.source === "online") summary.onlineTotal += amount;
      if (record.source === "manual") summary.manualTotal += amount;
    } else {
      summary.pendingCount += 1;
    }
  });

  return summary;
}

export async function fetchTransactionsByScope(options: {
  conferenceId?: string;
  regionId?: string;
  churchId?: string;
  categoryId?: string;
  type?: FinanceType;
  status?: TransactionStatus;
  dateRange?: DateRange;
  pagination?: PaginationInput;
}): Promise<PagedTransactionsResult> {
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

  if (options.status) constraints.push(where("status", "==", options.status));
  if (options.conferenceId) constraints.push(where("conferenceId", "==", options.conferenceId));
  if (options.regionId) constraints.push(where("regionId", "==", options.regionId));
  if (options.churchId) constraints.push(where("churchId", "==", options.churchId));
  if (options.categoryId) constraints.push(where("categoryId", "==", options.categoryId));
  if (options.type) constraints.push(where("type", "==", options.type));

  if (options.dateRange?.start) {
    constraints.push(where("createdAt", ">=", Timestamp.fromDate(options.dateRange.start)));
  }

  if (options.dateRange?.end) {
    constraints.push(where("createdAt", "<=", Timestamp.fromDate(options.dateRange.end)));
  }

  if (options.pagination?.cursorCreatedAt) {
    constraints.push(startAfter(Timestamp.fromDate(options.pagination.cursorCreatedAt)));
  }

  constraints.push(limit(options.pagination?.pageSize ?? 150));

  const recordsQuery = query(transactionsCollection(), ...constraints);
  const snapshot = await getDocs(recordsQuery);

  const records = snapshot.docs.map((doc) => normalizeTransaction({ id: doc.id, ...doc.data() }));
  const last = records[records.length - 1]?.createdAt ?? undefined;

  return {
    records,
    nextCursor: last ?? undefined,
  };
}

export async function aggregateByChurch(churchId: string, dateRange?: DateRange): Promise<AggregateByChurchResult> {
  const transactions = await fetchAllForAggregation({
    churchId,
    status: "confirmed",
    dateRange,
  });

  return {
    churchId,
    summary: summarizeTransactions(transactions),
  };
}

export async function aggregateByRegion(regionId: string, dateRange?: DateRange): Promise<AggregateByRegionResult> {
  const transactions = await fetchAllForAggregation({
    regionId,
    status: "confirmed",
    dateRange,
  });

  const byChurch = new Map<string, FinanceTransactionRecord[]>();

  transactions.forEach((tx) => {
    const key = tx.churchId || "visitor";
    const bucket = byChurch.get(key) ?? [];
    bucket.push(tx);
    byChurch.set(key, bucket);
  });

  return {
    regionId,
    summary: summarizeTransactions(transactions),
    churches: Array.from(byChurch.entries()).map(([churchId, records]) => ({
      churchId,
      summary: summarizeTransactions(records),
    })),
  };
}

export async function aggregateByConference(
  conferenceId: string,
  dateRange?: DateRange,
): Promise<AggregateByConferenceResult> {
  const transactions = await fetchAllForAggregation({
    conferenceId,
    status: "confirmed",
    dateRange,
  });

  const byRegion = new Map<string, FinanceTransactionRecord[]>();

  transactions.forEach((tx) => {
    const key = tx.regionId || "visitor";
    const bucket = byRegion.get(key) ?? [];
    bucket.push(tx);
    byRegion.set(key, bucket);
  });

  return {
    conferenceId,
    summary: summarizeTransactions(transactions),
    regions: Array.from(byRegion.entries()).map(([regionId, records]) => ({
      regionId,
      summary: summarizeTransactions(records),
    })),
  };
}

export function normalizeTransaction(value: Record<string, unknown>): FinanceTransactionRecord {
  const type = normalizeFinanceType(value.type);

  return {
    id: asText(value.id),
    amount: safeAmount(value.amount),
    type,
    categoryId: optionalText(value.categoryId),
    purpose: optionalText(value.purpose),
    conferenceId: optionalText(value.conferenceId),
    regionId: optionalText(value.regionId),
    churchId: optionalText(value.churchId),
    donorType: value.donorType === "visitor" ? "visitor" : "member",
    name: optionalText(value.name),
    phone: optionalText(value.phone),
    email: optionalText(value.email),
    message: optionalText(value.message),
    status: value.status === "confirmed" ? "confirmed" : "pending",
    source: value.source === "manual" ? "manual" : "online",
    receiptId: optionalText(value.receiptId),
    createdAt: extractDate(value.createdAt),
    confirmedAt: extractDate(value.confirmedAt),
  };
}

export function normalizeFinanceType(value: unknown): FinanceType {
  const candidate = asText(value) as FinanceType;
  return ALL_TYPES.includes(candidate) ? candidate : "donation";
}

async function fetchAllForAggregation(options: {
  conferenceId?: string;
  regionId?: string;
  churchId?: string;
  status: TransactionStatus;
  dateRange?: DateRange;
}): Promise<FinanceTransactionRecord[]> {
  const pageSize = 300;
  let cursor: Date | undefined;
  const all: FinanceTransactionRecord[] = [];

  while (true) {
    const page = await fetchTransactionsByScope({
      ...options,
      pagination: {
        pageSize,
        cursorCreatedAt: cursor,
      },
    });

    all.push(...page.records);

    if (!page.nextCursor || page.records.length < pageSize) {
      break;
    }

    cursor = page.nextCursor;
  }

  return all;
}

function transactionsCollection(): CollectionReference<DocumentData> {
  return collection(db, FINANCE_COLLECTIONS.transactions);
}

function safeAmount(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
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
  if (value instanceof Timestamp) return value.toDate();
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
