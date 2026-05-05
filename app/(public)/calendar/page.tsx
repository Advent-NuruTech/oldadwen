"use client";

import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import { useEvents } from "@/hooks/useEvents";
import { parseDateOnly, toYmd } from "@/lib/dateUtils";
import { buildExportLines, buildPdfBlob, ChurchEvent } from "@/lib/eventEngine";

/* ================= HELPERS ================= */
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
      existing ? existing.push(event) : index.set(key, [event]);
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
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

/* ================= PAGE ================= */
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
    if (value instanceof Date) setSelectedDate(value);
    else if (Array.isArray(value) && value[0]) setSelectedDate(value[0]);
  };

  const exportMonthly = () => {
    const start = new Date(yearForExport, monthForExport - 1, 1);
    const end = new Date(yearForExport, monthForExport, 0);

    const filtered = events.filter((e) => intersectsRange(e, start, end));
    const label = start.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    triggerPdfDownload(buildExportLines(filtered, label), `calendar-${label}.pdf`);
  };

  const exportYearly = () => {
    const start = new Date(yearForExport, 0, 1);
    const end = new Date(yearForExport, 11, 31);

    const filtered = events.filter((e) => intersectsRange(e, start, end));
    triggerPdfDownload(
      buildExportLines(filtered, `Year ${yearForExport}`),
      `calendar-${yearForExport}.pdf`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white px-4 pt-24 pb-10">
      
      <div className="mx-auto max-w-7xl space-y-10">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Old SDA <span className="text-cyan-400">Church Calendar</span>
          </h1>
          <p className="text-slate-300 text-sm">
            Events, schedules & spiritual gatherings in one place
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">

          {/* CALENDAR CARD */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">

            <Calendar
              onChange={onDateChange as any}
              value={selectedDate}
              calendarType="gregory"
              locale="en-US"
              className="modern-calendar"
              tileClassName={({ date, view }) => {
                if (view !== "month") return undefined;
                return (eventDateIndex.get(toYmd(date))?.length ?? 0) > 0
                  ? "has-event"
                  : undefined;
              }}
              tileContent={({ date, view }) => {
                if (view !== "month") return null;
                const events = eventDateIndex.get(toYmd(date)) ?? [];
                if (!events.length) return null;

                return (
                  <div className="flex justify-center gap-1 mt-1">
                    {events.slice(0, 2).map((e) => (
                      <span key={e.id} className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    ))}
                    {events.length > 2 && (
                      <span className="text-[10px] text-cyan-300">
                        +{events.length - 2}
                      </span>
                    )}
                  </div>
                );
              }}
            />
          </div>

          {/* SIDE PANEL */}
          <div className="space-y-6">

            {/* EVENTS LIST */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <h2 className="text-lg font-semibold mb-3">
                {selectedDate.toDateString()}
              </h2>

              {loading && <p className="text-sm text-slate-400">Loading...</p>}
              {error && <p className="text-red-400 text-sm">{error}</p>}

              {!loading && selectedEvents.length === 0 && (
                <p className="text-sm text-slate-400">No events scheduled</p>
              )}

              <div className="space-y-3">
                {selectedEvents.map((e) => (
                  <EventCard
                    key={e.id}
                    event={e}
                    onOpen={setActiveModalEvent}
                    detailsHref={`/events/${e.id}`}
                  />
                ))}
              </div>
            </div>

            {/* EXPORT PANEL */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-cyan-300">
                Export Center
              </h2>

              <div className="mt-4 space-y-3">
                <input
                  type="number"
                  value={yearForExport}
                  onChange={(e) => setYearForExport(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
                />

                <select
                  value={monthForExport}
                  onChange={(e) => setMonthForExport(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("en", { month: "long" })}
                    </option>
                  ))}
                </select>

                <button onClick={exportMonthly} className="btn-primary">
                  Export Month
                </button>

                <button onClick={exportYearly} className="btn-secondary">
                  Export Year
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <EventModal
        event={activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
      />

      {/* STYLES */}
      <style jsx global>{`
        .modern-calendar {
          width: 100%;
          border: none;
          background: transparent;
          color: white;
        }

        .react-calendar__tile {
          border-radius: 10px;
          padding: 10px 0;
        }

        .react-calendar__tile--active {
          background: linear-gradient(135deg, #06b6d4, #3b82f6) !important;
          color: white;
        }

        .has-event {
          background: rgba(34, 211, 238, 0.08);
        }

        .btn-primary {
          width: 100%;
          padding: 10px;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          border-radius: 10px;
          font-weight: 600;
          color: white;
        }

        .btn-secondary {
          width: 100%;
          padding: 10px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px;
          color: white;
        }
      `}</style>
    </div>
  );
}