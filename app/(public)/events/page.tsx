"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import { useEvents } from "@/hooks/useEvents";
import { ChurchEvent, EventStatus, getEventStatus } from "@/lib/eventEngine";

const statusOptions: Array<EventStatus | "ALL"> = [
  "ALL",
  "UPCOMING",
  "TODAY",
  "ONGOING",
  "COMPLETED",
];

export default function EventsPage() {
  const { events, loading, error } = useEvents();

  const [statusFilter, setStatusFilter] = useState<EventStatus | "ALL">("ALL");
  const [activeEvent, setActiveEvent] = useState<ChurchEvent | null>(null);
  const [search, setSearch] = useState("");

  /* FILTER LOGIC */
  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (event) => getEventStatus(event) === statusFilter
      );
    }

    if (search.trim()) {
      filtered = filtered.filter((event) =>
        `${event.title} ${event.description || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    return filtered;
  }, [events, statusFilter, search]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white px-4 pt-24 pb-10">

      <div className="mx-auto max-w-6xl space-y-8">

        {/* TOP NAV TABS */}
        <div className="flex items-center justify-between flex-wrap gap-3">

          <h1 className="text-2xl font-bold">
            Church <span className="text-cyan-400">Activities </span>
          </h1>

          <div className="flex items-center gap-2">

            <Link
              href="/events"
              className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
            >
              Events
            </Link>

            <Link
              href="/calendar"
              className="px-4 py-2 rounded-full text-sm font-semibold border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition"
            >
              Calendar
            </Link>

          </div>
        </div>

        {/* HEADER CARD */}
        <header className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl">

          <p className="text-sm text-slate-400">
            Real-time church schedule with intelligent status and announcements.
          </p>

          {/* SEARCH */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* FILTERS */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {statusOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatusFilter(option)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === option
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

        </header>

        {/* STATES */}
        {loading && (
          <p className="text-sm text-slate-400">Loading events...</p>
        )}

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        {!loading && !error && filteredEvents.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400">
            No events found.
          </div>
        )}

        {/* EVENTS GRID */}
        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onOpen={setActiveEvent}
              detailsHref={`/events/${event.id}`}
            />
          ))}
        </section>

      </div>

      {/* MODAL */}
      <EventModal
        event={activeEvent}
        onClose={() => setActiveEvent(null)}
      />
    </div>
  );
}