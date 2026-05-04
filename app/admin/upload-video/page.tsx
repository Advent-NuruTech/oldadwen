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

function extractYouTubeID(url: string): string | null {
  try {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
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
    const q = query(collection(db, "youtubeVideos"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const vids: Video[] = snap.docs.map((doc) => ({
        id: doc.id,
        videoId: doc.data().videoId,
        createdAt: doc.data().createdAt,
      }));
      setVideos(vids);
    });
    return () => unsub();
  }, []);

  const handleUpload = async () => {
    if (!videoUrl.trim()) return alert("Enter a valid YouTube URL");
    const id = extractYouTubeID(videoUrl.trim());
    if (!id) return alert("Invalid YouTube URL");

    setLoading(true);
    try {
      await addDoc(collection(db, "youtubeVideos"), {
        videoId: id,
        createdAt: Timestamp.now(),
      });
      setVideoUrl("");
    } catch {
      alert("Failed to upload video");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    await deleteDoc(doc(db, "youtubeVideos", id));
  };

  const handleCopy = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#0D3B66] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Upload YouTube Video
        </h1>

        <input
          type="text"
          placeholder="Paste YouTube URL or Video ID"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full p-2 rounded bg-[#0A2F52] border border-blue-400 placeholder-gray-300 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded transition font-semibold"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        <h2 className="mt-6 text-lg font-semibold">
          Uploaded Videos
        </h2>

        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
          {videos.length === 0 && (
            <p className="text-gray-300">
              No videos uploaded yet.
            </p>
          )}

          {videos.map((vid) => {
            const url = `https://youtu.be/${vid.videoId}`;
            return (
              <div
                key={vid.id}
                className="flex justify-between items-center p-3 rounded bg-[#0A2F52] border border-blue-500"
              >
                <span className="break-all text-sm">
                  {vid.videoId}
                </span>

                <div className="flex gap-3 text-sm">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    View
                  </a>

                  <button
                    onClick={() => handleCopy(url, vid.id)}
                    className={`px-2 py-1 rounded border border-blue-400 ${
                      copiedId === vid.id
                        ? "bg-blue-600"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    {copiedId === vid.id ? "Copied" : "Copy"}
                  </button>

                  <button
                    onClick={() => handleDelete(vid.id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
