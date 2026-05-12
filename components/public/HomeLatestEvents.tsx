"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useEvents } from "@/hooks/useEvents";
import { formatDateRange } from "@/lib/dateUtils";
import { ChurchEvent, getEventStatus } from "@/lib/eventEngine";
import EventBanner from "@/components/EventBanner";

type EventTab = "upcoming" | "ongoing";

function filterByTab(events: ChurchEvent[], tab: EventTab): ChurchEvent[] {
  if (tab === "upcoming") {
    return events.filter((event) => getEventStatus(event) === "UPCOMING");
  }

  return events.filter((event) => {
    const status = getEventStatus(event);
    return status === "ONGOING" || status === "TODAY";
  });
}

export default function HomeLatestEvents() {
  const [activeTab, setActiveTab] = useState<EventTab>("upcoming");
  const { events, loading, error } = useEvents();

  const visibleEvents = useMemo(() => {
    return filterByTab(events, activeTab).slice(0, 3);
  }, [events, activeTab]);

  return (
    <section className="bg-[#07101F] border-y border-cyan-500/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Latest Events
            </h2>
            <p className="mt-1 text-sm text-cyan-100">
              Quick view of upcoming and ongoing programs.
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-cyan-500/30 bg-slate-900/70 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === "upcoming"
                  ? "bg-cyan-500 text-slate-950"
                  : "text-cyan-200 hover:bg-cyan-500/10"
              }`}
            >
              Upcoming
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ongoing")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === "ongoing"
                  ? "bg-cyan-500 text-slate-950"
                  : "text-cyan-200 hover:bg-cyan-500/10"
              }`}
            >
              Ongoing
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-6">
          {loading && (
            <p className="text-sm text-cyan-100">Loading events...</p>
          )}

          {error && (
            <p className="text-sm text-red-300">{error}</p>
          )}

          {!loading && !error && visibleEvents.length === 0 && (
            <p className="text-sm text-slate-300">
              No events in this category right now.
            </p>
          )}

          {!loading && !error && visibleEvents.length > 0 && (
            <div className="grid gap-4 md:grid-cols-3">
              {visibleEvents.map((event) => (
                <article
                  key={event.id}
                  className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 overflow-hidden"
                >
                  {/* IMAGE (SAME SYSTEM AS DETAILS PAGE) */}
                  <div className="w-full bg-black/40">
                    <EventBanner
                      bannerUrl={event.bannerUrl}
                      title={event.title}
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                      {getEventStatus(event)}
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-white line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-300">
                      {formatDateRange(event.startDate, event.endDate)}
                    </p>

                    {event.venue && (
                      <p className="mt-1 text-sm text-cyan-100">
                        Venue: {event.venue}
                      </p>
                    )}

                    <Link
                      href={`/events/${event.id}`}
                      className="mt-4 inline-block rounded-lg border border-cyan-500/40 px-3 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/10"
                    >
                      View Event
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}