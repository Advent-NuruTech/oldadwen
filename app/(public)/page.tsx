"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* ================= IMPORT COMPONENTS ================= */
import Hero from "@/components/public/HeroBanner";
import BlogList from "@/components/public/BlogList";
import LibraryList from "@/components/public/LibraryList";
import { SectionTitle } from "@/components/public/SectionTitle";
import YoutubeCarousel from "@/components/public/YoutubeCarousel";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* ================= HERO ================= */}
      <Hero />

      {/* ================= YOUTUBE (DARK SECTION) ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 
        bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 
        text-white">
        
        <div className="max-w-7xl mx-auto text-center">
          <SectionTitle
            title="Latest Video Messages"
            subtitle="Watch powerful sermons, Bible teachings, and mission highlights"
          />

          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <YoutubeCarousel />
          </motion.div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <a
              href="https://youtube.com/@gospelsounders"
              target="_blank"
              className="inline-block
                bg-white text-blue-900
                px-8 py-4
                rounded-xl font-bold text-lg
                hover:bg-gray-100 hover:scale-105
                transition-all duration-300 shadow-lg"
            >
              WATCH ALL VIDEOS →
            </a>
          </motion.div>
        </div>
      </section>

      {/* ================= BLOG & LIBRARY ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* BLOG */}
          <div>
            <SectionTitle
              title="Ministry Updates"
              subtitle="Latest messages, reflections, and announcements"
            />

            <div className="mt-10">
              <BlogList maxBlogs={4} />
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/blog"
                className="inline-block
                  border-2 border-blue-700 text-blue-700
                  px-8 py-3 rounded-lg font-semibold
                  hover:bg-blue-700 hover:text-white
                  transition-all duration-300"
              >
                READ MORE →
              </Link>
            </div>
          </div>

          {/* LIBRARY */}
          <div>
            <SectionTitle
              title="Bible Study Library"
              subtitle="Deep studies, downloadable materials, and references"
            />

            <div className="mt-10">
              <LibraryList maxDocs={4} />
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/library"
                className="inline-block
                  bg-blue-700 text-white
                  px-8 py-3 rounded-lg font-semibold
                  hover:bg-blue-800 hover:scale-105
                  transition-all duration-300 shadow-md"
              >
                EXPLORE LIBRARY →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 
        bg-gray-50 border-t border-gray-200">
        
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Grow in Truth. Stand in Faith.
          </h2>

          <p className="mt-4 text-gray-600 text-lg">
            Access Bible studies, sermons, and materials to strengthen your walk with God.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/library"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold
              hover:bg-blue-800 transition-all"
            >
              START STUDY
            </Link>

            <Link
              href="/contact"
              className="border border-gray-400 px-8 py-3 rounded-lg font-semibold
              hover:bg-gray-100 transition-all"
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}