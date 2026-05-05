"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

/* ================= TYPES ================= */
interface Video {
  id: string;
  videoId: string;
}

/* ================= TYPING HOOK ================= */
function useTyping(text: string, speed = 100, repeatDelay = 2000) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let index = 0;
    let interval: NodeJS.Timeout;

    const start = () => {
      interval = setInterval(() => {
        setDisplayed(text.slice(0, index + 1));
        index++;

        if (index === text.length) {
          clearInterval(interval);
          setTimeout(() => {
            index = 0;
            setDisplayed("");
            start();
          }, repeatDelay);
        }
      }, speed);
    };

    start();
    return () => clearInterval(interval);
  }, [text, speed, repeatDelay]);

  return displayed;
}

/* ================= HERO ================= */
export default function HeroBanner() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const typingText = useTyping(
    "Prepare to meet the LORD thy God",
    90,
    2000
  );

  /* ===== Fetch latest 5 videos ===== */
  useEffect(() => {
    const fetchVideos = async () => {
      const q = query(
        collection(db, "youtubeVideos"),
        orderBy("createdAt", "desc"),
        limit(5)
      );

      const snapshot = await getDocs(q);

      const vids: Video[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        videoId: doc.data().videoId,
      }));

      setVideos(vids);
    };

    fetchVideos();
  }, []);

  /* ===== Auto slide every 5s ===== */
  useEffect(() => {
    if (videos.length === 0) return;

    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % videos.length);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [videos]);

  return (
    <motion.section
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* ===== BACKGROUND VIDEO SLIDER ===== */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {videos.length > 0 && (
            <motion.iframe
              key={videos[current].videoId}
              src={`https://www.youtube.com/embed/${videos[current].videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${videos[current].videoId}&modestbranding=1`}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-110"
              allow="autoplay; encrypted-media"
              allowFullScreen
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 1 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ===== DARK OVERLAY ===== */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-blue-950/70 to-black/90 z-10" />

      {/* ===== CONTENT ===== */}
      <div className="relative z-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* TEXT */}
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
              Old Seventh Day{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Adventists
              </span>
            </h1>

            <h2 className="mt-4 text-xl sm:text-2xl text-blue-100">
              Restoring all things
            </h2>

            <div className="mt-6 text-lg sm:text-xl text-blue-100 min-h-[40px]">
              {typingText}
              <span className="animate-pulse ml-1">|</span>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sabbath-school"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Sabbath School
              </Link>

              <Link
                href="/library"
                className="border border-blue-400 text-blue-100 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition"
              >
                Bible Studies
              </Link>

              <Link
                href="/calendar"
                className="border border-cyan-300 text-cyan-100 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-400 hover:text-black transition"
              >
                Calendar
              </Link>
            </div>
          </div>

          {/* VISUAL EFFECT */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-72 h-72">
              <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-pulse" />
              <div className="absolute inset-6 rounded-full border border-cyan-300/20 animate-spin" />
              <div className="absolute inset-12 rounded-full bg-blue-500/10 blur-2xl" />
            </div>
          </div>

        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="w-6 h-10 border border-white/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </motion.section>
  );
}