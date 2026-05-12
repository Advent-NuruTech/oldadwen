"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function AboutPage() {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const Section = ({
    title,
    text,
    image,
    reverse = false,
    dark = false,
  }: {
    title: string;
    text: string;
    image: string;
    reverse?: boolean;
    dark?: boolean;
  }) => (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`grid md:grid-cols-2 gap-8 items-center rounded-2xl overflow-hidden shadow-xl`}
    >
      {/* IMAGE */}
      <div
        className={`relative h-80 md:h-96 w-full cursor-pointer ${
          reverse ? "md:order-2" : ""
        }`}
        onClick={() => setActiveImage(image)}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover hover:scale-105 transition duration-700"
        />
      </div>

      {/* TEXT CARD - ENHANCED FONT SIZES FOR READABILITY */}
      <div
        className={`p-7 md:p-10 ${
          dark
            ? "bg-slate-950 text-white border border-slate-800"
            : "bg-white text-slate-900 border border-slate-200"
        } ${reverse ? "md:order-1" : ""}`}
      >
        <h2
          className={`text-3xl md:text-4xl font-extrabold mb-5 ${
            dark ? "text-cyan-300" : "text-slate-900"
          }`}
        >
          {title}
        </h2>

        <div
          className={`text-xl md:text-xl leading-relaxed whitespace-pre-line space-y-4 ${
            dark ? "text-slate-200" : "text-slate-700"
          }`}
        >
          {text.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>
    </motion.section>
  );

  return (
    <main
      className="min-h-screen text-white bg-cover bg-center bg-fixed relative pt-28 pb-16 px-4"
      style={{
        backgroundImage: "url('/images/background.jpeg')",
      }}
    >
      {/* GLOBAL OVERLAY */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">

        {/* HEADER - ENHANCED FONT SIZES */}
        <div className="text-center pt-6 md:pt-10">
          <h1 className="text-4xl md:text-6xl font-black">
            OLD SDA <span className="text-cyan-300">ORGANIZATION</span>
          </h1>

          <p className="text-cyan-100 mt-4 text-lg md:text-2xl font-medium">
            Restoring Old Adventism | Based on the 1872 & 1889 Fundamental Principles
          </p>

          <p className="text-slate-200 mt-6 text-lg md:text-xl max-w-3xl mx-auto italic">
            “Thus saith the Lord, Stand ye in the ways, and see, and ask for the old paths, where is the good way, and walk therein, and ye shall find rest for your souls.” — Jeremiah 6:16
          </p>
        </div>

        {/* ================= COMPLETE TEXT WITH ALL DETAILS ================= */}

        <Section
          dark={true}
          title="Our Foundation: A Quest for Truth"
          image="https://res.cloudinary.com/dg7jxs7st/image/upload/v1778401686/WhatsApp_Image_2026-05-05_at_20.20.56_uyrd2t.jpg"
          text={`The Old SDA Organization traces its roots to Amazing Facts Europe Kenya Campus and a deep, prayerful quest for truth.

In 2018, after a powerful convention at Ranen Lwala SDA Church, Ranen Conference, the doctrine of the One True God as taught by the early SDA pioneers was openly presented. This biblical teaching led to the censure of Young Evangelist Ministry by Ranen Conference, marking the beginning of our journey to “contend for the faith which was once delivered unto the saints.” Jude 1:3`}
        />



        <Section
          dark={false}
          reverse
          title="2019 – Public Witness & First Trials"
          image="https://res.cloudinary.com/dg7jxs7st/image/upload/v1778099010/14_cbos1f.jpg"
          
          text={`In 2019 we began preaching openly and holding public missions. The Kanyadoto Mission 2019 resulted in the opening of Amazing Grace SDA Church. We are sorry to say the General Conference, which holds to the Trinity, later took the church from us.

It was during the Embu Campmeeting 2019 that Bro. Alvin Ogaga and Bro. Erick Leo were baptized into the One True God by Pastor Daniel Mesa of USA.`}
        />

        <Section
          dark={true}
          title="2020 – Separation, Home Churches & First Baptisms"
          image="https://res.cloudinary.com/dg7jxs7st/image/upload/v1778081747/8_vvllm7.jpg"
          text={`January 2020: The first believers to separate and worship in their homes were Bro. Erick Leo of Ranen, Bro. Jefferson Oluoch, and Bro. Bernard Odhiambo.

February 2020: COVID-19 entered Kenya. With all General Conference churches closed, this became a milestone for full separation. We promoted worship in homes, forests, and by rivers, teaching the Three Angels' Messages and standing firmly on the 1872 and 1889 Fundamental Principles of the old SDA Church.

Baptisms Began: We invited ordained ministers from sister ministry Gospel Sounders. Ev. Zaddock Ponde baptized converts in 2020, including the late young man Geoffrey and Sister Lydia Miginjo in River Kuja — “baptized in One True God through Christ Jesus.”

The Lord's Table began in our houses, especially in Ranen.

December 2020: Ramoya Mission was held. We are sorry to say the GC took over and rebaptized over 32 of our people into the Trinity.`}
        />

        <Section
          dark={false}
          reverse
          title="2021 – No Collaboration: Campmeetings & Church Organization"
          image="https://res.cloudinary.com/dg7jxs7st/image/upload/v1778081697/4_mhotjc.jpg"
          text={`In 2021 we made a solemn decision: no collaboration with any Trinitarian church. We would hold our own campmeetings, missions, and trainings as One True God believers.

July 2021 – Rongo Campmeeting at Sawayume Grounds
Theme: I Want My Church Back
Key Text: 1 Timothy 3:14-15 | Song: SDA Hymnal 212

Speakers:
- Sermon: Bro. Fred Agoro
- Bible Study: Fred Ndege
- Prophecy: Alvin Ogaga
- Gospel Order: Erick Leo
- Youths: Ken Tolo
- Reformation & True Education: Maxwell Okoth
- Publishing: Benazigwe Nzowe
- Righteousness by Faith: Ev. Kosgey Stephen

Baptism: 17 souls baptized into the One True God by Bro. Erick Leo.

After prayer and study of 1SM 204.1-2, 2SM 384, Jeremiah 6:16, Revelation 14:6-12, we concluded the current SDA organization is not the original. We realized the Jesuits have infiltrated everything: Fundamental Principles were changed to Fundamental Beliefs, God was changed to the Trinity which we believe are false gods, and the logo was changed from the Three Angels' Messages to flames which we understand to be of Jesuit origin. Therefore, we fully separated and organized into the Old SDA Church.

July 2021: Rongo Church was the first local church organized.

November 2021: Old SDA Rongo and Young Evangelist Ministry entered Nandi Region, opening Mosombor Old SDA Church, Kapsimatwo, and Mogoiwet. Bro. Emmanuel Juma and Zaddock Omollo remained as missionaries. The first missionary to Nandi in August 2021 was Ev. Maxwell Okoth.

December 2021: 1st Nandi Campmeeting at Kaiboi. Many baptized by Bro. Erick Leo. Through Rongo Church support, missions reached Kadel, Seka, Adek Kabuoch, Kisii, Kuria, Chamgiwadu, Kobodo, Sori Karungu, and more.

Kadel Church was organized to serve the Karachuonyo region.

Key Pioneers: Ev. Maxwell Okoth, Erick Leo, Alvin Ogaga, and Emmanuel Juma led these missions. The first missionary to Karachuonyo was Maxwell Okoth.`}
        />

        <Section
          dark={true}
          title="2022 – Persecution, Ordination & Conference Organization"
          image="https://res.cloudinary.com/dg7jxs7st/image/upload/v1778100108/images_gzohdc.jpg"
          text={`February 2022: First Old SDA Revival Week of Prayer held between Rongo and Nandi larger churches. Speakers exchanged: Maxwell Okoth went to Nandi, Emmanuel Juma to Rongo.

Persecution for Faith: Brethren were arrested in Nandi and Rongo for separation from the apostate SDA church and for accepting true education. Those arrested and charged include: Ev. Maxwell Okoth – arrested twice, escaped twice; Usher Jeffrey – whereabouts unknown; Charles Ogolla – no longer Old SDA; Ruth Omingo; Veldah Verah; Elias Ondoro; the late John Rugut; Zaddock Omollo; Ruth Chelagat. All were sponsored by enemies of truth.

July 2022 – Rongo Kasere Center Campmeeting
Theme: No New Organization
Key Text: Isaiah 28:16 | Song: SDA Hymnal 504

Speakers: Ev. Maxwell Okoth – Sermon & Youth; Ev. Titus Kulu – Prophecy & True Education; Bro. Alvin Ogaga – Stewardship; Bro. Brian Weave – Stewardship; Bro. Allan Ongolla – Health; Bro. Kosgey Stephen – Righteousness by Faith & Country Living.

Nandi Campmeeting was also held, attended by Allan Ongolla and Brighton Ouru.

First Ordination of Ministers: After the campmeeting, the church authorized the first ordination:
1. Ev. Maxwell Okoth
2. Ev. Emmanuel Juma
3. Ev. Charles Ogolla
Led by Elder Ken Tolo and Erick Leo. They were recommended by the brethren and authorized to preach, baptize, and organize churches according to Gospel Order.

October 2022 – Nyanza Nandi Region Conference Organized
All local churches gathered and formed the Old SDA Nyanza Nandi Conference.

Elections:
1. Maxwell Okoth – Coordinating Chair
2. Charles Ogolla – Secretary
3. Jefferson Oluoch – Treasurer
4. Zaddock Omollo – Nandi Representative
Plus departmental heads.

Finance: Agreed to send 50% of tithes and 30% of offerings to support ministers and organizational activities. Church envelopes were made.

Focus Areas Agreed: More missions, medical missionary work, true education schools, train workers, train youth in handwork in collaboration with Gachie Church, Kiambu.`}
        />

        <Section
          dark={false}
          reverse
          title="2022 to Present – Growth & Mission"
          image="https://res.cloudinary.com/dg7jxs7st/image/upload/v1778081882/11_wew2bd.jpg"
          text={`From 2022 until now, organization has helped us:
1. Maintain church property and open new churches in and beyond our borders: Nairobi City, Weitethie Thika, Lusigeti Kikuyu, Thogoto Kikuyu, Soy Kakamega, Bungoma, Eldoret, Malindi, Uganda, Tanzania, South Sudan, among many others.
2. Baptisms: Over 800 souls baptized into the One True God. More than 900 are currently under instruction for baptism.
3. Leadership: More elders and ministers ordained.
4. True Education: Established centers to help our young people. We run a simple publishing house producing our own pioneer lessons.
5. Bible Workers: Trained and sent many young people as missionaries across the country, supported by the church.

“Even though we are poor we are rich in Christ.”

January 2023: United with other like-minded regions in Kenya and formed the Larger Old SDA Organization in Kenya.`}
        />

        <Section
          dark={true}
          title="What We Believe"
          image="https://res.cloudinary.com/dg7jxs7st/image/upload/v1778099931/download_yuoymt.jpg"
          text={`We remain steadfast in the Bible and the Spirit of Prophecy as manifested in the writings of Ellen G. White.

1. Scripture: We accept the whole Bible as inspired. We do not reject portions of Scripture.
2. Spirit of Prophecy: We accept all SOP books unless light is given from the Word otherwise.
3. Godhead: We do not believe in the Trinity. “There is one God, the Father... and one Lord Jesus Christ” 1 Corinthians 8:6; John 17:3.
4. Jesus Christ: We believe He is the literal Son of God. John 3:16
5. Holy Spirit: We believe the Holy Spirit is the power, influence, and character that proceeds from the Father through His Son.
6. Separation: We reject the Trinity in all its forms – Catholic or SDA. This principle caused our separation. We reject any ecumenical movement as papal and satanic. We subscribe to no umbrella body of religion.
7. Church & State: We believe in separation of church and state. Our organization has nothing to do with politics or elections. Members are free to choose whether to vote after being taught the position of Bible and SOP.
8. True Education: A must. “We believe without education no redemption.” Members are free to choose after being taught – no coercion. True education is the only hope for a permanent reformatory movement.`}
        />

        <Section
          dark={false}
          reverse
          title="Our Mission Today"
          image="https://res.cloudinary.com/dg7jxs7st/image/upload/v1778081717/5_gpv027.jpg"
          text={`1. Preach the Three Angels' Messages of Revelation 14:6-12 in their pioneer purity.
2. Call God's people out of Babylon and back to the "old paths." Jeremiah 6:16
3. Expose Jesuit infiltration that has changed Fundamental Principles to Fundamental Beliefs, introduced the Trinity, and altered the symbols of Adventism.
4. Establish true education, health reform, and country living as given to the pioneers.
5. Organize churches on Gospel Order as found in 1 Corinthians 12 & 13.
6. Prepare a people for the Latter Rain and the coming of Jesus.`}
        />

        {/* Footer / Welcome Section with Contact */}
        <div className="bg-slate-950/90 backdrop-blur-sm border border-cyan-800 rounded-2xl p-8 md:p-12 text-center mt-8">
          <h2 className="text-3xl md:text-5xl font-bold text-cyan-300 mb-4">
            Welcome to Old SDA Organization
          </h2>
          <p className="text-xl md:text-2xl text-white mb-3">
            Restoring Old Adventism
          </p>
          <div className="h-px bg-cyan-800 max-w-md mx-auto my-6"></div>
          <p className="text-slate-300 text-base md:text-lg mb-2">
            Headquarters: Rongo, Migori County, Kenya
          </p>
          <p className="text-slate-300 text-base md:text-lg">
            Contact: oldsdaorganization@gmail.com
          </p>
          <div className="mt-8 pt-4 border-t border-slate-800">
            <p className="text-cyan-100 text-xl md:text-xl italic">
              “Thus saith the Lord, Stand ye in the ways, and see, and ask for the old paths, where is the good way, and walk therein, and ye shall find rest for your souls.”
            </p>
            <p className="text-slate-400 mt-2">Jeremiah 6:16</p>
          </div>
        </div>

      </div>

      {/* ================= IMAGE LIGHTBOX ================= */}
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
  );
}