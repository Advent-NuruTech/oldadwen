"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function MaxwellOkothBiography() {
  const [open, setOpen] = useState(false);
  const [imageView, setImageView] = useState<string | null>(null);

  const images = {
    hero: "https://res.cloudinary.com/dg7jxs7st/image/upload/v1778401463/max_qctewh.jpg",
    portrait: "https://res.cloudinary.com/dg7jxs7st/image/upload/v1778081726/6_vm49x1.jpg",
    baptism: "https://res.cloudinary.com/dg7jxs7st/image/upload/v1778401463/max_qctewh.jpg",
    ministry: "https://res.cloudinary.com/dg7jxs7st/image/upload/v1778401686/WhatsApp_Image_2026-05-05_at_20.20.56_uyrd2t.jpg",
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
              className="relative h-94 w-full cursor-pointer"
              onClick={() => setImageView(images.hero)}
            >
              <Image src={images.hero} alt="Ev. Maxwel Okoth Ouma" fill className="object-cover" />
            </div>

            <div className="p-6 md:p-8">

              <p className="text-sm uppercase tracking-wider text-cyan-600 font-semibold">
                Biography
              </p>

              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900">
                Ev. Maxwel Okoth Ouma
              </h2>

              <p className="mt-4 text-lg text-slate-600 leading-relaxed italic">
                “I will instruct thee and teach thee in the way which thou shalt go: I will guide thee with mine eye.”
              </p>
              <p className="text-slate-500 text-sm">— Psalm 32:8</p>

              <p className="mt-5 text-slate-700 text-base md:text-lg leading-relaxed">
                Born 2nd February 1994 to Mr. Dick Ouma Moi and Mrs. Sherine Adhiambo Ouma in Migori County. 
                A teacher, preacher, and pioneer of the Old SDA movement — standing for the One True God and the Three Angels' Messages.
              </p>

              {/* IMAGE */}
              <div
                className="relative h-56 w-full mt-6 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setImageView(images.portrait)}
              >
                <Image src={images.portrait} alt="Evangelist Maxwell Okoth" fill className="object-cover" />
              </div>

              <button
                onClick={() => setOpen(true)}
                className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-600 transition"
              >
                READ FULL BIOGRAPHY →
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
                className="absolute top-4 right-4 text-white text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL BIOGRAPHY MODAL */}
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
                    Biography of Ev. Maxwel Okoth Ouma
                  </h3>
                  <p className="italic text-slate-600">“I will instruct thee and teach thee in the way which thou shalt go: I will guide thee with mine eye.” — Psalm 32:8</p>

                  {/* IMAGE */}
                  <div className="relative h-64 w-full rounded-xl overflow-hidden cursor-pointer" onClick={() => setImageView(images.baptism)}>
                    <Image src={images.baptism} alt="Baptism" fill className="object-cover" />
                  </div>

                  <h4 className="font-semibold text-xl text-cyan-700">Birth and Parentage</h4>
                  <p>I was born on <strong>2nd February 1994</strong> to <strong>Mr. Dick Ouma Moi</strong> and <strong>Mrs. Sherine Adhiambo Ouma</strong> of Migori County, Awendo Sub-county, <em>North East Sakwa Location</em>, Raruowa Village.</p>
                  <p className="italic text-slate-600">“Lo, children are an heritage of the LORD: and the fruit of the womb is his reward.” — Psalm 127:3</p>

                  <h4 className="font-semibold text-xl text-cyan-700">Early Life and Family Upbringing</h4>
                  <p>I was raised by strict parents. My father was a primary teacher and later resigned to farming. My mother was a strict disciplinarian and a business woman. I am the 4th born of 11 children: 3 girls and 8 men.</p>
                  <p className="italic text-slate-600">“Train up a child in the way he should go: and when he is old, he will not depart from it.” — Proverbs 22:6</p>

                  <h4 className="font-semibold text-xl text-cyan-700">Education</h4>
                  <p>I started at Raruowa Kadera Primary School, then Ranen Primary School for K.C.P.E. I joined Sagegi Mixed Boarding Secondary School and later Moi University, Rongo Town Campus, training as a teacher of Education Arts.</p>
                  <p className="italic text-slate-600">“Study to shew thyself approved unto God, a workman that needeth not to be ashamed.” — 2 Timothy 2:15</p>

                  <h4 className="font-semibold text-xl text-cyan-700">Teaching Career</h4>
                  <p>I taught at Matagaro, Ranen Conference Adventist Secondary School, Mabera, Weirungu Mixed, became Principal at St. John Saria Mixed, and later at Raruowa Kadera Mixed until 15th January 2021.</p>

                  {/* IMAGE */}
                  <div className="relative h-64 w-full rounded-xl overflow-hidden cursor-pointer" onClick={() => setImageView(images.ministry)}>
                    <Image src={images.ministry} alt="Ministry" fill className="object-cover" />
                  </div>

                  <h4 className="font-semibold text-xl text-cyan-700">Religious Life & Calling</h4>
                  <p>In 2005 I was baptized by Pastor Clement Juma at River Kuja. From that day I started reading the Bible, and my parents told me I would be a pastor. In high school I became a strong Adventist Youth member. In university I served as Sabbath School Superintendent, Head Deacon, and Church Elder — ordained in February 2015.</p>

                  <h4 className="font-semibold text-xl text-cyan-700">Full Change – 2015</h4>
                  <p>On <strong>10th September 2015</strong> I received a scholarship to Amazing Facts Europe Kenya Campus in Rongo. There my eyes opened to the Three Angels' Messages of Revelation 14:6-12. I graduated February 2016 with a licence to preach and as a Global Medical Missionary.</p>

                  <h4 className="font-semibold text-xl text-cyan-700">Conflict Over Truth & Persecution</h4>
                  <p>I saw unbiblical practices in the church: marching, dancing, candles, Trinity doctrine, wrong education. In 2020 I was terminated from Radio Tarumbeta 90.4 FM for teaching One True God and rejecting Trinity. In 2022 I was arrested twice — once in Rongo, once in Nandi — and spent a week in cells.</p>
                  <p className="italic text-slate-600">“Blessed are ye, when men shall revile you, and persecute you... for my sake.” — Matthew 5:11</p>

                  <h4 className="font-semibold text-xl text-cyan-700">Old SDA Organization</h4>
                  <p>In August 2021 I was rebaptized in One True God and His Son Jesus in River Mara, Kilgoris. In July 2022 I was ordained as a full-time minister. In October 2022 we organized the Old SDA Church Organization Nyanza Nandi Region Conference, and I was elected the first Chair, serving until 31st December 2025.</p>

                  <h4 className="font-semibold text-xl text-cyan-700">Present Service</h4>
                  <p>I serve in the Old SDA Executive Committee and as Director of the True Education and Country Living Department. I am also the current Patron and Sponsor of the Young Evangelist Ministry.</p>
                  <p className="italic text-slate-600">“Hitherto hath the LORD helped us.” — 1 Samuel 7:12</p>

                  <p className="font-semibold mt-6">Ev. Maxwel Okoth Ouma</p>
                  <p className="text-sm text-slate-500">Contact: 0724403284 | Okothmaxwelouma@gmail.com</p>

                  <p className="italic text-slate-600 text-center pt-4">“Therefore, my beloved brethren, be ye stedfast, unmoveable, always abounding in the work of the Lord.” — 1 Corinthians 15:58</p>

                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}