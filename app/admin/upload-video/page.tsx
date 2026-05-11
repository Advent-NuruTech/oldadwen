"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface Video {
  id: string;
  videoId: string;
  createdAt: Timestamp;
}

function extractYouTubeID(input: string): string | null {
  try {
    const value = input.trim();

    // Allow direct YouTube video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
      return value;
    }

    // Supports:
    // - watch?v=
    // - youtu.be/
    // - shorts/
    // - live/
    // - embed/
    const regExp =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    const match = value.match(regExp);

    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export default function UploadVideoPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "youtubeVideos"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const vids: Video[] = snap.docs.map((docItem) => ({
        id: docItem.id,
        videoId: docItem.data().videoId,
        createdAt: docItem.data().createdAt,
      }));

      setVideos(vids);
    });

    return () => unsub();
  }, []);

  const handleUpload = async () => {
    if (!videoUrl.trim()) {
      alert("Please enter a YouTube URL or Video ID");
      return;
    }

    const id = extractYouTubeID(videoUrl);

    if (!id) {
      alert("Invalid YouTube URL");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "youtubeVideos"), {
        videoId: id,
        createdAt: Timestamp.now(),
      });

      setVideoUrl("");

      alert("Video uploaded successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to upload video");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Delete this video?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "youtubeVideos", id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete video");
    }
  };

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId(null);
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("Failed to copy link");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D3B66] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Upload YouTube Video
        </h1>

        <p className="text-gray-300 mb-6 text-sm">
          Supports YouTube videos, live streams, shorts, and direct video IDs.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Paste YouTube URL or Video ID"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0A2F52] border border-blue-400 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className={`w-full p-3 rounded-lg transition font-semibold ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Uploaded Videos
          </h2>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {videos.length === 0 && (
              <div className="p-4 rounded-lg bg-[#0A2F52] border border-blue-500 text-gray-300">
                No videos uploaded yet.
              </div>
            )}

            {videos.map((vid) => {
              const url = `https://youtu.be/${vid.videoId}`;

              return (
                <div
                  key={vid.id}
                  className="p-4 rounded-xl bg-[#0A2F52] border border-blue-500"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 mb-1">
                        Video ID
                      </p>

                      <p className="break-all font-medium">
                        {vid.videoId}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-sm font-medium"
                      >
                        View
                      </a>

                      <button
                        onClick={() => handleCopy(url, vid.id)}
                        className={`px-3 py-2 rounded-lg border border-blue-400 transition text-sm font-medium ${
                          copiedId === vid.id
                            ? "bg-blue-700"
                            : "hover:bg-blue-700"
                        }`}
                      >
                        {copiedId === vid.id ? "Copied" : "Copy"}
                      </button>

                      <button
                        onClick={() => handleDelete(vid.id)}
                        className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 aspect-video rounded-lg overflow-hidden border border-blue-400">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${vid.videoId}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}