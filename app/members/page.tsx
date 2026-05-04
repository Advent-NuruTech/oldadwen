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
        <title>Our Team | Gospel Sounders</title>
        <meta
          name="description"
          content="Meet the dedicated team behind Gospel Sounders — servants committed to revealing the Father and the Son, proclaiming the everlasting gospel, and preparing a people for Christ's soon return."
        />
      </Head>

      {/* Deep blue gradient background matching blog page */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B] -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#3B82F6_0%,_transparent_70%)] opacity-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#1E3A8A]/20 to-transparent"></div>
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        {/* Page Header - matching blog header style with larger fonts */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
            <span className="text-sm font-medium text-[#60A5FA]">Our Team</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-tight tracking-tight">
            Meet Our Team
          </h1>

          <div className="max-w-3xl mx-auto">
            <div className="relative bg-[#1E293B]/60 backdrop-blur-sm rounded-2xl p-8 border border-[#334155] shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/5 to-[#2563EB]/5"></div>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed relative z-10">
                Faithful workers united in purpose — revealing the Father and the Son
                through truth-filled ministry, literature, and service.
              </p>
            </div>
          </div>
        </div>

        {/* Loading State - matching blog loading spinner */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="relative">
              <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-[#3B82F6]"></div>
              <div className="absolute inset-0 rounded-full bg-[#3B82F6] blur-xl opacity-20 animate-pulse"></div>
            </div>
          </div>
        ) : members.length > 0 ? (
          /* Members Grid - matching suggested articles card styling with larger fonts */
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => {
              // Get excerpt from metadata for description
              const cleanText = stripHtml(member.metadata);
              const excerpt = getExcerpt(cleanText, 30);
              
              return (
                <Link
                  key={member.id}
                  href={`/members/${member.id}`}
                  className="group block rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-[#1E293B]/40 border border-[#334155] backdrop-blur-sm"
                >
                  {/* Image section */}
                  {member.imageUrl && (
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 p-4"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#0A0E27]/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <svg className="w-5 h-5 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="w-16 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] mb-5 rounded-full"></div>
                    <h2 className="font-bold text-2xl mb-4 text-white group-hover:text-[#60A5FA] transition-colors">
                      {member.name}
                    </h2>
                    <p className="text-gray-300 text-base mb-6 line-clamp-3 leading-relaxed">
                      {excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{member.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-sm text-gray-400">Team Member</span>
                      </div>
                      <span className="text-base font-medium text-[#60A5FA] group-hover:text-[#93C5FD] group-hover:translate-x-1 transition-all duration-300">
                        View Profile →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty State - matching blog empty state with larger fonts */
          <div className="text-center py-24">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
              <span className="text-sm font-medium text-[#60A5FA]">Coming Soon</span>
            </div>
            <p className="text-xl text-gray-300 mb-3">
              No team members published yet.
            </p>
            <p className="text-base text-gray-500">
              Please check back soon.
            </p>
          </div>
        )}
      </main>
    </>
  );
}