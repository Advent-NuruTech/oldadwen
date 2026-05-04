"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

export default function AddBlogPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: true,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-full min-h-[280px] focus:outline-none text-gray-200",
      },
    },
    immediatelyRender: false,
  });

  const handleSubmit = async () => {
    if (!title.trim() || !author.trim() || !editor?.getHTML().trim()) {
      alert("Title, author, and content are required");
      return;
    }

    setLoading(true);

    try {
      let imageURL: string | undefined;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const res = await fetch("/api/upload-blog-image", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        imageURL = data.url;
      }

      await addDoc(collection(db, "blog"), {
        title,
        author,
        content: editor.getHTML(),
        imageURL: imageURL ?? null,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setAuthor("");
      setImageFile(null);
      editor.commands.clearContent();

      alert("Blog published successfully!");
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
              Content Studio
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Create Blog Post
          </h1>

          <p className="text-gray-400 mt-2">
            Write, design, and publish powerful content
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-gradient-to-br from-[#1E293B]/40 via-[#0F172A]/40 to-[#1E1B4B]/40
        backdrop-blur-sm border border-[#334155] rounded-2xl p-6 shadow-2xl space-y-5">

          {/* TITLE */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog title..."
            className="w-full p-3 rounded-lg bg-[#1E293B]/60 text-white
            border border-[#334155] focus:border-[#60A5FA] outline-none
            placeholder:text-gray-500"
          />

          {/* AUTHOR */}
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author name..."
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
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="text-gray-300"
            />

            {imageFile && (
              <p className="text-xs text-gray-400">
                Selected: {imageFile.name}
              </p>
            )}
          </div>

          {/* EDITOR */}
          <div className="border border-[#334155] rounded-xl overflow-hidden bg-[#0F172A]/60">
            <div className="px-3 py-2 border-b border-[#334155] text-xs text-[#60A5FA]">
              Content Editor
            </div>

            <div className="p-3">
              <EditorContent editor={editor} />
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
            {loading ? "Publishing..." : "Publish Blog"}
          </button>
        </div>
      </div>
    </main>
  );
}