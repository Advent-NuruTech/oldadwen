"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export default function AdminSidebar({
  isOpen,
  onClose,
  navItems,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-gray-900 text-white
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <button onClick={onClose} className="md:hidden">
            <FaTimes />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-2 rounded
                ${active ? "bg-gray-700" : "hover:bg-gray-800"}`}
                onClick={onClose}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2 rounded bg-red-600 hover:bg-red-700"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
