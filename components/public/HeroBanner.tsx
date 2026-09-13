"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Video {
  id: string;
  videoId: string;
}

const heroImages = [
  "/hero/6.jpeg",
  "/hero/5.jpeg",
  "/hero/8.jpeg",
  "/hero/1.jpeg",
];

function useTypingText(text: string, typingSpeed = 55) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let characterIndex = 0;
    let isDeleting = false;
    let typingTimeout: number;

    const typeNextCharacter = () => {
      characterIndex += isDeleting ? -1 : 1;
      setDisplayedText(text.slice(0, characterIndex));

      let nextDelay = isDeleting ? 28 : typingSpeed;

      if (!isDeleting && characterIndex === text.length) {
        isDeleting = true;
        nextDelay = 2200;
      } else if (isDeleting && characterIndex === 0) {
        isDeleting = false;
        nextDelay = 650;
      }

      typingTimeout = window.setTimeout(typeNextCharacter, nextDelay);
    };

    typingTimeout = window.setTimeout(typeNextCharacter, 350);

    return () => window.clearTimeout(typingTimeout);
  }, [text, typingSpeed]);

  return displayedText;
}

export default function HeroBanner() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const fellowshipText = useTypingText(
    "Our Fellowship is with the Father and the Son."
  );

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosQuery = query(
          collection(db, "youtubeVideos"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const snapshot = await getDocs(videosQuery);

        setVideos(
          snapshot.docs.map((document) => ({
            id: document.id,
            videoId: document.data().videoId,
          }))
        );
      } catch (error) {
        console.error("Unable to load featured videos", error);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (videos.length < 2) return;

    const videoInterval = window.setInterval(() => {
      setCurrentVideo((previous) => (previous + 1) % videos.length);
    }, 600000);

    return () => window.clearInterval(videoInterval);
  }, [videos]);

  useEffect(() => {
    const imageInterval = window.setInterval(() => {
      setCurrentImage((previous) => (previous + 1) % heroImages.length);
    }, 7000);

    return () => window.clearInterval(imageInterval);
  }, []);

  return (
    <section className="relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-[#050816]">
      <AnimatePresence initial={false} mode="sync">
        <motion.img
          key={heroImages[currentImage]}
          src={heroImages[currentImage]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-30 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(3,7,18,0.84)_0%,rgba(3,7,18,0.62)_43%,rgba(3,7,18,0.16)_74%,rgba(3,7,18,0.3)_100%)]" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(0deg,rgba(3,7,18,0.78)_0%,transparent_52%,rgba(3,7,18,0.2)_100%)]" />
      <div className="absolute left-[12%] top-[18%] -z-10 h-72 w-72 rounded-full bg-brand-blue/20 blur-[120px]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-brand-blue/60 to-transparent" />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-24">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08 }}
            className="max-w-xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
          >
            Restoring
            <span className="block text-brand-blue">all things.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16 }}
            className="mt-7 max-w-xl text-base leading-8 text-slate-200 sm:text-lg"
          >
            A fellowship grounded in Scripture, growing in faith, and preparing
            hearts for the coming of the Lord.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 min-h-7 text-base font-medium text-white sm:text-lg"
            aria-label="Our Fellowship is with the Father and the Son."
          >
            <span aria-hidden="true">{fellowshipText}</span>
            <span
              aria-hidden="true"
              className="ml-1 inline-block h-[1.1em] w-0.5 translate-y-0.5 animate-pulse bg-brand-blue"
            />
          </motion.p>

          <motion.blockquote
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.24 }}
            className="mt-7 border-l-2 border-brand-blue pl-4 text-sm font-medium tracking-wide text-white/75 sm:text-base"
          >
            “Prepare to meet the LORD thy God.”
            <cite className="ml-2 not-italic text-white/45">— Amos 4:12</cite>
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.32 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              href="/events"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-brand-blue px-7 font-semibold text-white shadow-[0_16px_40px_rgba(37,99,235,0.32)] transition duration-300 hover:-translate-y-0.5 hover:bg-brand-blue-hover hover:shadow-[0_18px_50px_rgba(37,99,235,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
            >
              Explore events
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>

            <Link
              href="/donate"
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.07] px-7 font-semibold text-white backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-brand-blue/70 hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
            >
              Support the mission
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.15 }}
          className="w-full lg:pl-4"
        >
          <div className="relative mx-auto max-w-2xl lg:mx-0 lg:ml-auto">
            <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-brand-blue/15 blur-3xl" />

            <div className="overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#071024]/80 shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              <div className="relative aspect-video overflow-hidden bg-[#081329]">
                <AnimatePresence mode="wait">
                  {videos.length > 0 ? (
                    <motion.iframe
                      key={videos[currentVideo].videoId}
                      src={`https://www.youtube.com/embed/${videos[currentVideo].videoId}?autoplay=1&mute=1&controls=0&rel=0&loop=1&playlist=${videos[currentVideo].videoId}`}
                      title="Featured gospel message"
                      className="absolute inset-0 h-full w-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7 }}
                    />
                  ) : (
                    <motion.div
                      key="video-placeholder"
                      className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.22),transparent_65%)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur-md">
                        <Play className="ml-1 h-6 w-6 fill-current" aria-hidden="true" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050816]/60 via-transparent to-transparent" />

              </div>

              <div className="flex items-center justify-between gap-5 border-t border-white/10 px-5 py-5 sm:px-6">
                <div>
                  <h2 className="font-semibold tracking-tight text-white sm:text-lg">
                    Gospel messages
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Sermons, Bible studies, and mission reports
                  </p>
                </div>

                {videos.length > 1 && (
                  <div className="flex items-center gap-1.5" aria-label="Video position">
                    {videos.map((video, index) => (
                      <span
                        key={video.id}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          index === currentVideo
                            ? "w-7 bg-brand-blue"
                            : "w-1.5 bg-white/25"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 sm:flex" aria-hidden="true">
        {heroImages.map((image, index) => (
          <span
            key={image}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentImage ? "w-8 bg-brand-blue" : "w-2 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
