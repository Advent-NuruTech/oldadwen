"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  year: number;
  quarter: number;
  pdfUrl?: string;
  thumbnailUrl?: string;
  description?: string;
}

// ---------- UTILITY ----------
const truncateText = (text?: string, wordLimit = 20) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
};

// ---------- COMPONENT ----------
export default function SabbathSchool({ maxLessons = 2 }: { maxLessons?: number }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const q = query(
          collection(db, "sabbath_school_lessons"),
          orderBy("startDate", "desc"),
          limit(maxLessons)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Lesson));
        setLessons(data);
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLessons();
  }, [maxLessons]);

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-blue-600/20 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-blue-600/20 rounded"></div>
            <div className="h-4 bg-blue-600/20 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (lessons.length === 0) return (
    <div className="text-center py-12">
      <p className="text-blue-300">No lessons available at this time.</p>
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {lessons.map(lesson => (
        <div
          key={lesson.id}
          className="group bg-gradient-to-br from-blue-900/50 to-blue-800/30 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-1 border border-blue-400/20"
        >
          {lesson.thumbnailUrl && (
            <div className="w-full h-48 overflow-hidden relative">
              <img
                src={lesson.thumbnailUrl}
                alt={lesson.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
          <div className="p-4">
            <span className="text-xs font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Quarter {lesson.quarter} • Year {lesson.year}
            </span>
            <h3 className="mt-2 font-bold text-blue-100 text-lg group-hover:text-cyan-200 transition-colors duration-200">
              {lesson.title}
            </h3>
            <p className="text-xs text-cyan-200/70 mb-3">
              {lesson.startDate} — {lesson.endDate}
            </p>
            <p className="text-blue-200/80 text-sm mb-4 line-clamp-3">
              {truncateText(lesson.description, 20)}
            </p>
            {lesson.pdfUrl && (
              <Link
                href={`/sabbath-school/${lesson.id}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:from-blue-500 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 group/btn"
              >
                <span>Read Lesson</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}