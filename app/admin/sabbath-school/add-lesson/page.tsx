"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import RichTextEditor from "@/components/RichTextEditor";
import { useRouter } from "next/navigation";

export default function AddLessonPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    year: new Date().getFullYear(),
    quarter: 1,
    description: "",
  });

  async function handleSubmit() {
    if (!file) return alert("PDF is required");

    setLoading(true);

    try {
      const pdfUrl = await uploadToCloudinary(file);
      const thumbnailUrl = thumbnail
        ? await uploadToCloudinary(thumbnail)
        : "";

      await addDoc(collection(db, "sabbath_school_lessons"), {
        ...form,
        pdfUrl,
        ...(thumbnailUrl && { thumbnailUrl }),
        createdAt: new Date(),
      });

      router.push("/admin/sabbath-school");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="
      min-h-screen p-6
      bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B]
    ">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <div className="inline-block mb-3 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
            <span className="text-xs font-medium text-[#60A5FA]">
              Sabbath School
            </span>
          </div>

          <h1 className="text-4xl font-extrabold text-white">
            Add Lesson
          </h1>

          <p className="text-gray-400 mt-2">
            Upload and manage study materials
          </p>
        </div>

        {/* FORM CARD */}
        <section className="
          rounded-2xl overflow-hidden
          bg-gradient-to-br from-[#1E293B]/40 via-[#0F172A]/40 to-[#1E1B4B]/40
          backdrop-blur-sm
          border border-[#334155]
          shadow-2xl
          p-6 md:p-8
          space-y-6
        ">

          {/* TITLE */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
              Lesson Title
            </label>
            <input
              placeholder="Enter lesson title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              className="
                w-full p-3 rounded-lg
                bg-[#1E293B]/60 text-white
                border border-[#334155]
                focus:border-[#60A5FA]
                focus:ring-2 focus:ring-[#60A5FA]/20
                outline-none
              "
            />
          </div>

          {/* DATES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="
                  w-full p-3 rounded-lg
                  bg-[#1E293B]/60 text-white
                  border border-[#334155]
                  focus:border-[#60A5FA]
                  focus:ring-2 focus:ring-[#60A5FA]/20
                  outline-none
                "
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
                End Date
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
                className="
                  w-full p-3 rounded-lg
                  bg-[#1E293B]/60 text-white
                  border border-[#334155]
                  focus:border-[#60A5FA]
                  focus:ring-2 focus:ring-[#60A5FA]/20
                  outline-none
                "
              />
            </div>
          </div>

          {/* YEAR + QUARTER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              value={form.year}
              onChange={(e) =>
                setForm({ ...form, year: Number(e.target.value) })
              }
              className="
                w-full p-3 rounded-lg
                bg-[#1E293B]/60 text-white
                border border-[#334155]
                focus:border-[#60A5FA]
                focus:ring-2 focus:ring-[#60A5FA]/20
                outline-none
              "
            />

            <input
              type="number"
              min={1}
              max={4}
              value={form.quarter}
              onChange={(e) =>
                setForm({ ...form, quarter: Number(e.target.value) })
              }
              className="
                w-full p-3 rounded-lg
                bg-[#1E293B]/60 text-white
                border border-[#334155]
                focus:border-[#60A5FA]
                focus:ring-2 focus:ring-[#60A5FA]/20
                outline-none
              "
            />
          </div>

          {/* PDF */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
              Lesson PDF
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="
                w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:bg-[#60A5FA] file:text-white
                file:hover:bg-[#93C5FD]
                cursor-pointer
              "
            />
          </div>

          {/* THUMBNAIL */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
              Thumbnail (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
              className="
                w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:bg-[#60A5FA] file:text-white
                file:hover:bg-[#93C5FD]
                cursor-pointer
              "
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
              Description
            </label>
            <div className="
              border border-[#334155]
              rounded-lg overflow-hidden
              bg-[#1E293B]/60
            ">
              <RichTextEditor
                value={form.description}
                onChange={(desc) =>
                  setForm({ ...form, description: desc })
                }
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              w-full py-3 rounded-lg font-bold text-white
              bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]
              hover:shadow-2xl hover:scale-[1.02]
              transition-all duration-300
              disabled:opacity-50
            "
          >
            {loading ? "Saving Lesson..." : "Add Lesson"}
          </button>

        </section>
      </div>
    </main>
  );
}