import { NextResponse } from "next/server";
import {
  collection,
  getDocs,
  writeBatch,
  query,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST() {
  const today = new Date().toISOString().split("T")[0];

  const lessonsRef = collection(db, "sabbath_school_lessons");

  const todaySnap = await getDocs(
    query(lessonsRef, where("lessonDate", "==", today))
  );
  




  if (todaySnap.empty) {
    return NextResponse.json({ message: "No lesson for today" });
  }

  const batch = writeBatch(db);

  // Set all current lessons to false
  const currentSnap = await getDocs(
    query(lessonsRef, where("isCurrent", "==", true))
  );

  currentSnap.forEach(doc => {
    batch.update(doc.ref, { isCurrent: false });
  });

  // Set today's lesson as current
  todaySnap.forEach(doc => {
    batch.update(doc.ref, { isCurrent: true });
  });

  await batch.commit();

  return NextResponse.json({ message: "Current lesson updated" });
}
