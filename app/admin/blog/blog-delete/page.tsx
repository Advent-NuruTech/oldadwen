"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import RichTextEditor from "@/components/RichTextEditor";

type Blog = {
  id: string;
  title: string;
  author: string;
  content: string;
  imageURL?: string;
  createdAt?: { seconds: number };
};

export default function BlogManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const loadBlogs = async () => {
      const snap = await getDocs(collection(db, "blog"));
      const data: Blog[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Blog, "id">),
      }));
      setBlogs(data);
      setLoading(false);
    };
    loadBlogs();
  }, []);

  const startEdit = (blog: Blog) => {
    setEditingId(blog.id);
    setTitle(blog.title);
    setAuthor(blog.author);
    setContent(blog.content);
    setImageFile(null);
  };

  const handleSave = async () => {
    if (!editingId) return;
    const blog = blogs.find((b) => b.id === editingId);
    if (!blog) return;

    let imageURL = blog.imageURL || "";

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

    await updateDoc(doc(db, "blog", editingId), {
      title,
      author,
      content,
      imageURL,
      updatedAt: serverTimestamp(),
    });

    setBlogs((prev) =>
      prev.map((b) =>
        b.id === editingId ? { ...b, title, author, content, imageURL } : b
      )
    );

    setEditingId(null);
    setTitle("");
    setAuthor("");
    setContent("");
    setImageFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog permanently?")) return;
    await deleteDoc(doc(db, "blog", id));
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  if (loading)
    return <div className="p-6 text-white">Loading blogs...</div>;

  return (
    <div className="min-h-screen bg-[#0D3B66] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Manage Blogs
        </h1>

        <ul className="space-y-6">
          {blogs.map((b) => (
            <li
              key={b.id}
              className="p-4 rounded-lg bg-[#0A2F52] border border-blue-500"
            >
              {editingId === b.id ? (
                <>
                  <input
                    type="text"
                    className="w-full p-2 mb-2 rounded bg-[#08304F] border border-blue-400 text-white"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                  />

                  <input
                    type="text"
                    className="w-full p-2 mb-2 rounded bg-[#08304F] border border-blue-400 text-white"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author"
                  />

                  <div className="mb-3">
                    <RichTextEditor value={content} onChange={setContent} />
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImageFile(e.target.files?.[0] ?? null)
                    }
                    className="mb-2 text-sm"
                  />

                  {!imageFile && b.imageURL && (
                    <img
                      src={b.imageURL}
                      alt={b.title}
                      className="w-full mt-2 rounded"
                    />
                  )}

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-bold text-lg">
                    {b.title}
                  </h2>

                  <p className="text-sm text-blue-200 mb-2">
                    By {b.author}
                    {b.createdAt && (
                      <> • {new Date(b.createdAt.seconds * 1000).toLocaleDateString()}</>
                    )}
                  </p>

                  {b.imageURL && (
                    <img
                      src={b.imageURL}
                      alt={b.title}
                      className="w-full mt-2 rounded"
                    />
                  )}

                  <div
                    className="prose prose-invert max-w-none mt-3"
                    dangerouslySetInnerHTML={{ __html: b.content }}
                  />

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => startEdit(b)}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded text-black font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
