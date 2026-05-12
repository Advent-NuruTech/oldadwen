"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaDonate,
  FaFileAlt,
  FaPrayingHands,
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";

import AdminSidebar from "./AdminSidebar";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: FaTachometerAlt },

  { href: "/admin/members/add-member", label: "Add Member", icon: FaUsers },
  { href: "/admin/members/edit-member", label: "Manage Members", icon: FaUsers },

  { href: "/admin/full-time-ministers/add-member", label: "Add Full-Time Minister", icon: FaUserTie },
  { href: "/admin/full-time-ministers/edit-member", label: "Manage Full-Time Ministers", icon: FaUserTie },

  { href: "/admin/sabbath-school/add-lesson", label: "Add Lesson", icon: FaBookOpen },
  { href: "/admin/sabbath-school/edit-lesson", label: "Edit Lessons", icon: FaBookOpen },

  { href: "/admin/blog/post", label: "Post Blog", icon: FaBookOpen },
  { href: "/admin/blog/blog-delete", label: "Edit / Delete Blog", icon: FaBookOpen },

  { href: "/admin/events", label: "Event Manager", icon: FaCalendarAlt },
  { href: "/admin/reports", label: "Reports Manager", icon: FaFileAlt },

  { href: "/admin/finance/login", label: "Finance Login", icon: FaDonate },
  { href: "/admin/finance/login/dashboard", label: "Finance Dashboard", icon: FaDonate },

  { href: "/admin/bible-studies", label: "Upload Study Notes", icon: FaBookOpen },
  { href: "/admin/upload-video", label: "Upload Video", icon: FaBookOpen },

  { href: "/admin/received-prayer", label: "Prayer Requests", icon: FaPrayingHands },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-transparent text-inherit">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems.map((item) => ({
          ...item,
          active: pathname === item.href,
        }))}
      />

      <div className="flex flex-1 flex-col md:ml-64">
        <header
          className="
            md:hidden flex items-center justify-between px-4 py-3
            bg-transparent border-b border-slate-200 dark:border-gray-800
          "
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl text-inherit"
            aria-label="Open admin navigation"
          >
            ☰
          </button>

          <h1 className="font-semibold tracking-wide">Admin Panel</h1>
        </header>

        <main className="flex-1 bg-transparent p-0">
          <div className="h-full w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
