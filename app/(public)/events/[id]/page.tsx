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
    return <div className="min-h-screen bg-slate-50 p-8 text-sm text-slate-600">Loading event...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-slate-50 p-8 text-sm text-red-600">{error}</div>;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <p className="text-sm text-slate-700">Event not found.</p>
        <Link href="/events" className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline">
          Back to events
        </Link>
      </div>
    );
  }

  const status = getEventStatus(event);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <EventBanner bannerUrl={event.bannerUrl} title={event.title} />

        <div className="space-y-5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{event.title}</h1>
              <p className="mt-1 text-sm text-slate-600">{formatDateRange(event.startDate, event.endDate)}</p>
            </div>
            <EventStatusBadge status={status} />
          </div>

          <p className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">{generateSmartMessage(event)}</p>

          <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-2">
            <p>
              <span className="font-semibold text-slate-900">Type:</span> {event.type}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Venue:</span> {event.venue || "Not specified"}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Participants:</span> {event.participants || "Not specified"}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Speakers:</span> {event.speakers.length > 0 ? event.speakers.join(", ") : "Not listed"}
            </p>
            <p className="sm:col-span-2">
              <span className="font-semibold text-slate-900">Churches:</span> {event.churches.length > 0 ? event.churches.join(", ") : "Not listed"}
            </p>
          </div>

          {event.description && <p className="whitespace-pre-line text-sm text-slate-700">{event.description}</p>}

          <div className="flex flex-wrap gap-2">
            {event.pdfUrl && (
              <a
                href={event.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Open PDF Attachment
              </a>
            )}
            <Link
              href="/events"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Back to events
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}