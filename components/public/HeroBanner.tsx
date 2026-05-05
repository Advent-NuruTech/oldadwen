"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

interface Video {
  id: string;
  videoId: string;
}

/* Typing hook unchanged */
function useTyping(text: string, speed = 90, repeatDelay = 2000) {
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

export default function HeroBanner() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const typingText = useTyping("Prepare to meet the LORD thy God");

  useEffect(() => {
    const fetchVideos = async () => {
      const q = query(
        collection(db, "youtubeVideos"),
        orderBy("createdAt", "desc"),
        limit(5)
      );

      const snapshot = await getDocs(q);

      setVideos(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          videoId: doc.data().videoId,
        }))
      );
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (!videos.length) return;

    intervalRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % videos.length);
    }, 600000); // 🔥 10 minutes rotation

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [videos]);

  return (
    <section className="relative w-full min-h-screen bg-black overflow-hidden flex items-center">
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-blue-950/70 to-black/90 z-10" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* TEXT SIDE */}
          <div className="flex flex-col justify-center pt-4 lg:pt-0">
            <motion.h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Old Seventh Day{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Adventists
              </span>
            </motion.h1>

            <h2 className="mt-3 text-lg sm:text-2xl font-semibold text-blue-100">
              Restoring all things
            </h2>

            <div className="mt-4 text-blue-100 text-base sm:text-lg font-medium min-h-[32px]">
              {typingText}
              <span className="animate-pulse ml-1">|</span>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="bg-blue-600 px-5 py-3 rounded-lg text-white font-semibold" href="/sabbath-school">
                Sabbath School
              </Link>

              <Link className="border border-blue-400 px-5 py-3 rounded-lg text-blue-100 font-semibold" href="/library">
                Bible Studies
              </Link>

              <Link className="border border-cyan-300 px-5 py-3 rounded-lg text-cyan-100 font-semibold" href="/calendar">
                Calendar
              </Link>
            </div>
          </div>

          {/* VIDEO SIDE */}
          <div className="w-full flex justify-center lg:justify-end mt-6 lg:mt-0">
            <div className="relative w-full max-w-xl aspect-video rounded-xl overflow-hidden shadow-2xl">

              <AnimatePresence mode="wait">
                {videos.length > 0 && (
                  <motion.iframe
                    key={videos[current].videoId}
                    src={`https://www.youtube.com/embed/${videos[current].videoId}?autoplay=1&mute=1&controls=0&rel=0&loop=1&playlist=${videos[current].videoId}`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  />
                )}
              </AnimatePresence>

              {/* subtle overlay */}
              <div className="absolute inset-0 bg-black/20" />
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
    </section>
  );
}