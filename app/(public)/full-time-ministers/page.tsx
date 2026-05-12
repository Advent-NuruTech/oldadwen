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
  expertise?: string;
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
        const fullTimeQuery = query(collection(db, "fullTimeMinisters"), orderBy("createdAt", "asc"));
        const fullTimeSnap = await getDocs(fullTimeQuery);

        const dedicatedMinisters = fullTimeSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          name: docSnap.data().name,
          imageUrl: docSnap.data().imageUrl,
          metadata: docSnap.data().metadata,
          role: docSnap.data().role || "",
          title: docSnap.data().title || "",
          expertise: docSnap.data().expertise || "",
          isFullTime: true,
        })) as Minister[];

        if (dedicatedMinisters.length > 0) {
          setMinisters(dedicatedMinisters);
          return;
        }

        const membersQuery = query(collection(db, "members"), orderBy("createdAt", "asc"));
        const membersSnapshot = await getDocs(membersQuery);
        const members = membersSnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          name: docSnap.data().name,
          imageUrl: docSnap.data().imageUrl,
          metadata: docSnap.data().metadata,
          role: docSnap.data().role || "",
          title: docSnap.data().title || "",
          expertise: docSnap.data().expertise || "",
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
          content="Meet our dedicated full-time ministers at Old SDA Organization - men and women wholly consecrated to proclaiming the everlasting gospel, restoring Old Adventism, and shepherding God's end-time remnant."
        />
      </Head>

      <div
        className="fixed inset-0 bg-cover bg-center bg-fixed -z-10"
        style={{
          backgroundImage: "url('/images/nature1.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <div className="text-center mb-16 pt-13 md:pt-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
            <span className="text-amber-300 text-sm font-medium">Set Apart for Sacred Work</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Full-Time <span className="text-amber-300">Ministers</span>
          </h1>
          <p className="text-amber-100 text-lg md:text-xl mt-3 max-w-2xl mx-auto">
            Wholly consecrated laborers - giving their all to the gospel,
            seeking no earthly gain, awaiting only the soon return of our King.
          </p>
          <div className="w-24 h-1 bg-amber-400 mx-auto mt-6 rounded-full" />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="relative">
              <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-amber-400"></div>
              <div className="absolute inset-0 rounded-full bg-amber-400 blur-xl opacity-20 animate-pulse"></div>
            </div>
          </div>
        ) : ministers.length > 0 ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministers.map((minister) => {
              const cleanText = stripHtml(minister.metadata);
              const excerpt = getExcerpt(cleanText, 28);
              const roleText = minister.role && minister.role.trim() !== "" ? minister.role : "Full-Time Minister";
              const titleText = minister.title || "Bible Worker";

              return (
                <Link
                  key={minister.id}
                  href={`/full-time-ministers/${minister.id}`}
                  className="group block rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-slate-950/90 border border-amber-500/20 backdrop-blur-sm hover:border-amber-500/50"
                >
                  {minister.imageUrl && (
                    <div className="relative h-64 overflow-hidden bg-slate-900">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                      <img
                        src={minister.imageUrl}
                        alt={minister.name}
                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 p-4"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="absolute top-3 left-3 z-20">
                        <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          FULL-TIME
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-slate-950/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 border border-amber-500/30">
                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs text-amber-400/90 uppercase tracking-[0.18em]">{titleText}</span>
                    </div>
                    <h2 className="font-bold text-2xl mb-3 text-white group-hover:text-amber-300 transition-colors">
                      {minister.name}
                    </h2>
                    <p className="text-slate-300 text-base mb-6 line-clamp-3 leading-relaxed">
                      {excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{minister.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-sm text-slate-300">{roleText}</span>
                      </div>
                      <span className="text-base font-medium text-amber-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all duration-300">
                        View Profile -&gt;
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
              <span className="text-sm font-medium text-amber-300">In Prayer & Preparation</span>
            </div>
            <p className="text-xl text-slate-300 mb-3">
              Full-time ministers being raised up.
            </p>
            <p className="text-base text-slate-500 max-w-md mx-auto">
              The Lord is calling laborers into His harvest. Check back soon as
              we introduce those wholly set apart for His end-time work.
            </p>
            <div className="mt-8 flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500/40 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500/60 animate-pulse delay-150"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500/80 animate-pulse delay-300"></div>
            </div>
          </div>
        )}

        {ministers.length > 0 && (
          <div className="mt-20 text-center">
            <div className="bg-slate-950/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-3">Supporting the Sacred Work</h3>
              <p className="text-slate-300 mb-6">
                These full-time ministers have given up everything to proclaim the three angels' messages.
                Their labor is supported by the freewill offerings of God's people who believe in the soon
                return of our Lord Jesus Christ.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/finance"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8m5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Support Gospel Work</span>
                </Link>
                <Link
                  href="/prayer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all duration-300 border border-slate-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-7-4.35-7-10a4 4 0 017-2.65A4 4 0 0119 11c0 5.65-7 10-7 10z" />
                  </svg>
                  <span>Pray With Us</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
