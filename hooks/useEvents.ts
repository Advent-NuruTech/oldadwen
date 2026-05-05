"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { ChurchEvent, normalizeEvent, sortEvents } from "@/lib/eventEngine";

interface UseEventsResult {
  events: ChurchEvent[];
  loading: boolean;
  error: string | null;
}

export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventsQuery = query(collection(db, "events"), orderBy("startDate", "asc"));

    const unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        const mapped = snapshot.docs.map((doc) =>
          normalizeEvent({ id: doc.id, ...doc.data() }, doc.id),
        );

        setEvents(sortEvents(mapped));
        setLoading(false);
        setError(null);
      },
      (snapshotError) => {
        setError(snapshotError.message || "Failed to load events.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return useMemo(
    () => ({
      events,
      loading,
      error,
    }),
    [events, loading, error],
  );
}
