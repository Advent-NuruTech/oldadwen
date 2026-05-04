"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";

type Blog = {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  author: string;
  createdAt?: Date | { toDate: () => Date } | string;
  description?: string;
};

// -------- Helpers --------
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

  return `Published on ${day}${suffix} ${d.toLocaleString("default", {
    month: "long",
    year: "numeric",
  })}`;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function getExcerpt(text: string, words = 24) {
  const wordsArray = text.split(" ");
  if (wordsArray.length <= words) return text;
  return wordsArray.slice(0, words).join(" ") + "…";
}

function createShareText(title: string, description: string, maxWords = 60): string {
  const titleWords = title.split(" ").length;
  const availableWords = Math.max(10, maxWords - titleWords);
  
  const truncatedDesc = description.split(" ").slice(0, availableWords).join(" ");
  const hasMore = description.split(" ").length > availableWords;
  return `${title}. ${truncatedDesc}${hasMore ? '…' : ''}`;
}

function generateMetaDescription(blog: Blog): string {
  if (blog.description) {
    return blog.description.length > 160 
      ? blog.description.substring(0, 157) + "..."
      : blog.description;
  }
  
  const plainText = stripHtml(blog.content);
  if (plainText.length <= 160) return plainText;
  
  return plainText.substring(0, 157) + "...";
}

export default function BlogIdPage() {
  const params = useParams();
  const router = useRouter();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [suggestedBlogs, setSuggestedBlogs] = useState<Blog[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [metaDescription, setMetaDescription] = useState("");
  const [shareSupported, setShareSupported] = useState(false);
  const [contentParagraphs, setContentParagraphs] = useState<string[]>([]);
  const [lastTwoParagraphs, setLastTwoParagraphs] = useState<string>("");

  useEffect(() => {
    setShareSupported(!!navigator.share);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    async function fetchBlogAndSuggestions() {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!id) return;

      const snap = await getDoc(doc(db, "blog", id));
      if (!snap.exists()) {
        router.push("/blog");
        return;
      }

      const data = snap.data();
      const currentBlog: Blog = {
        id: snap.id,
        title: data.title,
        content: data.content,
        imageURL: data.imageURL,
        author: data.author ?? "Unknown author",
        createdAt: data.createdAt ?? null,
        description: data.description || "",
      };

      setBlog(currentBlog);
      
      const metaDesc = generateMetaDescription(currentBlog);
      setMetaDescription(metaDesc);
      document.title = `${currentBlog.title} | Blog`;

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = currentBlog.content;
      const paragraphs = Array.from(tempDiv.querySelectorAll('p')).map(p => p.innerHTML);
      setContentParagraphs(paragraphs);
      
      if (paragraphs.length >= 2) {
        const lastTwo = paragraphs.slice(-2);
        const lastTwoText = lastTwo.map(p => stripHtml(p)).join(' ');
        setLastTwoParagraphs(lastTwoText);
      }

      const blogsRef = collection(db, "blog");
      const q = query(blogsRef, where("__name__", "!=", id), limit(6));
      const qsnap = await getDocs(q);

      const others: Blog[] = [];
      qsnap.forEach((docSnap) => {
        const d = docSnap.data();
        others.push({
          id: docSnap.id,
          title: d.title,
          content: d.content,
          imageURL: d.imageURL,
          author: d.author ?? "Unknown author",
          createdAt: d.createdAt ?? null,
          description: d.description || "",
        });
      });

      setSuggestedBlogs(others.slice(0, 3));
    }

    fetchBlogAndSuggestions();
  }, [params.id, router]);

  async function shareWithImage(blog: Blog) {
    if (!shareSupported) {
      try {
        const textToCopy = `${blog.title}\n\n${window.location.href}`;
        await navigator.clipboard.writeText(textToCopy);
        alert("Link copied to clipboard!");
      } catch {
        alert("Sharing is not supported on this device");
      }
      return;
    }

    setIsSharing(true);
    
    try {
      const plainText = stripHtml(blog.content);
      const shareText = createShareText(blog.title, plainText, 60);
      
      let shareData: ShareData = {
        title: blog.title,
        text: shareText,
        url: window.location.href,
      };

      if (blog.imageURL) {
        try {
          const response = await fetch(blog.imageURL);
          if (response.ok) {
            const blob = await response.blob();
            const file = new File([blob], 'blog-image.jpg', { 
              type: blob.type || 'image/jpeg' 
            });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              shareData = {
                ...shareData,
                files: [file],
              };
            }
          }
        } catch {
          // Continue without image
        }
      }

      await navigator.share(shareData);

    } catch (error: unknown) {
      const err = error as Error;
      if (err.name !== 'AbortError') {
        try {
          const textToCopy = `${blog.title}\n${window.location.href}`;
          await navigator.clipboard.writeText(textToCopy);
          alert("Link copied to clipboard!");
        } catch {
          // Ignore clipboard errors
        }
      }
    } finally {
      setIsSharing(false);
    }
  }

  async function shareTextContent(blog: Blog) {
    if (!shareSupported) {
      try {
        const textToCopy = `${blog.title}\n\n${window.location.href}`;
        await navigator.clipboard.writeText(textToCopy);
        alert("Link copied to clipboard!");
      } catch {
        alert("Sharing is not supported on this device");
      }
      return;
    }

    try {
      const plainText = stripHtml(blog.content);
      const shareText = createShareText(blog.title, plainText, 60);
      
      await navigator.share({
        title: blog.title,
        text: shareText,
        url: window.location.href,
      });
    } catch (error: unknown) {
      const err = error as Error;
      if (err.name !== 'AbortError') {
        try {
          const textToCopy = `${blog.title}\n${window.location.href}`;
          await navigator.clipboard.writeText(textToCopy);
          alert("Link copied to clipboard!");
        } catch {
          // Ignore clipboard errors
        }
      }
    }
  }

  const handleSuggestedBlogClick = (blogId: string) => {
    router.push(`/blog/${blogId}`);
    scrollToTop();
  };

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0E27]">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3B82F6]"></div>
          <div className="absolute inset-0 rounded-full bg-[#3B82F6] blur-xl opacity-20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${blog.title} | Blog`}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        {blog.imageURL && <meta property="og:image" content={blog.imageURL} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={metaDescription} />
        {blog.imageURL && <meta name="twitter:image" content={blog.imageURL} />}
        <meta name="author" content={blog.author} />
      </Head>

      {/* Deep blue gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B] -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#3B82F6_0%,_transparent_70%)] opacity-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#1E3A8A]/20 to-transparent"></div>
      </div>

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        {/* Back Navigation */}
        <button
          onClick={() => router.push("/blog")}
          className="group mb-10 text-gray-400 hover:text-[#60A5FA] font-medium flex items-center gap-2 transition-all duration-300 hover:gap-3"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all articles
        </button>

        {/* Article Header */}
        <article>
          <header className="mb-12">
           
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white leading-tight tracking-tight">
              {blog.title}
            </h1>

            {/* Meta Description */}
            {metaDescription && (
              <div className="mb-8 group">
                <div className="relative bg-[#1E293B]/60 backdrop-blur-sm rounded-2xl p-8 border border-[#334155] shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/5 to-[#2563EB]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <p className="text-lg text-gray-300 leading-relaxed relative z-10">
                    {metaDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Author & Date */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-t border-b border-[#334155]">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#3B82F6] rounded-full blur-md opacity-50"></div>
                  <div className="relative w-12 h-12 rounded-full bg-[#1E293B] flex items-center justify-center border border-[#3B82F6]/30">
                    <span className="font-bold text-lg text-[#60A5FA]">
                      {blog.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-white">By {blog.author}</p>
                  <p className="text-sm text-gray-400">
                    {formatProfessionalDate(blog.createdAt)}
                  </p>
                </div>
              </div>
              
              {/* Reading Time Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E293B]/50 border border-[#334155]">
                <svg className="w-4 h-4 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-400">5 min read</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {blog.imageURL && (
            <div className="relative mb-12 rounded-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              <img
                src={blog.imageURL}
                alt={blog.title}
                className="w-full h-auto max-h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0E27] to-transparent z-10"></div>
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="space-y-8">
              {contentParagraphs.map((paragraph, index) => {
                const isLastTwo = index >= contentParagraphs.length - 2;
                const isFirst = index === 0;
                
                return (
                  <div 
                   
  key={index}
  className={`
    leading-[1.9] text-gray-300 text-[1.125rem] md:text-[1.25rem]
                    ${isFirst ? 'text-[1.35rem] md:text-[1.5rem] first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-[#60A5FA]' : ''}  ${isLastTwo ? 'relative overflow-hidden rounded-2xl p-8 mt-12 bg-[#1E293B]/30 border border-[#334155]' : ''}
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
                        <div className="flex items-center gap-2 text-sm text-[#60A5FA]">
                          
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </article>

        {/* Sharing Section */}
        <div className="mt-20 pt-10 border-t border-[#334155]">
          <div className="text-center mb-10">
            <div className="inline-block mb-3 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
              <span className="text-xs font-medium text-[#60A5FA]">Spread the word</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Share this article
            </h3>
            <p className="text-gray-400">
              Help others discover this gem
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            {/* Share with Image Button */}
            <button
              onClick={() => shareWithImage(blog)}
              disabled={isSharing}
              className="group relative flex items-center justify-center gap-3 px-10 py-4 rounded-full font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 w-full sm:w-auto min-w-[260px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#1D4ED8]"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              {isSharing ? (
                <>
                  <div className="relative w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin z-10"></div>
                  <span className="relative z-10">Sharing...</span>
                </>
              ) : (
                <>
                  <svg className="relative w-5 h-5 group-hover:scale-110 transition-transform z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="relative z-10 text-white">Share with Image</span>
                </>
              )}
            </button>
            
            {/* Share Text Only Button */}
            <button
              onClick={() => shareTextContent(blog)}
              className="group flex items-center justify-center gap-3 px-10 py-4 bg-[#1E293B]/50 backdrop-blur-sm text-white border border-[#334155] rounded-full font-semibold hover:bg-[#334155]/50 hover:border-[#3B82F6]/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto min-w-[260px]"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Share Text Only
            </button>
          </div>
        </div>

        {/* Suggested Articles */}
        {suggestedBlogs.length > 0 && (
          <section className="mt-24">
            <div className="text-center mb-12">
              <div className="inline-block mb-3 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
                <span className="text-xs font-medium text-[#60A5FA]">Keep exploring</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
                Continue Reading
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                More stories you might enjoy from our collection
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {suggestedBlogs.map((b) => (
                <article
                  key={b.id}
                  onClick={() => handleSuggestedBlogClick(b.id)}
                  className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-[#1E293B]/40 border border-[#334155] backdrop-blur-sm"
                >
                  {b.imageURL && (
                    <div className="relative h-52 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                      <img
                        src={b.imageURL}
                        alt={b.title}
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
                      {b.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-5 line-clamp-3 leading-relaxed">
                      {b.description 
                        ? getExcerpt(b.description, 20)
                        : getExcerpt(stripHtml(b.content), 20)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{b.author.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {b.author}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-[#60A5FA] group-hover:text-[#93C5FD] group-hover:translate-x-1 transition-all duration-300">
                        Read Article →
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <div className="mt-24 pt-12 border-t border-[#334155] text-center">
          <div className="relative bg-[#1E293B]/30 backdrop-blur-sm rounded-3xl p-10 border border-[#334155] overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1D4ED8]/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <p className="text-gray-300 mb-6 text-xl">
                Enjoyed this article? <span className="text-[#60A5FA] font-semibold">Explore more insights</span>
              </p>
              <button
                onClick={() => router.push("/blog")}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-full font-semibold text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                View All Articles
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}