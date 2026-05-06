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
import { AnimatePresence, motion } from "framer-motion";

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
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};

export default function AddMember({ member }: AddMemberProps) {
  const [name, setName] = useState(member?.name ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState(member?.metadata ?? "");
  const [role, setRole] = useState(member?.role ?? "");
  const [loading, setLoading] = useState(false);
  const [existingRoles, setExistingRoles] = useState<string[]>([]);

  // MODAL STATE
  const [roleModalOpen, setRoleModalOpen] = useState(false);
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
    const roleQ = query(collection(db, "roles"));
    const snapshot = await getDocs(roleQ);

    const roles = new Set<string>();

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.name?.trim()) {
        roles.add(capitalizeEachWord(data.name));
      }
    });

    setExistingRoles(Array.from(roles).sort());
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // CREATE MEMBER
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

        showToast("success", "Member updated successfully");
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

        showToast("success", "Member added successfully");
      }
    } catch (err) {
      showToast("error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // CREATE ROLE (MODAL)
  const handleCreateRole = async () => {
    if (!newRole.trim()) return;

    const formatted = capitalizeEachWord(newRole);

    await addDoc(collection(db, "roles"), {
      name: formatted,
      createdAt: serverTimestamp(),
    });

    setRole(formatted);
    setNewRole("");
    setRoleModalOpen(false);

    await fetchRoles();

    showToast("success", `Role "${formatted}" created`);
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
      relative
    ">

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`
              fixed bottom-6 right-6 z-50
              px-4 py-3 rounded-xl shadow-xl
              text-white text-sm font-medium
              backdrop-blur-md border
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
        {roleModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="
                w-[90%] max-w-md
                bg-[#0F172A]
                border border-[#334155]
                rounded-2xl
                p-6 space-y-4
              "
            >
              <h2 className="text-white text-lg font-bold">
                Create New Role
              </h2>

              <input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Enter role name..."
                className="
                  w-full p-3 rounded-lg
                  bg-[#1E293B]
                  text-white
                  border border-[#334155]
                  outline-none
                "
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setRoleModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreateRole}
                  className="
                    px-4 py-2 rounded-lg text-white text-sm
                    bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]
                  "
                >
                  Save Role
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
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
          className="
            w-full p-3 rounded-lg
            bg-[#1E293B]/60 text-white
            border border-[#334155]
            outline-none
          "
        />
      </div>

      {/* ROLE */}
      <div>
        <label className="block mb-2 text-sm font-semibold text-[#60A5FA]">
          Role
        </label>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="
            w-full p-3 rounded-lg
            bg-[#1E293B]/60 text-white
            border border-[#334155]
            outline-none
          "
        >
          <option value="">Select role</option>
          {existingRoles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button
          onClick={() => setRoleModalOpen(true)}
          className="mt-2 text-sm text-[#60A5FA] hover:underline"
        >
          + Add new role
        </button>
      </div>

      {/* IMAGE */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
      />

      {/* METADATA */}
      <RichTextEditor value={metadata} onChange={setMetadata} />

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="
          w-full py-3 rounded-lg text-white font-bold
          bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]
        "
      >
        {loading ? "Saving..." : member ? "Update Member" : "Add Member"}
      </button>
    </div>
  );
}