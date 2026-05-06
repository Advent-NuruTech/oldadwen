"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import RichTextEditor from "@/components/RichTextEditor";
import { AnimatePresence, motion } from "framer-motion";

const capitalizeEachWord = (str: string): string => {
  if (!str) return "";
  return str
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

export default function AddMemberPage() {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState("");
  const [role, setRole] = useState("");

  const [existingRoles, setExistingRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // ROLE MODAL
  const [roleModal, setRoleModal] = useState(false);
  const [newRole, setNewRole] = useState("");

  // TOAST
  const [toast, setToast] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error" | "info", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // FETCH ROLES
  const fetchRoles = async () => {
    const snap = await getDocs(collection(db, "roles"));

    const roles = new Set<string>();

    snap.forEach((d) => {
      const r = d.data().name;
      if (r?.trim()) roles.add(capitalizeEachWord(r));
    });

    setExistingRoles(Array.from(roles).sort());
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // CREATE ROLE (MODERN)
  const createRole = async () => {
    if (!newRole.trim()) return;

    const formatted = capitalizeEachWord(newRole);

    await addDoc(collection(db, "roles"), {
      name: formatted,
      createdAt: serverTimestamp(),
    });

    setRole(formatted);
    setNewRole("");
    setRoleModal(false);

    await fetchRoles();

    showToast("success", `Role "${formatted}" created`);
  };

  // CREATE MEMBER (WITH IMAGE FIXED)
  const handleSubmit = async () => {
    if (!name.trim()) return;

    setLoading(true);

    try {
      let imageUrl = "";

      // ✅ IMAGE UPLOAD RESTORED
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      await addDoc(collection(db, "members"), {
        name: name.trim(),
        imageUrl, // ✅ now properly stored
        metadata,
        role: role.trim() || "",
        createdAt: serverTimestamp(),
      });

      setName("");
      setImageFile(null);
      setMetadata("");
      setRole("");

      showToast("success", "Member added successfully");
    } catch (err) {
      showToast("error", "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B]">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* TOAST */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`
                fixed bottom-6 right-6 z-50
                px-4 py-3 rounded-xl text-white text-sm
                backdrop-blur-md border shadow-xl
                ${
                  toast.type === "success"
                    ? "bg-green-500/20 border-green-400"
                    : toast.type === "error"
                    ? "bg-red-500/20 border-red-400"
                    : "bg-blue-500/20 border-blue-400"
                }
              `}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ROLE MODAL */}
        <AnimatePresence>
          {roleModal && (
            <motion.div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-[90%] max-w-md bg-[#0F172A] border border-[#334155] rounded-2xl p-6 space-y-4">
                <h2 className="text-white text-lg font-bold">
                  Create New Role
                </h2>

                <input
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Enter role name..."
                  className="w-full p-3 rounded-lg bg-[#1E293B] text-white border border-[#334155]"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setRoleModal(false)}
                    className="text-gray-400"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={createRole}
                    className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Save Role
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Add New Member</h1>
        </div>

        {/* FORM */}
        <section className="rounded-2xl p-6 space-y-6 bg-[#1E293B]/40 border border-[#334155]">

          {/* NAME */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Member name"
            className="w-full p-3 rounded-lg bg-[#0F172A] text-white border border-[#334155]"
          />

          {/* ROLE */}
          <div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0F172A] text-white border border-[#334155]"
            >
              <option value="">Select role</option>
              {existingRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <button
              onClick={() => setRoleModal(true)}
              className="mt-2 text-sm text-blue-400 hover:underline"
            >
              + Add new role
            </button>
          </div>

          {/* IMAGE UPLOAD (RESTORED FIX) */}
          <div>
            <label className="text-sm text-[#60A5FA]">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full text-white mt-2"
            />
          </div>

          {/* DETAILS */}
          <RichTextEditor value={metadata} onChange={setMetadata} />

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-r from-blue-600 to-blue-800"
          >
            {loading ? "Saving..." : "Add Member"}
          </button>
        </section>
      </div>
    </main>
  );
}