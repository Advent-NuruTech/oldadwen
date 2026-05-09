"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Filter, RotateCcw, X, Download, Eye } from "lucide-react";
import Link from "next/link";

/* ================= TYPES ================= */
interface Lesson {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  year: number;
  quarter: number;
  pdfUrl: string;
  thumbnailUrl?: string;
  description?: string;
}

/* ================= UTILS ================= */
function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

function truncateText(text: string, limit = 60) {
  const words = text.split(/\s+/);
  return {
    truncated: words.length > limit,
    text:
      words.length > limit
        ? words.slice(0, limit).join(" ") + "…"
        : text,
  };
}

function highlightVerses(html?: string) {
  if (!html) return "";
  const regex = /\b([1-3]?\s?[A-Za-z]+)\s\d+:\d+\b/g;
  return html.replace(
    regex,
    m =>
      `<span class="text-sky-300 font-semibold underline underline-offset-4 cursor-pointer hover:text-sky-200 transition-colors break-words">${m}</span>`
  );
}

function formatProfessionalDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ================= COMPONENT ================= */
export default function SabbathSchoolPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pdfViewUrl, setPdfViewUrl] = useState<string | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [day, setDay] = useState("all");

  /* ---------- FETCH ---------- */
  useEffect(() => {
    async function fetchLessons() {
      const snap = await getDocs(collection(db, "sabbath_school_lessons"));
      setLessons(snap.docs.map(d => ({ id: d.id, ...d.data() } as Lesson)));
    }
    fetchLessons();
  }, []);

  const years = useMemo(
    () => Array.from(new Set(lessons.map(l => l.year))).sort(),
    [lessons]
  );

  const filteredLessons = useMemo(() => {
    return lessons.filter(l => {
      const d = new Date(l.startDate);
      return (
        (year === "all" || d.getFullYear().toString() === year) &&
        (month === "all" || (d.getMonth() + 1).toString() === month) &&
        (day === "all" || d.getDate().toString() === day)
      );
    });
  }, [lessons, year, month, day]);

  const sortedLessons = useMemo(() => {
    return [...filteredLessons].sort(
      (a, b) =>
        new Date(a.startDate).getTime() -
        new Date(b.startDate).getTime()
    );
  }, [filteredLessons]);

  const currentIndex = sortedLessons.findIndex(l => l.id === expandedId);
  const currentLesson = currentIndex >= 0 ? sortedLessons[currentIndex] : null;
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < sortedLessons.length - 1
      ? sortedLessons[currentIndex + 1]
      : null;

  const resetFilters = () => {
    setYear("all");
    setMonth("all");
    setDay("all");
    setShowFilters(false);
  };

  const handleDownload = (pdfUrl: string, title: string) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ================= LIST VIEW ================= */
  if (!expandedId) {
    return (
      <main
        className="min-h-screen text-white bg-cover bg-center bg-fixed relative pt-28 pb-16 px-4 overflow-x-hidden"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dg7jxs7st/image/upload/v1778231376/nli-oct-screen-res-56_p1tvuj.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-12">
          {/* HEADER */}
          <div className="text-center mb-10 pt-6 md:pt-10">
            <div className="inline-block mb-3 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
              <span className="text-lg text-[#60A5FA] font-medium">
                quarterly bible study
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white break-words">
              Sabbath School Lessons
            </h1>

            <p className="text-gray-300 mt-4 text-base sm:text-lg md:text-xl break-words">
              Systematic, spirit-filled study under{" "}
              <span className="text-[#60A5FA] font-semibold">
                Old Seventh Day Adventists
              </span>
            </p>
          </div>

          {/* FILTER BUTTON */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowFilters(v => !v)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full
                bg-gradient-to-r from-[#2563EB]/80 to-[#1D4ED8]/80
                text-white font-semibold hover:from-[#2563EB] hover:to-[#1D4ED8] 
                transition-all duration-300 shadow-lg"
            >
              <Filter size={16} />
              Filter Lessons
            </button>
          </div>

          {/* FILTER PANEL */}
          {showFilters && (
            <div className="max-w-4xl mx-auto mb-10 rounded-2xl p-4 sm:p-6
              bg-[#1E293B]/40 backdrop-blur border border-[#334155] shadow-xl">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <select
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="w-full min-w-0 rounded-lg px-4 py-2 bg-[#0F172A]/60 border border-[#334155] text-gray-200"
                >
                  <option value="all">All Years</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                <select
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  className="w-full min-w-0 rounded-lg px-4 py-2 bg-[#0F172A]/60 border border-[#334155] text-gray-200"
                >
                  <option value="all">All Months</option>
                  {Array.from({ length: 12 }).map((_, m) => (
                    <option key={m} value={m + 1}>
                      {new Date(0, m).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </select>

                <select
                  value={day}
                  onChange={e => setDay(e.target.value)}
                  className="w-full min-w-0 rounded-lg px-4 py-2 bg-[#0F172A]/60 border border-[#334155] text-gray-200"
                >
                  <option value="all">All Days</option>
                  {Array.from({ length: 31 }).map((_, d) => (
                    <option key={d} value={d + 1}>{d + 1}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 text-sm font-semibold text-[#60A5FA]"
                >
                  <RotateCcw size={14} />
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* CARDS */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedLessons.map(lesson => {
              const plain = stripHtml(lesson.description);
              const { text } = truncateText(plain);

              return (
                <div
                  key={lesson.id}
                  className="flex flex-col rounded-2xl overflow-hidden bg-[#1E293B]/40 backdrop-blur border border-[#334155] shadow-xl"
                >
                  {lesson.thumbnailUrl && (
                    <img
                      src={lesson.thumbnailUrl}
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-lg font-bold text-white break-words">
                      {lesson.title}
                    </h2>

                    <p className="text-sm text-[#60A5FA] mb-1">
                      Quarter {lesson.quarter} • {lesson.year}
                    </p>

                    <p className="text-sm text-gray-300 mb-4 break-words">
                      {text}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-2">
                      <button
                        onClick={() => setExpandedId(lesson.id)}
                        className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#2563EB]/80 to-[#1D4ED8]/80 text-white"
                      >
                        Read More
                      </button>

                      {lesson.pdfUrl && (
                        <>
                       

                          <button
                            onClick={() => handleDownload(lesson.pdfUrl, lesson.title)}
                            className="px-4 py-2 rounded-lg bg-[#F59E0B]/80 text-white"
                          >
                            <Download size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PDF MODAL */}
        {pdfViewUrl && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-6 overflow-x-hidden">
            <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-lg overflow-hidden">
              <button
                onClick={() => setPdfViewUrl(null)}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full"
              >
                <X size={20} />
              </button>

              <iframe
                src={`${pdfViewUrl}#toolbar=1&navpanes=1`}
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </main>
    );
  }

  /* ================= FULL VIEW ================= */
  if (!currentLesson) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-black/90 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex flex-wrap justify-between gap-3 mb-6">
          <button
            onClick={() => setExpandedId(null)}
            className="px-4 py-2 rounded-full bg-[#2563EB]/80 text-white"
          >
            <X size={18} /> Close
          </button>

          <div className="flex flex-wrap gap-2">
            {prevLesson && (
              <button
                onClick={() => setExpandedId(prevLesson.id)}
                className="px-3 py-2 bg-[#334155] text-white rounded-full"
              >
                ← Prev
              </button>
            )}
            {nextLesson && (
              <button
                onClick={() => setExpandedId(nextLesson.id)}
                className="px-3 py-2 bg-[#334155] text-white rounded-full"
              >
                Next →
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-[#1E293B]/60 p-5 sm:p-8 border border-[#334155]">
          <h1 className="text-2xl sm:text-4xl font-bold text-white break-words">
            {currentLesson.title}
          </h1>

          <div
            className="text-gray-300 mt-6 leading-relaxed break-words overflow-hidden"
            dangerouslySetInnerHTML={{
              __html: highlightVerses(currentLesson.description),
            }}
          />
        </div>
      </div>
    </div>
  );
}