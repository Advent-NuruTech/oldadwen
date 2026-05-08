"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { db, storage } from "@/lib/firebase";

import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import RichTextEditor from "@/components/RichTextEditor";

export default function AddBlogPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // STORED AUTHORS
  const [authors, setAuthors] = useState<string[]>([]);

  // FETCH PREVIOUS AUTHORS
  useEffect(() => {
    async function fetchAuthors() {
      try {
        const snap = await getDocs(
          query(collection(db, "blogs"), orderBy("authorName"))
        );

        const authorSet = new Set<string>();

        snap.docs.forEach((doc) => {
          const data = doc.data();

          if (data.authorName) {
            authorSet.add(data.authorName.trim());
          }
        });

        setAuthors(Array.from(authorSet));
      } catch (error) {
        console.error(error);
      }
    }

    fetchAuthors();
  }, []);

  // FILTERED AUTHOR SUGGESTIONS
  const filteredAuthors = useMemo(() => {
    if (!authorName.trim()) return authors;

    return authors.filter((author) =>
      author.toLowerCase().includes(authorName.toLowerCase())
    );
  }, [authorName, authors]);

  const handleSubmit = async () => {
    if (
      !title.trim() ||
      !shortDescription.trim() ||
      !authorName.trim() ||
      !content.trim()
    ) {
      return alert("Please fill all required fields.");
    }

    setLoading(true);

    try {
      let imageUrl = "";

      // UPLOAD IMAGE
      if (image) {
        const imageRef = ref(
          storage,
          `blog-images/${Date.now()}-${image.name}`
        );

        await uploadBytes(imageRef, image);

        imageUrl = await getDownloadURL(imageRef);
      }

      // SAVE BLOG
      await addDoc(collection(db, "blogs"), {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        authorName: authorName.trim(),
        content,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Blog posted successfully!");

      setTitle("");
      setShortDescription("");
      setAuthorName("");
      setContent("");
      setImage(null);

      router.push("/admin/blog");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B] px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 mb-4">
            <span className="text-[#60A5FA] text-xs font-semibold">
              BLOG STUDIO
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white">
            Create New Blog
          </h1>

          <p className="text-gray-400 mt-3">
            Publish teachings, insights and updates
          </p>
        </div>

        {/* FORM */}
        <div className="rounded-3xl border border-[#334155] bg-[#0F172A]/50 backdrop-blur-xl p-6 md:p-8 shadow-2xl space-y-6">

          {/* TITLE */}
          <div>
            <label className="block text-sm text-[#60A5FA] mb-2">
              Blog Title
            </label>

            <input
              type="text"
              placeholder="Enter blog title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[#334155] bg-[#1E293B]/70 px-4 py-3 text-white outline-none focus:border-[#60A5FA]"
            />
          </div>

          {/* SHORT DESCRIPTION */}
          <div>
            <label className="block text-sm text-[#60A5FA] mb-2">
              Short Description
            </label>

            <textarea
              placeholder="Short summary..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-[#334155] bg-[#1E293B]/70 px-4 py-3 text-white outline-none focus:border-[#60A5FA]"
            />
          </div>

          {/* AUTHOR */}
          <div className="relative">
            <label className="block text-sm text-[#60A5FA] mb-2">
              Author Name
            </label>

            <input
              type="text"
              list="authors"
              placeholder="Choose existing author or type new..."
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full rounded-xl border border-[#334155] bg-[#1E293B]/70 px-4 py-3 text-white outline-none focus:border-[#60A5FA]"
            />

            {/* DATALIST */}
            <datalist id="authors">
              {filteredAuthors.map((author) => (
                <option
                  key={author}
                  value={author}
                />
              ))}
            </datalist>

            {/* AUTHOR COUNT */}
            {authors.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                {authors.length} saved author
                {authors.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* IMAGE */}
          <div>
            <label className="block text-sm text-[#60A5FA] mb-2">
              Featured Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="text-gray-300"
            />

            {image && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-[#334155]">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
          </div>

          {/* EDITOR */}
          <div className="rounded-2xl overflow-hidden border border-[#334155] bg-[#0B1120]">
            <div className="border-b border-[#334155] px-4 py-3 text-sm font-semibold text-[#60A5FA]">
              Content Editor
            </div>

            <div className="p-4">
              <RichTextEditor
                value={content}
                onChange={setContent}
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] py-4 text-lg font-bold text-white transition hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish Blog"}
          </button>
        </div>
      </div>
    </main>
  );
}