"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function ThisWeek() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), (snap) => {
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEvents(data);
    });

    return () => unsub();
  }, []);

  const now = new Date();
  const weekEnd = new Date();
  weekEnd.setDate(now.getDate() + 7);

  const thisWeekEvents = events.filter(e => {
    const start = new Date(e.startDate);
    return start >= now && start <= weekEnd;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">This Week Events</h1>

      {thisWeekEvents.map(event => (
        <div key={event.id} className="p-3 border mt-3 rounded">
          <h3 className="font-bold">{event.title}</h3>
          <p>{event.startDate} → {event.endDate}</p>
          <p>{event.venue}</p>
        </div>
      ))}
    </div>
  );
}