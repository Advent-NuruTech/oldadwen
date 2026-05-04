"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import RichTextEditor from "../RichTextEditor";

interface MemberData {
  id: string;
  name: string;
  imageUrl: string;
  metadata: string;
  role?: string;
}

interface AddMemberProps {
  member?: MemberData;
}

const capitalizeEachWord = (str: string): string => {
  if (!str) return "";
  return str
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function AddMember({ member }: AddMemberProps) {
  const [name, setName] = useState(member?.name ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState(member?.metadata ?? "");
  const [role, setRole] = useState(member?.role ?? "");
  const [loading, setLoading] = useState(false);
  const [existingRoles, setExistingRoles] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const q = query(collection(db, "members"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const roles = new Set<string>();

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.role?.trim()) {
          roles.add(capitalizeEachWord(data.role));
        }
      });

      setExistingRoles(Array.from(roles).sort());
    };

    fetchRoles();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setLoading(true);

    try {
      let imageUrl = member?.imageUrl ?? "";

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      if (member) {
        await updateDoc(doc(db, "members", member.id), {
          name: name.trim(),
          imageUrl,
          metadata,
          role: role.trim() || "",
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "members"), {
          name: name.trim(),
          imageUrl,
          metadata,
          role: role.trim() || "",
          createdAt: serverTimestamp(),
        });

        setName("");
        setImageFile(null);
        setMetadata("");
        setRole("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      rounded-2xl overflow-hidden
      bg-gradient-to-br from-[#1E293B]/40 via-[#0F172A]/40 to-[#1E1B4B]/40
      backdrop-blur-sm
      border border-[#334155]
      shadow-2xl
      p-6 md:p-8
      space-y-6
    ">

      {/* TITLE (optional but consistent) */}
      <div className="border-b border-[#334155] pb-4">
        <h2 className="text-2xl font-bold text-white">
          {member ? "Edit Member" : "Add New Member"}
        </h2>
        <p className="text-sm text-[#60A5FA] mt-1">
          Manage member information and roles
        </p>
      </div>

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
            transition-all
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

      {/* METADATA */}
      <div>
        <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
          Details
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
        {loading ? "Saving..." : member ? "Update Member" : "Add Member"}
      </button>
    </div>
  );
}