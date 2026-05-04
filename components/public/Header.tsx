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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
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
    { href: "#", label: "Donate", icon: FaDonate },
    { href: "/prayer", label: "Prayer Request", icon: FaPrayingHands },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-gradient-to-r from-blue-900/95 via-blue-800/95 to-blue-900/95 backdrop-blur-md shadow-2xl" 
          : "bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900"
      } border-b border-blue-400/20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 lg:h-24">
            
            {/* Logo */}
            <Link href="/" onClick={handleNavigation} className="flex items-center gap-3 group">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                <Image src="/images/logo.jpeg" alt="Logo" fill className="object-cover" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-200 bg-clip-text text-transparent">
                  Old SDA 
                </h1>
                <p className="text-xs sm:text-sm text-cyan-200/80 -mt-1">
                  Restoring Old Adventism 
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-2">

              {/* About Us Dropdown */}
              <div ref={aboutRef} className="relative">
                <button
                  onClick={() => setAboutOpen(!aboutOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                    pathname.startsWith("/about") || pathname.startsWith("/members")
                      ? "bg-blue-600/50 text-white backdrop-blur-sm"
                      : "text-cyan-100 hover:bg-blue-700/50 hover:text-white"
                  }`}
                >
                  <FaUsers />
                  <span>About Us</span>
                  <FaChevronDown className={`text-xs transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`} />
                </button>

                {aboutOpen && (
                  <div className="absolute top-full mt-2 min-w-[180px] rounded-lg shadow-xl overflow-hidden bg-gradient-to-b from-blue-800 to-blue-900 backdrop-blur-md border border-blue-400/30 animate-slideDown">
                    <Link
                      href="/about"
                      onClick={() => setAboutOpen(false)}
                      className="block px-4 py-2 text-sm text-cyan-100 hover:bg-blue-700/50 hover:text-white transition-all duration-200"
                    >
                      About Us
                    </Link>
                    <Link
                      href="/members"
                      onClick={() => setAboutOpen(false)}
                      className="block px-4 py-2 text-sm text-cyan-100 hover:bg-blue-700/50 hover:text-white transition-all duration-200"
                    >
                      Our Team
                    </Link>
                  </div>
                )}
              </div>

              {/* Other Nav Items */}
              {publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigation}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm whitespace-nowrap ${
                    isActive(item.href)
                      ? "bg-blue-600/50 text-white backdrop-blur-sm shadow-md"
                      : "text-cyan-100 hover:bg-blue-700/50 hover:text-white hover:shadow-md"
                  }`}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-blue-600/30 backdrop-blur-sm hover:bg-blue-600/50 transition-all duration-200"
              >
                <FaBars className="text-xl text-cyan-100" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading Progress Bar */}
        {loading && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 animate-pulse" />
        )}
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-20 lg:h-24" />

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

      {/* Add animation keyframes if not already in your global CSS */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
}