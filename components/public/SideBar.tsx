"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaTimes } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  publicNavItems: { href: string; label: string; icon: any }[];
}

export default function Sidebar({ isOpen, onClose, publicNavItems }: SidebarProps) {
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

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden transition-all duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px]
        bg-white/90 backdrop-blur-xl
        shadow-[0_10px_40px_rgba(0,0,0,0.15)]
        z-50 transform transition-transform duration-300 ease-out lg:hidden
        border-r border-gray-200
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full
          bg-gray-100 hover:bg-gray-200
          transition-all duration-200 hover:scale-110"
        >
          <FaTimes className="text-lg text-gray-700" />
        </button>

        <div className="flex flex-col h-full">
  {/* Header */}
<div className="p-6 text-center
  bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900
  text-white
  shadow-xl
  border-b border-blue-400/20"
>
  <div className="relative w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden shadow-xl border-2 border-blue-400/30">
    <Image
      src="/images/logo.jpeg"
      alt="Logo"
      fill
      className="object-cover"
    />
  </div>

  <h3 className="text-2xl font-black tracking-tight">
    OLD SDA
  </h3>

  <p className="text-sm font-semibold mt-1 tracking-wide uppercase text-cyan-200/90">
    Restoring Old Adventism
  </p>
</div>
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLink}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  isActive(item.href)
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all
                  ${
                    isActive(item.href)
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-blue-600 group-hover:bg-blue-100"
                  }`}
                >
                  <item.icon className="text-base" />
                </div>

                {/* CLEAR, STRONG TEXT */}
                <span className="font-semibold text-[15px] tracking-wide">
                  {item.label.toUpperCase()}
                </span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 text-center">
            <p className="text-xs font-medium text-gray-500">
              © 2026 OLD SDA ADVENTISTS
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}