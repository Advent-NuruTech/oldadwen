"use client";

import { useState } from "react";

export type Blog = {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  author: string;
  createdAt?: any;
};

// ---------- UTILS ----------
function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

function getWordCount(html: string) {
  const text = stripHtml(html);
  return text ? text.split(/\s+/).length : 0;
}

function getPreview(html: string, limit = 60) {
  const words = stripHtml(html).split(/\s+/);
  if (words.length <= limit) return words.join(" ");
  return words.slice(0, limit).join(" ") + "…";
}

function formatDate(date: any) {
  if (!date) return "";
  const d =
    typeof date === "string"
      ? new Date(date)
      : date.toDate
      ? date.toDate()
      : new Date(date);

  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface BlogCardProps {
  blog: Blog;
  onReadMore: (id: string) => void;
}

export default function BlogCard({ blog, onReadMore }: BlogCardProps) {
  const wordCount = getWordCount(blog.content);
  const needsReadMore = wordCount > 60;

  return (
    <article className="mb-10">
      <div className="bg-white dark:bg-[#2A221C] border border-gray-200 dark:border-[#3A2F25] rounded-2xl shadow-md hover:shadow-xl transition p-5">

        {/* IMAGE */}
        {blog.imageURL && (
          <img
            src={blog.imageURL}
            alt={blog.title}
            className="w-full h-52 object-cover rounded-xl mb-4"
            loading="lazy"
          />
        )}

        {/* TITLE */}
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 dark:text-[#F6F1EA] leading-snug">
          {blog.title}
        </h2>

        {/* AUTHOR */}
        <p className="text-sm mb-2 text-[#6B4A2E] dark:text-[#D9A441] font-medium">
          By {blog.author}
        </p>

        {/* DATE */}
        {blog.createdAt && (
          <p className="text-xs mb-3 text-[#A67C52] dark:text-[#C9A46C]">
            {formatDate(blog.createdAt)}
          </p>
        )}

        {/* PREVIEW */}
        <p className="text-gray-700 dark:text-[#D8C9B4] leading-relaxed text-sm md:text-base">
          {getPreview(blog.content)}
        </p>

        {/* ACTION */}
        {needsReadMore && (
          <button
            onClick={() => onReadMore(blog.id)}
            className="mt-4 inline-block px-5 py-2 rounded-full font-semibold
              bg-gradient-to-r from-[#6B4A2E] to-[#D9A441]
              text-white dark:text-black
              hover:opacity-90 transition"
          >
            Read More
          </button>
        )}
      </div>
    </article>
  );
}