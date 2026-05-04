"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import RichTextEditor from "@/components/RichTextEditor";

const capitalizeEachWord = (str: string): string => {
  if (!str) return "";
  return str
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

export default function AddMemberPage() {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState("");
  const [role, setRole] = useState("");
  const [existingRoles, setExistingRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      const q = query(collection(db, "members"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      const roles = new Set<string>();
      snap.forEach((d) => {
        const r = d.data().role;
        if (r?.trim()) roles.add(capitalizeEachWord(r));
      });

      setExistingRoles(Array.from(roles).sort());
    };

    fetchRoles();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setLoading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      await addDoc(collection(db, "members"), {
        name: name.trim(),
        imageUrl,
        metadata,
        role: role.trim() || "",
        createdAt: serverTimestamp(),
      });

      // reset
      setName("");
      setImageFile(null);
      setMetadata("");
      setRole("");
    } finally {
      setLoading(false);
    }
  };

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
              Members
            </span>
          </div>

          <h1 className="text-4xl font-extrabold text-white">
            Add New Member
          </h1>

          <p className="text-gray-400 mt-2">
            Create and manage church members
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

          {/* NAME */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
              Member Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
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

          {/* ROLE */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
              Role <span className="text-gray-400 text-xs">(Optional)</span>
            </label>

            <select
              value={role}
              onChange={(e) => {
                if (e.target.value === "new") {
                  const r = prompt("Enter new role:");
                  if (r) setRole(capitalizeEachWord(r));
                } else {
                  setRole(e.target.value);
                }
              }}
              className="
                w-full p-3 rounded-lg
                bg-[#1E293B]/60 text-white
                border border-[#334155]
                focus:border-[#60A5FA]
                focus:ring-2 focus:ring-[#60A5FA]/20
                outline-none
              "
            >
              <option value="">Select role</option>
              {existingRoles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
              <option value="new">+ Add new role</option>
            </select>
          </div>

          {/* IMAGE */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
              Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
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

          {/* DETAILS */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
              Member Details
            </label>

            <div className="
              border border-[#334155]
              rounded-lg overflow-hidden
              bg-[#1E293B]/60
            ">
              <RichTextEditor value={metadata} onChange={setMetadata} />
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
            {loading ? "Saving..." : "Add Member"}
          </button>

        </section>
      </div>
    </main>
  );
}