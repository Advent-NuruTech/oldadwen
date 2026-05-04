"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import RichTextEditor from "@/components/RichTextEditor";

export default function AddBlogPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (
      !title.trim() ||
      !shortDescription.trim() ||
      !content.trim() ||
      !authorName.trim()
    ) {
      return alert("All fields are required, including author name");
    }

    setLoading(true);

    try {
      let imageUrl = "";

      if (image) {
        const storageRef = ref(
          storage,
          `blog-images/${Date.now()}-${image.name}`
        );

        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "blogs"), {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        authorName: authorName.trim(),
        content,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setShortDescription("");
      setAuthorName("");
      setContent("");
      setImage(null);

      alert("Blog posted successfully!");
      router.push("/admin/blog");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B] p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <div className="inline-block mb-3 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
            <span className="text-xs font-medium text-[#60A5FA]">
              Blog Studio
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Create New Blog
          </h1>

          <p className="text-gray-400 mt-2">
            Write, publish, and share your message
          </p>
        </div>

        {/* FORM CARD */}
        <div
          className="bg-gradient-to-br from-[#1E293B]/40 via-[#0F172A]/40 to-[#1E1B4B]/40
        backdrop-blur-sm border border-[#334155] rounded-2xl p-6 shadow-2xl space-y-5"
        >
          {/* TITLE */}
          <input
            type="text"
            placeholder="Blog title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1E293B]/60 text-white
            border border-[#334155] focus:border-[#60A5FA] outline-none
            placeholder:text-gray-500"
          />

          {/* SHORT DESCRIPTION */}
          <input
            type="text"
            placeholder="Short description..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1E293B]/60 text-white
            border border-[#334155] focus:border-[#60A5FA] outline-none
            placeholder:text-gray-500"
          />

          {/* AUTHOR */}
          <input
            type="text"
            placeholder="Author name..."
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1E293B]/60 text-white
            border border-[#334155] focus:border-[#60A5FA] outline-none
            placeholder:text-gray-500"
          />

          {/* IMAGE */}
          <div className="space-y-2">
            <label className="text-sm text-[#60A5FA]">
              Featured Image (optional)
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="text-gray-300"
            />

            {image && (
              <p className="text-xs text-gray-400">
                Selected: {image.name}
              </p>
            )}
          </div>

          {/* RICH TEXT EDITOR */}
          <div className="border border-[#334155] rounded-xl overflow-hidden bg-[#0F172A]/60">
            <div className="px-3 py-2 border-b border-[#334155] text-xs text-[#60A5FA]">
              Content Editor
            </div>

            <div className="p-3">
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-white
            bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]
            hover:scale-105 transition-all duration-300
            disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading ? "Posting..." : "Post Blog"}
          </button>
        </div>

        {/* DATE */}
        <p className="text-center text-xs text-gray-500">
          Date: {new Date().toLocaleDateString()}
        </p>
      </div>
    </main>
  );
}