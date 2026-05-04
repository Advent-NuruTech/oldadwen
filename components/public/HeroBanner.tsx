"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

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

/* ================= HERO BANNER ================= */
export default function HeroBanner() {
  const typingText = useTyping("Prepare to meet the LORD thy God", 100, 2000);

  return (
    <motion.section
      className="relative w-screen h-screen overflow-hidden flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* ===== Background Video (fills screen, can crop) ===== */}
      <video
        src="/hero/video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ===== Foreground Video (main focus, always visible) ===== */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <video
          src="/hero/video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="max-w-full max-h-full w-auto h-auto"
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* ===== Gradient Overlay ===== */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-800/50 to-blue-900/70 md:bg-gradient-to-r md:from-blue-900/80 md:via-blue-800/60 md:to-transparent" />

      {/* ===== Floating Particles ===== */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* ===== Centered Content ===== */}
      <div className="relative z-10 h-full w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="text-left lg:text-left order-2 lg:order-1">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <motion.h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blue-50 mb-4 lg:mb-6 leading-tight">
                Old Seventh Day {" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                  Adventists
                </span>
              </motion.h1>

              <motion.h2 className="text-xl sm:text-2xl md:text-3xl text-cyan-100 mb-4 lg:mb-8 font-medium">
                Restoring all things
              </motion.h2>

              <motion.div className="text-lg sm:text-xl md:text-2xl text-cyan-100 mb-8 lg:mb-12 min-h-[1.6em] font-light">
                <span className="inline-block">
                  {typingText}
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="ml-1">
                    |
                  </motion.span>
                </span>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div className="flex flex-wrap gap-3 sm:gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}>
                <Link href="/sabbath-school" className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 text-base sm:text-lg flex-1 sm:flex-none text-center min-w-[140px] hover:from-blue-500 hover:to-blue-600">
                  <span className="relative z-10">Sabbath School</span>
                </Link>

                <Link href="/library" className="group relative overflow-hidden border-2 border-blue-500 text-blue-50 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-xl hover:scale-105 active:scale-95 text-base sm:text-lg flex-1 sm:flex-none text-center min-w-[140px]">
                  <span className="relative z-10">Bible Studies</span>
                </Link>

                <Link href="/blog" className="group relative overflow-hidden border-2 border-cyan-300 text-cyan-100 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 hover:bg-cyan-400 hover:text-blue-900 hover:shadow-xl hover:scale-105 active:scale-95 text-base sm:text-lg flex-1 sm:flex-none text-center min-w-[140px]">
                  <span className="relative z-10">Calendar</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative Element */}
          <motion.div className="hidden lg:block order-1 lg:order-2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 1 }}>
            <div className="relative w-full h-64 lg:h-96">
              <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full animate-pulse" />
              <div className="absolute inset-8 border border-cyan-400/20 rounded-full animate-spin-slow" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-6 h-10 border-2 border-blue-500 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-blue-500 rounded-full" />
        </div>
      </motion.div>
    </motion.section>
  );
}