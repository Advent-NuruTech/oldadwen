"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import RichTextEditor from "@/components/RichTextEditor";

interface Lesson {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  year: number;
  quarter: number;
  pdfUrl?: string;
  thumbnailUrl?: string;
}

export default function LessonManager() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [fileInputs, setFileInputs] = useState<Record<string, File | null>>({});
  const [thumbInputs, setThumbInputs] = useState<Record<string, File | null>>({});

  useEffect(() => {
    async function fetchLessons() {
      const q = query(
        collection(db, "sabbath_school_lessons"),
        orderBy("startDate", "asc")
      );
      const snapshot = await getDocs(q);
      setLessons(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Lesson, "id">),
        }))
      );
      setLoading(false);
    }
    fetchLessons();
  }, []);

  const handleUpdate = async (lesson: Lesson) => {
    setSavingId(lesson.id);
    try {
      let pdfUrl = lesson.pdfUrl;
      let thumbnailUrl = lesson.thumbnailUrl;

      if (fileInputs[lesson.id]) {
        pdfUrl = await uploadToCloudinary(fileInputs[lesson.id]!);
      }
      if (thumbInputs[lesson.id]) {
        thumbnailUrl = await uploadToCloudinary(thumbInputs[lesson.id]!);
      }

      await updateDoc(doc(db, "sabbath_school_lessons", lesson.id), {
        ...lesson,
        pdfUrl,
        thumbnailUrl,
        updatedAt: serverTimestamp(),
      });

      setLessons((prev) =>
        prev.map((l) =>
          l.id === lesson.id ? { ...lesson, pdfUrl, thumbnailUrl } : l
        )
      );

      setFileInputs((p) => ({ ...p, [lesson.id]: null }));
      setThumbInputs((p) => ({ ...p, [lesson.id]: null }));
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lesson?")) return;
    await deleteDoc(doc(db, "sabbath_school_lessons", id));
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  if (loading)
    return <div className="p-6 text-white">Loading lessons...</div>;

  return (
    <div className="min-h-screen bg-[#0D3B66] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Manage Sabbath School Lessons
        </h1>

        <ul className="space-y-8">
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              className="p-6 rounded-lg bg-[#0A2F52] border border-blue-500"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  className="p-2 rounded bg-[#08304F] border border-blue-400 text-white"
                  value={lesson.title}
                  onChange={(e) =>
                    setLessons((prev) =>
                      prev.map((l) =>
                        l.id === lesson.id
                          ? { ...l, title: e.target.value }
                          : l
                      )
                    )
                  }
                  placeholder="Title"
                />

                <div className="md:col-span-2">
                  <label className="block mb-1 font-semibold">
                    Description
                  </label>
                  <RichTextEditor
                    value={lesson.description}
                    onChange={(desc) =>
                      setLessons((prev) =>
                        prev.map((l) =>
                          l.id === lesson.id
                            ? { ...l, description: desc }
                            : l
                        )
                      )
                    }
                  />
                </div>

                <input
                  type="date"
                  className="p-2 rounded bg-[#08304F] border border-blue-400 text-white"
                  value={lesson.startDate}
                  onChange={(e) =>
                    setLessons((prev) =>
                      prev.map((l) =>
                        l.id === lesson.id
                          ? { ...l, startDate: e.target.value }
                          : l
                      )
                    )
                  }
                />

                <input
                  type="date"
                  className="p-2 rounded bg-[#08304F] border border-blue-400 text-white"
                  value={lesson.endDate}
                  onChange={(e) =>
                    setLessons((prev) =>
                      prev.map((l) =>
                        l.id === lesson.id
                          ? { ...l, endDate: e.target.value }
                          : l
                      )
                    )
                  }
                />

                <input
                  type="number"
                  className="p-2 rounded bg-[#08304F] border border-blue-400 text-white"
                  value={lesson.year}
                  onChange={(e) =>
                    setLessons((prev) =>
                      prev.map((l) =>
                        l.id === lesson.id
                          ? { ...l, year: Number(e.target.value) }
                          : l
                      )
                    )
                  }
                  placeholder="Year"
                />

                <input
                  type="number"
                  min={1}
                  max={4}
                  className="p-2 rounded bg-[#08304F] border border-blue-400 text-white"
                  value={lesson.quarter}
                  onChange={(e) =>
                    setLessons((prev) =>
                      prev.map((l) =>
                        l.id === lesson.id
                          ? { ...l, quarter: Number(e.target.value) }
                          : l
                      )
                    )
                  }
                  placeholder="Quarter"
                />

                <div>
                  <label className="block text-sm mb-1">PDF</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="text-sm"
                    onChange={(e) =>
                      setFileInputs((prev) => ({
                        ...prev,
                        [lesson.id]: e.target.files?.[0] ?? null,
                      }))
                    }
                  />
                  {lesson.pdfUrl && (
                    <a
                      href={lesson.pdfUrl}
                      target="_blank"
                      className="text-blue-400 text-sm block mt-1"
                    >
                      View current PDF
                    </a>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-1">Thumbnail</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm"
                    onChange={(e) =>
                      setThumbInputs((prev) => ({
                        ...prev,
                        [lesson.id]: e.target.files?.[0] ?? null,
                      }))
                    }
                  />
                  {lesson.thumbnailUrl && (
                    <img
                      src={lesson.thumbnailUrl}
                      alt="Thumbnail"
                      className="mt-2 w-24 h-24 rounded object-cover border border-blue-400"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleUpdate(lesson)}
                  disabled={savingId === lesson.id}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
                >
                  {savingId === lesson.id ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
