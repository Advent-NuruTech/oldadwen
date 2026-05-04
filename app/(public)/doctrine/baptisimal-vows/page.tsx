"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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
  'My Purpose: Having given myself fully to God, and desiring to truly serve Him here and to live with Him forever, I hereby declare my acceptance of these principles of truth, and my obedience to them by His grace.'
];

export default function VowsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4 md:px-8">
      {/* Header */}
      <section className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-[#3B2414] dark:text-emerald-300 tracking-tight"
        >
          Baptismal Vows
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          These 13 vows represent the believer’s personal commitment to follow
          Jesus Christ, uphold biblical truth, and live a life of service and
          holiness in harmony with God’s will.
        </motion.p>
      </section>

      {/* Vows List */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vows.map((text, index) => (
          <VowCard key={index} text={text} />
        ))}
      </section>

      
    </main>
  );
}

// Individual Vow Card with Read More toggle
function VowCard({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const wordLimit = 60;

  const words = text.split(" ");
  const showReadMore = words.length > wordLimit;
  const visibleText = expanded ? text : words.slice(0, wordLimit).join(" ") + (showReadMore ? "..." : "");

  // Extract number
  const numberMatch = text.match(/^(\d+)\./);
  const number = numberMatch ? numberMatch[1] : "";
  const content = number ? text.replace(`${number}. `, "") : text;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-[#B5D8C6] dark:border-gray-700 hover:shadow-lg hover:border-[#8FCFB1] dark:hover:border-emerald-400 transition-all duration-300 flex flex-col"
    >
      <h2 className="text-gray-900 dark:text-gray-200 font-medium leading-relaxed">
        <span className="text-[#E94B3C] dark:text-red-400 font-bold mr-2">{number}.</span>
        <span>{expanded ? content : visibleText.replace(`${number}. `, "")}</span>
      </h2>

      {showReadMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-red-600 dark:text-red-400 font-semibold text-sm hover:underline self-start"
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
      )}
    </motion.div>
  );
}
