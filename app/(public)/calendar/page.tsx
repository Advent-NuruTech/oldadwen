"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

type Event = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
};

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      setEvents(data);
    });

    return () => unsub();
  }, []);

  const getEventsForDate = (date: Date) => {
    return events.filter(e => {
      const start = new Date(e.startDate);
      const end = new Date(e.endDate);
      return date >= start && date <= end;
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Church Calendar</h1>

      <Calendar onChange={(d:any) => setDate(d)} value={date} />

      <div className="mt-6">
        <h2 className="text-xl font-semibold">
          Events on {date.toDateString()}
        </h2>

        {getEventsForDate(date).map(event => (
          <div key={event.id} className="p-3 border mt-2 rounded">
            <h3 className="font-bold">{event.title}</h3>
            <p>{event.startDate} → {event.endDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}