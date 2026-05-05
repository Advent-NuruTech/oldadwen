"use client";

import { useMemo, useState } from "react";

import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import { useEvents } from "@/hooks/useEvents";
import { ChurchEvent, EventStatus, getEventStatus } from "@/lib/eventEngine";

const statusOptions: Array<EventStatus | "ALL"> = ["ALL", "UPCOMING", "TODAY", "ONGOING", "COMPLETED"];

export default function EventsPage() {
  const { events, loading, error } = useEvents();
  const [statusFilter, setStatusFilter] = useState<EventStatus | "ALL">("ALL");
  const [activeEvent, setActiveEvent] = useState<ChurchEvent | null>(null);

  const filteredEvents = useMemo(() => {
    if (statusFilter === "ALL") return events;
    return events.filter((event) => getEventStatus(event) === statusFilter);
  }, [events, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Church Events</h1>
          <p className="mt-2 text-sm text-slate-600">Real-time church schedule with intelligent status and announcements.</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {statusOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatusFilter(option)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  statusFilter === option
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </header>

        {loading && <p className="text-sm text-slate-600">Loading events...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && filteredEvents.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            No events found for this filter.
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onOpen={setActiveEvent} detailsHref={`/events/${event.id}`} />
          ))}
        </section>
      </div>

      <EventModal event={activeEvent} onClose={() => setActiveEvent(null)} />
    </div>
  );
}
