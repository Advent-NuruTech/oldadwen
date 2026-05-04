"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Image from "next/image";

interface BlogItem {
  id: string;
  title: string;
  description: string;
  url?: string;
  authorName: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

export default function ModernGallery() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [selected, setSelected] = useState<BlogItem | null>(null);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const q = query(collection(db, "hefGallery"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          const items: BlogItem[] = snap.docs.map((doc) => {
            const data = doc.data() as BlogItem;
            return {
              id: doc.id,
              title: data.title || "Untitled",
              description: data.description || "No description",
              url: data.url,
              authorName: data.authorName || "Anonymous",
              createdAt: data.createdAt,
            };
          });
          setBlogs(items);
        } else {
          console.log("No blogs found in Firestore collection hefGallery");
        }
      },
      (error) => console.error("Firestore error:", error)
    );

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Blog Gallery
      </h1>

      {blogs.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No blogs available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            const isExpanded = expanded[blog.id] || false;
            const descTooLong = blog.description.length > 120;

            return (
              <div
                key={blog.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
              >
                {blog.url && (
                  <div
                    className="relative aspect-video w-full cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelected(blog)}
                  >
                    <Image src={blog.url} alt={blog.title} fill className="object-cover rounded-t-2xl" />
                  </div>
                )}

                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{blog.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                    By <strong>{blog.authorName}</strong> •{" "}
                    {blog.createdAt
                      ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString()
                      : new Date().toLocaleDateString()}
                  </p>

                  <p className="text-gray-700 dark:text-gray-200 text-sm mb-4">
                    {isExpanded ? blog.description : blog.description.slice(0, 120)}
                    {descTooLong && (
                      <button
                        className="ml-1 text-blue-600 dark:text-blue-400 font-medium hover:underline"
                        onClick={() =>
                          setExpanded((prev) => ({ ...prev, [blog.id]: !isExpanded }))
                        }
                      >
                        {isExpanded ? "Show less" : "...Read more"}
                      </button>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {selected.url && (
              <div className="relative h-64 md:h-80 w-full rounded-t-2xl overflow-hidden">
                <Image src={selected.url} alt={selected.title} fill className="object-cover" />
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selected.title}</h2>
                <button
                  className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 font-bold text-2xl"
                  onClick={() => setSelected(null)}
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                By <strong>{selected.authorName}</strong> •{" "}
                {selected.createdAt
                  ? new Date(selected.createdAt.seconds * 1000).toLocaleDateString()
                  : new Date().toLocaleDateString()}
              </p>
              <p className="text-gray-700 dark:text-gray-200">{selected.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
