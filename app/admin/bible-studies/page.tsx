"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

interface LibraryDoc {
  id: string;
  title: string;
  category: string;
  description: string;
  filePath: string;
}

export default function AdminLibraryPage() {
  const [docs, setDocs] = useState<LibraryDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    file: null as File | null,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "library"), (snapshot) => {
      const allDocs = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as LibraryDoc[];

      setDocs(allDocs);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (
      !form.title.trim() ||
      !form.category.trim() ||
      !form.description.trim()
    ) {
      return alert("All fields except file are required");
    }

    setLoading(true);

    try {
      let filePath = "";

      if (form.file) {
        filePath = await uploadToCloudinary(form.file);
      }

      if (editingId) {
        await updateDoc(doc(db, "library", editingId), {
          title: form.title,
          category: form.category,
          description: form.description,
          ...(filePath && { filePath }),
        });

        setEditingId(null);
      } else {
        await addDoc(collection(db, "library"), {
          title: form.title,
          category: form.category,
          description: form.description,
          filePath,
          createdAt: new Date(),
        });
      }

      setForm({
        title: "",
        category: "",
        description: "",
        file: null,
      });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: LibraryDoc) => {
    setForm({
      title: item.title,
      category: item.category,
      description: item.description,
      file: null,
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    await deleteDoc(doc(db, "library", id));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B] p-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-center">
          <div className="inline-block mb-3 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
            <span className="text-xs font-medium text-[#60A5FA]">
              Digital Library
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Manage Documents
          </h1>

          <p className="text-gray-400 mt-2">
            Upload, organize, and manage resources
          </p>
        </div>

        {/* FORM CARD */}
        <div
          className="bg-gradient-to-br from-[#1E293B]/40 via-[#0F172A]/40 to-[#1E1B4B]/40
        backdrop-blur-sm border border-[#334155] rounded-2xl p-6 shadow-2xl space-y-4"
        >
          <input
            placeholder="Document title..."
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="w-full p-3 rounded-lg bg-[#1E293B]/60 text-white
            border border-[#334155] focus:border-[#60A5FA] outline-none"
          />

          <input
            placeholder="Category..."
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="w-full p-3 rounded-lg bg-[#1E293B]/60 text-white
            border border-[#334155] focus:border-[#60A5FA] outline-none"
          />

          <textarea
            placeholder="Description..."
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full p-3 rounded-lg bg-[#1E293B]/60 text-white
            border border-[#334155] focus:border-[#60A5FA] outline-none min-h-[120px]"
          />

          {/* FILE */}
          <div className="space-y-2">
            <label className="text-sm text-[#60A5FA]">
              Upload File (optional for update)
            </label>

            <input
              type="file"
              onChange={(e) =>
                setForm({
                  ...form,
                  file: e.target.files?.[0] ?? null,
                })
              }
              className="text-gray-300"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-white
            bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]
            hover:scale-105 transition-all duration-300
            disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Document"
              : "Add Document"}
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {docs.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-start
              bg-[#1E293B]/40 border border-[#334155]
              rounded-xl p-4"
            >
              <div>
                <h3 className="text-white font-bold">
                  {item.title}
                </h3>

                <p className="text-sm text-[#60A5FA]">
                  {item.category}
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  {item.description}
                </p>
              </div>

              <div className="flex flex-col gap-2 text-right">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-[#60A5FA]"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
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