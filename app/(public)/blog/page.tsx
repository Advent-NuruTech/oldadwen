"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import Link from "next/link";
import SearchBlog, { SearchFilters } from "@/components/public/SearchBlog";
import {
  formatProfessionalDate,
  formatDateForFilter,
  stripHtml,
  getPreviewWithHighlight,
  highlightText,
  Blog as BlogType,
} from "@/lib/blog-utils";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogType[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    authorFilter: "all",
    dateFilter: "",
  });

  const isSearching =
    !!(
      filters.searchTerm.trim() ||
      filters.authorFilter !== "all" ||
      filters.dateFilter
    );

  useEffect(() => {
    async function fetchBlogs() {
      const snap = await getDocs(
        query(collection(db, "blog"), orderBy("createdAt", "desc"))
      );

      const blogList: BlogType[] = snap.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            content: data.content,
            imageURL: data.imageURL,
            author: data.author ?? "Unknown author",
            createdAt: data.createdAt ?? null,
          };
        }
      );

      setBlogs(blogList);
      setFilteredBlogs(blogList);

      const uniqueAuthors = Array.from(
        new Set(blogList.map((b) => b.author))
      ).sort();
      setAuthors(uniqueAuthors);
    }

    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = [...blogs];

    if (filters.searchTerm.trim()) {
      const term = filters.searchTerm.toLowerCase().trim();
      filtered = filtered.filter((blog) => {
        const content = stripHtml(blog.content).toLowerCase();
        return (
          blog.title.toLowerCase().includes(term) ||
          content.includes(term) ||
          blog.author.toLowerCase().includes(term)
        );
      });
    }

    if (filters.authorFilter !== "all") {
      filtered = filtered.filter(
        (blog) => blog.author === filters.authorFilter
      );
    }

    if (filters.dateFilter) {
      filtered = filtered.filter((blog) => {
        if (!blog.createdAt) return false;
        return (
          formatDateForFilter(blog.createdAt) === filters.dateFilter
        );
      });
    }

    setFilteredBlogs(filtered);
  }, [filters, blogs]);

  return (
    <main
      className="min-h-screen text-white bg-cover bg-center bg-fixed relative pt-28 pb-16 px-4"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/dg7jxs7st/image/upload/v1778153542/download_1_y3x4sq.jpg')",
      }}
    >
      {/* GLOBAL OVERLAY */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-12">
        {/* HEADER */}
        <div className="text-center mb-10 pt-6 md:pt-10">
          <div className="inline-block mb-3 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
            <span className="text-lg text-[#60A5FA] font-medium">
              restoring old adventism
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white">
            Articles & Teachings
          </h1>

          <p className="text-gray-300 mt-4 text-lg md:text-xl">
            Explore spiritual insights and teachings
          </p>
        </div>

        <SearchBlog
          authors={authors}
          filters={filters}
          onFiltersChange={setFilters}
          isSearching={isSearching}
          resultCount={filteredBlogs.length}
          totalCount={blogs.length}
        />

        {/* CONTENT */}
        {isSearching && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">
              Search Results
            </h2>
            <p className="text-gray-400 mt-2">
              Found {filteredBlogs.length} result
              {filteredBlogs.length !== 1 && "s"}
            </p>
          </div>
        )}

        {filteredBlogs.length > 0 ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                searchTerm={filters.searchTerm}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block p-8 rounded-2xl bg-[#1E293B]/40 backdrop-blur border border-[#334155]">
              <h3 className="text-2xl font-bold text-white mb-3">
                No blogs found
              </h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search filters
              </p>
              <button
                onClick={() =>
                  setFilters({
                    searchTerm: "",
                    authorFilter: "all",
                    dateFilter: "",
                  })
                }
                className="px-6 py-3 bg-gradient-to-r from-[#2563EB]/80 to-[#1D4ED8]/80 text-white rounded-lg font-semibold hover:from-[#2563EB] hover:to-[#1D4ED8] transition"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* BLOG CARD */
function BlogCard({
  blog,
  searchTerm,
}: {
  blog: BlogType;
  searchTerm: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-[#1E293B]/40 backdrop-blur border border-[#334155] shadow-xl hover:shadow-2xl transition">
      {blog.imageURL && (
        <img
          src={blog.imageURL}
          alt={blog.title}
          className="h-48 w-full object-cover"
        />
      )}

      <div className="p-5 flex flex-col h-full">
        <h2
          className="text-lg font-bold text-white mb-2"
          dangerouslySetInnerHTML={{
            __html: highlightText(blog.title, searchTerm),
          }}
        />

        <p
          className="text-sm text-[#60A5FA] mb-1"
          dangerouslySetInnerHTML={{
            __html: highlightText(`By ${blog.author}`, searchTerm),
          }}
        />

        {blog.createdAt && (
          <p className="text-xl text-gray-400 mb-3">
            {formatProfessionalDate(blog.createdAt)}
          </p>
        )}

        <p
          className="text-xl text-gray-300 mb-4 line-clamp-4"
          dangerouslySetInnerHTML={{
            __html: getPreviewWithHighlight(
              blog.content,
              searchTerm
            ),
          }}
        />

        <Link
          href={`/blog/${blog.id}`}
          className="mt-auto text-center px-4 py-2 rounded-lg bg-gradient-to-r from-[#67e8f9]/80 to-[#1D4ED8]/80 text-white font-semibold hover:from-[#2563EB] hover:to-[#1D4ED8] hover:scale-105 transition"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}