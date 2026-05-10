"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function TrueEducationMessage() {
  const [open, setOpen] = useState(false);
  const [imageView, setImageView] = useState<string | null>(null);

  const images = {
    hero: "https://res.cloudinary.com/dg7jxs7st/image/upload/v1778402052/ChatGPT_Image_May_10_2026_11_33_40_AM_nnp599.png",
    farm: "https://images.unsplash.com/photo-1507692049790-de58290a4334",
    bible: "https://res.cloudinary.com/dg7jxs7st/image/upload/v1778402052/ChatGPT_Image_May_10_2026_11_33_40_AM_nnp599.png",
    mission: "https://res.cloudinary.com/dg7jxs7st/image/upload/v1778081768/10_uayy12.jpg",
  };

  return (
    <>
      {/* SECTION */}
      <section className="pt-24 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">

            {/* HERO IMAGE */}
            <div
              className="relative h-64 w-full cursor-pointer"
              onClick={() => setImageView(images.hero)}
            >
              <Image src={images.hero} alt="True Education" fill className="object-cover" />
            </div>

            <div className="p-6 md:p-8">

              <p className="text-sm uppercase tracking-wider text-cyan-600 font-semibold">
                Official Message
              </p>

              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900">
                True Education & Country Living
              </h2>

              <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                “We believe without education no redemption.”  
                <br />
                “Train up a child in the way he should go...” — Proverbs 22:6
              </p>

              <p className="mt-5 text-slate-700 text-base md:text-lg leading-relaxed">
                Greetings in the name of our Lord Jesus Christ, the Son of the One True God.
              </p>

              {/* IMAGE */}
              <div
                className="relative h-56 w-full mt-6 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setImageView(images.farm)}
              >
                <Image src={images.farm} alt="Country Living" fill className="object-cover" />
              </div>

              <button
                onClick={() => setOpen(true)}
                className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-600 transition"
              >
                READ FULL MESSAGE →
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* IMAGE VIEWER */}
      <AnimatePresence>
        {imageView && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/80" onClick={() => setImageView(null)} />

            <div className="relative w-full max-w-5xl h-[80vh]">
              <Image src={imageView} alt="Preview" fill className="object-contain" />
              <button
                onClick={() => setImageView(null)}
                className="absolute top-4 right-4 text-white text-2xl"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL MESSAGE MODAL */}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* BACKDROP */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setOpen(false)} />

            {/* SCROLL AREA */}
            <div className="relative h-full w-full overflow-y-auto pt-24 pb-10 px-4">

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                className="relative mx-auto max-w-4xl bg-white rounded-2xl shadow-2xl p-6 md:p-10"
              >
                {/* CLOSE */}
                <button
                  onClick={() => setOpen(false)}
                  className="sticky top-0 float-right z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-slate-600 hover:text-black text-xl shadow"
                >
                  ✕
                </button>

                <div className="clear-both space-y-6 text-base md:text-lg leading-relaxed text-slate-800">

                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Message from the True Education and Country Living Director  
                    Old SDA Organization
                  </h3>

                  {/* IMAGE */}
                  <div className="relative h-64 w-full rounded-xl overflow-hidden cursor-pointer" onClick={() => setImageView(images.bible)}>
                    <Image src={images.bible} alt="Bible Study" fill className="object-cover" />
                  </div>

                  <p className="italic text-slate-600">
                    “We believe without education no redemption.”  
                    “Train up a child in the way he should go: and when he is old, he will not depart from it.” Proverbs 22:6
                  </p>

                  <p>
                    Greetings in the name of our Lord Jesus Christ, the Son of the One True God.
                  </p>

                  <p>
                    I serve as the True Education and Country Living Director for the Old SDA Organization. My burden is to restore the system of education and life given to our pioneers before Jesuit infiltration changed our schools, our homes, and our message.
                  </p>

                  <h4 className="font-semibold text-xl text-cyan-700">Why This Department Exists</h4>

                  <p>
                    We separated because we saw Fundamental Principles changed to Fundamental Beliefs, our God changed to the Trinity, and the Three Angels replaced by flames. The same power that altered our theology also altered our schools.
                  </p>

                  <p className="italic text-slate-600">
                    “There is danger that our educational institutions will be molded after the worldly order.” 6T 142.2
                  </p>

                  <p>So we chose the old paths. Jeremiah 6:16</p>

                  {/* IMAGE */}
                  <div className="relative h-64 w-full rounded-xl overflow-hidden cursor-pointer" onClick={() => setImageView(images.mission)}>
                    <Image src={images.mission} alt="Mission Work" fill className="object-cover" />
                  </div>

                  <h4 className="font-semibold text-xl text-cyan-700">What True Education Means to Us</h4>

                  <ul className="list-disc ml-6 space-y-2">
                    <li>Bible as Foundation – Proverbs 9:10</li>
                    <li>Useful Labor Daily – Genesis 3:19</li>
                    <li>Country Location – CL 6.2</li>
                    <li>Missionary Aim – Education p. 271</li>
                    <li>No Coercion</li>
                  </ul>

                  <h4 className="font-semibold text-xl text-cyan-700">The Work</h4>

                  <p>
                    It has been tough. Arrests. Opposition. Poverty. No schools. Yet we have come this far.
                  </p>

                  <p>
                    Today we have true education students. We have trained ministers in the missionary field. We have built meeting houses for worship. We moved from worship in rivers and hills and peoples’ homes into places of prayer.
                  </p>

                  <p className="italic text-slate-600">
                    “Hitherto hath the Lord helped us.” 1 Samuel 7:12
                  </p>

                  <p>
                    I thank God for Young Evangelist Ministry. Without them, history would not be the same.
                  </p>

                  <p>
                    I thank all full-time ministers for leaving everything to ensure Old SDA stands. God bless.
                  </p>

                  <p>
                    To all elders, all sponsors, all church members that have walked the journey with us: may God bless.
                  </p>

                  <h4 className="font-semibold text-xl text-cyan-700">As We Move Forward: Put Hope in God</h4>

                  <p className="italic text-slate-600">
                    “We have nothing to fear for the future...” LS 196
                  </p>

                  <p>
                    To Parents: “If you would train your children for heaven...” CG 355  
                    <br />
                    To Youth: “Get out of the large cities...” 2SM 355  
                    <br />
                    To the Church: Support this work.
                  </p>

                  <p>
                    We were poor, but God made us rich in faith. This is the Lord’s doing.
                  </p>

                  <p className="font-semibold">
                    True Education and Country Living Department  
                    Old SDA Organization  
                    “Restoring Old Adventism”
                  </p>

                  <p className="text-sm text-slate-500">
                    Contact: Okothmaxwelouma@gmail.com
                  </p>

                  <p className="italic text-slate-600">
                    “Let us rise up and build.” Nehemiah 2:18
                  </p>

                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}