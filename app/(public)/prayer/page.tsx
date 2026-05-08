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
    <main
      className="min-h-screen text-white bg-cover bg-center bg-fixed relative pt-28 pb-16 px-4"
      style={{
        backgroundImage: "url('/images/nature1.jpg')",
      }}
    >
      {/* GLOBAL OVERLAY - Same as About page */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6">
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* HEADER - Same style as About page */}
              <div className="text-center pt-6 md:pt-10 mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-400/30 mb-6">
                  <FaPrayingHands className="text-3xl text-cyan-300" />
                </div>

                <h1 className="text-4xl md:text-6xl font-black">
                  PRAYER <span className="text-cyan-300">REQUEST</span>
                </h1>

                <p className="text-cyan-100 mt-4 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                  Share your burden with us. As{" "}
                  <span className="text-cyan-300 font-semibold">
                    Old Seventh Day Adventists
                  </span>
                  , we stand in prayer and faith together.
                </p>

                <p className="text-slate-200 mt-6 text-base md:text-lg max-w-3xl mx-auto italic">
                  “The LORD is nigh unto all them that call upon him, to all that call upon him in truth.” — Psalm 145:18
                </p>
              </div>

              {/* INFO CARD - Matching About page card style */}
              <div className="bg-slate-950/90 backdrop-blur-sm border border-cyan-800 rounded-2xl p-6 md:p-8 mb-8">
                <div className="flex gap-3 items-start mb-4">
                  <FaHeart className="text-cyan-400 text-xl mt-1" />
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    United in prayer, strengthened in faith
                  </h2>
                </div>

                <p className="text-slate-300 leading-relaxed text-base md:text-lg">
                  We believe God hears every prayer. Whatever you are going
                  through, you are not alone. Our team intercedes for you with
                  sincerity and faith.
                </p>

                <div className="mt-5 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-l-4 border-cyan-400 p-4 rounded-r-xl">
                  <p className="italic text-cyan-100 text-base md:text-lg">
                    "{quote}"
                  </p>
                </div>
              </div>

              {/* FORM - Styled like About page content sections */}
              <form
                onSubmit={handleSubmit}
                className="bg-slate-950/90 backdrop-blur-sm border border-cyan-800 rounded-2xl p-6 md:p-8 space-y-6"
              >
                <Input icon={<FaUser />} name="name" label="Full Name *" value={formData.name} onChange={handleChange} required />
                <Input icon={<FaPhone />} name="phone" label="Phone Number *" value={formData.phone} onChange={handleChange} required />
                <Input icon={<FaEnvelope />} name="email" label="Email (optional)" value={formData.email} onChange={handleChange} />

                <div>
                  <label className="text-cyan-200 text-sm md:text-base font-medium">
                    Prayer Request *
                  </label>
                  <textarea
                    name="request"
                    required
                    rows={6}
                    value={formData.request}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-cyan-700/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-white placeholder-gray-400 transition"
                    placeholder="Share your prayer request with us..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Prayer Request"
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center pt-6 md:pt-10"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30">
                <FaCheckCircle className="text-4xl text-white" />
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white">
                Request Received
              </h2>

              <p className="text-cyan-100 mt-4 text-lg md:text-xl max-w-md mx-auto">
                We are praying with you. Stay encouraged in Christ.
              </p>

              <div className="mt-8 p-6 bg-slate-950/50 rounded-2xl border border-cyan-800 max-w-md mx-auto">
                <p className="text-slate-300 italic">"Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness."</p>
                <p className="text-cyan-400 mt-2">— Isaiah 41:10</p>
              </div>

              <button
                onClick={() => setSuccess(false)}
                className="mt-8 px-8 py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg"
              >
                Submit Another Request
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* ================= INPUT COMPONENT ================= */
function Input({ icon, label, ...props }: any) {
  return (
    <div>
      <label className="text-cyan-200 text-sm md:text-base font-medium">
        {label}
      </label>
      <div className="relative mt-2">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400">
          {icon}
        </div>



        <input
          {...props}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-cyan-700/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-white placeholder-gray-400 transition"
        />
      </div>
    </div>
  );
}