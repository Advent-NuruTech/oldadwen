"use client";

import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Filter, RotateCcw, X, Download, Eye, Search } from "lucide-react";
import Link from "next/link";

interface LibraryDoc {
  id: string;
  title: string;
  category: string;
  description: string;
  filePath: string;
  createdAt: any;
  thumbnailUrl?: string;
}

export default function LibraryPage() {
  const [documents, setDocuments] = useState<LibraryDoc[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [pdfViewUrl, setPdfViewUrl] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "library"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LibraryDoc[];
      setDocuments(docs);
    });
    return () => unsubscribe();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(documents.map((d) => d.category))),
    [documents]
  );

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.category.toLowerCase().includes(search.toLowerCase()) ||
        doc.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || doc.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [documents, search, categoryFilter]);

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setShowFilters(false);
  };

  const handleDownload = (filePath: string, title: string) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = `${title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stripHtml = (html?: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  const truncateText = (text: string, limit = 60) => {
    const words = text.split(/\s+/);
    return {
      truncated: words.length > limit,
      text:
        words.length > limit
          ? words.slice(0, limit).join(" ") + "…"
          : text,
    };
  };

  const highlightVerses = (html?: string) => {
    if (!html) return "";
    const regex = /\b([1-3]?\s?[A-Za-z]+)\s\d+:\d+\b/g;
    return html.replace(
      regex,
      m =>
        `<span class="text-sky-300 font-semibold underline underline-offset-4 cursor-pointer hover:text-sky-200 transition-colors break-words">${m}</span>`
    );
  };

  const currentIndex = filteredDocs.findIndex(d => d.id === expandedId);
  const currentDoc = currentIndex >= 0 ? filteredDocs[currentIndex] : null;
  const prevDoc = currentIndex > 0 ? filteredDocs[currentIndex - 1] : null;
  const nextDoc =
    currentIndex < filteredDocs.length - 1
      ? filteredDocs[currentIndex + 1]
      : null;

  // List View
  if (!expandedId) {
    return (
      <main
        className="min-h-screen text-white bg-cover bg-center bg-fixed relative pt-28 pb-16 px-4 overflow-x-hidden"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dg7jxs7st/image/upload/v1778153542/download_1_y3x4sq.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-12">
          {/* HEADER */}
          <div className="text-center mb-10 pt-6 md:pt-10">
            <div className="inline-block mb-3 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
              <span className="text-lg text-[#60A5FA] font-medium">
                study resources
              </span>
            </div>

            <h1 className="text-3xl text-4xl md:text-6xl font-extrabold text-white break-words">
              Library
            </h1>

            <p className="text-gray-300 mt-4 text-lg sm:text-lg md:text-xl break-words">
              Explore categorized study materials, teachings, and resources
              from{" "}
              <span className="text-[#60A5FA] font-semibold">
                Old Seventh Day Adventists
              </span>
            </p>
          </div>

          {/* FILTER BUTTON */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowFilters(v => !v)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full
                bg-gradient-to-r from-[#2563EB]/80 to-[#1D4ED8]/80
                text-white font-semibold hover:from-[#2563EB] hover:to-[#1D4ED8] 
                transition-all duration-300 shadow-lg"
            >
              <Filter size={16} />
              Filter Documents
            </button>
          </div>

          {/* FILTER PANEL */}
          {showFilters && (
            <div className="max-w-4xl mx-auto mb-10 rounded-2xl p-4 sm:p-6
              bg-[#1E293B]/40 backdrop-blur border border-[#334155] shadow-xl">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Search by title, category, or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg px-4 py-2 bg-[#0F172A]/60 border border-[#334155] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-lg px-4 py-2 bg-[#0F172A]/60 border border-[#334155] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 text-sm font-semibold text-[#60A5FA] hover:text-[#93C5FD] transition-colors"
                >
                  <RotateCcw size={14} />
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* QUICK SEARCH BAR (if filters hidden) */}
          {!showFilters && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Quick search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full px-10 py-2.5 bg-[#1E293B]/40 backdrop-blur border border-[#334155] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
            </div>
          )}

          {/* CARDS GRID */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => {
              const plainText = stripHtml(doc.description);
              const { text } = truncateText(plainText);

              return (
                <div
                  key={doc.id}
                  className="flex flex-col rounded-1xl overflow-hidden bg-[#1E293B]/40 backdrop-blur border border-[#334155] shadow-xl hover:scale-[1.02] transition-transform duration-300"
                >
                  {doc.thumbnailUrl && (
                    <img
                      src={doc.thumbnailUrl}
                      alt={doc.title}
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-lg font-bold text-white break-words">
                      {doc.title}
                    </h2>

                    <p className="text-sm text-[#60A5FA] mb-2">
                      {doc.category}
                    </p>

                    <p className="text-xl text-gray-300 mb-4 break-words">
                      {text}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-2">
                      <button
                        onClick={() => setExpandedId(doc.id)}
                        className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#2563EB]/80 to-[#1D4ED8]/80 text-white font-medium hover:from-[#2563EB] hover:to-[#1D4ED8] transition-all"
                      >
                        Read More
                      </button>

                      {doc.filePath && (
                        <>
                          

                          <button
                            onClick={() => handleDownload(doc.filePath, doc.title)}
                            className="px-4 py-2 rounded-lg bg-[#F59E0B]/80 text-white hover:bg-[#F59E0B] transition-all"
                            title="Download PDF"
                          >
                            <Download size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredDocs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No documents found matching your criteria.</p>
              <button
                onClick={resetFilters}
                className="mt-4 text-[#60A5FA] hover:text-[#93C5FD] transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* PDF MODAL */}
        {pdfViewUrl && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-6 overflow-x-hidden">
            <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-lg overflow-hidden">
              <button
                onClick={() => setPdfViewUrl(null)}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors z-10"
              >
                <X size={20} />
              </button>
              <iframe
                src={`${pdfViewUrl}#toolbar=1&navpanes=1`}
                className="w-full h-full"
                title="PDF Viewer"
              />
            </div>
          </div>
        )}
      </main>
    );
  }

  // Expanded Full View
  if (!currentDoc) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-black/90 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex flex-wrap justify-between gap-3 mb-6">
          <button
            onClick={() => setExpandedId(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2563EB]/80 text-white hover:bg-[#2563EB] transition-colors"
          >
            <X size={18} />
            Close
          </button>

          <div className="flex flex-wrap gap-2">
            {prevDoc && (
              <button
                onClick={() => setExpandedId(prevDoc.id)}
                className="px-4 py-2 rounded-full bg-[#334155] text-white hover:bg-[#475569] transition-colors"
              >
                ← Previous
              </button>
            )}
            {nextDoc && (
              <button
                onClick={() => setExpandedId(nextDoc.id)}
                className="px-4 py-2 rounded-full bg-[#334155] text-white hover:bg-[#475569] transition-colors"
              >
                Next →
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-[#1E293B]/60 p-5 sm:p-8 border border-[#334155]">
          <h1 className="text-2xl sm:text-4xl font-bold text-white break-words">
            {currentDoc.title}
          </h1>

          <div className="mt-2">
            <span className="inline-block px-3 py-1 rounded-full bg-[#3B82F6]/20 text-[#60A5FA] text-sm">
              {currentDoc.category}
            </span>
          </div>

          <div
            className="text-gray-300 mt-6 leading-relaxed break-words overflow-hidden prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: highlightVerses(currentDoc.description),
            }}
          />

          <div className="mt-8 flex flex-wrap gap-4">
            {currentDoc.filePath && (
              <>

                <button
                  onClick={() => handleDownload(currentDoc.filePath, currentDoc.title)}
                  className="px-6 py-2.5 rounded-lg bg-[#F59E0B]/80 text-white font-semibold hover:bg-[#F59E0B] transition-all flex items-center gap-2"
                >
                  <Download size={18} />
                  Download PDF
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}