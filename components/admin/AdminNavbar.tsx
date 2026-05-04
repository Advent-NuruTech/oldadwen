"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaUsers,
  FaBookOpen,
  FaPrayingHands,
  FaDonate,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: FaTachometerAlt },
  { href: "/members/add-member", label: "Add Member", icon: FaUsers },
  { href: "/members/edit-member", label: "Edit Members", icon: FaUsers },
  { href: "/admin/sabbath-school/add-lesson", label: "Add Lesson", icon: FaBookOpen },
  { href: "/admin/sabbath-school/edit-lesson", label: "Edit Lessons", icon: FaBookOpen },
  { href: "/dmin/blog/post", label: "Add Blog", icon: FaBookOpen },
  { href: "/admin/received-prayer", label: "Prayer Requests", icon: FaPrayingHands },
  { href: "/admin/contributions", label: "Contributions", icon: FaDonate },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white p-4">
        <span className="font-bold">Admin Panel</span>
        <button onClick={() => setOpen(!open)}>
          {open ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-900 text-white z-40
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="hidden md:block p-6 text-xl font-bold border-b border-gray-700">
          Admin Panel
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
