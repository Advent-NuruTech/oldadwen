"use client";

import Link from "next/link";

const vows = [
  "1. Do you accept all the Bible as the inspired word of God, and do you take it as your only rule of faith? Is it your purpose to ever walk according to its teachings? 2 Tim. 3:16,17; Acts 20:32.",
  "2. Have you received the Lord Jesus Christ as your personal Saviour for salvation from sin, for a real change of heart, and will you permit Him by the Holy Spirit to live in you daily? John 1:12,13; Gal. 2:20.",
  "3. Have you repented of, and confessed all known sin to God, and do you believe that He, for Christ's sake has forgiven you, and as far as possible have you tried to make matters right with your fellow men? 1 John 1:9; Matt.5:23-26; Eze.33:15.",
  "4. Is it your purpose, by the grace of God, to live a true Christian life, by surrendering all - soul, body, spirit - to God, to do His will in all things and keep the commandments of God? Rom. 12:1; Col. 3:17; Rev. 14:12.",
  "5. Will you seek to maintain a true spiritual experience by the daily study of God's Word and prayer, and will you endeavour by your consistent life and personal effort to win souls to Christ?",
  "6. Do you believe and accept the great truths of the Word of God concerning the personal, visible, literal, imminent return of Christ (Acts 1:9-11); immortality only through Christ (2 Tim. 1:10); the unconscious state of the dead (Ecc!. 9:5,6); the destruction of the wicked (Mal. 4:1-3); and the other kindred truths that comprise the special message of Revelation 14:6-12?",
  "7. Is it your purpose to keep the seventh day of the week from Friday sunset to Saturday sunset as the Lord's holy day according to the fourth commandment? Luke 23:56; Ex. 20:8-11.",
  "8. Will you practice the Bible plan for the support of God's work by rendering unto Him first the tithe, or one tenth of all your increase (Lev. 27:30; Mal. 3:8-10); and then offerings as you may be able, according to His prospering hand? Deut. 16:17; Luke 6:38.",
  "9. Is it your purpose to obey the command to eat and drink to the glory of God (1 Cor. 10:31) by abstaining from all intoxicating liquors (Pro. 23:29-32), tobacco in all its forms (1 Cor. 3:16, 17) swine's flesh (Isa. 66:15, 17), narcotics, tea, coffee, and other harmful things?",
  "10. Are you willing to follow the Bible rule of modesty and simplicity of dress, refraining from the wearing of earrings, necklaces, bracelets, beads, rings, etc., and from any lack of dress that is out of keeping with the Bible rule of modesty? 1 Tim. 2:9, 10; 1 Peter 3:3,4; Ex. 33:5, 6; Gen. 35:2-4.",
  "11. Do you believe in and have you accepted the ordinance of humility (John 13:1-17), and the ordinance of the Lord's Supper? 1 Cor. 11:23-33.",
  "12. Is it your purpose to come out from the world and be separate in obedience to God's command in 2 Cor. 6:17, by refraining from following the sinful practices of the world, such as dancing, card-playing, theatre-going, novel reading, etc. and by shunning all questionable worldly amusements? 1 John 2:15; James 1:27; 4:4.",
  "13. Will you seek to build up the interests of the church by giving the Sabbath School your hearty and practical support and attending, as far as possible, all services of the church? And will you endeavour by God's help to do your part in the work of the church? Luke 4:16; Rom. 12:4-8.",
  "14. Do you recognise that the remnant church has the Spirit of Prophecy, and that this has been manifested to this church through the writings of Ellen G. White? Rev. 12:17; 19:10.",
  "15. Do you believe in baptism by immersion only, and are you ready to follow your Lord and Master in this sacred rite? Matt. 28:18-20; Col. 2:12; Rom. 6:3-5.",
  "16. My Purpose: Having given myself fully to God, and desiring to truly serve Him here and to live with Him forever, I hereby declare my acceptance of these principles of truth, and my obedience to them by His grace."
];

// Helper to extract number and text from each vow
function parseVow(text: string): { number: string; content: string } {
  const match = text.match(/^(\d+)\.\s+([\s\S]*)$/);
  if (match) {
    return { number: match[1], content: match[2] };
  }
  // For "My Purpose" which has no number
  if (text.startsWith("My Purpose:")) {
    return { number: "", content: text };
  }
  return { number: "", content: text };
}

export default function VowsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0b1220] to-[#020617] text-white px-4 sm:px-6 py-12 sm:py-16">

      {/* HEADER */}
      <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
          Baptismal Vows
        </h1>
        <div className="h-1 w-24 mx-auto mt-4 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full" />
        <p className="text-blue-200 text-lg sm:text-xl md:text-2xl mt-6 max-w-2xl mx-auto">
          <span className="text-cyan-300 font-semibold">A Sacred Commitment</span> | Following Your Lord in Baptism
        </p>
      </div>

      {/* INTRODUCTORY STATEMENT */}
      <div className="max-w-4xl mx-auto mb-10 sm:mb-12 bg-white/5 border border-blue-500/20 rounded-2xl p-5 sm:p-6 md:p-8 backdrop-blur-md">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-300 text-center mb-4 sm:mb-6">Baptismal Covenant</h2>
        <p className="text-blue-100 text-lg sm:text-xl md:text-2xl leading-relaxed text-center">
          These vows represent the believer's personal commitment to follow Jesus Christ, 
          uphold biblical truth, and live a life of service and holiness in harmony with God's will.
        </p>
        <p className="text-cyan-300 text-lg sm:text-xl mt-5 sm:mt-6 font-semibold text-center">I solemnly declare:</p>
      </div>

      {/* VOWS LIST */}
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {vows.map((vow, index) => {
          const { number, content } = parseVow(vow);
          const isLastVow = index === vows.length - 1;
          
          return (
            <section 
              key={index}
              className={`
                bg-white/5 border border-blue-500/20 rounded-2xl p-5 sm:p-6 md:p-8 backdrop-blur-md 
                transition-all hover:border-cyan-500/40
                ${isLastVow ? 'bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-blue-950/40 border-cyan-500/30' : ''}
              `}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                {number && (
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20 mx-auto sm:mx-0">
                    <span className="text-white text-xl sm:text-2xl font-bold">{number}</span>
                  </div>
                )}
                <p className="text-blue-100 text-lg sm:text-xl md:text-xl leading-relaxed flex-1 text-center sm:text-left">
                  {content}
                </p>
              </div>
            </section>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="text-center pt-10 sm:pt-12 border-t border-blue-500/20 max-w-4xl mx-auto mt-8 sm:mt-8">
        <div className="bg-blue-950/30 border-l-4 border-cyan-400 p-5 sm:p-6 max-w-2xl mx-auto rounded-r-xl">
          <p className="text-cyan-200 italic text-lg sm:text-xl md:text-2xl">
            “Therefore we are buried with him by baptism into death: that like as Christ was raised up from the dead by the glory of the Father, even so we also should walk in newness of life.”
          </p>
          <p className="text-blue-200 font-semibold mt-2 text-base sm:text-lg">Romans 6:4</p>
        </div>
        <p className="text-blue-400 text-xs sm:text-sm mt-6">Baptismal Vows — Based on the Historic Seventh-day Adventist Church Manual</p>
      </div>
    </main>
  );
}