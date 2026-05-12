"use client";

import { useState, useEffect } from "react";
import EditProfile from "@/components/admin/EditProfile";
import AddAdmin from "@/components/admin/AddAdmin";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import {
  FiUsers,
  FiFileText,
  FiLogOut,
  FiSettings,
  FiChevronRight,
} from "react-icons/fi";
import { FaPrayingHands } from "react-icons/fa";
import { ReactNode } from "react";

/* ------------------------------------------------------------------ */

export default function AdminDashboard() {
  const [activeTab, setActiveTab] =
    useState<"profile" | "addAdmin" | null>(null);

  const [stats, setStats] = useState({
    members: 0,
    prayerRequests: 0,
    blog: 0,
  });

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [members, prayers, blogs] = await Promise.all([
          getDocs(collection(db, "members")),
          getDocs(collection(db, "prayerRequests")),
          getDocs(collection(db, "blog")),
        ]);

        setStats({
          members: members.size,
          prayerRequests: prayers.size,
          blog: blogs.size,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const logout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">

      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur border-slate-200 dark:border-slate-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome back, {auth.currentUser?.email?.split("@")[0] || "Admin"}
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow transition"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="p-6 space-y-6">

        {/* STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Members"
            value={stats.members}
            icon={<FiUsers />}
            onClick={() => router.push("/admin/members/edit-member")}
            color="blue"
          />

          <StatCard
            title="Prayer Requests"
            value={stats.prayerRequests}
            icon={<FaPrayingHands />}
            onClick={() => router.push("/admin/received-prayer")}
            color="pink"
          />

          <StatCard
            title="Blog Posts"
            value={stats.blog}
            icon={<FiFileText />}
            onClick={() => router.push("/admin/blog/blog-delete")}
            color="emerald"
          />
        </div>

        {/* ADMIN TOOLS */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Admin Tools
            </h2>
            <FiSettings className="text-slate-400" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <ToolCard
              title="Profile Settings"
              desc="Update email and password"
              color="blue"
              onClick={() => setActiveTab("profile")}
            />
            <ToolCard
              title="Add Admin"
              desc="Create administrator account"
              color="emerald"
              onClick={() => setActiveTab("addAdmin")}
            />
          </div>
        </section>
      </main>

      {/* MODAL */}
      {activeTab && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl">
            <div className="border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                {activeTab === "profile" ? "Edit Profile" : "Add Admin"}
              </h3>
              <button
                onClick={() => setActiveTab(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {activeTab === "profile" && <EditProfile />}
              {activeTab === "addAdmin" && <AddAdmin />}
            </div>
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Loading dashboard...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

type StatColor = "blue" | "pink" | "emerald";

type StatStyle = {
  iconBg: string;
  iconText: string;
};

const statStyles: Record<StatColor, StatStyle> = {
  blue: {
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconText: "text-blue-600",
  },
  pink: {
    iconBg: "bg-pink-100 dark:bg-pink-900/30",
    iconText: "text-pink-600",
  },
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconText: "text-emerald-600",
  },
};

function StatCard({
  title,
  value,
  icon,
  onClick,
  color,
}: {
  title: string;
  value: number;
  icon: ReactNode;
  onClick: () => void;
  color: StatColor;
}) {
  const s = statStyles[color];

  return (
    <button
      onClick={onClick}
      className="text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition focus:outline-none"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg ${s.iconBg} ${s.iconText}`}>
          {icon}
        </div>
        <FiChevronRight className="text-slate-400" />
      </div>

      <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
        {value}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
    </button>
  );
}

type ToolColor = "blue" | "emerald";

type ToolStyle = {
  bg: string;
  border: string;
  title: string;
  text: string;
  button: string;
};

const toolStyles: Record<ToolColor, ToolStyle> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    title: "text-blue-800 dark:text-blue-300",
    text: "text-blue-700 dark:text-blue-400",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
    title: "text-emerald-800 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
};

function ToolCard({
  title,
  desc,
  color,
  onClick,
}: {
  title: string;
  desc: string;
  color: ToolColor;
  onClick: () => void;
}) {
  const s = toolStyles[color];

  return (
    <div className={`p-4 rounded-xl border ${s.bg} ${s.border}`}>
      <h4 className={`font-semibold ${s.title}`}>{title}</h4>
      <p className={`text-sm mb-3 ${s.text}`}>{desc}</p>
      <button
        onClick={onClick}
        className={`w-full py-2 rounded-lg text-white font-medium transition ${s.button}`}
      >
        Open
      </button>
    </div>
  );
}

