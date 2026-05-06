"use client";

import { useMemo } from "react";

import { useFinanceNotifications } from "@/hooks/useFinanceNotifications";

export default function FinanceNotificationsView() {
  const { notifications, unreadCount, markAsRead, loading, error } = useFinanceNotifications();

  const rows = useMemo(() => notifications.slice(0, 100), [notifications]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Finance Notifications</h2>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
          Unread {unreadCount}
        </span>
      </div>

      {loading && <p className="text-sm text-slate-600">Loading notifications...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {rows.length > 0 && (
        <section className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
          {rows.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-lg border p-3 ${notification.status === "unread" ? "border-cyan-300 bg-cyan-50" : "border-slate-200 bg-white"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">{notification.donorName || "Anonymous donor"}</p>
                  <p>
                    {notification.type} | KES {notification.amount.toLocaleString("en-KE")}
                  </p>
                  <p className="text-xs text-slate-500">{notification.createdAt?.toLocaleString("en-KE") || "-"}</p>
                </div>

                {notification.status === "unread" ? (
                  <button
                    type="button"
                    onClick={() => markAsRead(notification.id)}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    Mark as read
                  </button>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">Read</span>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="text-sm text-slate-600">No finance notifications yet.</p>
      )}
    </div>
  );
}
