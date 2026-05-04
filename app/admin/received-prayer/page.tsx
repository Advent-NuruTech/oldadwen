"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

interface PrayerRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  request: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

export default function ReceivedPrayersPage() {
  const router = useRouter();
  const auth = getAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);

  // 🔐 Auth guard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  // 📥 Load prayers
  const loadPrayers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "prayerRequests"));

      const list: PrayerRequest[] = snapshot.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...(doc.data() as Omit<PrayerRequest, "id">),
        })
      );

      setPrayers(list);
    } catch (err) {
      console.error("Failed to load prayers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadPrayers();
  }, [user]);

  // 🗑️ Delete prayer
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this prayer request?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "prayerRequests", id));
      setPrayers((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete prayer request:", error);
      alert("Error deleting the request.");
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B] p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Received Prayer Requests
          </h1>
          <p className="text-gray-400 mt-2">
            Manage and review submitted prayer requests
          </p>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="text-center text-gray-400">
            Loading prayer requests...
          </div>
        ) : prayers.length === 0 ? (
          <div className="text-center text-gray-400">
            No prayer requests yet.
          </div>
        ) : (
          <div className="space-y-5">
            {prayers.map((prayer) => (
              <div
                key={prayer.id}
                className="bg-gradient-to-br from-[#1E293B]/40 via-[#0F172A]/40 to-[#1E1B4B]/40
                backdrop-blur-sm border border-[#334155] rounded-2xl shadow-xl p-5
                hover:shadow-2xl transition-all duration-300"
              >
                {/* Top row */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {prayer.name}
                    </h2>

                    <div className="text-sm text-[#60A5FA] mt-1 space-y-1">
                      <p>📞 {prayer.phone}</p>
                      {prayer.email && <p>✉️ {prayer.email}</p>}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(prayer.id)}
                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700
                    text-white rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>

                {/* Message */}
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {prayer.request}
                </div>

                {/* Date */}
                {prayer.createdAt && (
                  <div className="mt-4 text-xs text-gray-500">
                    Submitted:{" "}
                    {new Date(prayer.createdAt.seconds * 1000).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}