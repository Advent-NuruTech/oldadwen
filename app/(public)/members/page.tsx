"use client";

import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Head from "next/head";

import Link from "next/link";

interface Member {
  id: string;
  name: string;
  imageUrl: string;
  metadata: string;
  role?: string; // Add role field
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function getExcerpt(text: string, words = 25) {
  const wordsArray = text.split(" ");
  if (wordsArray.length <= words) return text;
  return wordsArray.slice(0, words).join(" ") + "…";
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "members"), orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          imageUrl: doc.data().imageUrl,
          metadata: doc.data().metadata,
          role: doc.data().role || "", // Fetch role, default to empty string
        })) as Member[];
        setMembers(data);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <>
      {/* SEO / Attention Magnet */}
      <Head>
        <title>Our Team | Old SDA Organization</title>
        <meta
          name="description"
          content="Meet the dedicated team behind Old SDA Organization — servants committed to restoring the Old Adventism , proclaiming the everlasting gospel, and preparing a people for Christ's soon return."
        />
      </Head>

      {/* SAME BACKGROUND AS ABOUT PAGE - Nature image with overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-fixed -z-10"
        style={{
          backgroundImage: "url('/images/nature1.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        {/* Page Header - matching about page style with larger fonts */}
        <div className="text-center mb-16 pt-13 md:pt-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Meet <span className="text-cyan-300">Our Team</span>
          </h1>
          <p className="text-cyan-100 text-lg md:text-xl mt-3 max-w-2xl mx-auto">
            Faithful workers united in purpose — revealing the Father and the Son
            through truth-filled ministry, literature, and service.
          </p>
          <div className="w-24 h-1 bg-cyan-400 mx-auto mt-6 rounded-full" />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="relative">
              <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-cyan-400"></div>
              <div className="absolute inset-0 rounded-full bg-cyan-400 blur-xl opacity-20 animate-pulse"></div>
            </div>
          </div>
        ) : members.length > 0 ? (
          /* Members Grid - matching about page card styling */
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => {
              // Get excerpt from metadata for description
              const cleanText = stripHtml(member.metadata);
              const excerpt = getExcerpt(cleanText, 30);
              
              // Determine the role text - if role exists, show it, otherwise show "Team Member"
              const roleText = member.role && member.role.trim() !== "" ? member.role : "Team Member";
              
              return (
                <Link
                  key={member.id}
                  href={`/members/${member.id}`}
                  className="group block rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-sm"
                >
                  {/* Image section */}
                  {member.imageUrl && (
                    <div className="relative h-64 overflow-hidden bg-slate-900">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 p-4"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-slate-950/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 border border-cyan-500/30">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-700 mb-5 rounded-full"></div>
                    <h2 className="font-bold text-2xl mb-4 text-white group-hover:text-cyan-300 transition-colors">
                      {member.name}
                    </h2>
                    <p className="text-slate-300 text-base mb-6 line-clamp-3 leading-relaxed">
                      {excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{member.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-sm text-slate-400">{roleText}</span>
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
          /* Empty State */
          <div className="text-center py-24">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              <span className="text-sm font-medium text-cyan-300">Coming Soon</span>
            </div>
            <p className="text-xl text-slate-300 mb-3">
              No team members published yet.
            </p>
            <p className="text-base text-slate-500">
              Please check back soon.
            </p>
          </div>
        )}
      </main>
    </>
  );
}