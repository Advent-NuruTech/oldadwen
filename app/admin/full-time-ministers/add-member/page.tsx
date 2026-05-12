"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
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

// Full-Time Minister specific fields interface
interface FullTimeMinisterData {
  name: string;
  imageUrl: string;
  metadata: string;
  role: string;
  title: string;
  
  
  isFullTime: boolean;
  joinedDate: string;
  ministryFocus: string;
  createdAt: any;
}

export default function AddFullTimeMinisterPage() {
  // Basic member fields
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState("");
  const [role, setRole] = useState("");

  // Full-Time Minister specific fields
  const [title, setTitle] = useState("");
  const [expertise, setExpertise] = useState("");
  const [joinedDate, setJoinedDate] = useState("");
  const [ministryFocus, setMinistryFocus] = useState("");

  const [existingRoles, setExistingRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Predefined full-time minister titles
  const ministerTitles = [
    "Evangelist",
    "Bible Worker",
    "Gospel Minister",
    "Prophetic Preacher",
    "Itinerant Minister",
    "Church Planter",
    "Revivalist",
    "End-Time Messenger",
  ];



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

  // CREATE ROLE
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

  // CREATE FULL-TIME MINISTER
  const handleSubmit = async () => {
    if (!name.trim()) {
      showToast("error", "Minister name is required");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const fullTimeMinisterData: FullTimeMinisterData = {
        name: name.trim(),
        imageUrl,
        metadata,
        role: role.trim() || "Full-Time Minister",
        title: title.trim() || "Gospel Laborer",
       
        isFullTime: true,
        joinedDate: joinedDate || new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        }),
        ministryFocus: ministryFocus.trim() || "Proclaiming the Everlasting Gospel",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "fullTimeMinisters"), fullTimeMinisterData);

      // Reset form
      setName("");
      setImageFile(null);
      setMetadata("");
      setRole("");
      setTitle("");
      setExpertise("");
      setJoinedDate("");
      setMinistryFocus("");

      showToast("success", "Full-Time Minister added successfully");
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to add full-time minister");
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
              <div className="w-[90%] max-w-md bg-[#0F172A] border border-amber-500/30 rounded-2xl p-6 space-y-4">
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
                    className="px-4 py-2 rounded-lg text-white bg-amber-600 hover:bg-amber-700"
                  >
                    Save Role
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER with Full-Time Minister Badge */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-4">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-amber-300 text-sm font-medium">FULL-TIME GOSPEL MINISTRY</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Add Full-Time Minister</h1>
          <p className="text-gray-400 mt-2">Set apart for sacred, consecrated work</p>
        </div>

        {/* FORM */}
        <section className="rounded-2xl p-6 space-y-6 bg-[#1E293B]/40 border border-amber-500/20">
          {/* NAME */}
          <div>
            <label className="text-sm text-amber-400 font-medium">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Elder John Wesley"
              className="w-full p-3 rounded-lg bg-[#0F172A] text-white border border-[#334155] focus:border-amber-500/50 focus:outline-none transition-colors mt-1"
            />
          </div>

          {/* TITLE - Ministerial position */}
          <div>
            <label className="text-sm text-amber-400 font-medium">Ministerial Title</label>
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0F172A] text-white border border-[#334155] focus:border-amber-500/50 focus:outline-none transition-colors mt-1"
            >
              <option value="">Select title</option>
              {ministerTitles.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="other">Other (type manually)</option>
            </select>
            {title === "other" && (
              <input
                value={title === "other" ? "" : title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter custom title..."
                className="w-full p-3 rounded-lg bg-[#0F172A] text-white border border-[#334155] mt-2"
              />
            )}
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm text-amber-400 font-medium">Role / Designation</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0F172A] text-white border border-[#334155] mt-1"
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
              className="mt-2 text-sm text-amber-400 hover:underline"
            >
              + Add new role
            </button>
          </div>

        

   
          

          {/* JOINED DATE */}
          <div>
            <label className="text-sm text-amber-400 font-medium">Serving Since</label>
            <input
              value={joinedDate}
              onChange={(e) => setJoinedDate(e.target.value)}
              placeholder="e.g., January 2020 or 2020"
              className="w-full p-3 rounded-lg bg-[#0F172A] text-white border border-[#334155] focus:border-amber-500/50 focus:outline-none transition-colors mt-1"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-sm text-amber-400 font-medium">Minister Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full text-white mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700 transition-colors"
            />
            {imageFile && (
              <p className="text-xs text-gray-400 mt-1">Selected: {imageFile.name}</p>
            )}
          </div>

          {/* DETAILS / BIOGRAPHY */}
          <div>
            <label className="text-sm text-amber-400 font-medium">Biography / Ministry Details</label>
            <RichTextEditor value={metadata} onChange={setMetadata} />
          </div>

          {/* DIVIDER */}
          <div className="border-t border-amber-500/20 pt-4">
            <div className="bg-amber-500/5 rounded-lg p-4 border border-amber-500/10">
              <p className="text-xs text-amber-400/70 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Full-time ministers are those wholly consecrated to gospel work, set apart for sacred ministry.
              </p>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Full-Time Minister...
              </span>
            ) : (
              "Add Full-Time Minister"
            )}
          </button>
        </section>

        {/* INFO NOTE */}
        <div className="text-center text-xs text-gray-500">
          <p>These ministers will appear on the <span className="text-amber-400">/full-time-ministers</span> page</p>
          <p className="mt-1">All fields marked with dedicated full-time minister status</p>
        </div>
      </div>
    </main>
  );
}
