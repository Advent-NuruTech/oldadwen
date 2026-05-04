"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import {
  FaTachometerAlt,
  FaUsers,
  FaBookOpen,
  FaDonate,
  FaPrayingHands,
} from "react-icons/fa";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: FaTachometerAlt },
  { href: "/admin/members/add-member", label: "Add Member", icon: FaUsers },
  { href: "/admin/members/edit-member", label: "Edit Members", icon: FaUsers },

  { href: "/admin/sabbath-school/add-lesson", label: "Add Lesson", icon: FaBookOpen },
  { href: "/admin/sabbath-school/edit-lesson", label: "Edit Lessons", icon: FaBookOpen },

  { href: "/admin/blog/post", label: "Post Blog", icon: FaBookOpen },
  { href: "/admin/blog/blog-delete", label: "Edit / Delete Blog", icon: FaBookOpen },

  { href: "/admin/bible-studies", label: "Upload Study Notes", icon: FaBookOpen },
  { href: "/admin/upload-video", label: "Upload Video", icon: FaBookOpen },

  { href: "/admin/received-prayer", label: "Prayer Requests", icon: FaPrayingHands },
  { href: "#", label: "Contributions", icon: FaDonate },
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

      {/* SIDEBAR */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems.map((item) => ({
          ...item,
          active: pathname === item.href,
        }))}
      />

      {/* MAIN AREA */}
      <div className="flex-1 md:ml-64 flex flex-col">

        {/* MOBILE TOP BAR */}
        <header className="
          md:hidden flex items-center justify-between px-4 py-3
          bg-transparent
          border-b border-slate-200 dark:border-gray-800
        ">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl text-inherit"
          >
            ☰
          </button>

          <h1 className="font-semibold tracking-wide">
            Admin Panel
          </h1>
        </header>

        {/* PAGE CONTENT (NO STYLE OVERRIDES) */}
        <main className="flex-1 p-0 bg-transparent">
          <div className="w-full h-full">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}