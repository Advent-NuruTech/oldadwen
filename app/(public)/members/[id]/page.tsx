"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import parse from "html-react-parser";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { motion } from "framer-motion";

interface Member {
  id?: string;
  name: string;
  imageUrl: string;
  metadata: string;
  description?: string;
  role?: string; // Add role field
}

interface Blog {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  author: string;
  createdAt?: Date | { toDate: () => Date } | string;
  description?: string;
}

// Helper for short preview
function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function getExcerpt(text: string, words = 24) {
  const wordsArray = text.split(" ");
  if (wordsArray.length <= words) return text;
  return wordsArray.slice(0, words).join(" ") + "…";
}

function getPreview(html: string, words = 18) {
  const clean = stripHtml(html);
  const parts = clean.split(" ");
  return parts.length > words ? parts.slice(0, words).join(" ") + "…" : clean;
}

function formatProfessionalDate(date: Blog["createdAt"]) {
  if (!date) return "";
  const d =
    typeof date === "string"
      ? new Date(date)
      : date instanceof Date
      ? date
      : date?.toDate
      ? date.toDate()
      : new Date();

  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${d.toLocaleString("default", {
    month: "short",
  })} ${day}${suffix}, ${d.getFullYear()}`;
}

// Helper to check if author name matches member name (case-insensitive, partial match)
function authorMatchesMember(authorName: string, memberName: string): boolean {
  // Clean and normalize both names
  const cleanAuthor = authorName.trim().toLowerCase();
  const cleanMember = memberName.trim().toLowerCase();
  
  // Check for exact match
  if (cleanAuthor === cleanMember) return true;
  
  // Check if member name contains author name or vice versa
  if (cleanAuthor.includes(cleanMember) || cleanMember.includes(cleanAuthor)) return true;
  
  // Split into parts and check for any part matches
  const authorParts = cleanAuthor.split(/\s+/);
  const memberParts = cleanMember.split(/\s+/);
  
  // Check if any author part matches any member part
  for (const authorPart of authorParts) {
    for (const memberPart of memberParts) {
      if (authorPart === memberPart) return true;
    }
  }
  
  return false;
}

export default function MemberPage() {
  const pathname = usePathname();
  const id = pathname?.split("/").pop();

  const [member, setMember] = useState<Member | null>(null);
  const [otherMembers, setOtherMembers] = useState<Member[]>([]);
  const [memberBlogs, setMemberBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [metadataParagraphs, setMetadataParagraphs] = useState<string[]>([]);
  const [lastTwoParagraphs, setLastTwoParagraphs] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchMemberData = async () => {
      setLoading(true);
      setLoadingBlogs(true);
      
      try {
        // Fetch current member
        const memberSnap = await getDoc(doc(db, "members", id));
        if (memberSnap.exists()) {
          const memberData = { id: memberSnap.id, ...(memberSnap.data() as Member) };
          setMember(memberData);
          
          // Process metadata for better paragraph display
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = memberData.metadata;
          const paragraphs = Array.from(tempDiv.querySelectorAll('p')).map(p => p.innerHTML);
          setMetadataParagraphs(paragraphs);
          
          // Extract last two paragraphs
          if (paragraphs.length >= 2) {
            const lastTwo = paragraphs.slice(-2);
            const lastTwoText = lastTwo.map(p => stripHtml(p)).join(' ');
            setLastTwoParagraphs(lastTwoText);
          }
          
          // Fetch ALL blogs from both collections to ensure we find all matches
          const blogsPromises = [
            // Try "blogs" collection (plural - from Add Blog page)
            getDocs(query(collection(db, "blogs"), orderBy("createdAt", "desc"), limit(50))),
            // Try "blog" collection (singular - from original blog page)
            getDocs(query(collection(db, "blog"), orderBy("createdAt", "desc"), limit(50)))
          ];
          
          const [blogsSnapPlural, blogsSnapSingular] = await Promise.all(blogsPromises);
          
          const blogs: Blog[] = [];
          
          // Process blogs from "blogs" collection
          blogsSnapPlural.forEach((docSnap) => {
            const data = docSnap.data();
            // Check if ANY part of member name appears in author field
            if (data.authorName && authorMatchesMember(data.authorName, memberData.name)) {
              blogs.push({
                id: docSnap.id,
                title: data.title,
                content: data.content,
                imageURL: data.imageUrl, // Note: field name difference
                author: data.authorName, // Using authorName field
                createdAt: data.createdAt ?? null,
                description: data.shortDescription || "",
              });
            }
          });
          
          // Process blogs from "blog" collection
          blogsSnapSingular.forEach((docSnap) => {
            const data = docSnap.data();
            // Check if ANY part of member name appears in author field
            if (data.author && authorMatchesMember(data.author, memberData.name)) {
              blogs.push({
                id: docSnap.id,
                title: data.title,
                content: data.content,
                imageURL: data.imageURL,
                author: data.author,
                createdAt: data.createdAt ?? null,
                description: data.description || "",
              });
            }
          });
          
          // Remove duplicates by blog title (in case same blog exists in both collections)
          const uniqueBlogs = blogs.filter((blog, index, self) =>
            index === self.findIndex(b => b.title === blog.title)
          );
          
          // Sort by date (newest first)
          uniqueBlogs.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt instanceof Date ? a.createdAt : 
                          typeof a.createdAt === 'string' ? a.createdAt : 
                          (a.createdAt as any)?.toDate?.() || new Date()).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt instanceof Date ? b.createdAt : 
                          typeof b.createdAt === 'string' ? b.createdAt : 
                          (b.createdAt as any)?.toDate?.() || new Date()).getTime() : 0;
            return dateB - dateA;
          });
          
          // Limit to 6 most recent
          setMemberBlogs(uniqueBlogs.slice(0, 6));
        } else {
          setMember(null);
        }

        // Fetch other members (max 6)
        const snapOther = await getDocs(query(collection(db, "members"), orderBy("createdAt", "asc"), limit(6)));
        const list = snapOther.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Member, "id">) }))
          .filter((m) => m.id !== id);
        setOtherMembers(list);
      } catch (err) {
        console.error("Error fetching member data:", err);
        setMember(null);
        setMemberBlogs([]);
        setOtherMembers([]);
      } finally {
        setLoading(false);
        setLoadingBlogs(false);
      }
    };

    fetchMemberData();
  }, [id]);

  const router = useRouter();

const handleBlogClick = (blogId: string) => {
  router.push(`/blog/${blogId}`);
};

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#0A0E27]">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3B82F6]"></div>
        <div className="absolute inset-0 rounded-full bg-[#3B82F6] blur-xl opacity-20 animate-pulse"></div>
      </div>
    </div>
  );
  
  if (!member) return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center px-4 bg-[#0A0E27]">
      <h2 className="text-2xl font-bold text-white mb-4">Member not found</h2>
      <Link 
        href="/members" 
        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-6 py-3 rounded-full font-medium hover:shadow-2xl hover:scale-105 transition-all duration-300"
      >
        ← Back to Members
      </Link>
    </div>
  );

  // Determine the role text - if role exists, show it, otherwise show "Team Member"
  const roleText = member.role && member.role.trim() !== "" ? member.role : "Team Member";

  return (
    <>
      {/* Deep blue gradient background matching blog page */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B] -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#3B82F6_0%,_transparent_70%)] opacity-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#1E3A8A]/20 to-transparent"></div>
      </div>

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        {/* Back Navigation - matching blog style */}
        <Link 
          href="/members" 
          className="group mb-10 text-gray-400 hover:text-[#60A5FA] font-medium flex items-center gap-2 transition-all duration-300 hover:gap-3"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to All Members
        </Link>

        {/* Current Member */}
        <div className="mb-16">
          {/* Member Image - matching blog image styling */}
          {member.imageUrl && (
            <div className="relative mb-12 rounded-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              <div className="relative w-full aspect-square md:aspect-video">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  className="object-contain transform group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                  priority
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0E27] to-transparent z-10"></div>
            </div>
          )}

          {/* Title - matching blog h1 style */}
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white leading-tight tracking-tight">
            {member.name}
          </h1>

          {/* Author & Role section - matching blog author box */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-t border-b border-[#334155]">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#3B82F6] rounded-full blur-md opacity-50"></div>
                <div className="relative w-12 h-12 rounded-full bg-[#1E293B] flex items-center justify-center border border-[#3B82F6]/30">
                  <span className="font-bold text-lg text-[#60A5FA]">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                {/* Role display - shows role if exists, otherwise "Team Member" */}
                <p className="font-semibold text-white">{roleText}</p>
                <p className="text-sm text-gray-400">
                  {memberBlogs.length} article{memberBlogs.length !== 1 ? 's' : ''} published
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Member Content with Enhanced Readability - matching blog article content styling */}
        <article>
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="space-y-8">
              {metadataParagraphs.map((paragraph, index) => {
                const isLastTwo = index >= metadataParagraphs.length - 2;
                const isFirst = index === 0;
                
                return (
                  <div 
                    key={index} 
                    className={`
                      leading-[1.9] text-gray-300 text-[1.125rem] md:text-[1.25rem]
                      ${isFirst ? 'text-[1.35rem] md:text-[1.5rem] first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-[#60A5FA]' : ''}
                      ${isLastTwo ? 'relative overflow-hidden rounded-2xl p-8 mt-12 bg-[#1E293B]/30 border border-[#334155]' : ''}
                    `}
                  >
                    {isLastTwo && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#3B82F6] to-[#2563EB]"></div>
                    )}
                    <div 
                      dangerouslySetInnerHTML={{ __html: paragraph }}
                      className={`
                        ${isLastTwo ? 'text-[1.15rem] md:text-[1.2rem]' : ''} 
                        text-[1.125rem] md:text-[1.25rem] leading-[1.9]
                        [&>a]:text-[#60A5FA] [&>a]:hover:text-[#93C5FD] [&>a]:transition-colors [&>a]:underline
                        [&>strong]:text-white [&>strong]:font-semibold
                        [&>h2]:text-3xl md:[&>h2]:text-4xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-5 [&>h2]:text-white
                        [&>h3]:text-2xl md:[&>h3]:text-3xl [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:text-white
                        [&>p]:mb-6
                        [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:space-y-3
                        [&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:space-y-3
                        [&>blockquote]:border-l-4 [&>blockquote]:border-[#3B82F6] [&>blockquote]:pl-5 [&>blockquote]:italic [&>blockquote]:text-gray-400 [&>blockquote]:my-6
                      `}
                    />
                    
                    {isLastTwo && lastTwoParagraphs && (
                      <div className="mt-6 pt-4 border-t border-[#334155]">
                        <meta name="description" content={lastTwoParagraphs.substring(0, 155) + '...'} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </article>

        {/* Blogs by this Member - with blog card styling matching suggested articles */}
        <div>
          {memberBlogs.length > 0 ? (
            <section className="mt-24">
              <div className="text-center mb-12">
                <div className="inline-block mb-3 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
                  <span className="text-xs font-medium text-[#60A5FA]">Written by {member.name}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
                  Articles by {member.name}
                </h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Latest insights and articles from {member.name}
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {memberBlogs.map((blog) => {
                  const excerpt = blog.description 
                    ? blog.description.length > 120 
                      ? blog.description.substring(0, 117) + "..."
                      : blog.description
                    : getExcerpt(stripHtml(blog.content), 40);

                  return (
                    <article
                      key={blog.id}
                      onClick={() => handleBlogClick(blog.id)}
                      className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-[#1E293B]/40 border border-[#334155] backdrop-blur-sm"
                    >
                      {blog.imageURL && (
                        <div className="relative h-52 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                          <img
                            src={blog.imageURL}
                            alt={blog.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
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
                        <div className="w-12 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] mb-4 rounded-full"></div>
                        <h3 className="font-bold text-xl mb-3 text-white group-hover:text-[#60A5FA] transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-5 line-clamp-3 leading-relaxed">
                          {excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center">
                              <span className="text-xs font-bold text-white">{blog.author.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatProfessionalDate(blog.createdAt)}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-[#60A5FA] group-hover:text-[#93C5FD] group-hover:translate-x-1 transition-all duration-300">
                            Read Article →
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : !loadingBlogs && (
            <div className="mt-24 text-center py-12 border-t border-[#334155]">
              <div className="inline-block mb-3 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
                <span className="text-xs font-medium text-[#60A5FA]">Coming Soon</span>
              </div>
              <p className="text-gray-400 text-lg mb-6">
                No blog articles published by {member.name} yet.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-6 py-3 rounded-full font-medium hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Explore All Blogs
              </Link>
            </div>
          )}

          {/* Other Members - matching suggested articles styling */}
          {otherMembers.length > 0 && (
            <section className="mt-24 pt-12 border-t border-[#334155]">
              <div className="text-center mb-12">
                <div className="inline-block mb-3 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
                  <span className="text-xs font-medium text-[#60A5FA]">Meet the team</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
                  Other Team Members
                </h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Discover more talented individuals on our team
                </p>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherMembers.map((m, index) => {
                  // Determine role text for other members
                  const otherMemberRoleText = m.role && m.role.trim() !== "" ? m.role : "Team Member";
                  
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                      className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-[#1E293B]/40 border border-[#334155] backdrop-blur-sm"
                    >
                      {/* Image section - only shows when imageUrl exists */}
                      {m.imageUrl && (
                        <div className="relative h-48 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                          <img
                            src={m.imageUrl}
                            alt={m.name}
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
                      
                      <div className={`p-6 ${!m.imageUrl ? 'pt-6' : ''}`}>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] mb-4 rounded-full"></div>
                        <h3 className="font-bold text-xl mb-3 text-white group-hover:text-[#60A5FA] transition-colors line-clamp-2">
                          {m.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-5 line-clamp-3 leading-relaxed">
                          {m.description && m.description.length > 0
                            ? getExcerpt(m.description, 20)
                            : getExcerpt(stripHtml(m.metadata), 20)}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center">
                              <span className="text-xs font-bold text-white">{m.name.charAt(0).toUpperCase()}</span>
                            </div>
                            {/* Role display for other members - shows role if exists, otherwise "Team Member" */}
                            <span className="text-xs text-gray-500">{otherMemberRoleText}</span>
                          </div>
                          <Link
                            href={`/members/${m.id}`}
                            className="text-sm font-medium text-[#60A5FA] group-hover:text-[#93C5FD] group-hover:translate-x-1 transition-all duration-300"
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

        {/* Bottom CTA - matching blog bottom CTA styling */}
        <div className="mt-24 pt-12 border-t border-[#334155] text-center">
          <div className="relative bg-[#1E293B]/30 backdrop-blur-sm rounded-3xl p-10 border border-[#334155] overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1D4ED8]/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <p className="text-gray-300 mb-6 text-xl">
                Want to connect with our team? <span className="text-[#60A5FA] font-semibold">Explore all members</span>
              </p>
              <Link
                href="/members"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-full font-semibold text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                View All Team Members
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}