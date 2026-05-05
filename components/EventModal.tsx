"use client";

import EventBanner from "@/components/EventBanner";
import EventStatusBadge from "@/components/EventStatusBadge";
import { generateSmartMessage } from "@/components/SmartMessageEngine";
import { formatDateRange } from "@/lib/dateUtils";
import { ChurchEvent, getEventStatus } from "@/lib/eventEngine";

interface EventModalProps {
  event: ChurchEvent | null;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  if (!event) return null;

  const status = getEventStatus(event);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white"
        onClick={(eventClick) => eventClick.stopPropagation()}
      >
        <EventBanner bannerUrl={event.bannerUrl} title={event.title} />

        <div className="space-y-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{event.title}</h2>
              <p className="text-sm text-slate-600">{formatDateRange(event.startDate, event.endDate)}</p>
            </div>
            <EventStatusBadge status={status} />
          </div>

          <p className="text-sm font-medium text-slate-700">{generateSmartMessage(event)}</p>

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
                Open Attachment PDF
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
