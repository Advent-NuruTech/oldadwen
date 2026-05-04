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
    !!(filters.searchTerm.trim() || 
    filters.authorFilter !== "all" || 
    filters.dateFilter);

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
      
      // Extract unique authors
      const uniqueAuthors = Array.from(new Set(blogList.map(blog => blog.author))).sort();
      setAuthors(uniqueAuthors);
    }
    fetchBlogs();
  }, []);

  // Filter blogs based on all criteria
  useEffect(() => {
    let filtered = [...blogs];

    // Apply text search
    if (filters.searchTerm.trim()) {
      const term = filters.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(blog => {
        const searchableContent = stripHtml(blog.content).toLowerCase();
        return (
          blog.title.toLowerCase().includes(term) ||
          searchableContent.includes(term) ||
          blog.author.toLowerCase().includes(term)
        );
      });
    }

    // Apply author filter
    if (filters.authorFilter !== "all") {
      filtered = filtered.filter(blog => blog.author === filters.authorFilter);
    }

    // Apply date filter
    if (filters.dateFilter) {
      filtered = filtered.filter(blog => {
        if (!blog.createdAt) return false;
        const blogDate = formatDateForFilter(blog.createdAt);
        return blogDate === filters.dateFilter;
      });
    }

    setFilteredBlogs(filtered);
  }, [filters, blogs]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#1F1A16]">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 pt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#6B4A2E] via-[#D9A441] to-[#B8860B]">
          Gospel Sounders Blog
        </h1>

        <SearchBlog
          authors={authors}
          filters={filters}
          onFiltersChange={setFilters}
          isSearching={isSearching}
          resultCount={filteredBlogs.length}
          totalCount={blogs.length}
        />
      </div>

      {/* Content Area */}
      {isSearching ? (
        // Search Results View
        <div className="max-w-7xl mx-auto px-4 md:px-12 pb-12">
          {filteredBlogs.length > 0 ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-[#F6F1EA]">
                  Search Results
                </h2>
                <p className="text-gray-600 dark:text-[#D8C9B4] mt-2">
                  Found {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => (
                  <BlogCard 
                    key={blog.id} 
                    blog={blog} 
                    searchTerm={filters.searchTerm} 
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-block p-8 bg-white dark:bg-[#2A221C] rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-[#F6F1EA] mb-4">
                  No blogs found
                </h3>
                <p className="text-gray-700 dark:text-[#D8C9B4] mb-6">
                  {filters.searchTerm 
                    ? `No results for "${filters.searchTerm}"`
                    : "Try adjusting your filters"}
                </p>
                <button
                  onClick={() => setFilters({
                    searchTerm: "",
                    authorFilter: "all",
                    dateFilter: "",
                  })}
                  className="px-6 py-3 bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black rounded-full font-semibold hover:opacity-90 transition"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Normal View - All Blogs
        <div className="max-w-7xl mx-auto px-4 md:px-12 pb-12">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard 
                key={blog.id} 
                blog={blog} 
                searchTerm={filters.searchTerm} 
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

// Blog Card Component
function BlogCard({ blog, searchTerm }: { blog: BlogType; searchTerm: string }) {
  return (
    <div className="flex flex-col bg-white dark:bg-[#2A221C] rounded-2xl shadow-lg hover:shadow-2xl transition p-5 h-full">
      {blog.imageURL && (
        <img
          src={blog.imageURL}
          alt={blog.title}
          className="rounded-xl object-cover h-48 w-full mb-4"
        />
      )}

      <h2 
        className="text-xl font-bold text-gray-900 dark:text-[#F6F1EA] mb-2"
        dangerouslySetInnerHTML={{ 
          __html: highlightText(blog.title, searchTerm)
        }}
      />

      <p 
        className="text-sm text-[#6B4A2E] dark:text-[#D9A441] mb-1"
        dangerouslySetInnerHTML={{ 
          __html: highlightText(`By ${blog.author}`, searchTerm)
        }}
      />

      {blog.createdAt && (
        <p className="text-xs text-[#A67C52] dark:text-[#D9A441] mb-3">
          {formatProfessionalDate(blog.createdAt)}
        </p>
      )}

      <p 
        className="text-gray-700 dark:text-[#D8C9B4] mb-4 line-clamp-4"
        dangerouslySetInnerHTML={{ 
          __html: getPreviewWithHighlight(blog.content, searchTerm)
        }}
      />

      <Link
        href={`/blog/${blog.id}`}
        className="mt-auto inline-block w-full text-center bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black py-2 px-4 rounded-full font-semibold hover:opacity-90 transition"
      >
        Read More
      </Link>
    </div>
  );
}