"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface Video {
  id: string;
  videoId: string;
}

export default function YoutubeCarousel() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const q = query(collection(db, "youtubeVideos"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const videoData: Video[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        videoId: doc.data().videoId,
      }));
      setVideos(videoData);
    };
    fetchVideos();
  }, []);

  if (videos.length === 0)
    return <p className="text-center text-[#5A3A23]">No videos yet</p>;

  return (
    <div className="flex overflow-x-auto gap-6 py-4 scrollbar-hide scroll-smooth px-2">
      {videos.map((video) => (
        <div
          key={video.id}
          className="flex-shrink-0 w-[90vw] md:w-[500px] aspect-video rounded-xl overflow-hidden shadow-lg"
        >
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}`}
            className="w-full h-full"
            allowFullScreen
            title="YouTube video player"
          />
        </div>
      ))}
    </div>
  );
}
