"use client";

import Link from "next/link";

import EventBanner from "@/components/EventBanner";
import EventStatusBadge from "@/components/EventStatusBadge";
import { generateSmartMessage } from "@/components/SmartMessageEngine";
import { formatDateRange } from "@/lib/dateUtils";
import { ChurchEvent, getEventStatus } from "@/lib/eventEngine";

interface EventCardProps {
  event: ChurchEvent;
  onOpen?: (event: ChurchEvent) => void;
  detailsHref?: string;
}

export default function EventCard({ event, onOpen, detailsHref }: EventCardProps) {
  const status = getEventStatus(event);
  const smartMessage = generateSmartMessage(event);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <EventBanner bannerUrl={event.bannerUrl} title={event.title} />

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
            <p className="text-sm text-slate-600">{formatDateRange(event.startDate, event.endDate)}</p>
          </div>
          <EventStatusBadge status={status} />
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">{event.type}</span>
          {event.venue && (
            <span className="rounded-full bg-sky-50 px-3 py-1 font-medium text-sky-700">{event.venue}</span>
          )}
        </div>

        <p className="text-sm text-slate-700">{smartMessage}</p>

        <div className="flex flex-wrap gap-2">
          {onOpen && (
            <button
              type="button"
              onClick={() => onOpen(event)}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Open Event
            </button>
          )}

          {detailsHref && (
            <Link
              href={detailsHref}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              View Details
            </Link>
          )}

          {event.pdfUrl && (
            <a
              href={event.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Open PDF
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
