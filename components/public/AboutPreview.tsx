"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPreview() {
  const features = [
    {
      title: "Restoring the Old Paths",
      subtitle: "Based on 1872 & 1889 Fundamental Principles",
      description:
        "We stand firmly on the original teachings of the Seventh-day Adventist pioneers, rejecting modern unbiblical changes and restoring the faith once delivered unto the saints.",
      image:
        "https://res.cloudinary.com/dg7jxs7st/image/upload/v1778401686/WhatsApp_Image_2026-05-05_at_20.20.56_uyrd2t.jpg",
      highlights: [
        "Three Angels' Messages",
        "The Sanctuary and the Investigative Judgment",
        "The Only True God and Jesus Christ Whom He Sent ",
        "Righteousness by Faith",
        "The Ten Commandments and Sabbath Observance",

        "Spirit of Prophecy as given to Ellen G. White",
      ],
      dark: true,
    },
    {
      title: "Rapid Mission Growth",
      subtitle: "God Leads His  Dear Children a long",
      description:
        "From humble beginnings in 2018 to a movement spanning across Kenya and beyond — raising missionaries, planting churches, and preparing a people for the Latter Rain.",
      image:
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=600&fit=crop",
      highlights: [
      
        "Missions in Uganda, Tanzania, South Sudan",
        "True education & publishing work",
        "Ordained ministers & trained Bible workers",
      ],
      dark: false,
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-cover bg-center bg-fixed relative">
      {/* Background overlay matching about page */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/images/nature1.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white">
            OLD SDA <span className="text-cyan-300">ORGANIZATION</span>
          </h2>
          <p className="text-cyan-100 text-lg md:text-xl mt-3 max-w-2xl mx-auto">
            Restoring Old Adventism | Based on the 1872 & 1889 Fundamental
            Principles
          </p>
          <div className="w-24 h-1 bg-cyan-400 mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Two Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl overflow-hidden shadow-2xl ${
                feature.dark
                  ? "bg-slate-950 border border-slate-800"
                  : "bg-white border border-slate-200"
              }`}
            >
              {/* Image */}
              <div className="relative h-56 w-full cursor-pointer group overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <h3
                  className={`text-2xl md:text-3xl font-bold mb-2 ${
                    feature.dark ? "text-cyan-300" : "text-slate-900"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-sm md:text-base font-medium mb-4 ${
                    feature.dark ? "text-cyan-400/80" : "text-cyan-600"
                  }`}
                >
                  {feature.subtitle}
                </p>
                <p
                  className={`text-base md:text-lg leading-relaxed mb-6 ${
                    feature.dark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {feature.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2 mb-8">
                  {feature.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-center gap-3"
                    >
                      <svg
                        className={`w-5 h-5 ${
                          feature.dark ? "text-cyan-400" : "text-cyan-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span
                        className={`text-sm md:text-base ${
                          feature.dark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Read More Button */}
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-xl font-semibold text-base md:text-lg transition-all duration-300 ${
                      feature.dark
                        ? "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    Read Full History →
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Quote / CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="inline-block bg-slate-950/80 backdrop-blur-sm border border-cyan-800 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto">
            <p className="text-cyan-100 text-lg md:text-xl italic">
              “Thus saith the Lord, Stand ye in the ways, and see, and ask for
              the old paths, where is the good way, and walk therein, and ye
              shall find rest for your souls.”
            </p>
            <p className="text-slate-400 mt-3 text-base">Jeremiah 6:16</p>
            <div className="flex justify-center gap-4 mt-6">
              <Link href="/about">
                <button className="px-6 py-2 rounded-full border border-cyan-500 text-cyan-300 hover:bg-cyan-500/20 transition text-sm md:text-base">
                  Discover Our Journey
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}