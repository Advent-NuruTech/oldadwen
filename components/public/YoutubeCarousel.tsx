"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { motion } from "framer-motion";

interface Video {
  id: string;
  videoId: string;
}

export default function YoutubeCarousel() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const q = query(
        collection(db, "youtubeVideos"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const videoData: Video[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        videoId: doc.data().videoId,
      }));

      setVideos(videoData);
    };

    fetchVideos();
  }, []);

  return (
    <main
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-fixed pt-28 pb-20"
      style={{
        backgroundImage: "url('/images/nature1.jpg')",
      }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl md:text-6xl font-black text-white">
            OLD SDA <span className="text-cyan-300">VIDEOS</span>
          </h1>

          <p className="text-cyan-100 mt-5 text-lg md:text-2xl font-medium max-w-3xl mx-auto">
            Sermons, Campmeetings, Missions & Truth-filled Messages
          </p>

          <div className="w-32 h-1 bg-cyan-400 mx-auto rounded-full mt-6" />

          <p className="text-slate-200 mt-6 text-base md:text-xl italic max-w-4xl mx-auto leading-relaxed">
            “And this gospel of the kingdom shall be preached in all the world
            for a witness unto all nations; and then shall the end come.”
            — Matthew 24:14
          </p>
        </motion.div>

        {/* EMPTY STATE */}
        {videos.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <div className="bg-slate-950/80 border border-cyan-800 rounded-2xl px-10 py-8 backdrop-blur-md shadow-2xl">
              <p className="text-cyan-100 text-xl text-center">
                No videos uploaded yet
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* VIDEO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-slate-950/85 border border-slate-800 hover:border-cyan-500 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md transition duration-500">
                    {/* VIDEO */}
                    <div className="relative aspect-video overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.videoId}`}
                        className="w-full h-full"
                        allowFullScreen
                        title="YouTube video player"
                      />
                    </div>

                    {/* FOOTER */}
                    <div className="p-5">
                      <h2 className="text-white font-bold text-lg md:text-xl line-clamp-2">
                        Old SDA Video Message
                      </h2>

                      <p className="text-slate-300 mt-3 text-sm md:text-base leading-relaxed">
                        Watch and share present truth messages, missionary
                        reports, campmeetings, Bible studies and gospel outreach
                        content.
                      </p>

                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-cyan-300 text-sm font-semibold">
                          Gospel Media
                        </span>

                        <a
                          href={`https://www.youtube.com/watch?v=${video.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-full transition"
                        >
                          Watch
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* FOOTER SECTION */}
            <div className="mt-20 bg-slate-950/90 border border-cyan-800 rounded-3xl p-8 md:p-12 text-center backdrop-blur-md shadow-2xl">
              <h2 className="text-3xl md:text-5xl font-black text-cyan-300">
                Spreading Present Truth
              </h2>

              <p className="text-slate-200 mt-5 text-lg md:text-2xl max-w-4xl mx-auto leading-relaxed">
                Through digital evangelism, sermons, Bible studies and mission
                reports, we continue proclaiming the everlasting gospel and the
                old paths.
              </p>

              <div className="h-px bg-slate-700 max-w-xl mx-auto my-8" />

              <p className="text-cyan-100 italic text-lg md:text-xl">
                “Cry aloud, spare not, lift up thy voice like a trumpet...”
              </p>

              <p className="text-slate-400 mt-2">Isaiah 58:1</p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}