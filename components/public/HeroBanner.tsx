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

/* Typing Hook */
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

/* Professional Background Images */
const heroImages = [
  "/images/hero/6.jpeg",
  "/images/hero/5.jpeg",
  "/images/hero/8.jpeg",
  "/images/hero/1.jpeg",
 
];

export default function HeroBanner() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const typingText = useTyping("Prepare to meet the LORD thy God");

  /* Fetch Videos */
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

  /* Rotate Videos */
  useEffect(() => {
    if (!videos.length) return;

    intervalRef.current = setInterval(() => {
      setCurrentVideo((p) => (p + 1) % videos.length);
    }, 600000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [videos]);

  /* Rotate Background Images */
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 7000);

    return () => clearInterval(imageInterval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center bg-black">
      {/* BACKGROUND IMAGE SLIDER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={heroImages[currentImage]}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
        >
          <img
            src={heroImages[currentImage]}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* PREMIUM OVERLAYS */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/50 z-10" />

      {/* LIGHT EFFECT */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 blur-[140px] rounded-full z-10" />

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-400/10 blur-[120px] rounded-full z-10" />

      {/* CONTENT */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* LEFT CONTENT */}
          <div className="max-w-2xl">
            {/* SMALL LABEL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />

           
            </motion.div>

            {/* TITLE */}
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white"
            >
              Old Seventh Day{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-blue-600">
                Adventists
              </span>
            </motion.h1>

            {/* SUBTITLE */}
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1 }}
              className="mt-5 text-xl sm:text-2xl text-blue-100 font-medium leading-relaxed"
            >
              Restoring all things through Practical Biblical truth. Our Fellowship is with the Father and the Son
            </motion.h2>

            {/* TYPING TEXT */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 min-h-[40px]"
            >
              <p className="text-lg sm:text-xl font-semibold text-cyan-200">
                {typingText}
                <span className="animate-pulse ml-1">|</span>
              </p>
            </motion.div>

            {/* BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/sabbath-school"
                className="group relative overflow-hidden rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-blue-500"
              >
                <span className="relative z-10">Sabbath School</span>
              </Link>

              <Link
                href="/library"
                className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-md px-7 py-4 font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:scale-105"
              >
                Bible Studies
              </Link>

              <Link
                href="/calendar"
                className="rounded-xl border border-cyan-400/30 bg-cyan-400/5 backdrop-blur-md px-7 py-4 font-semibold text-cyan-100 transition-all duration-300 hover:bg-cyan-400/10 hover:scale-105"
              >
                Calendar
              </Link>

              <Link
                href="/reports"
                className="rounded-xl border border-blue-400/30 bg-blue-400/5 backdrop-blur-md px-7 py-4 font-semibold text-blue-100 transition-all duration-300 hover:bg-blue-400/10 hover:scale-105"
              >
                Reports
              </Link>

              <Link
                href="/finance"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105"
              >
                Donate
              </Link>
            </motion.div>
          </div>

          {/* RIGHT VIDEO CARD */}
          <motion.div
            initial={{ opacity: 0, x: 70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-2xl">
              {/* GLOW */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 blur-2xl rounded-3xl" />

              {/* CARD */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-20" />

                <div className="aspect-video relative">
                  <AnimatePresence mode="wait">
                    {videos.length > 0 && (
                      <motion.iframe
                        key={videos[currentVideo].videoId}
                        src={`https://www.youtube.com/embed/${videos[currentVideo].videoId}?autoplay=1&mute=1&controls=0&rel=0&loop=1&playlist=${videos[currentVideo].videoId}`}
                        className="absolute inset-0 w-full h-full"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
                </div>

                {/* BOTTOM INFO */}
                <div className="p-5 border-t border-white/10 bg-black/40 backdrop-blur-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Featured Gospel Messages
                      </h3>

                      <p className="text-blue-100/70 text-sm mt-1">
                        Watch sermons, Bible studies, and mission reports.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {videos.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 rounded-full transition-all duration-500 ${
                            index === currentVideo
                              ? "w-8 bg-cyan-400"
                              : "w-2 bg-white/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
          }}
          className="w-7 h-12 rounded-full border border-white/30 flex justify-center pt-2 backdrop-blur-md bg-white/5"
        >
          <div className="w-1.5 h-3 rounded-full bg-white" />
        </motion.div>
      </div>
    </section>
  );
}