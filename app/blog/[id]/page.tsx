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
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [metaDescription, setMetaDescription] = useState("");
  const [shareSupported, setShareSupported] = useState(false);
  const [contentParagraphs, setContentParagraphs] = useState<string[]>([]);

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
      const shareText = plainText.split(" ").slice(0, 60).join(" ") + (plainText.split(" ").length > 60 ? "…" : "");
      
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
      const shareText = plainText.split(" ").slice(0, 60).join(" ") + (plainText.split(" ").length > 60 ? "…" : "");
      
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
      <div className="min-h-screen bg-cover bg-center bg-fixed relative flex items-center justify-center"
        style={{ backgroundImage: "url('/images/nature1.jpg')" }}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        <div className="relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-300"></div>
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
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        {blog.imageURL && <meta property="og:image" content={blog.imageURL} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={metaDescription} />
        {blog.imageURL && <meta name="twitter:image" content={blog.imageURL} />}
        <meta name="author" content={blog.author} />
      </Head>

      <main
        className="min-h-screen text-white bg-cover bg-center bg-fixed relative pt-28 pb-16 px-4"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dg7jxs7st/image/upload/v1778231376/nli-oct-screen-res-56_p1tvuj.jpg')",
        }}
      >
        {/* GLOBAL OVERLAY */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-6xl mx-auto space-y-12">

          {/* Back Navigation */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push("/blog")}
            className="text-cyan-300 hover:text-cyan-200 font-medium flex items-center gap-2 transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all articles
          </motion.button>

          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-950/90 backdrop-blur-sm border border-cyan-800 rounded-2xl p-8 md:p-12"
          >
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              {blog.title}
            </h1>

            {/* Meta Description */}
            {metaDescription && (
              <div className="mb-8">
                <p className="text-lg md:text-xl text-cyan-100 leading-relaxed">
                  {metaDescription}
                </p>
              </div>
            )}

            {/* Author & Date */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-cyan-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center">
                  <span className="font-medium text-white">
                    {blog.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-cyan-300">By {blog.author}</p>
                  <p className="text-sm text-slate-400">
                    {formatProfessionalDate(blog.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          {blog.imageURL && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative h-80 md:h-96 w-full rounded-2xl overflow-hidden cursor-pointer border border-cyan-800"
              onClick={() => setActiveImage(blog.imageURL!)}
            >
              <Image
                src={blog.imageURL}
                alt={blog.title}
                fill
                className="object-cover hover:scale-105 transition duration-700"
              />
            </motion.div>
          )}

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-950/90 backdrop-blur-sm border border-cyan-800 rounded-2xl p-8 md:p-12"
          >
            <div className="space-y-6">
              {contentParagraphs.map((paragraph, index) => (
                <div
                  key={index}
                  className="text-lg md:text-xl leading-relaxed text-slate-200"
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                />
              ))}
            </div>
          </motion.div>

          {/* Sharing Section */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-950/90 backdrop-blur-sm border border-cyan-800 rounded-2xl p-8 md:p-12 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-2">
              Share this article
            </h3>
            <p className="text-slate-400 mb-8">
              Help others discover this story
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => shareWithImage(blog)}
                disabled={isSharing}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-medium transition-all duration-300 disabled:opacity-50 w-full sm:w-auto min-w-[240px]"
              >
                {isSharing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sharing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Share with Image
                  </>
                )}
              </button>
              
              <button
                onClick={() => shareTextContent(blog)}
                className="group flex items-center justify-center gap-3 px-8 py-4 border-2 border-cyan-600 hover:bg-cyan-600 text-cyan-300 hover:text-white rounded-full font-medium transition-all duration-300 w-full sm:w-auto min-w-[240px]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Share Text Only
              </button>
            </div>
          </motion.div>

          {/* Suggested Articles */}
          {suggestedBlogs.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl md:text-5xl font-bold text-cyan-300 mb-2">
                  Continue Reading
                </h2>
                <p className="text-slate-400 text-lg">
                  More stories you might enjoy
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {suggestedBlogs.map((b, idx) => (
                  <motion.article
                    key={b.id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
                    onClick={() => handleSuggestedBlogClick(b.id)}
                    className="group cursor-pointer bg-slate-950/90 backdrop-blur-sm border border-cyan-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {b.imageURL && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={b.imageURL}
                          alt={b.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className={`p-6 ${!b.imageURL ? 'pt-6' : ''}`}>
                      <h3 className="font-bold text-xl mb-3 text-cyan-300 group-hover:text-cyan-200 transition-colors line-clamp-2">
                        {b.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                        {b.description 
                          ? getExcerpt(b.description, 20)
                          : getExcerpt(stripHtml(b.content), 20)}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">
                          By {b.author}
                        </span>
                        <span className="text-sm font-medium text-cyan-400 group-hover:translate-x-1 transition-transform">
                          Read →
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.section>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-slate-950/90 backdrop-blur-sm border border-cyan-800 rounded-2xl p-8 md:p-12 text-center"
          >
            <p className="text-slate-300 text-lg md:text-xl mb-6">
              Enjoyed this article? Explore more insights
            </p>
            <button
              onClick={() => router.push("/blog")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-medium transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              View All Articles
            </button>
          </motion.div>

        </div>

        {/* Image Lightbox */}
        <AnimatePresence>
          {activeImage && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveImage(null)}
            >
              <motion.div
                className="relative w-full max-w-6xl h-[85vh]"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={activeImage}
                  alt="preview"
                  fill
                  className="object-contain rounded-xl"
                />

                <button
                  onClick={() => setActiveImage(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white px-5 py-2 rounded-full text-lg font-medium transition"
                >
                  Close ✕
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}