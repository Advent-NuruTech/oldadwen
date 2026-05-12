import { NextRequest, NextResponse } from "next/server";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { deleteCloudinaryAssetsByUrls } from "@/lib/cloudinaryServer";

type ReportLink = {
  title: string;
  url: string;
};

type ReportPayload = {
  id?: string;
  title?: string;
  content?: string;
  images?: string[];
  links?: ReportLink[];
  donationLinks?: string;
  authorName?: string;
  authorTitle?: string;
  publishedDate?: string;
};

function normalizeLinks(value: unknown): ReportLink[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      const row = entry as Partial<ReportLink>;
      const title = (row.title ?? "").toString().trim();
      const url = (row.url ?? "").toString().trim();
      if (!title || !url) return null;
      return { title, url };
    })
    .filter((entry): entry is ReportLink => Boolean(entry));
}

function normalizeImages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, 6);
}

function normalizePublishedDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function mapReport(docId: string, raw: Record<string, unknown>) {
  const createdAt = raw.createdAt as Timestamp | undefined;
  return {
    id: docId,
    title: (raw.title ?? "").toString(),
    content: (raw.content ?? "").toString(),
    images: normalizeImages(raw.images),
    links: normalizeLinks(raw.links),
    donationLinks: (raw.donationLinks ?? "").toString(),
    authorName: (raw.authorName ?? "").toString(),
    authorTitle: (raw.authorTitle ?? "").toString(),
    publishedDate:
      (raw.publishedDate as Timestamp | undefined)?.toDate().toISOString() ??
      normalizePublishedDate(raw.publishedDate),
    createdAt: createdAt?.toDate().toISOString() ?? null,
    updatedAt:
      (raw.updatedAt as Timestamp | undefined)?.toDate().toISOString() ?? null,
  };
}

export async function GET() {
  try {
    const reportsQuery = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(reportsQuery);

    const reports = snapshot.docs.map((reportDoc) =>
      mapReport(reportDoc.id, reportDoc.data() as Record<string, unknown>),
    );

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Failed to read reports:", error);
    return NextResponse.json({ error: "Failed to load reports" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ReportPayload;

    const title = body.title?.trim();
    const content = body.content?.trim();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 },
      );
    }

    const images = normalizeImages(body.images);
    const links = normalizeLinks(body.links);
    const publishedDate = normalizePublishedDate(body.publishedDate);

    const docRef = await addDoc(collection(db, "reports"), {
      title,
      content,
      images,
      links,
      donationLinks: body.donationLinks?.trim() || "",
      authorName: body.authorName?.trim() || "",
      authorTitle: body.authorTitle?.trim() || "",
      publishedDate: publishedDate ? Timestamp.fromDate(new Date(publishedDate)) : serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create report:", error);
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as ReportPayload;
    const reportId = body.id?.trim();

    if (!reportId) {
      return NextResponse.json({ error: "Report id is required." }, { status: 400 });
    }

    const reportRef = doc(db, "reports", reportId);
    const title = body.title?.trim();
    const content = body.content?.trim();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 },
      );
    }

    const images = normalizeImages(body.images);
    const links = normalizeLinks(body.links);
    const publishedDate = normalizePublishedDate(body.publishedDate);

    await updateDoc(reportRef, {
      title,
      content,
      images,
      links,
      donationLinks: body.donationLinks?.trim() || "",
      authorName: body.authorName?.trim() || "",
      authorTitle: body.authorTitle?.trim() || "",
      ...(publishedDate ? { publishedDate: Timestamp.fromDate(new Date(publishedDate)) } : {}),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update report:", error);
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.trim();
    const imageUrls = searchParams.getAll("image");

    if (!id) {
      return NextResponse.json({ error: "Report id is required." }, { status: 400 });
    }

    const reportSnapshot = await getDoc(doc(db, "reports", id));
    const storedUrls = reportSnapshot.exists()
      ? normalizeImages((reportSnapshot.data() as Record<string, unknown>).images)
      : [];
    const allImageUrls = Array.from(new Set([...storedUrls, ...imageUrls]));

    await deleteCloudinaryAssetsByUrls(allImageUrls);
    await deleteDoc(doc(db, "reports", id));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete report:", error);
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
  }
}
