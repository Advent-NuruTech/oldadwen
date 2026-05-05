import {
  CollectionReference,
  DocumentData,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { ChurchRecord, ConferenceRecord, RegionRecord } from "@/lib/financeTypes";

export function conferencesCollection(): CollectionReference<DocumentData> {
  return collection(db, "conferences");
}

export function regionsCollection(): CollectionReference<DocumentData> {
  return collection(db, "regions");
}

export function churchesCollection(): CollectionReference<DocumentData> {
  return collection(db, "churches");
}

export async function getRegionsByConference(conferenceId: string): Promise<RegionRecord[]> {
  if (!conferenceId) return [];

  const snapshot = await getDocs(
    query(regionsCollection(), where("conferenceId", "==", conferenceId), orderBy("name", "asc")),
  );

  return snapshot.docs.map((doc) => normalizeRegion({ id: doc.id, ...doc.data() }));
}

export async function getChurchesByRegion(regionId: string): Promise<ChurchRecord[]> {
  if (!regionId) return [];

  const snapshot = await getDocs(
    query(
      churchesCollection(),
      where("regionId", "==", regionId),
      where("isActive", "==", true),
      orderBy("name", "asc"),
    ),
  );

  return snapshot.docs.map((doc) => normalizeChurch({ id: doc.id, ...doc.data() }));
}

export async function getChurchesByConference(conferenceId: string): Promise<ChurchRecord[]> {
  if (!conferenceId) return [];

  const snapshot = await getDocs(
    query(
      churchesCollection(),
      where("conferenceId", "==", conferenceId),
      where("isActive", "==", true),
      orderBy("name", "asc"),
    ),
  );

  return snapshot.docs.map((doc) => normalizeChurch({ id: doc.id, ...doc.data() }));
}

export function subscribeConferences(callback: (records: ConferenceRecord[]) => void): () => void {
  return onSnapshot(query(conferencesCollection(), orderBy("name", "asc")), (snapshot) => {
    callback(snapshot.docs.map((doc) => normalizeConference({ id: doc.id, ...doc.data() })));
  });
}

export function subscribeRegions(callback: (records: RegionRecord[]) => void): () => void {
  return onSnapshot(query(regionsCollection(), orderBy("name", "asc")), (snapshot) => {
    callback(snapshot.docs.map((doc) => normalizeRegion({ id: doc.id, ...doc.data() })));
  });
}

export function subscribeChurches(callback: (records: ChurchRecord[]) => void): () => void {
  return onSnapshot(query(churchesCollection(), orderBy("name", "asc")), (snapshot) => {
    callback(snapshot.docs.map((doc) => normalizeChurch({ id: doc.id, ...doc.data() })));
  });
}

export function normalizeConference(value: Record<string, unknown>): ConferenceRecord {
  return {
    id: asText(value.id),
    name: asText(value.name),
    code: asText(value.code),
    createdAt: extractDate(value.createdAt),
  };
}

export function normalizeRegion(value: Record<string, unknown>): RegionRecord {
  return {
    id: asText(value.id),
    name: asText(value.name),
    conferenceId: asText(value.conferenceId),
    code: asText(value.code),
    createdAt: extractDate(value.createdAt),
  };
}

export function normalizeChurch(value: Record<string, unknown>): ChurchRecord {
  return {
    id: asText(value.id),
    name: asText(value.name),
    regionId: asText(value.regionId),
    conferenceId: asText(value.conferenceId),
    code: asText(value.code),
    isActive: value.isActive !== false,
    createdAt: extractDate(value.createdAt),
  };
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
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
