"use client";

import { useMemo } from "react";
import {
  Bell,
  CheckCircle2,
  CreditCard,
  HandCoins,
} from "lucide-react";

import { useFinanceNotifications } from "@/hooks/useFinanceNotifications";

export default function FinanceNotificationsView() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    loading,
    error,
  } = useFinanceNotifications();

  const rows = useMemo(
    () => notifications.slice(0, 100),
    [notifications]
  );

  const getNotificationMessage = (notification: any) => {
    const donor =
      notification.donorName?.trim() || "Someone";

    const amount = `KES ${notification.amount.toLocaleString(
      "en-KE"
    )}`;

    switch (notification.type?.toLowerCase()) {
      case "tithe":
        return `${donor} has successfully paid tithe of ${amount}.`;

      case "offering":
        return `${donor} has given an offering of ${amount}.`;

      case "donation":
        return `${donor} has made a donation of ${amount}.`;

      case "payment":
        return `${donor} has completed a payment of ${amount}.`;

      default:
        return `${donor} has made a contribution of ${amount}.`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "payment":
        return <CreditCard className="h-5 w-5" />;

      case "donation":
        return <HandCoins className="h-5 w-5" />;

      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Finance Notifications
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Recent finance activities and payments.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm">
          <Bell className="h-4 w-4" />
          {unreadCount} Unread
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
          Loading notifications...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {/* Notifications */}
      {rows.length > 0 && (
        <section className="space-y-3">
          {rows.map((notification) => {
            const unread = notification.status === "unread";

            return (
              <article
                key={notification.id}
                className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:shadow-md ${
                  unread
                    ? "border-cyan-200 bg-cyan-50/70"
                    : "border-slate-200 bg-white"
                }`}
              >
                {/* Unread Indicator */}
                {unread && (
                  <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse" />
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        unread
                          ? "bg-cyan-100 text-cyan-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-relaxed text-slate-900">
                        {getNotificationMessage(notification)}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-slate-100 px-2 py-1 font-medium capitalize text-slate-700">
                          {notification.type || "Contribution"}
                        </span>

                        <span>
                          {notification.createdAt?.toLocaleString(
                            "en-KE",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          ) || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex shrink-0 items-center">
                    {unread ? (
                      <button
                        type="button"
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark as read
                      </button>
                    ) : (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Read
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Empty State */}
      {!loading && !error && rows.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <Bell className="mx-auto mb-3 h-10 w-10 text-slate-400" />

          <h3 className="text-sm font-semibold text-slate-800">
            No notifications yet
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Finance activities and payment updates will appear here.
          </p>
        </div>
      )}
    </div>
  );
}