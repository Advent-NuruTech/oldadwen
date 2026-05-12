"use client";

import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

interface Minister {
  id: string;
  name: string;
  imageUrl: string;
  metadata: string;
  role?: string;
  title?: string;
  isFullTime?: boolean;
}

function stripHtml(html: string) {
  return (html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function getExcerpt(text: string, words = 25) {
  const wordsArray = text.split(" ");
  if (wordsArray.length <= words) return text;
  return wordsArray.slice(0, words).join(" ") + "...";
}

function isFullTimeEntry(minister: Minister): boolean {
  return (
    minister.isFullTime === true ||
    minister.role?.toLowerCase().includes("full-time") === true ||
    minister.title?.toLowerCase().includes("full-time") === true
  );
}

export default function FullTimeMinistersPage() {
  const [ministers, setMinisters] = useState<Minister[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMinisters = async () => {
      setIsLoading(true);
      try {
        const fullTimeQuery = query(
          collection(db, "fullTimeMinisters"),
          orderBy("createdAt", "asc")
        );
        const fullTimeSnap = await getDocs(fullTimeQuery);

        const dedicatedMinisters = fullTimeSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          name: docSnap.data().name,
          imageUrl: docSnap.data().imageUrl,
          metadata: docSnap.data().metadata,
          role: docSnap.data().role || "",
          title: docSnap.data().title || "",
          isFullTime: true,
        })) as Minister[];

        if (dedicatedMinisters.length > 0) {
          setMinisters(dedicatedMinisters);
          return;
        }

        const membersQuery = query(
          collection(db, "members"),
          orderBy("createdAt", "asc")
        );
        const membersSnapshot = await getDocs(membersQuery);

        const members = membersSnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          name: docSnap.data().name,
          imageUrl: docSnap.data().imageUrl,
          metadata: docSnap.data().metadata,
          role: docSnap.data().role || "",
          title: docSnap.data().title || "",
          isFullTime: docSnap.data().isFullTime || false,
        })) as Minister[];

        setMinisters(members.filter(isFullTimeEntry));
      } catch (error) {
        console.error("Error fetching full-time ministers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMinisters();
  }, []);

  return (
    <>
      <Head>
        <title>Full-Time Ministers | Old SDA Organization</title>
        <meta
          name="description"
          content="Meet our dedicated full-time ministers."
        />
      </Head>

      {/* Background (same as Members page) */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-fixed -z-10"
        style={{ backgroundImage: "url('/images/nature1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">

        {/* Header */}
        <div className="text-center mb-16 pt-13 md:pt-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Full-Time <span className="text-cyan-300">Ministers</span>
          </h1>

          <p className="text-cyan-100 text-lg md:text-xl mt-3 max-w-2xl mx-auto">
            Dedicated servants fully committed to gospel ministry and service.
          </p>

          <div className="w-24 h-1 bg-cyan-400 mx-auto mt-6 rounded-full" />
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="relative">
              <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-cyan-400" />
              <div className="absolute inset-0 rounded-full bg-cyan-400 blur-xl opacity-20 animate-pulse" />
            </div>
          </div>
        ) : ministers.length > 0 ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {ministers.map((minister) => {
              const excerpt = getExcerpt(stripHtml(minister.metadata), 28);
              const roleText =
                minister.role?.trim() || "Full-Time Minister";
              const titleText = minister.title || "Worker";

              return (
                <Link
                  key={minister.id}
                  href={`/full-time-ministers/${minister.id}`}
                  className="group block rounded-1xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-sm hover:border-cyan-500/50"
                >
                  {/* Image */}
              {minister.imageUrl && (
  <div className="relative w-full bg-slate-900 flex items-center justify-center">
    
    {/* optional soft background depth */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40" />

    <img
      src={minister.imageUrl}
      alt={minister.name}
      className="w-full h-auto object-contain max-h-[480px] transition-transform duration-700 group-hover:scale-105"
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />

    {/* badge */}
    <div className="absolute top-3 left-3 z-20">
      <div className="bg-cyan-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
        FULL-TIME
      </div>
    </div>

  </div>
)}

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs text-cyan-400 uppercase tracking-[0.18em]">
                        {titleText}
                      </span>
                    </div>

                    <h2 className="font-bold text-2xl mb-3 text-white group-hover:text-cyan-300 transition-colors">
                      {minister.name}
                    </h2>

                    <p className="text-slate-300 text-base mb-6 line-clamp-3 leading-relaxed">
                      {excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {minister.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-slate-300">
                          {roleText}
                        </span>
                      </div>

                      <span className="text-base font-medium text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all duration-300">
                        View Profile →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <>
            <div className="text-center py-24">
              <p className="text-xl text-slate-300 mb-3">
                Full-time ministers will appear soon.
              </p>
              <p className="text-base text-slate-500">
                Stay tuned for updates.
              </p>
            </div>

            {/* Bottom CTA - matching members page styling */}
            <div className="mt-24 pt-12 border-t border-slate-800 text-center">
              <div className="relative bg-slate-950/40 backdrop-blur-sm rounded-3xl p-10 border border-slate-800 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-700/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                  <p className="text-gray-300 mb-6 text-xl">
                    Support those who have given all for the gospel. <span className="text-cyan-400 font-semibold">Partner with full-time ministers</span>
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/full-time-ministers"
                      className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-full font-semibold text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      View All Full-Time Ministers
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <Link
                      href="/finance"
                      className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-800 rounded-full font-semibold text-cyan-400 border border-slate-700 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Support Gospel Work
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}