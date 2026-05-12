import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";

import { db } from "@/lib/firebase";

type CommentPayload = {
  reportId?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reportId = searchParams.get("reportId")?.trim();

    const commentsQuery = query(collection(db, "reportComments"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(commentsQuery);
    let comments: Array<Record<string, unknown> & { id: string; reportId?: string }> = snapshot.docs
      .map((commentDoc) => ({
        id: commentDoc.id,
        ...(commentDoc.data() as Record<string, unknown>),
      }));

    if (reportId) {
      comments = comments.filter((entry) => (entry.reportId ?? "").toString() === reportId);
    }

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CommentPayload;
    const reportId = body.reportId?.trim();
    const name = body.name?.trim();
    const message = body.message?.trim();

    if (!reportId || !name || !message) {
      return NextResponse.json(
        { error: "reportId, name and message are required." },
        { status: 400 },
      );
    }

    const commentRef = await addDoc(collection(db, "reportComments"), {
      reportId,
      name,
      email: body.email?.trim() || "",
      phone: body.phone?.trim() || "",
      message,
      createdAt: serverTimestamp(),
    });

    const reportSnap = await getDoc(doc(db, "reports", reportId));
    const reportTitle = reportSnap.exists()
      ? (reportSnap.data().title ?? "").toString().trim()
      : "";

    await addDoc(collection(db, "notifications"), {
      commentId: commentRef.id,
      reportId,
      type: "report_comment",
      actorName: name,
      donorName: name,
      amount: 0,
      message: `${name} submitted a report comment${reportTitle ? ` on "${reportTitle}"` : ""}.`,
      status: "unread",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to create comment:", error);
    return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 });
  }
}
