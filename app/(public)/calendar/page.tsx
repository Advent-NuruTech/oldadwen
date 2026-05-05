"use client";

import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import { useEvents } from "@/hooks/useEvents";
import { parseDateOnly, toYmd } from "@/lib/dateUtils";
import { buildExportLines, buildPdfBlob, ChurchEvent } from "@/lib/eventEngine";

function buildDateIndex(events: ChurchEvent[]): Map<string, ChurchEvent[]> {
  const index = new Map<string, ChurchEvent[]>();

  events.forEach((event) => {
    const start = parseDateOnly(event.startDate);
    const end = parseDateOnly(event.endDate);
    if (!start || !end) return;

    let cursor = new Date(start);
    while (cursor <= end) {
      const key = toYmd(cursor);
      const existing = index.get(key);
      if (existing) {
        existing.push(event);
      } else {
        index.set(key, [event]);
      }
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
    }
  });

  return index;
}

function intersectsRange(event: ChurchEvent, rangeStart: Date, rangeEnd: Date): boolean {
  const start = parseDateOnly(event.startDate);
  const end = parseDateOnly(event.endDate);
  if (!start || !end) return false;

  return start <= rangeEnd && end >= rangeStart;
}

function triggerPdfDownload(lines: string[], fileName: string): void {
  const blob = buildPdfBlob(lines);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function CalendarPage() {
  const { events, loading, error } = useEvents();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeModalEvent, setActiveModalEvent] = useState<ChurchEvent | null>(null);
  const [monthForExport, setMonthForExport] = useState<number>(new Date().getMonth() + 1);
  const [yearForExport, setYearForExport] = useState<number>(new Date().getFullYear());

  const eventDateIndex = useMemo(() => buildDateIndex(events), [events]);

  const selectedEvents = useMemo(() => {
    return eventDateIndex.get(toYmd(selectedDate)) ?? [];
  }, [eventDateIndex, selectedDate]);

  const onDateChange = (value: Date | Date[] | null) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      return;
    }

    if (Array.isArray(value) && value[0] instanceof Date) {
      setSelectedDate(value[0]);
    }
  };

  const exportYearly = () => {
    const rangeStart = new Date(yearForExport, 0, 1);
    const rangeEnd = new Date(yearForExport, 11, 31);

    const filtered = events.filter((event) => intersectsRange(event, rangeStart, rangeEnd));
    const lines = buildExportLines(filtered, `Church Calendar ${yearForExport}`);
    triggerPdfDownload(lines, `church-calendar-${yearForExport}.pdf`);
  };

  const exportMonthly = () => {
    const rangeStart = new Date(yearForExport, monthForExport - 1, 1);
    const rangeEnd = new Date(yearForExport, monthForExport, 0);

    const filtered = events.filter((event) => intersectsRange(event, rangeStart, rangeEnd));
    const monthLabel = rangeStart.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const lines = buildExportLines(filtered, `Church Calendar ${monthLabel}`);
    triggerPdfDownload(lines, `church-calendar-${yearForExport}-${String(monthForExport).padStart(2, "0")}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Old SDA  Church Calendar Of Events </h1>
          <p className="mt-2 text-sm text-slate-600">
            Real-time events, smart announcements, and church-ready exports.
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,320px]">
            <div className="rounded-2xl border border-slate-200 p-4">
              <Calendar
                onChange={onDateChange as any}
                value={selectedDate}
                tileClassName={({ date, view }) => {
                  if (view !== "month") return undefined;
                  const hasEvents = (eventDateIndex.get(toYmd(date)) ?? []).length > 0;
                  return hasEvents ? "calendar-has-events" : undefined;
                }}
                tileContent={({ date, view }) => {
                  if (view !== "month") return null;
                  const dayEvents = eventDateIndex.get(toYmd(date)) ?? [];
                  if (dayEvents.length === 0) return null;

                  const title = dayEvents.map((event) => event.title).join(" | ");
                  return (
                    <div title={title} className="calendar-marker-row">
                      {dayEvents.slice(0, 3).map((event) => (
                        <span key={`${event.id}-${event.startDate}`} className="calendar-marker" />
                      ))}
                      {dayEvents.length > 3 ? <span className="calendar-plus">+{dayEvents.length - 3}</span> : null}
                    </div>
                  );
                }}
              />
            </div>
 <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            Events on {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </h2>

          {loading && <p className="text-sm text-slate-600">Loading events...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && !error && selectedEvents.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
              No events scheduled for this date.
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {selectedEvents.map((event) => (
              <EventCard key={event.id} event={event} onOpen={setActiveModalEvent} detailsHref={`/events/${event.id}`} />
            ))}
          </div>
        </section>
            <aside className="space-y-4 rounded-2xl border border-slate-200 p-4">
              <h2 className="text-lg font-semibold">PDF Export</h2>
              <p className="text-sm text-slate-600">Download yearly or monthly calendar in a church-ready format.</p>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Year</label>
                <input
                  type="number"
                  value={yearForExport}
                  onChange={(event) => setYearForExport(Number(event.target.value) || new Date().getFullYear())}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Month</label>
                <select
                  value={monthForExport}
                  onChange={(event) => setMonthForExport(Number(event.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  {Array.from({ length: 12 }).map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {new Date(2000, index, 1).toLocaleString("en-US", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={exportYearly}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  Export Year PDF
                </button>
                <button
                  type="button"
                  onClick={exportMonthly}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                >
                  Export Month PDF
                </button>
              </div>
            </aside>
          </div>
        </section>

        
      </div>

      <EventModal event={activeModalEvent} onClose={() => setActiveModalEvent(null)} />

      <style jsx global>{`
        .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }

        .react-calendar__tile {
          border-radius: 0.75rem;
          position: relative;
        }

        .react-calendar__tile--active {
          background: #0f172a !important;
          color: #fff;
        }

        .calendar-has-events {
          background: #eff6ff;
        }

        .calendar-marker-row {
          margin-top: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
        }

        .calendar-marker {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #2563eb;
          display: inline-block;
        }

        .calendar-plus {
          font-size: 9px;
          color: #1d4ed8;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
