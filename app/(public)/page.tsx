"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AboutPreview from "@/components/public/AboutPreview";
import HomeLatestEvents from "@/components/public/HomeLatestEvents";
import MaxwellOkothBiography from "@/components/public/MaxwellOkothBiography";
/* ================= COMPONENTS ================= */
import Hero from "@/components/public/HeroBanner";
import BlogList from "@/components/public/BlogList";
import { SectionTitle } from "@/components/public/SectionTitle";
import YoutubeCarousel from "@/components/public/YoutubeCarousel";
import TrueEducationMessage from "@/components/public/TrueEducationMessage";

export default function HomePage() {
  return (
    <main
      className="min-h-screen text-white bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: "url('/images/background.jpeg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm"></div>

      <div className="relative z-10">

        {/* ================= HERO ================= */}
        <Hero />
<AboutPreview />
<HomeLatestEvents />
    
<TrueEducationMessage />
   <MaxwellOkothBiography />
        {/* ================= YOUTUBE ================= */}
        <section className="py-16 px-4 sm:px-3 lg:px-8 bg-[#0B1220] text-white">
          <div className="max-w-6xl mx-auto text-center">

           

            <motion.div
              className="mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <YoutubeCarousel />
            </motion.div>

            {/* 🔥 ONLY BUTTON KEPT ORIGINAL (UNCHANGED AS REQUESTED) */}
            <div className="mt-10">
              <a
                href="https://youtube.com/@gospelsounders"
                target="_blank"
                className="inline-block bg-white text-[#0F172A] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                WATCH ALL VIDEOS →
              </a>
            </div>

          </div>
        </section>

        {/* ================= BLOG ================= */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[#0F172A]">
          <div className="max-w-6xl mx-auto">

            <SectionTitle
              title="Ministry Updates"
              subtitle="Latest messages, reflections, and announcements"
              variant="dark"
            />

            <div className="mt-8">
              <BlogList maxBlogs={2} />
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/blog"
                className="inline-block border border-cyan-400 text-cyan-300 px-6 py-2.5 rounded-lg font-semibold hover:bg-cyan-500 hover:text-white transition"
              >
                READ MORE →
              </Link>
            </div>

          </div>
        </section>

    
        {/* ================= CTA ================= */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#020617] border-t border-cyan-500/10">
          <div className="max-w-4xl mx-auto text-center">

            <div className="bg-white/5 border border-cyan-500/20 backdrop-blur-md rounded-2xl p-10 md:p-14 shadow-xl">

              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Grow in Truth. Stand in Faith.
              </h2>

              <p className="mt-4 text-cyan-100 text-lg leading-relaxed max-w-2xl mx-auto">
                Access Bible studies, sermons, and materials for spiritual growth.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">

                <Link
                  href="/library"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md"
                >
                  START STUDY
                </Link>

                <Link
                  href="/contact"
                  className="border border-cyan-400/30 text-cyan-100 px-8 py-3 rounded-xl font-semibold hover:bg-white/10 hover:text-white transition"
                >
                  CONTACT US
                </Link>

              </div>

            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
