"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { db } from "@/lib/firebase";

interface FullTimeMinister {
  id: string;
  name: string;
  imageUrl: string;
  metadata: string;
  description?: string;
  role?: string;
  title?: string;
  isFullTime?: boolean;
  joinedDate?: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  author: string;
  authorId?: string;
  createdAt?: Date | { toDate: () => Date } | string;
}

function stripHtml(html: string) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function getExcerpt(text: string, words = 26) {
  const wordsArray = text.split(" ");
  if (wordsArray.length <= words) return text;
  return `${wordsArray.slice(0, words).join(" ")}...`;
}

function toDate(value: Blog["createdAt"]): Date | null {
  if (!value) return null;
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (value instanceof Date) return value;
  if (typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate();
  }
  return null;
}

function formatProfessionalDate(date: Blog["createdAt"]) {
  const normalized = toDate(date);
  if (!normalized) return "";

  const day = normalized.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${normalized.toLocaleString("default", { month: "short" })} ${day}${suffix}, ${normalized.getFullYear()}`;
}

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function isFullTimeEntry(minister: Partial<FullTimeMinister>): boolean {
  return (
    minister.isFullTime === true ||
    minister.role?.toLowerCase().includes("full-time") === true ||
    minister.title?.toLowerCase().includes("full-time") === true
  );
}

export default function FullTimeMinisterPage() {
  const pathname = usePathname();
  const id = pathname?.split("/").pop();
  const router = useRouter();

  const [minister, setMinister] = useState<FullTimeMinister | null>(null);
  const [otherMinisters, setOtherMinisters] = useState<FullTimeMinister[]>([]);
  const [ministerBlogs, setMinisterBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [metadataParagraphs, setMetadataParagraphs] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchMinisterData = async () => {
      setLoading(true);
      setLoadingBlogs(true);

      try {
        let activeMinister: FullTimeMinister | null = null;

        const dedicatedSnap = await getDoc(doc(db, "fullTimeMinisters", id));
        if (dedicatedSnap.exists()) {
          activeMinister = {
            id: dedicatedSnap.id,
            ...(dedicatedSnap.data() as Omit<FullTimeMinister, "id">),
          };
        }

        if (!activeMinister) {
          const membersSnap = await getDoc(doc(db, "members", id));
          if (membersSnap.exists()) {
            const fallbackMinister = {
              id: membersSnap.id,
              ...(membersSnap.data() as Omit<FullTimeMinister, "id">),
            };
            if (isFullTimeEntry(fallbackMinister)) activeMinister = fallbackMinister;
          }
        }

        if (!activeMinister) {
          setMinister(null);
          setLoading(false);
          setLoadingBlogs(false);
          return;
        }

        setMinister(activeMinister);

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = activeMinister.metadata || "";
        const paragraphs = Array.from(tempDiv.querySelectorAll("p")).map((p) => p.innerHTML);
        setMetadataParagraphs(paragraphs.length ? paragraphs : [activeMinister.metadata || ""]);

        const blogsSnap = await getDocs(query(collection(db, "blog"), orderBy("createdAt", "desc"), limit(200)));
        const ministerName = normalizeName(activeMinister.name);

        const blogs = blogsSnap.docs
          .map((blogDoc) => {
            const data = blogDoc.data();
            return {
              id: blogDoc.id,
              title: data.title,
              content: data.content,
              imageURL: data.imageURL,
              author: data.author ?? "",
              authorId: data.authorId ?? "",
              createdAt: data.createdAt ?? null,
            } as Blog;
          })
          .filter((blog) => {
            const matchesAuthorId = !!blog.authorId && blog.authorId === activeMinister?.id;
            const matchesExactAuthorName = normalizeName(blog.author) === ministerName;
            return matchesAuthorId || matchesExactAuthorName;
          })
          .sort((a, b) => {
            const left = toDate(a.createdAt)?.getTime() ?? 0;
            const right = toDate(b.createdAt)?.getTime() ?? 0;
            return right - left;
          });

        setMinisterBlogs(blogs);

        const [fullTimeMinistersSnap, membersSnap] = await Promise.all([
          getDocs(query(collection(db, "fullTimeMinisters"), orderBy("createdAt", "asc"), limit(20))),
          getDocs(query(collection(db, "members"), orderBy("createdAt", "asc"), limit(20))),
        ]);

        const merged = new Map<string, FullTimeMinister>();

        fullTimeMinistersSnap.docs.forEach((item) => {
          const row = { id: item.id, ...(item.data() as Omit<FullTimeMinister, "id">) };
          merged.set(row.id, row);
        });

        membersSnap.docs.forEach((item) => {
          const row = { id: item.id, ...(item.data() as Omit<FullTimeMinister, "id">) };
          if (!merged.has(row.id) && isFullTimeEntry(row)) {
            merged.set(row.id, row);
          }
        });

        setOtherMinisters(
          Array.from(merged.values())
            .filter((entry) => entry.id !== activeMinister?.id)
            .slice(0, 6),
        );
      } catch (err) {
        console.error("Error fetching full-time minister data:", err);
        setMinister(null);
        setMinisterBlogs([]);
        setOtherMinisters([]);
      } finally {
        setLoading(false);
        setLoadingBlogs(false);
      }
    };

    fetchMinisterData();
  }, [id]);

  const articleCountText = useMemo(() => {
    const count = ministerBlogs.length;
    return `${count} article${count === 1 ? "" : "s"} published`;
  }, [ministerBlogs.length]);

  const handleBlogClick = (blogId: string) => {
    router.push(`/blog/${blogId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0A0E27]">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          <div className="absolute inset-0 rounded-full bg-cyan-500 blur-xl opacity-20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!minister) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4 bg-[#0A0E27]">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
          <span className="text-sm font-medium text-cyan-400">Full-Time Minister</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Minister not found</h2>
        <p className="text-gray-400 mb-6 max-w-md">
          The full-time minister you are looking for does not exist or is no longer available.
        </p>
        <Link
          href="/full-time-ministers"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-6 py-3 rounded-full font-medium hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          ← Back to Full-Time Ministers
        </Link>
      </div>
    );
  }

  const roleText = minister.role?.trim() ? minister.role : "Full-Time Minister";
  const titleText = minister.title?.trim() ? minister.title : "Bible Worker";
  const joinedInfo = minister.joinedDate ? `Serving since ${minister.joinedDate}` : "Wholly consecrated to the work";

  return (
    <>
      {/* Deep blue gradient background matching members page */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B] -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#06B6D4_0%,_transparent_70%)] opacity-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-cyan-900/10 to-transparent"></div>
      </div>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <Link
          href="/full-time-ministers"
          className="group mb-10 text-gray-400 hover:text-cyan-400 font-medium flex items-center gap-2 transition-all duration-300 hover:gap-3"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to All Full-Time Ministers
        </Link>

        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 backdrop-blur-sm">
            <span className="text-cyan-300 text-sm font-medium">FULL-TIME GOSPEL MINISTER</span>
          </div>
        </div>

        <div className="mb-16">
          {/* Member Image - matching Members page styling (NO cropping, object-contain) */}
          {minister.imageUrl && (
            <div className="relative mb-10 rounded-2xl overflow-hidden group border border-slate-800 bg-slate-950/40">
              <div className="relative w-full aspect-square md:aspect-video">
                <Image
                  src={minister.imageUrl}
                  alt={minister.name}
                  fill
                  className="object-contain transform group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0E27] to-transparent"></div>
            </div>
          )}

          <div className="text-center mb-3">
            <span className="inline-block bg-cyan-600/20 text-cyan-300 px-4 py-1.5 rounded-full text-sm font-semibold border border-cyan-500/30">
              {titleText}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white leading-tight tracking-tight text-center">
            {minister.name}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-t border-b border-slate-800 bg-slate-950/40 rounded-xl px-6">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-cyan-500/50">
                <span className="font-bold text-lg text-cyan-400">{minister.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="font-semibold text-white">{roleText}</p>
                <p className="text-sm text-cyan-400/80">{joinedInfo}</p>
              </div>
            </div>
            <div className="text-sm text-cyan-300 font-medium">{articleCountText}</div>
          </div>
        </div>

        {/* Member Content with Enhanced Readability - matching members page styling */}
        <article className="prose prose-invert prose-lg max-w-none">
          <div className="space-y-8">
            {metadataParagraphs.map((paragraph, index) => {
              const isFirst = index === 0;
              const isLastTwo = index >= metadataParagraphs.length - 2;
              
              return (
                <div 
                  key={index} 
                  className={`
                    leading-[1.9] text-gray-300 text-[1.125rem] md:text-[1.25rem]
                    ${isFirst ? 'text-[1.35rem] md:text-[1.5rem] first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-cyan-400' : ''}
                    ${isLastTwo ? 'relative overflow-hidden rounded-2xl p-8 mt-12 bg-slate-950/40 border border-slate-800' : ''}
                  `}
                >
                  {isLastTwo && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-cyan-700"></div>
                  )}
                  <div 
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                    className={`
                      ${isLastTwo ? 'text-[1.15rem] md:text-[1.2rem]' : ''} 
                      text-[1.125rem] md:text-[1.25rem] leading-[1.9]
                      [&>a]:text-cyan-400 [&>a]:hover:text-cyan-300 [&>a]:transition-colors [&>a]:underline
                      [&>strong]:text-white [&>strong]:font-semibold
                      [&>h2]:text-3xl md:[&>h2]:text-4xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-5 [&>h2]:text-white
                      [&>h3]:text-2xl md:[&>h3]:text-3xl [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:text-white
                      [&>p]:mb-6
                      [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:space-y-3
                      [&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:space-y-3
                      [&>blockquote]:border-l-4 [&>blockquote]:border-cyan-500 [&>blockquote]:pl-5 [&>blockquote]:italic [&>blockquote]:text-gray-400 [&>blockquote]:my-6
                    `}
                  />
                </div>
              );
            })}
          </div>
        </article>

        <div>
          {ministerBlogs.length > 0 ? (
            <section className="mt-20">
              <div className="text-center mb-12">
                <div className="inline-block mb-3 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                  <span className="text-xs font-medium text-cyan-400">Published by {minister.name}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Articles by {minister.name}</h2>
                <p className="text-gray-400 max-w-md mx-auto">Only verified articles published by this minister</p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {ministerBlogs.map((blog, idx) => {
                  const excerpt = getExcerpt(stripHtml(blog.content), 30);

                  return (
                    <motion.article
                      key={blog.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      onClick={() => handleBlogClick(blog.id)}
                      className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-slate-950/60 border border-slate-800 backdrop-blur-sm hover:border-cyan-500/50"
                    >
                      {blog.imageURL && (
                        <div className="relative h-52 overflow-hidden bg-slate-900">
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                          <img
                            src={blog.imageURL}
                            alt={blog.title}
                            className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-slate-950/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-700 mb-4 rounded-full"></div>
                        <h3 className="font-bold text-xl mb-3 text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-5 line-clamp-3 leading-relaxed">{excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">{blog.author.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="text-xs text-gray-500">{formatProfessionalDate(blog.createdAt)}</span>
                          </div>
                          <span className="text-sm font-medium text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all duration-300">
                            Read Article →
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </section>
          ) : !loadingBlogs && (
            <div className="mt-20 text-center py-12 border-t border-slate-800">
              <div className="inline-block mb-3 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                <span className="text-xs font-medium text-cyan-400">Coming Soon</span>
              </div>
              <p className="text-gray-400 text-lg mb-6">No published articles were found for {minister.name}.</p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-6 py-3 rounded-full font-medium hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Explore All Articles
              </Link>
            </div>
          )}

          {otherMinisters.length > 0 && (
            <section className="mt-24 pt-12 border-t border-slate-800">
              <div className="text-center mb-12">
                <div className="inline-block mb-3 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                  <span className="text-xs font-medium text-cyan-400">Meet the team</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Other Full-Time Ministers</h2>
                <p className="text-gray-400 max-w-md mx-auto">Men and women wholly consecrated to the gospel work</p>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherMinisters.map((m, index) => {
                  const otherRoleText = m.role && m.role.trim() !== "" ? m.role : "Full-Time Minister";

                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                      className="group rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-slate-950/60 border border-slate-800 backdrop-blur-sm hover:border-cyan-500/50"
                    >
                      {m.imageUrl && (
                        <div className="relative h-48 overflow-hidden bg-slate-900">
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                          <img
                            src={m.imageUrl}
                            alt={m.name}
                            className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 p-4"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-slate-950/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>
                      )}

                      <div className={`p-6 ${!m.imageUrl ? "pt-6" : ""}`}>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-700 mb-4 rounded-full"></div>
                        <h3 className="font-bold text-xl mb-2 text-white group-hover:text-cyan-400 transition-colors line-clamp-2">{m.name}</h3>
                        <p className="text-cyan-400/80 text-xs mb-3">{otherRoleText}</p>
                        <p className="text-gray-400 text-sm mb-5 line-clamp-3 leading-relaxed">
                          {m.description && m.description.length > 0
                            ? getExcerpt(m.description, 20)
                            : getExcerpt(stripHtml(m.metadata), 20)}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">{m.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="text-xs text-gray-500">{m.title || "Bible Worker"}</span>
                          </div>
                          <Link
                            href={`/full-time-ministers/${m.id}`}
                            className="text-sm font-medium text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all duration-300"
                          >
                            View Profile →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}
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
      </main>
    </>
  );
}