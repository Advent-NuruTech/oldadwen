"use client";

import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Link from "next/link";

interface LibraryDoc {
  id: string;
  title: string;
  category: string;
  description: string;
  filePath: string;
  createdAt: any;
}

export default function LibraryPage() {
  const [documents, setDocuments] = useState<LibraryDoc[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

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
        doc.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || doc.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [documents, search, categoryFilter]);

  const truncateText = (text: string, limit = 55) =>
    text.split(" ").length > limit
      ? text.split(" ").slice(0, limit).join(" ") + "..."
      : text;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0b1220] to-[#020617] text-white px-6 py-16">

      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          Library
        </h1>

        <div className="h-1 w-24 mx-auto mt-4 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full" />

        <p className="text-blue-200 mt-5">
          Explore categorized study materials, teachings, and resources
          from <span className="text-cyan-300 font-semibold">Old Seventh Day Adventists</span>.
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="max-w-3xl mx-auto mb-10 space-y-4">

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-blue-500/20 focus:ring-2 focus:ring-cyan-400 outline-none backdrop-blur-md"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-blue-500/20 text-white backdrop-blur-md"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

      </div>

      {/* GRID */}
      {!expanded && (
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {filteredDocs.map((doc) => (
            <li
              key={doc.id}
              className="bg-white/5 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-md hover:scale-[1.02] transition"
            >
              <h3 className="text-xl font-bold">{doc.title}</h3>

              <p className="text-cyan-300 text-sm mt-1">
                {doc.category}
              </p>

              <p className="text-blue-100 text-sm mt-4">
                {truncateText(doc.description)}
              </p>

              <div className="mt-6 flex flex-col gap-3">

                <button
                  onClick={() => setExpanded(doc.id)}
                  className="text-sm text-cyan-300 hover:text-white transition"
                >
                  Read More →
                </button>

                <Link
                  href={`/library/${doc.id}`}
                  className="px-4 py-2 rounded-xl text-center font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-600 transition"
                >
                  Study / Download
                </Link>

              </div>
            </li>
          ))}

        </ul>
      )}

      {/* EXPANDED VIEW */}
      {expanded && (
        <div className="fixed inset-0 z-50 bg-[#020617]/95 backdrop-blur-md overflow-auto p-8">

          <button
            onClick={() => setExpanded(null)}
            className="mb-8 px-5 py-2 rounded-xl bg-blue-600 hover:bg-cyan-500 transition"
          >
            Close
          </button>

          {filteredDocs
            .filter((d) => d.id === expanded)
            .map((doc) => (
              <div key={doc.id} className="max-w-4xl mx-auto space-y-6">

                <h2 className="text-3xl font-bold">{doc.title}</h2>

                <p className="text-cyan-300">{doc.category}</p>

                <div className="text-blue-100 leading-relaxed whitespace-pre-line">
                  {doc.description}
                </div>

                <Link
                  href={`/library/${doc.id}`}
                  className="inline-block px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-600 transition"
                >
                  Open Full Document
                </Link>

              </div>
            ))}
        </div>
      )}

    </main>
  );
}