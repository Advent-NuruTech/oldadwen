"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  FaTimes,
  FaHome,
  FaBookOpen,
  FaNewspaper,
  FaDonate,
  FaPrayingHands,
  FaUsers,
} from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isActive = (href: string) => pathname === href;

  if (!isOpen) return null;

  const handleLink = () => onClose();

  /* SIDEBAR NAV ITEMS */
  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: FaHome,
    },
    {
      href: "/about",
      label: "About Us",
      icon: FaUsers,
    },
    {
      href: "/members",
      label: "Our Team",
      icon: FaUsers,
    },
    {
      href: "/full-time-ministers",
      label: "Full-Time Ministers",
      icon: FaUsers,
    },
    {
      href: "/sabbath-school",
      label: "Sabbath School",
      icon: FaBookOpen,
    },
    {
      href: "/library",
      label: "Library",
      icon: FaBookOpen,
    },
    {
      href: "/blog",
      label: "Blog",
      icon: FaNewspaper,
    },
    {
      href: "/finance",
      label: "DONATE",
      icon: FaDonate,
    },
    {
      href: "/prayer",
      label: "Prayer Request",
      icon: FaPrayingHands,
    },

 {
      href: "/reports",
      label: "Reports",
      icon: FaBookOpen,
    },


  ];

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
        onClick={onClose}
      />

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[340px]
        bg-[#0B1220] text-white
        shadow-[0_20px_60px_rgba(0,0,0,0.6)]
        z-50 transform transition-transform duration-300 ease-out lg:hidden
        border-r border-white/10
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full
          bg-white/5 hover:bg-white/10
          border border-white/10
          transition hover:scale-110"
        >
          <FaTimes className="text-lg text-slate-300" />
        </button>

        <div className="flex flex-col h-full">

          {/* HEADER */}
          <div className="p-6 text-center bg-gradient-to-b from-[#0F172A] to-[#020617] border-b border-cyan-500/10">

            <div className="relative w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden shadow-xl border border-cyan-500/20">
              <Image
                src="/images/logo.jpeg"
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>

            <h3 className="text-2xl font-black tracking-tight text-white">
              OLD SDA
            </h3>

            <p className="text-sm font-semibold mt-1 tracking-wide uppercase text-cyan-300">
              Restoring Old Adventism
            </p>

          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLink}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all
                  ${
                    isActive(item.href)
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-cyan-300 group-hover:bg-white/10"
                  }`}
                >
                  <item.icon className="text-base" />
                </div>

                <span className="font-semibold text-[14px] tracking-wide">
                  {item.label.toUpperCase()}
                </span>
              </Link>
            ))}

          </nav>

          {/* FOOTER */}
          <div className="p-4 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              © 2026 OLD SDA ADVENTISTS
            </p>
          </div>

        </div>
      </aside>
    </>
  );
}