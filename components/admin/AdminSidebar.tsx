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
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-40
          h-screen w-64
          bg-gray-950 text-white
          border-r border-gray-800
          shadow-2xl
          transition-transform duration-300 ease-in-out
          flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              Admin Panel
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Finance Management
            </p>
          </div>

          {/* CLOSE BUTTON MOBILE */}
          <button
            onClick={onClose}
            className="
              rounded-lg p-2 text-gray-400
              transition hover:bg-gray-800 hover:text-white
              md:hidden
            "
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center gap-3
                    rounded-xl px-4 py-3
                    transition-all duration-200
                    ${
                      active
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                >
                  {/* ICON */}
                  <div
                    className={`
                      flex h-10 w-10 items-center justify-center
                      rounded-lg transition
                      ${
                        active
                          ? "bg-white/10"
                          : "bg-gray-800 group-hover:bg-gray-700"
                      }
                    `}
                  >
                    <Icon size={16} />
                  </div>

                  {/* LABEL */}
                  <span className="truncate text-sm font-medium">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-800 p-4">
          <button
            onClick={handleLogout}
            className="
              flex w-full items-center justify-center gap-3
              rounded-xl bg-red-600 px-4 py-3
              text-sm font-semibold text-white
              transition-all duration-200
              hover:bg-red-700 active:scale-[0.98]
            "
          >
            <FaSignOutAlt size={15} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}