

"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const beliefs = [
  // include all 28 principles exactly as provided
"1. That there is one God, a personal, spiritual being, the Creator of all things, omnipotent, omniscient, and eternal; infinite in wisdom, holiness, justice, goodness, truth and mercy; unchangeable and every-where present by his representative, the Holy Spirit. Psalm 139:7.",
  "2. That there is one Lord Jesus Christ, the Son of the eternal Father, the one by whom he created all things, and by whom they do consist; that he took on him the nature of the seed of Abraham for the redemption of our fallen race; that he dwelt among men, full of grace and truth, lived our example, died our sacrifice, was raised for our justification, ascended on high to be our only mediator in the sanctuary in heaven, where through the merits of his shed blood, he secures the pardon and forgiveness of the sins of all those who persistently come to him; and as the closing portion of work as priest, before he takes his throne as king, he will make the great atonement for the sins of all such, and their sins will then be blotted out (Acts 3:19) and born away from the sanctuary, as shown in the service of the Levitical priesthood, which foreshadowed and prefigured the ministry of our Lord in heaven. See Leviticus 16; Hebrews 8:4, 5; 9:6, 7.",
  "3. That the Holy Scriptures of the Old and New Testament were given by inspiration of God, contain a full revelation of his will to man, and are the only infallible rule of faith and practice.",
  "4. That baptism is an ordinance of the Christian church, to follow faith and repentance,—an ordinance by which we commemorate the resurrection of Christ, as by this act we show our faith in his burial and resurrection, and through that, in the resurrection of all the saints at the last day; and that no other mode more fitly represents these facts than that which the Scriptures prescribe, namely immersion. Romans 6:3–5; Colossians 2:12.",
  "5. That the new birth comprises the entire change necessary to fit us for the kingdom of God, and consists of two parts: First, a moral change wrought by conversion and a Christian life (John 5:3); second, a physical change at the second coming of Christ, whereby, if dead, we are raised incorruptible, and if living, are changed to immortality in a moment, in the twinkling of an eye. Luke 20:36; 1 Corinthians 15:51, 52.",
  "6. That prophecy is a part of God’s revelation to man; that it is included in that Scripture which is profitable for instruction (2 Timothy 3:16); that it is designed for us and our children (Deuteronomy 29:29); that so far from being enshrouded in impenetrable mystery, it is that which especially constitutes the word of God a lamp to our feet and a light in our path (Psalm 119:105; 2 Peter 1:19); that a blessing is pronounced upon those who study it (Revelation 1:1–3); and that, consequently, it is to be understood by the people of God sufficiently to show them their position in the world’s history and the special duties required at their hands.",
  "7. That the world’s history from specified dates in the past, the rise and fall of empires, and the chronological succession of events down to the setting up of God’s everlasting kingdom, are outlined in numerous great chains of prophecy; and that these prophecies are now all fulfilled except the closing scenes.",
  "8. That the doctrine of the world’s conversion and a temporal millennium is a fable of these last days, calculated to lull men into a state of carnal security, and cause them to be overtaken by the great day of the Lord as by a thief in the night (1 Thessalonians 5:3); that the second coming of Christ is to precede, not follow, the millennium; for until the Lord appears, the papal power, with all its abominations, is to continue (2 Thessalonians 2:8), the wheat and the tares grow together (Matthew 13:29, 30, 39), and evil men and seducers wax worse and worse, as the word of God declares. 2 Timothy 3:1, 13.",
  "9. That the mistake of Adventists in 1844 pertained to the nature of the event then to transpire not to the time; that no prophetic period is given to reach the second advent, but that the longest one, the two thousand and three hundred days of Daniel 8:14, terminated in 1844, and brought us to an event called the cleansing of the sanctuary.",
  "10. That the sanctuary of the new covenant is the tabernacle of God in heaven, of which Paul speaks in Hebrews 8 and onward, and of which our Lord, as great high priest, is minister; that this sanctuary is the antitype of the Mosaic tabernacle and that the priestly work of our Lord, connected therewith, is the antitype of the work of the Jewish priests of the former dispensation (Hebrews 8:1–5, etc.); that this, and not the earth, is the sanctuary to be cleansed at the end of the two thousand and three hundred days, what is termed its cleansing being in this case, as in the type, simply the entrance of the high priest into the most holy place, to finish the round of service connected therewith, by making atonement and removing from the sanctuary the sins of believers (Acts 3:19), and occupies a brief but indefinite space in the first apartment (Leviticus 16; Hebrews 9:22, 23); and that this work in the antitype, beginning in 1844, consists in actually blotting out the sins of believers (Acts 4:19), and occupies a brief but indefinite space of time, at the conclusion of which the work of mercy for the world will be finished, and the second advent of Christ will take place.",
  "11. That God’s moral requirements are the same upon all men in all dispensations; that these are summarily contained in the commandments spoken by Jehovah from Sinai, engraven on tables of stone, and deposited in the ark, which was in consequence called the “ark of the covenant,” or testament (Numbers 10:33; Hebrews 9:4, etc.); that this law is immutable and perpetual, being a transcript of the tables deposited in the ark in the true sanctuary on high, which is also, for the same reason, called the ark of God’s testament: for under the sounding of the seventh trumpet we are told that “the temple of God was opened in heaven, and there was seen in his temple the ark of his testament.” Revelation 11:19.",
  "12. That the fourth commandment of this law requires that we devote the seventh day of each week, commonly called Saturday, to abstinence from our own labor, and to the performance of sacred and religious duties; that this is the only weekly Sabbath known to the Bible, being the day that was set apart before Paradise was lost (Genesis 2:2, 3), and which will be observed in Paradise restored (Isaiah 66:22, 23); that the facts upon which the Sabbath institution is based confine it to the seventh day, as they are not true of any other day, and that the terms, Jewish Sabbath, as applied to the seventh day, and Christian Sabbath, as applied to the first day of the week, are names of human invention, unscriptural in fact, and false in meaning.",
  "13. That as the man of sin, the papacy, has thought to change times and laws (the law of God, Daniel 7:25), and has misled almost all Christendom in regard to the fourth commandment, we find a prophecy of reform in this respect to be wrought among believers just before the coming of Christ. Isaiah 56:1, 2; 1 Peter 1:5; Revelation 14:12, etc.",
  "14. That the followers of Christ should be a peculiar people, not following the maxims, nor conforming to the ways, of the world; not loving its pleasures nor countenancing its follies inasmuch as the apostle says that “whosoever therefore will be” in this sense, “a friend of the world is the enemy of God” (James 4:4); and Christ says that we cannot have two masters, or, at the same time, serve God and mammon. Matthew 6:24.",
  "15. That the Scriptures insist upon plainness and modesty of attire as a prominent mark of discipleship in those who profess to be the followers of Him who was “meek and lowly in heart;” that the wearing of gold, pearls, and costly array, or anything designed merely to adorn the person and foster the pride of the natural heart, is to be discarded, according to such scriptures as 1 Timothy 2:9, 10; 1 Peter 3:3, 4.",
  "16. That means for the support of evangelical work among men should be contributed from love to God and love of souls, not raised by church lotteries, or occasions designed to contribute to the fun-loving, appetite-indulging propensities of the sinner, such as fairs, festivals, crazy socials, etc., which are a disgrace to the professed church of Christ; that the proportion of one’s income required in former dispensations can be no less under the gospel; that it is the same as Abraham (whose children we are, if we are Christ’s. Galatians 3:29) when he gave him a tenth of all (Hebrews 7:1–4); the tithe is the Lord’s (Leviticus 27:30); and this tenth of one’s income is also to be supplemented by offerings from those who are able, for the support of the gospel. 2 Corinthians 9:6; Malachi 3:8, 10.",
  "17. That as the natural or carnal heart is at enmity with God and his law, this enmity can be subdued only by a radical transformation of the affections, the exchange of unholy for holy principles; that this transformation follows repentance and faith, is the special work of the Holy Spirit, and constitutes regeneration, or conversion.",
  "18. That all have violated the law of God, and cannot of themselves render obedience to his just requirements, we are dependent on Christ, first for justification from our past offences, and secondly, for grace whereby to render acceptable obedience to his holy law in time to come.",
  "19. That the Spirit of God was promised to manifest itself in the church through certain gifts, enumerated especially in 1 Corinthians 12 and Ephesians 4; that these gifts are not designed to supersede, or take the place of, the Bible, which is sufficient to make us wise unto salvation, any more than the Bible can take the place of the Holy Spirit; that, in specifying the various channels of its operations, that Spirit has simply made provision for its own existence and presence with the people of God to the end of time to lead to an understanding of that word which it had inspired, to convince of sin, and to work a transformation in the heart and life; and that those who deny to the Spirit its place and operation, do plainly deny that part of the Bible which assigns to it this work and position.",
  "20. That God, in accordance with his uniform dealings with the race, sends forth a proclamation of the approach of the second advent of Christ; and that this work is symbolized by the three messages of Revelation 14, the last one bringing to view the work of reform on the law of God, that his people may acquire a complete readiness for that event.",
  "21. That the time of the cleansing of the sanctuary (see proposition 10), synchronizing with the time of the proclamation of the third message (Revelation 14:9, 10), is a time of investigative judgment, first, with reference to the dead, and secondly, at the close of probation, with reference to the living, to determine who of the myriads now sleeping in the dust of the earth are worthy of a part in the first resurrection, and who of its living multitudes are worthy of translation,—points which must be determined before the Lord appears.",
  "22. That the grave, whither we all tend, expressed by the Hebrew word “sheol” and the Greek word “hades,” is a place, or condition, in which there is no work, device, wisdom, nor knowledge. Ecclesiastes 9:10.",
  "23. That the state to which we are reduced by death is one of silence, inactivity, and entire unconsciousness. Psalm 146:4; Ecclesiastes 9:5, 6; Daniel 12:2.",
  "24. That out of this prison-house of the grave, mankind are to be brought by a bodily resurrection, the righteous having part in the first resurrection, which takes place at the second coming of Christ; the wicked in the second resurrection, which takes place in a thousand years thereafter. Revelation 20:4, 6.",
  "25. That at the last trump, the living righteous are to be changed in a moment, in the twinkling of an eye, and that the risen righteous are to be caught up to meet the Lord in the air, so forever to be with the Lord. 1 Thessalonians 4:16, 17; 1 Corinthians 15:51, 52.",
  "26. That these immortalized ones are then taken to heaven, to the New Jerusalem, the Father’s house, in which there are many mansions (John 14:1–3), where they reign with Christ a thousand years, judging the world and fallen angels, that is, apportioning the punishment to be executed upon them at the close of the one thousand years (Revelation 20:4; 1 Corinthians 6:2, 3); that during this time the earth lies in a desolate, chaotic condition (Jeremiah 4:23–27), as in the beginning, by the Greek term “abussos” (bottomless pit, Septuagint of Genesis 1:2); and that here Satan is confined during the thousand years (Revelation 20:1, 2), and here finally destroyed (Revelation 20:10; Malachi 4:1); the theater of the ruin he has wrought in the universe being appropriately made for a time his gloomy prison-house, and then the place of his final execution.",
  "27. That at the end of the thousand years the Lord descends with his people and the New Jerusalem (Revelation 21:2), the wicked dead are raised, and come up on the surface of the yet unrenewed earth, and gather about the city, the camp of the saints (Revelation 20:9), and fire comes down from God out of heaven and devours them. They are then consumed, root and branch (Malachi 4:1), becoming as though they had not been (Obadiah 15, 16). In this everlasting destruction from the presence of the Lord (2 Thessalonians 1:9), the wicked meet the “everlasting punishment” threatened against them (Matthew 25:46), which is everlasting death. Romans 6:23; Revelation 20:14, 15. This is the perdition of ungodly men, the fire which consumes them being the fire for which “the heavens and earth, which are now, ... are kept in store,” which shall melt even the elements with its intensity, and purge the earth from the deepest stains of the curse of sin. 2 Peter 3:7–12.",
  "28. That new heavens and a new earth shall spring by the power of God from the ashes of the old, and this renewed earth with the New Jerusalem for its metropolis and capital shall be the eternal inheritance of the saints, the place where the righteous shall evermore dwell. 2 Peter 3:13; Psalm 37:11, 29; Matthew 5:5.",
];



export default function BeliefsPage() {
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
          Fundamental Principles of Seventh-day Adventists (1874)
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          “Seventh-day Adventists have no creed but the Bible.” — These 28
          principles, first published under the leadership of Uriah Smith,
          summarize the faith held by the early believers in full harmony
          throughout the body.
        </motion.p>
      </section>

      {/* Beliefs List */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {beliefs.map((text, index) => (
          <PrincipleCard key={index} text={text} />
        ))}
      </section>

      
    </main>
  );
}

// Individual Principle Card Component
function PrincipleCard({ text }: { text: string }) {
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


