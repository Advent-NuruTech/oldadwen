"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import RichTextEditor from "@/components/RichTextEditor";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface Minister {
  id: string;
  name: string;
  imageUrl: string;
  metadata: string;
  role?: string;
  title?: string;

  joinedDate?: string;
}

export default function EditFullTimeMinistersPage() {
  const [ministers, setMinisters] = useState<Minister[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [editingStates, setEditingStates] = useState<{
    [key: string]: {
      name: string;
      imageFile: File | null;
      metadata: string;
      role: string;
      title: string;
    
      joinedDate: string;
    };
  }>({});

  useEffect(() => {
    const fetchMinisters = async () => {
      const q = query(collection(db, "fullTimeMinisters"), orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
        imageUrl: d.data().imageUrl,
        metadata: d.data().metadata,
        role: d.data().role || "",
        title: d.data().title || "",
       
        joinedDate: d.data().joinedDate || "",
      })) as Minister[];

      setMinisters(data);

      const states: typeof editingStates = {};
      data.forEach((m) => {
        states[m.id] = {
          name: m.name,
          imageFile: null,
          metadata: m.metadata,
          role: m.role || "",
          title: m.title || "",
        
          joinedDate: m.joinedDate || "",
        };
      });
      setEditingStates(states);
      setLoading(false);
    };

    fetchMinisters();
  }, []);

  const handleSave = async (minister: Minister) => {
    const state = editingStates[minister.id];
    if (!state || !state.name.trim()) return;

    setSavingIds((p) => [...p, minister.id]);

    try {
      let imageUrl = minister.imageUrl;
      if (state.imageFile) {
        imageUrl = await uploadToCloudinary(state.imageFile);
      }

      await updateDoc(doc(db, "fullTimeMinisters", minister.id), {
        name: state.name,
        imageUrl,
        metadata: state.metadata,
        role: state.role,
        title: state.title,
     
        joinedDate: state.joinedDate,
        isFullTime: true,
      });

      setMinisters((prev) =>
        prev.map((m) =>
          m.id === minister.id
            ? {
                ...m,
                name: state.name,
                imageUrl,
                metadata: state.metadata,
                role: state.role,
                title: state.title,
                
                joinedDate: state.joinedDate,
              }
            : m,
        ),
      );

      setEditingStates((prev) => ({
        ...prev,
        [minister.id]: { ...prev[minister.id], imageFile: null },
      }));
    } finally {
      setSavingIds((p) => p.filter((id) => id !== minister.id));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B] p-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Manage Full-Time Ministers</h1>
          <p className="text-gray-400 mt-2">Edit full-time minister profiles in their dedicated collection</p>
        </div>

        {ministers.map((minister) => {
          const state = editingStates[minister.id];
          const saving = savingIds.includes(minister.id);
          if (!state) return null;

          return (
            <section
              key={minister.id}
              className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E293B]/40 via-[#0F172A]/40 to-[#1E1B4B]/40 backdrop-blur-sm border border-[#334155] shadow-2xl"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-[#334155] pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{state.name}</h2>
                    <p className="text-sm text-amber-300 mt-1">{state.title || "Bible Worker"}</p>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-amber-300">Minister Image</label>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border border-[#334155] bg-[#1E293B]/60">
                    <Image
                      src={state.imageFile ? URL.createObjectURL(state.imageFile) : minister.imageUrl}
                      alt={state.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-300"
                  onChange={(e) =>
                    setEditingStates((prev) => ({
                      ...prev,
                      [minister.id]: {
                        ...prev[minister.id],
                        imageFile: e.target.files?.[0] ?? null,
                      },
                    }))
                  }
                />

                <input
                  type="text"
                  value={state.name}
                  onChange={(e) =>
                    setEditingStates((prev) => ({
                      ...prev,
                      [minister.id]: { ...prev[minister.id], name: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-lg bg-[#1E293B]/60 text-white border border-[#334155]"
                  placeholder="Name"
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={state.title}
                    onChange={(e) =>
                      setEditingStates((prev) => ({
                        ...prev,
                        [minister.id]: { ...prev[minister.id], title: e.target.value },
                      }))
                    }
                    className="w-full p-3 rounded-lg bg-[#1E293B]/60 text-white border border-[#334155]"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={state.role}
                    onChange={(e) =>
                      setEditingStates((prev) => ({
                        ...prev,
                        [minister.id]: { ...prev[minister.id], role: e.target.value },
                      }))
                    }
                    className="w-full p-3 rounded-lg bg-[#1E293B]/60 text-white border border-[#334155]"
                    placeholder="Current role"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                 
                  <input
                    type="text"
                    value={state.joinedDate}
                    onChange={(e) =>
                      setEditingStates((prev) => ({
                        ...prev,
                        [minister.id]: { ...prev[minister.id], joinedDate: e.target.value },
                      }))
                    }
                    className="w-full p-3 rounded-lg bg-[#1E293B]/60 text-white border border-[#334155]"
                    placeholder="Serving since"
                  />
                </div>

                <div className="border border-[#334155] rounded-lg overflow-hidden bg-[#1E293B]/60">
                  <RichTextEditor
                    value={state.metadata}
                    onChange={(val) =>
                      setEditingStates((prev) => ({
                        ...prev,
                        [minister.id]: { ...prev[minister.id], metadata: val },
                      }))
                    }
                  />
                </div>

                <button
                  onClick={() => handleSave(minister)}
                  disabled={saving}
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Update Full-Time Minister"}
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
