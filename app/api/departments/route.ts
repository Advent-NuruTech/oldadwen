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

type DepartmentPayload = {
  id?: string;
  name?: string;
  description?: string;
  headName?: string;
  headRole?: string;
  images?: string[];
};

function normalizeImages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, 6);
}

function toDepartment(docId: string, raw: Record<string, unknown>) {
  const createdAt = raw.createdAt as Timestamp | undefined;
  return {
    id: docId,
    name: (raw.name ?? "").toString(),
    description: (raw.description ?? "").toString(),
    headName: (raw.headName ?? "").toString(),
    headRole: (raw.headRole ?? "").toString(),
    images: normalizeImages(raw.images),
    createdAt: createdAt?.toDate().toISOString() ?? null,
  };
}

export async function GET() {
  try {
    const departmentsQuery = query(
      collection(db, "departments"),
      orderBy("createdAt", "asc"),
    );
    const snapshot = await getDocs(departmentsQuery);
    const departments = snapshot.docs.map((departmentDoc) =>
      toDepartment(departmentDoc.id, departmentDoc.data() as Record<string, unknown>),
    );

    return NextResponse.json(departments);
  } catch (error) {
    console.error("Failed to load departments:", error);
    return NextResponse.json({ error: "Failed to load departments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DepartmentPayload;
    const name = body.name?.trim();
    const description = body.description?.trim();
    const headName = body.headName?.trim();
    const headRole = body.headRole?.trim();

    if (!name || !description || !headName || !headRole) {
      return NextResponse.json(
        { error: "Name, description, head name and head role are required." },
        { status: 400 },
      );
    }

    const images = normalizeImages(body.images);

    await addDoc(collection(db, "departments"), {
      name,
      description,
      headName,
      headRole,
      images,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to create department:", error);
    return NextResponse.json({ error: "Failed to create department" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as DepartmentPayload;
    const id = body.id?.trim();

    if (!id) {
      return NextResponse.json({ error: "Department id is required." }, { status: 400 });
    }

    const name = body.name?.trim();
    const description = body.description?.trim();
    const headName = body.headName?.trim();
    const headRole = body.headRole?.trim();

    if (!name || !description || !headName || !headRole) {
      return NextResponse.json(
        { error: "Name, description, head name and head role are required." },
        { status: 400 },
      );
    }

    const images = normalizeImages(body.images);
    const departmentRef = doc(db, "departments", id);
    const existing = await getDoc(departmentRef);
    const previousImages = existing.exists()
      ? normalizeImages((existing.data() as Record<string, unknown>).images)
      : [];
    const removedImages = previousImages.filter((url) => !images.includes(url));

    await deleteCloudinaryAssetsByUrls(removedImages);

    await updateDoc(departmentRef, {
      name,
      description,
      headName,
      headRole,
      images,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update department:", error);
    return NextResponse.json({ error: "Failed to update department" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.trim();

    if (!id) {
      return NextResponse.json({ error: "Department id is required." }, { status: 400 });
    }

    const departmentRef = doc(db, "departments", id);
    const existing = await getDoc(departmentRef);
    const images = existing.exists()
      ? normalizeImages((existing.data() as Record<string, unknown>).images)
      : [];

    await deleteCloudinaryAssetsByUrls(images);
    await deleteDoc(departmentRef);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete department:", error);
    return NextResponse.json({ error: "Failed to delete department" }, { status: 500 });
  }
}

