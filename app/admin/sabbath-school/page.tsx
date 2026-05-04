"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import RichTextEditor from "@/components/RichTextEditor";

interface Lesson {
  id: string;
  title: string;
  lessonDate: string;
  year: number;
  quarter: number;
  pdfUrl: string;
  thumbnailUrl?: string;
  description?: string;
}

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    lessonDate: "",
    year: new Date().getFullYear(),
    quarter: 1,
    description: "",
  });

  const lessonsRef = collection(db, "sabbath_school_lessons");

  async function fetchLessons() {
    const snap = await getDocs(lessonsRef);
    const data: Lesson[] = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Lesson)
    );
    setLessons(data);
  }

  useEffect(() => {
    fetchLessons();
  }, []);

  async function handleUpload() {
    if (!file && !editingId) return alert("Select a PDF file");
    setLoading(true);

    try {
      let pdfUrl = "";
      let thumbnailUrl = "";

      if (file) pdfUrl = await uploadToCloudinary(file);
      if (thumbnail) thumbnailUrl = await uploadToCloudinary(thumbnail);

      if (editingId) {
        await updateDoc(doc(db, "sabbath_school_lessons", editingId), {
          ...form,
          ...(pdfUrl && { pdfUrl }),
          ...(thumbnailUrl && { thumbnailUrl }),
        });
        setEditingId(null);
      } else {
        await addDoc(lessonsRef, {
          ...form,
          pdfUrl,
          ...(thumbnailUrl && { thumbnailUrl }),
          createdAt: new Date(),
        });
      }

      setForm({
        title: "",
        lessonDate: "",
        year: new Date().getFullYear(),
        quarter: 1,
        description: "",
      });

      setFile(null);
      setThumbnail(null);
      fetchLessons();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this lesson?")) return;
    await deleteDoc(doc(db, "sabbath_school_lessons", id));
    fetchLessons();
  }

  function handleEdit(lesson: Lesson) {
    setForm({
      title: lesson.title,
      lessonDate: lesson.lessonDate,
      year: lesson.year,
      quarter: lesson.quarter,
      description: lesson.description || "",
    });
    setEditingId(lesson.id);
    setFile(null);
    setThumbnail(null);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B] p-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-center">
          <div className="inline-block mb-3 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
            <span className="text-xs font-medium text-[#60A5FA]">
              Sabbath School
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Manage Lessons
          </h1>
          <p className="text-gray-400 mt-2">
            Create, update, and organize study materials
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-gradient-to-br from-[#1E293B]/40 via-[#0F172A]/40 to-[#1E1B4B]/40 
        backdrop-blur-sm border border-[#334155] rounded-2xl p-6 shadow-2xl space-y-4">

          <input
            placeholder="Lesson Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 rounded-lg bg-[#1E293B]/60 text-white
            border border-[#334155] focus:border-[#60A5FA] outline-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="date"
              value={form.lessonDate}
              onChange={(e) =>
                setForm({ ...form, lessonDate: e.target.value })
              }
              className="p-3 rounded-lg bg-[#1E293B]/60 text-white
              border border-[#334155] focus:border-[#60A5FA] outline-none"
            />

            <input
              type="number"
              value={form.year}
              onChange={(e) =>
                setForm({ ...form, year: Number(e.target.value) })
              }
              className="p-3 rounded-lg bg-[#1E293B]/60 text-white
              border border-[#334155] focus:border-[#60A5FA] outline-none"
            />
          </div>

          <input
            type="number"
            min={1}
            max={4}
            value={form.quarter}
            onChange={(e) =>
              setForm({ ...form, quarter: Number(e.target.value) })
            }
            className="w-full p-3 rounded-lg bg-[#1E293B]/60 text-white
            border border-[#334155] focus:border-[#60A5FA] outline-none"
          />

          {/* FILES */}
          <div className="space-y-2">
            <label className="text-sm text-[#60A5FA]">Lesson PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-gray-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#60A5FA]">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
              className="text-gray-300"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="border border-[#334155] rounded-lg overflow-hidden">
            <RichTextEditor
              value={form.description}
              onChange={(desc) =>
                setForm({ ...form, description: desc })
              }
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-white
            bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]
            hover:scale-105 transition-all duration-300"
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Lesson"
              : "Add Lesson"}
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-[#1E293B]/40 border border-[#334155]
              rounded-xl p-4 flex justify-between items-start"
            >
              <div>
                <h3 className="text-white font-bold">{lesson.title}</h3>
                <p className="text-sm text-gray-400">
                  {lesson.lessonDate} • Year {lesson.year} • Q{lesson.quarter}
                </p>

                {lesson.thumbnailUrl && (
                  <img
                    src={lesson.thumbnailUrl}
                    className="w-24 h-24 object-cover mt-2 rounded-lg"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2 text-right">
                <button
                  onClick={() => handleEdit(lesson)}
                  className="text-[#60A5FA]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}