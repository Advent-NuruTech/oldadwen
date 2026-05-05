"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import EventBanner from "@/components/EventBanner";
import EventStatusBadge from "@/components/EventStatusBadge";
import { generateSmartMessage } from "@/components/SmartMessageEngine";
import { useEvents } from "@/hooks/useEvents";
import { formatDateRange } from "@/lib/dateUtils";
import { getEventStatus } from "@/lib/eventEngine";

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { events, loading, error } = useEvents();
  const event = events.find((entry) => entry.id === eventId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white p-8 pt-24 text-sm">
        Loading event...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-red-400 p-8 pt-24 text-sm">
        {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white p-8 pt-24">
        <p className="text-sm text-slate-300">Event not found.</p>

        <Link
          href="/events"
          className="mt-3 inline-block text-sm font-semibold text-cyan-400 hover:underline"
        >
          Back to events
        </Link>
      </div>
    );
  }

  const status = getEventStatus(event);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white px-4 pt-24 pb-10">

      <div className="mx-auto max-w-4xl space-y-6">

        {/* TOP NAV */}
        <div className="flex items-center justify-between flex-wrap gap-3">

          <h1 className="text-lg font-semibold text-slate-200">
            Event Details
          </h1>

          <div className="flex gap-2">

            <Link
              href="/events"
              className="px-4 py-2 text-sm rounded-full border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            >
              Events
            </Link>

            <Link
              href="/calendar/list"
              className="px-4 py-2 text-sm rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
            >
              Calendar
            </Link>

          </div>
        </div>

        {/* CARD */}
        <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">

          {/* IMAGE (FIXED: NO CROPPING) */}
          <div className="w-full bg-black/40">
            <EventBanner
              bannerUrl={event.bannerUrl}
              title={event.title}
            />
          </div>

          {/* CONTENT */}
          <div className="space-y-5 p-6">

            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {event.title}
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  {formatDateRange(event.startDate, event.endDate)}
                </p>
              </div>

              <EventStatusBadge status={status} />
            </div>

            {/* SMART MESSAGE */}
            <p className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-4 text-sm text-cyan-200">
              {generateSmartMessage(event)}
            </p>

            {/* INFO GRID */}
            <div className="grid gap-3 rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-slate-300 sm:grid-cols-2">

              <p>
                <span className="font-semibold text-white">Type:</span> {event.type}
              </p>

              <p>
                <span className="font-semibold text-white">Venue:</span>{" "}
                {event.venue || "Not specified"}
              </p>

              <p>
                <span className="font-semibold text-white">Participants:</span>{" "}
                {event.participants || "Not specified"}
              </p>

              <p>
                <span className="font-semibold text-white">Speakers:</span>{" "}
                {event.speakers.length > 0
                  ? event.speakers.join(", ")
                  : "Not listed"}
              </p>

              <p className="sm:col-span-2">
                <span className="font-semibold text-white">Churches:</span>{" "}
                {event.churches.length > 0
                  ? event.churches.join(", ")
                  : "Not listed"}
              </p>
            </div>

            {/* DESCRIPTION */}
            {event.description && (
              <p className="whitespace-pre-line text-sm text-slate-300">
                {event.description}
              </p>
            )}

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-2">

              {event.pdfUrl && (
                <a
                  href={event.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-emerald-400/30 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/10"
                >
                  Open PDF Attachment
                </a>
              )}

              <Link
                href="/events"
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10"
              >
                Back to Events
              </Link>

            </div>

          </div>
        </article>

      </div>
    </div>
  );
}