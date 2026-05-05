"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FaUsers,
  FaBars,
  FaHome,
  FaBookOpen,
  FaWater,
  FaPrayingHands,
  FaDonate,
  FaChevronDown,
} from "react-icons/fa";
import Sidebar from "./SideBar";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const aboutRef = useRef<HTMLDivElement>(null);

  const handleNavigation = () => setLoading(true);
  useEffect(() => setLoading(false), [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href: string) => pathname === href;

  const publicNavItems = [
    { href: "/", label: "Home", icon: FaHome },
    { href: "/sabbath-school", label: "Sabbath School", icon: FaUsers },
    { href: "/library", label: "Library", icon: FaBookOpen },
    { href: "/blog", label: "Blog", icon: FaWater },
    { href: "/finance", label: "GIVE", icon: FaDonate },
    { href: "/prayer", label: "Prayer Request", icon: FaPrayingHands },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* LOGO */}
            <Link
              href="/"
              onClick={handleNavigation}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition">
                <Image
                  src="/images/logo.jpeg"
                  alt="Logo"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h1 className="text-xl font-extrabold text-gray-900">
                  Old SDA
                </h1>
                <p className="text-xs text-gray-500 -mt-1">
                  Restoring Adventism
                </p>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-2">

              {/* ABOUT DROPDOWN */}
              <div ref={aboutRef} className="relative">
                <button
                  onClick={() => setAboutOpen(!aboutOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    aboutOpen
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaUsers />
                  About
                  <FaChevronDown
                    className={`text-xs transition-transform ${
                      aboutOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {aboutOpen && (
                  <div className="absolute top-full mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-fadeIn">
                    <Link
                      href="/about"
                      onClick={() => setAboutOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      About Us
                    </Link>
                    <Link
                      href="/members"
                      onClick={() => setAboutOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Our Team
                    </Link>
                  </div>
                )}
              </div>

              {/* NAV ITEMS */}
              {publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigation}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive(item.href)
                      ? "text-blue-700 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* MOBILE */}
            <div className="lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                <FaBars className="text-xl text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* LOADING BAR */}
        {loading && (
          <div className="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse" />
        )}
      </nav>

      <div className="h-20" />

      {sidebarOpen && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          publicNavItems={[
            { href: "/about", label: "About Us", icon: FaUsers },
            { href: "/members", label: "Our Team", icon: FaUsers },
            ...publicNavItems,
          ]}
        />
      )}
    </>
  );
}