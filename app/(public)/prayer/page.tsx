"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPrayingHands,
  FaHeart,
  FaCheckCircle,
  FaPhone,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";

/* ===================== MAIN PAGE ===================== */
export default function PrayerPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    request: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const quotes = [
    "The Lord is near to all who call upon Him. — Psalm 145:18",
    "Cast your burden upon the Lord and He will sustain you. — Psalm 55:22",
    "With God all things are possible. — Matthew 19:26",
    "God is our refuge and strength. — Psalm 46:1",
  ];

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "prayerRequests"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setFormData({ name: "", phone: "", email: "", request: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050B1A] text-white">

      {/* 🌌 BACKGROUND GLOW LAYERS */}
      <div className="absolute inset-0">
        <div className="absolute w-[600px] h-[600px] bg-blue-600/20 blur-3xl rounded-full top-[-200px] left-[-200px]" />
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full bottom-[-150px] right-[-150px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* HEADER */}
              <div className="text-center mb-14">

                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <FaPrayingHands className="text-3xl" />
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold mt-6">
                  Prayer Request
                </h1>

                <p className="text-blue-200 mt-3 max-w-xl mx-auto">
                  Share your burden with us. As{" "}
                  <span className="text-cyan-300 font-semibold">
                    Old Seventh Day Adventists
                  </span>
                  , we stand in prayer and faith together.
                </p>

                <div className="h-1 w-24 mx-auto mt-6 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full" />
              </div>

              {/* INFO CARD */}
              <div className="bg-white/5 backdrop-blur-md border border-blue-500/20 rounded-2xl p-6 mb-10">

                <div className="flex gap-3 items-start mb-4">
                  <FaHeart className="text-cyan-400 text-xl mt-1" />
                  <h2 className="text-xl font-semibold">
                    United in prayer, strengthened in faith
                  </h2>
                </div>

                <p className="text-blue-100 leading-relaxed">
                  We believe God hears every prayer. Whatever you are going
                  through, you are not alone. Our team intercedes for you with
                  sincerity and faith.
                </p>

                <div className="mt-5 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-l-4 border-cyan-400 p-4 rounded-xl">
                  <p className="italic text-cyan-100">{quote}</p>
                </div>

              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="bg-white/5 backdrop-blur-md border border-blue-500/20 rounded-2xl p-6 space-y-5"
              >

                <Input icon={<FaUser />} name="name" label="Full Name *" value={formData.name} onChange={handleChange} required />
                <Input icon={<FaPhone />} name="phone" label="Phone Number *" value={formData.phone} onChange={handleChange} required />
                <Input icon={<FaEnvelope />} name="email" label="Email (optional)" value={formData.email} onChange={handleChange} />

                <div>
                  <label className="text-sm text-blue-200">Prayer Request *</label>
                  <textarea
                    name="request"
                    required
                    rows={6}
                    value={formData.request}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-black/30 border border-blue-500/30 focus:ring-2 focus:ring-cyan-400 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-600 transition shadow-lg"
                >
                  {loading ? "Submitting..." : "Submit Prayer Request"}
                </button>

              </form>

            </motion.div>
          ) : (
            <motion.div className="text-center">

              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
                <FaCheckCircle className="text-3xl" />
              </div>

              <h2 className="text-3xl font-bold">
                Request Received
              </h2>

              <p className="text-blue-200 mt-3 mb-8">
                We are praying with you. Stay encouraged in Christ.
              </p>

              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-cyan-500 transition"
              >
                Submit Another Request
              </button>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */
function Input({ icon, label, ...props }: any) {
  return (
    <div>
      <label className="text-sm text-blue-200">{label}</label>
      <div className="relative mt-2">
        <div className="absolute left-3 top-3 text-blue-400">
          {icon}
        </div>

        <input
          {...props}
          className="w-full pl-10 px-4 py-3 rounded-xl bg-black/30 border border-blue-500/30 focus:ring-2 focus:ring-cyan-400 outline-none"
        />
      </div>
    </div>
  );
}