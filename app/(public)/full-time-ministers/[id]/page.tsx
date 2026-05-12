"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { db } from "@/lib/firebase";

interface FullTimeMinister {
  id: string;
  name: string;
  imageUrl: string;
  metadata: string;
  description?: string;
  role?: string;
  title?: string;
  expertise?: string;
  isFullTime?: boolean;
  joinedDate?: string;
  ministryFocus?: string;
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          <div className="absolute inset-0 rounded-full bg-amber-500 blur-xl opacity-20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!minister) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4 bg-[#0A0E27]">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
          <span className="text-sm font-medium text-amber-400">Full-Time Minister</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Minister not found</h2>
        <p className="text-gray-400 mb-6 max-w-md">
          The full-time minister you are looking for does not exist or is no longer available.
        </p>
        <Link
          href="/full-time-ministers"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-full font-medium hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          Back to Full-Time Ministers
        </Link>
      </div>
    );
  }

  const roleText = minister.role?.trim() ? minister.role : "Full-Time Minister";
  const titleText = minister.title?.trim() ? minister.title : "Bible Worker";
  const expertiseText = minister.expertise?.trim() ? minister.expertise : "Gospel Ministry";
  const joinedInfo = minister.joinedDate ? `Serving since ${minister.joinedDate}` : "Wholly consecrated to the work";

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B] -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#F59E0B_0%,_transparent_70%)] opacity-5"></div>
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-amber-900/10 to-transparent"></div>
      </div>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <Link
          href="/full-time-ministers"
          className="group mb-10 text-gray-400 hover:text-amber-400 font-medium flex items-center gap-2 transition-all duration-300 hover:gap-3"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to All Full-Time Ministers
        </Link>

        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 backdrop-blur-sm">
            <span className="text-amber-300 text-sm font-medium">FULL-TIME GOSPEL MINISTER</span>
          </div>
        </div>

        <div className="mb-16">
          {minister.imageUrl && (
            <div className="relative mb-10 rounded-2xl overflow-hidden group border border-amber-500/20 bg-slate-900">
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
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0E27] to-transparent"></div>
            </div>
          )}

          <div className="text-center mb-3">
            <span className="inline-block bg-amber-600/20 text-amber-300 px-4 py-1.5 rounded-full text-sm font-semibold border border-amber-500/30">
              {titleText}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white leading-tight tracking-tight text-center">
            {minister.name}
          </h1>

          <div className="text-center mb-8">
            <p className="text-amber-200">{expertiseText}</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-t border-b border-amber-500/20 bg-amber-500/5 rounded-xl px-6">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full bg-[#1E293B] flex items-center justify-center border border-amber-500/50">
                <span className="font-bold text-lg text-amber-400">{minister.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="font-semibold text-white">{roleText}</p>
                <p className="text-sm text-amber-400/80">{joinedInfo}</p>
              </div>
            </div>
            <div className="text-sm text-amber-300 font-medium">{articleCountText}</div>
          </div>
        </div>

        <article className="space-y-8">
          {metadataParagraphs.map((paragraph, index) => (
            <div
              key={index}
              className="leading-[1.9] text-gray-300 text-[1.125rem] md:text-[1.2rem]"
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          ))}
        </article>

        <div>
          {ministerBlogs.length > 0 ? (
            <section className="mt-20">
              <div className="text-center mb-12">
                <div className="inline-block mb-3 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                  <span className="text-xs font-medium text-amber-400">Published by {minister.name}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Articles by {minister.name}</h2>
                <p className="text-gray-400 max-w-md mx-auto">Only verified articles published by this minister</p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {ministerBlogs.map((blog) => {
                  const excerpt = getExcerpt(stripHtml(blog.content), 30);

                  return (
                    <article
                      key={blog.id}
                      onClick={() => handleBlogClick(blog.id)}
                      className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-[#1E293B]/40 border border-amber-500/20 backdrop-blur-sm hover:border-amber-500/50"
                    >
                      {blog.imageURL && (
                        <div className="relative h-52 overflow-hidden">
                          <img
                            src={blog.imageURL}
                            alt={blog.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <h3 className="font-bold text-xl mb-3 text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-5 line-clamp-3 leading-relaxed">{excerpt}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{formatProfessionalDate(blog.createdAt)}</span>
                          <span className="text-sm font-medium text-amber-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all duration-300">
                            Read Article -&gt;
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : !loadingBlogs && (
            <div className="mt-20 text-center py-12 border-t border-amber-500/20">
              <p className="text-gray-400 text-lg mb-6">No published articles were found for {minister.name}.</p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-full font-medium hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Explore Other Articles
              </Link>
            </div>
          )}

          {otherMinisters.length > 0 && (
            <section className="mt-24 pt-12 border-t border-amber-500/20">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Other Full-Time Ministers</h2>
                <p className="text-gray-400 max-w-md mx-auto">Men and women wholly consecrated to the gospel work</p>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherMinisters.map((m) => {
                  const otherRoleText = m.role && m.role.trim() !== "" ? m.role : "Full-Time Minister";

                  return (
                    <div
                      key={m.id}
                      className="group rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-[#1E293B]/40 border border-amber-500/20 backdrop-blur-sm hover:border-amber-500/50"
                    >
                      {m.imageUrl && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={m.imageUrl}
                            alt={m.name}
                            className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 p-4"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      )}

                      <div className={`p-6 ${!m.imageUrl ? "pt-6" : ""}`}>
                        <h3 className="font-bold text-xl mb-2 text-white group-hover:text-amber-400 transition-colors line-clamp-2">{m.name}</h3>
                        <p className="text-amber-400/80 text-xs mb-3">{otherRoleText}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{m.title || "Bible Worker"}</span>
                          <Link
                            href={`/full-time-ministers/${m.id}`}
                            className="text-sm font-medium text-amber-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all duration-300"
                          >
                            View Profile -&gt;
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <div className="mt-24 pt-12 border-t border-amber-500/20 text-center">
          <div className="relative bg-amber-500/5 backdrop-blur-sm rounded-3xl p-10 border border-amber-500/20 overflow-hidden">
            <div className="relative z-10">
              <p className="text-gray-300 mb-6 text-xl">
                Support those who have given all for the gospel. <span className="text-amber-400 font-semibold">Partner with full-time ministers</span>
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/full-time-ministers"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full font-semibold text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  View All Full-Time Ministers
                </Link>
                <Link
                  href="/finance"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1E293B] rounded-full font-semibold text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 transition-all duration-300"
                >
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
