"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0b1220] to-[#020617] text-white px-6 py-16">

      {/* HEADER */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
          Old SDA Organization
        </h1>

        <div className="h-1 w-24 mx-auto mt-4 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full" />

        <p className="text-blue-200 text-lg md:text-xl mt-6 max-w-2xl mx-auto">
          <span className="text-cyan-300 font-semibold">Restoring Old Adventism</span> | Based on the 1872 & 1889 Fundamental Principles
        </p>
      </div>

      {/* CONTENT - FULL UNMODIFIED TEXT WITH ONLY SPELLING/PUNCTUATION CORRECTIONS */}
      <div className="max-w-4xl mx-auto space-y-12">

        {/* SECTION: Foundation */}
        <section className="bg-white/5 border border-blue-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 border-l-4 border-cyan-400 pl-4 mb-6">Our Foundation: A Quest for Truth</h2>
          <p className="text-blue-100 leading-relaxed mb-4">
            The Old SDA Organization traces its roots to <span className="text-cyan-300 font-semibold">Amazing Facts Europe Kenya Campus</span> and a deep, prayerful quest for truth. In 2018, after a powerful convention at <span className="text-cyan-300 font-semibold">Ranen Lwala SDA Church, Ranen Conference</span>, the doctrine of the <span className="text-cyan-300 font-semibold">One True God</span> as taught by the early SDA pioneers was openly presented. This biblical teaching led to the censure of <span className="text-cyan-300 font-semibold">Young Evangelist Ministry</span> by Ranen Conference, marking the beginning of our journey to "contend for the faith which was once delivered unto the saints." <span className="italic text-cyan-200">Jude 1:3</span>
          </p>
        </section>

        {/* SECTION: 2019 */}
        <section className="bg-white/5 border border-blue-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 border-l-4 border-cyan-400 pl-4 mb-6">2019 – Public Witness & First Trials</h2>
          <p className="text-blue-100 leading-relaxed mb-4">
            In 2019 we began preaching openly and holding public missions. The <span className="text-cyan-300 font-semibold">Kanyadoto Mission 2019</span> resulted in the opening of <span className="text-cyan-300 font-semibold">Amazing Grace SDA Church</span>. We are sorry to say the General Conference, which holds to the Trinity, later took the church from us.
          </p>
          <p className="text-blue-100 leading-relaxed">
            It was during the <span className="text-cyan-300 font-semibold">Embu Campmeeting 2019</span> that Bro. Alvin Ogaga and Bro. Erick Leo were baptized into the One True God by Pastor Daniel Mesa of USA.
          </p>
        </section>

        {/* SECTION: 2020 */}
        <section className="bg-white/5 border border-blue-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 border-l-4 border-cyan-400 pl-4 mb-6">2020 – Separation, Home Churches & First Baptisms</h2>
          <p className="text-blue-100 leading-relaxed mb-4">
            <span className="font-semibold text-cyan-200">January 2020:</span> The first believers to separate and worship in their homes were <span className="text-cyan-300 font-semibold">Bro. Erick Leo of Ranen, Bro. Jefferson Oluoch, and Bro. Bernard Odhiambo</span>.
          </p>
          <p className="text-blue-100 leading-relaxed mb-4">
            <span className="font-semibold text-cyan-200">February 2020:</span> COVID-19 entered Kenya. With all General Conference churches closed, this became a milestone for full separation. We promoted worship in homes, forests, and by rivers, teaching the <span className="text-cyan-300 font-semibold">Three Angels' Messages</span> and standing firmly on the <span className="text-cyan-300 font-semibold">1872 and 1889 Fundamental Principles</span> of the old SDA Church.
          </p>
          <p className="text-blue-100 leading-relaxed mb-4">
            <span className="font-semibold text-cyan-200">Baptisms Began:</span> We invited ordained ministers from sister ministry <span className="text-cyan-300 font-semibold">Gospel Sounders</span>. <span className="text-cyan-300 font-semibold">Ev. Zaddock Ponde</span> baptized converts in 2020, including the late young man <span className="text-cyan-300 font-semibold">Geoffrey</span> and <span className="text-cyan-300 font-semibold">Sister Lydia Miginjo</span> in River Kuja — "baptized in One True God through Christ Jesus."
          </p>
          <p className="text-blue-100 leading-relaxed mb-4">
            <span className="font-semibold text-cyan-200">The Lord's Table</span> began in our houses, especially in Ranen.
          </p>
          <p className="text-blue-100 leading-relaxed">
            <span className="font-semibold text-cyan-200">December 2020:</span> <span className="text-cyan-300 font-semibold">Ramoya Mission</span> was held. We are sorry to say the GC took over and rebaptized over 32 of our people into the Trinity.
          </p>
        </section>

        {/* SECTION: 2021 */}
        <section className="bg-white/5 border border-blue-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 border-l-4 border-cyan-400 pl-4 mb-6">2021 – No Collaboration: Campmeetings & Church Organization</h2>
          <p className="text-blue-100 leading-relaxed mb-4">
            In 2021 we made a solemn decision: no collaboration with any Trinitarian church. We would hold our own campmeetings, missions, and trainings as <span className="text-cyan-300 font-semibold">One True God believers</span>.
          </p>
          <div className="bg-blue-950/30 border-l-4 border-cyan-400 p-4 my-6 rounded-r-xl">
            <p className="font-semibold text-cyan-200 mb-2">July 2021 – Rongo Campmeeting at Sawayume Grounds</p>
            <p className="text-blue-100"><span className="font-semibold">Theme:</span> <span className="italic">I Want My Church Back</span></p>
            <p className="text-blue-100"><span className="font-semibold">Key Text:</span> 1 Timothy 3:14-15 | <span className="font-semibold">Song:</span> SDA Hymnal 212</p>
            <p className="text-blue-100 mt-2"><span className="font-semibold">Speakers:</span></p>
            <ul className="list-disc list-inside text-blue-100 ml-4 space-y-1 mt-1">
              <li><span className="font-semibold">Sermon:</span> Bro. Fred Agoro</li>
              <li><span className="font-semibold">Bible Study:</span> Fred Ndege</li>
              <li><span className="font-semibold">Prophecy:</span> Alvin Ogaga</li>
              <li><span className="font-semibold">Gospel Order:</span> Erick Leo</li>
              <li><span className="font-semibold">Youths:</span> Ken Tolo</li>
              <li><span className="font-semibold">Reformation & True Education:</span> Maxwell Okoth</li>
              <li><span className="font-semibold">Publishing:</span> Benazigwe Nzowe</li>
              <li><span className="font-semibold">Righteousness by Faith:</span> Ev. Kosgey Stephen</li>
            </ul>
            <p className="text-blue-100 mt-3"><span className="font-semibold">Baptism:</span> 17 souls baptized into the One True God by Bro. Erick Leo.</p>
          </div>
          <p className="text-blue-100 leading-relaxed mb-4">
            After prayer and study of <span className="text-cyan-300">1SM 204.1-2, 2SM 384, Jeremiah 6:16, Revelation 14:6-12</span>, we concluded the current SDA organization is not the original. We realized the <span className="text-cyan-300 font-semibold">Jesuits have infiltrated everything</span>: Fundamental Principles were changed to Fundamental Beliefs, God was changed to the Trinity which we believe are false gods, and the logo was changed from the Three Angels' Messages to flames which we understand to be of Jesuit origin. Therefore, we <span className="text-cyan-300 font-semibold">fully separated and organized into the Old SDA Church</span>.
          </p>
          <p className="text-blue-100 leading-relaxed mb-4">
            <span className="font-semibold text-cyan-200">July 2021:</span> <span className="text-cyan-300 font-semibold">Rongo Church</span> was the first local church organized.
          </p>
          <p className="text-blue-100 leading-relaxed mb-4">
            <span className="font-semibold text-cyan-200">November 2021:</span> Old SDA Rongo and Young Evangelist Ministry entered <span className="text-cyan-300 font-semibold">Nandi Region</span>, opening <span className="text-cyan-300 font-semibold">Mosombor Old SDA Church, Kapsimatwo, and Mogoiwet</span>. Bro. Emmanuel Juma and Zaddock Omollo remained as missionaries. The first missionary to Nandi in August 2021 was <span className="text-cyan-300 font-semibold">Ev. Maxwell Okoth</span>.
          </p>
          <p className="text-blue-100 leading-relaxed mb-4">
            <span className="font-semibold text-cyan-200">December 2021:</span> <span className="text-cyan-300 font-semibold">1st Nandi Campmeeting at Kaiboi</span>. Many baptized by Bro. Erick Leo. Through Rongo Church support, missions reached <span className="text-cyan-300">Kadel, Seka, Adek Kabuoch, Kisii, Kuria, Chamgiwadu, Kobodo, Sori Karungu</span>, and more.
          </p>
          <p className="text-blue-100 leading-relaxed mb-4">
            <span className="text-cyan-300 font-semibold">Kadel Church</span> was organized to serve the Karachuonyo region.
          </p>
          <p className="text-blue-100 leading-relaxed">
            <span className="font-semibold">Key Pioneers:</span> Ev. Maxwell Okoth, Erick Leo, Alvin Ogaga, and Emmanuel Juma led these missions. The first missionary to Karachuonyo was Maxwell Okoth.
          </p>
        </section>

        {/* SECTION: 2022 */}
        <section className="bg-white/5 border border-blue-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 border-l-4 border-cyan-400 pl-4 mb-6">2022 – Persecution, Ordination & Conference Organization</h2>
          <p className="text-blue-100 leading-relaxed mb-4">
            <span className="font-semibold text-cyan-200">February 2022:</span> First <span className="text-cyan-300 font-semibold">Old SDA Revival Week of Prayer</span> held between Rongo and Nandi larger churches. Speakers exchanged: Maxwell Okoth went to Nandi, Emmanuel Juma to Rongo.
          </p>
          <div className="bg-red-950/20 border-l-4 border-red-500 p-4 my-6 rounded-r-xl">
            <p className="font-semibold text-cyan-200 mb-2">Persecution for Faith:</p>
            <p className="text-blue-100">Brethren were arrested in Nandi and Rongo for separation from the apostate SDA church and for accepting true education. Those arrested and charged include:<br />
            Ev. Maxwell Okoth – arrested twice, escaped twice; Usher Jeffrey – whereabouts unknown; Charles Ogolla – no longer Old SDA; Ruth Omingo; Veldah Verah; Elias Ondoro; the late John Rugut; Zaddock Omollo; Ruth Chelagat. All were sponsored by enemies of truth.</p>
          </div>
          <div className="bg-blue-950/30 border-l-4 border-cyan-400 p-4 my-6 rounded-r-xl">
            <p className="font-semibold text-cyan-200 mb-2">July 2022 – Rongo Kasere Center Campmeeting</p>
            <p className="text-blue-100"><span className="font-semibold">Theme:</span> <span className="italic">No New Organization</span></p>
            <p className="text-blue-100"><span className="font-semibold">Key Text:</span> Isaiah 28:16 | <span className="font-semibold">Song:</span> SDA Hymnal 504</p>
            <p className="text-blue-100 mt-2"><span className="font-semibold">Speakers:</span> Ev. Maxwell Okoth – Sermon & Youth; Ev. Titus Kulu – Prophecy & True Education; Bro. Alvin Ogaga – Stewardship; Bro. Brian Weave – Stewardship; Bro. Allan Ongolla – Health; Bro. Kosgey Stephen – Righteousness by Faith & Country Living.</p>
            <p className="text-blue-100 mt-2">Nandi Campmeeting was also held, attended by Allan Ongolla and Brighton Ouru.</p>
          </div>
          <div className="bg-indigo-950/30 border-l-4 border-indigo-400 p-4 my-6 rounded-r-xl">
            <p className="font-semibold text-cyan-200 mb-2">First Ordination of Ministers:</p>
            <p className="text-blue-100">After the campmeeting, the church authorized the first ordination:</p>
            <ol className="list-decimal list-inside text-blue-100 ml-4 mt-2 space-y-1">
              <li><span className="font-semibold">Ev. Maxwell Okoth</span></li>
              <li><span className="font-semibold">Ev. Emmanuel Juma</span></li>
              <li><span className="font-semibold">Ev. Charles Ogolla</span></li>
            </ol>
            <p className="text-blue-100 mt-2">Led by Elder Ken Tolo and Erick Leo. They were recommended by the brethren and authorized to preach, baptize, and organize churches according to Gospel Order.</p>
          </div>
          <div className="bg-blue-950/30 border-l-4 border-cyan-400 p-4 my-6 rounded-r-xl">
            <p className="font-semibold text-cyan-200 mb-2">October 2022 – Nyanza Nandi Region Conference Organized</p>
            <p className="text-blue-100">All local churches gathered and formed the <span className="text-cyan-300 font-semibold">Old SDA Nyanza Nandi Conference</span>.</p>
            <p className="text-blue-100 mt-2"><span className="font-semibold">Elections:</span></p>
            <ol className="list-decimal list-inside text-blue-100 ml-4 mt-1 space-y-1">
              <li><span className="font-semibold">Maxwell Okoth</span> – Coordinating Chair</li>
              <li><span className="font-semibold">Charles Ogolla</span> – Secretary</li>
              <li><span className="font-semibold">Jefferson Oluoch</span> – Treasurer</li>
              <li><span className="font-semibold">Zaddock Omollo</span> – Nandi Representative</li>
            </ol>
            <p className="text-blue-100 mt-2">Plus departmental heads.</p>
            <p className="text-blue-100 mt-2"><span className="font-semibold">Finance:</span> Agreed to send 50% of tithes and 30% of offerings to support ministers and organizational activities. Church envelopes were made.</p>
            <p className="text-blue-100 mt-2"><span className="font-semibold">Focus Areas Agreed:</span> More missions, medical missionary work, true education schools, train workers, train youth in handwork in collaboration with Gachie Church, Kiambu.</p>
          </div>
        </section>

        {/* SECTION: 2022 to Present */}
        <section className="bg-white/5 border border-blue-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 border-l-4 border-cyan-400 pl-4 mb-6">2022 to Present – Growth & Mission</h2>
          <p className="text-blue-100 leading-relaxed mb-4">
            From 2022 until now, organization has helped us:
          </p>
          <ol className="list-decimal list-inside text-blue-100 space-y-3 ml-4 mb-4">
            <li><span className="font-semibold">Maintain church property</span> and open new churches in and beyond our borders: <span className="text-cyan-300">Nairobi City, Weitethie Thika, Lusigeti Kikuyu, Thogoto Kikuyu, Soy Kakamega, Bungoma, Eldoret, Malindi, Uganda, Tanzania, South Sudan</span>, among many others.</li>
            <li><span className="font-semibold">Baptisms:</span> Over <span className="text-cyan-300 font-bold">800 souls</span> baptized into the One True God. More than <span className="text-cyan-300 font-bold">900</span> are currently under instruction for baptism.</li>
            <li><span className="font-semibold">Leadership:</span> More elders and ministers ordained.</li>
            <li><span className="font-semibold">True Education:</span> Established centers to help our young people. We run a simple publishing house producing our own pioneer lessons.</li>
            <li><span className="font-semibold">Bible Workers:</span> Trained and sent many young people as missionaries across the country, supported by the church.</li>
          </ol>
          <p className="text-blue-100 italic text-center text-cyan-200 text-lg">“Even though we are poor we are rich in Christ.”</p>
          <p className="text-blue-100 leading-relaxed mt-4">
            <span className="font-semibold text-cyan-200">January 2023:</span> United with other like-minded regions in Kenya and formed the <span className="text-cyan-300 font-semibold">Larger Old SDA Organization in Kenya</span>.
          </p>
        </section>

        {/* SECTION: What We Believe */}
        <section className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-blue-950/40 border border-cyan-500/30 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 border-l-4 border-cyan-400 pl-4 mb-6">What We Believe</h2>
          <p className="text-blue-100 leading-relaxed mb-4">
            We remain steadfast in the <span className="text-cyan-300 font-semibold">Bible and the Spirit of Prophecy</span> as manifested in the writings of Ellen G. White.
          </p>
          <div className="space-y-3 text-blue-100">
            <p><span className="font-semibold text-cyan-200">1. Scripture:</span> We accept the whole Bible as inspired. We do not reject portions of Scripture.</p>
            <p><span className="font-semibold text-cyan-200">2. Spirit of Prophecy:</span> We accept all SOP books unless light is given from the Word otherwise.</p>
            <p><span className="font-semibold text-cyan-200">3. Godhead:</span> We do <span className="italic text-cyan-300">not</span> believe in the Trinity. <span className="italic">“There is one God, the Father... and one Lord Jesus Christ”</span> <span className="text-cyan-200">1 Corinthians 8:6; John 17:3</span>.</p>
            <p><span className="font-semibold text-cyan-200">4. Jesus Christ:</span> We believe He is the literal Son of God. <span className="text-cyan-200">John 3:16</span></p>
            <p><span className="font-semibold text-cyan-200">5. Holy Spirit:</span> We believe the Holy Spirit is the power, influence, and character that proceeds from the Father through His Son.</p>
            <p><span className="font-semibold text-cyan-200">6. Separation:</span> We reject the Trinity in all its forms – Catholic or SDA. This principle caused our separation. We reject any ecumenical movement as papal and satanic. We subscribe to no umbrella body of religion.</p>
            <p><span className="font-semibold text-cyan-200">7. Church & State:</span> We believe in separation of church and state. Our organization has nothing to do with politics or elections. Members are free to choose whether to vote after being taught the position of Bible and SOP.</p>
            <p><span className="font-semibold text-cyan-200">8. True Education:</span> A must. <span className="italic">“We believe without education no redemption.”</span> Members are free to choose after being taught – no coercion. True education is the only hope for a permanent reformatory movement.</p>
          </div>
        </section>

        {/* SECTION: Our Mission Today */}
        <section className="bg-white/5 border border-blue-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 border-l-4 border-cyan-400 pl-4 mb-6">Our Mission Today</h2>
          <ol className="list-decimal list-inside text-blue-100 space-y-3 ml-4">
            <li>Preach the <span className="text-cyan-300 font-semibold">Three Angels' Messages</span> of Revelation 14:6-12 in their pioneer purity.</li>
            <li>Call God's people out of Babylon and back to the <span className="italic text-cyan-300">“old paths.”</span> <span className="text-cyan-200">Jeremiah 6:16</span></li>
            <li>Expose Jesuit infiltration that has changed Fundamental Principles to Fundamental Beliefs, introduced the Trinity, and altered the symbols of Adventism.</li>
            <li>Establish true education, health reform, and country living as given to the pioneers.</li>
            <li>Organize churches on Gospel Order as found in 1 Corinthians 12 & 13.</li>
            <li>Prepare a people for the Latter Rain and the coming of Jesus.</li>
          </ol>
        </section>

        {/* FOOTER / CONTACT */}
        <div className="text-center pt-8 border-t border-blue-500/20">
          <h2 className="text-2xl font-bold text-cyan-300 mb-4">Welcome to Old SDA Organization</h2>
          <p className="text-blue-200 text-lg mb-2">Restoring Old Adventism</p>
          <div className="h-0.5 w-16 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto my-4"></div>
          <p className="text-blue-300 mb-1">📍 Headquarters: Rongo, Migori County, Kenya</p>
          <p className="text-blue-300 mb-6">📧 Contact: [Insert Email / Phone / P.O. Box]</p>
          <div className="bg-blue-950/30 border-l-4 border-cyan-400 p-5 max-w-2xl mx-auto rounded-r-xl">
            <p className="text-cyan-200 italic text-lg">
              “Thus saith the Lord, Stand ye in the ways, and see, and ask for the old paths, where is the good way, and walk therein, and ye shall find rest for your souls.”
            </p>
            <p className="text-blue-200 font-semibold mt-2">Jeremiah 6:16</p>
          </div>
        </div>

      </div>
    </main>
  );
}