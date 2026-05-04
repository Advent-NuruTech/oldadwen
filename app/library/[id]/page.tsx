"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";

interface LibraryDoc {
  id: string;
  filePath: string;
}

export default function LibraryDocPage() {
  const params = useParams(); // expects /library/[id]
  const docId = params?.id as string;

  const [libraryDoc, setLibraryDoc] = useState<LibraryDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docId) return;

    async function fetchDoc() {
      setLoading(true);
      const docRef = doc(db, "library", docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as LibraryDoc;
        setLibraryDoc({ id: docSnap.id, filePath: data.filePath });
      }
      setLoading(false);
    }

    fetchDoc();
  }, [docId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-white dark:bg-[#1F1A16]">
        <p className="text-gray-500">Loading Document...</p>
      </div>
    );

  if (!libraryDoc || !libraryDoc.filePath)
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-white dark:bg-[#1F1A16]">
        <p className="text-red-500">Document not found.</p>
      </div>
    );

  return (
    <main className="h-screen w-screen bg-white dark:bg-[#1F1A16]">
      {/* Fullscreen PDF/Document */}
      <iframe
        src={libraryDoc.filePath}
        className="w-full h-full"
        title="Library Document"
      />
    </main>
  );
}
