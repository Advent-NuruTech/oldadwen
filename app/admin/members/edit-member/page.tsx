"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import RichTextEditor from "@/components/RichTextEditor";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface Member {
  id: string;
  name: string;
  imageUrl: string;
  metadata: string;
  role?: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [editingStates, setEditingStates] = useState<{
    [key: string]: { name: string; imageFile: File | null; metadata: string; role: string };
  }>({});

  useEffect(() => {
    const fetchMembers = async () => {
      const q = query(collection(db, "members"), orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
        imageUrl: d.data().imageUrl,
        metadata: d.data().metadata,
        role: d.data().role || "",
      })) as Member[];

      setMembers(data);

      const states: typeof editingStates = {};
      data.forEach((m) => {
        states[m.id] = { 
          name: m.name, 
          imageFile: null, 
          metadata: m.metadata,
          role: m.role || ""
        };
      });
      setEditingStates(states);
      setLoading(false);
    };

    fetchMembers();
  }, []);

  const handleSave = async (member: Member) => {
    const state = editingStates[member.id];
    if (!state || !state.name.trim()) return;

    setSavingIds((p) => [...p, member.id]);

    try {
      let imageUrl = member.imageUrl;
      if (state.imageFile) {
        imageUrl = await uploadToCloudinary(state.imageFile);
      }

      await updateDoc(doc(db, "members", member.id), {
        name: state.name,
        imageUrl,
        metadata: state.metadata,
        role: state.role,
      });

      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id 
            ? { ...m, name: state.name, imageUrl, metadata: state.metadata, role: state.role } 
            : m
        )
      );

      setEditingStates((prev) => ({
        ...prev,
        [member.id]: { ...prev[member.id], imageFile: null },
      }));
    } finally {
      setSavingIds((p) => p.filter((id) => id !== member.id));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B]">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3B82F6]"></div>
          <div className="absolute inset-0 rounded-full bg-[#3B82F6] blur-xl opacity-20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B] p-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center mb-8">
          <div className="inline-block mb-3 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
            <span className="text-xs font-medium text-[#60A5FA]">Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Manage Members
          </h1>
          <p className="text-gray-400 mt-2">Edit member details, roles, and information</p>
        </div>

        {members.map((member) => {
          const state = editingStates[member.id];
          const saving = savingIds.includes(member.id);
          if (!state) return null;

          return (
            <section
              key={member.id}
              className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E293B]/40 via-[#0F172A]/40 to-[#1E1B4B]/40 backdrop-blur-sm border border-[#334155] shadow-2xl transition-all duration-300 hover:shadow-3xl"
            >
              <div className="p-6 space-y-6">
                {/* Header with member name */}
                <div className="flex items-center justify-between border-b border-[#334155] pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {state.name}
                    </h2>
                    {member.role && (
                      <p className="text-sm text-[#60A5FA] mt-1">{member.role}</p>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center">
                    <span className="font-bold text-xl text-white">
                      {state.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
                    Member Image
                  </label>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border border-[#334155] bg-[#1E293B]/60">
                    <Image
                      src={state.imageFile ? URL.createObjectURL(state.imageFile) : member.imageUrl}
                      alt={state.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
                    Change Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0 file:text-sm file:font-semibold
                    file:bg-[#60A5FA] file:text-white file:hover:bg-[#93C5FD]
                    file:cursor-pointer file:transition-all file:duration-300
                    cursor-pointer"
                    onChange={(e) =>
                      setEditingStates((prev) => ({
                        ...prev,
                        [member.id]: {
                          ...prev[member.id],
                          imageFile: e.target.files?.[0] ?? null,
                        },
                      }))
                    }
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
                    Name
                  </label>
                  <input
                    type="text"
                    value={state.name}
                    onChange={(e) =>
                      setEditingStates((prev) => ({
                        ...prev,
                        [member.id]: { ...prev[member.id], name: e.target.value },
                      }))
                    }
                    className="w-full p-3 rounded-lg bg-[#1E293B]/60 text-white border border-[#334155] 
                    focus:border-[#60A5FA] focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/20
                    transition-all duration-300"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
                    Role <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={state.role}
                    onChange={(e) =>
                      setEditingStates((prev) => ({
                        ...prev,
                        [member.id]: { ...prev[member.id], role: e.target.value },
                      }))
                    }
                    placeholder="e.g., Senior Developer, Project Manager"
                    className="w-full p-3 rounded-lg bg-[#1E293B]/60 text-white placeholder:text-gray-500
                    border border-[#334155] focus:border-[#60A5FA] focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/20
                    transition-all duration-300"
                  />
                </div>

                {/* Metadata */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
                    Details
                  </label>
                  <div className="border border-[#334155] rounded-lg overflow-hidden bg-[#1E293B]/60">
                    <RichTextEditor
                      value={state.metadata}
                      onChange={(val) =>
                        setEditingStates((prev) => ({
                          ...prev,
                          [member.id]: { ...prev[member.id], metadata: val },
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Save */}
                <button
                  onClick={() => handleSave(member)}
                  disabled={saving}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]
                  text-white font-bold rounded-lg hover:shadow-2xl hover:scale-105 
                  disabled:opacity-60 disabled:hover:scale-100 transition-all duration-300
                  relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {saving ? "Saving..." : "Update Member"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}