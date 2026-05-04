"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Link from "next/link";

export interface Blog {
  id: string;
  title: string;
  content?: string;
  imageURL?: string;
  author?: string;
  createdAt?: any;
}

// ---------- UTILITY ----------
const stripHtml = (html?: string) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
};

const getPreview = (content?: string, wordLimit = 40) => {
  const clean = stripHtml(content);
  const words = clean.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "…"
    : clean;
};

const formatDate = (date?: any) => {
  if (!date) return "";
  const d =
    typeof date === "string"
      ? new Date(date)
      : date.toDate
      ? date.toDate()
      : new Date(date);

  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `Published on ${day}${suffix} ${d.toLocaleString("default", {
    month: "long",
    year: "numeric",
  })}`;
};

// ---------- COMPONENT ----------
export default function BlogList({ maxBlogs = 2 }: { maxBlogs?: number }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const q = query(
          collection(db, "blog"),
          orderBy("createdAt", "desc"),
          limit(maxBlogs)
        );

        const snap = await getDocs(q);

        const blogList: Blog[] = snap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            content: data.content,
            imageURL: data.imageURL,
            author: data.author ?? "Unknown author",
            createdAt: data.createdAt ?? null,
          };
        });

        setBlogs(blogList);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, [maxBlogs]);

  if (loading)
    return (
      <p className="text-center text-gray-600 dark:text-gray-300">
        Loading blogs...
      </p>
    );

  if (blogs.length === 0)
    return (
      <p className="text-center text-gray-600 dark:text-gray-300">
        No blogs available.
      </p>
    );

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">

      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="
            flex flex-col rounded-2xl p-5
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            shadow-sm hover:shadow-md
            transition-all duration-200
          "
        >

          {/* IMAGE */}
          {blog.imageURL && (
            <div className="w-full h-48 overflow-hidden rounded-xl mb-4 bg-gray-100 dark:bg-gray-800">
              <img
                src={blog.imageURL}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* TITLE */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {blog.title}
          </h3>

          {/* AUTHOR + DATE */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By {blog.author}
          </p>

          {blog.createdAt && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
              {formatDate(blog.createdAt)}
            </p>
          )}

          {/* CONTENT PREVIEW */}
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {getPreview(blog.content)}
          </p>

          {/* CTA */}
          <Link
            href={`/blog/${blog.id}`}
            className="
              mt-auto inline-block w-full text-center
              bg-gray-900 dark:bg-white
              text-white dark:text-black
              py-2 px-4 rounded-lg font-semibold
              hover:opacity-80 transition
            "
          >
            Read More →
          </Link>

        </div>
      ))}

    </div>
  );
}