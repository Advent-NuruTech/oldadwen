"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaWhatsapp,
  FaYoutube,
  FaEnvelope,
  FaChevronUp,
} from "react-icons/fa";

/* Typing Effect (same as hero) */
function useTyping(text: string, speed = 80) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) i = 0;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
}

export default function Footer() {
  const year = new Date().getFullYear();
  const typing = useTyping("Powered by Advent NuruTech");

  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  /* Scroll Animation */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={ref}
      className="relative text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507692049790-de58290a4334')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/85" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* MAIN GRID */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-10 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >

          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Old SDA
            </h2>
            <p className="mt-3 text-gray-300 font-medium leading-relaxed">
              Restoring Old Adventism based on the original faith once delivered.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2 text-gray-300 font-medium">
              <Link href="/about">About</Link>
              <Link href="/principles1889">1889 Fundamental Principles</Link>
              <Link href="/principles1872">1872 Fundamental Principles</Link>
              <Link href="/doctrine/baptisimal-vows">Baptisimal Vows</Link>
              <Link href="/blog">Truth filled articles</Link>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>

            <div className="space-y-2 text-gray-300 font-medium">
              <p>Kenya</p>
              <p>oldsdaorganization@gmail.com</p>
              <p>+254 724403284 </p>
            </div>

            {/* SOCIAL */}
            <div className="flex gap-3 mt-4">
              <a href="#" target="_blank">
                <FaFacebookF />
              </a>
              <a href="#">
                <FaWhatsapp />
              </a>
              <a href="#">
                <FaYoutube />
              </a>
              <a href="mailto:oldsdaorganization@gmail.com">
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-16 text-center space-y-3">

          {/* LEGAL LINKS (NEW) */}
          <div className="flex justify-center gap-4 text-sm text-gray-400">
            <Link href="/terms" className="hover:text-white transition">
              Terms & Conditions
            </Link>
            <span>|</span>
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/cookies" className="hover:text-white transition">
              Cookies Policy
            </Link>
          </div>

          <p className="text-gray-400 text-sm">
            © {year} Old SDA. All rights reserved.
          </p>

          {/* TYPING POWERED BY */}
          <a
            href="https://adventnurutech.xyz"
            target="_blank"
            className="text-blue-400 font-semibold"
          >
            {typing}
            <span className="animate-pulse ml-1">|</span>
          </a>
        </div>
      </div>

      {/* BACK TO TOP ICON ONLY */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-blue-600 p-3 rounded-full text-white"
      >
        <FaChevronUp />
      </button>
    </footer>
  );
}