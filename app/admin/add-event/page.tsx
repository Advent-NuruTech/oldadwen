"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddEvent() {
  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    venue: "",
    participants: "",
  });

  const handleSubmit = async () => {
    await addDoc(collection(db, "events"), form);
    alert("Event Added!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Add Event</h1>

      <input placeholder="Title" onChange={e => setForm({...form, title: e.target.value})} />
      <input type="date" onChange={e => setForm({...form, startDate: e.target.value})} />
      <input type="date" onChange={e => setForm({...form, endDate: e.target.value})} />
      <input placeholder="Venue" onChange={e => setForm({...form, venue: e.target.value})} />
      <input placeholder="Participants" onChange={e => setForm({...form, participants: e.target.value})} />

      <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 mt-4">
        Save Event
      </button>
    </div>
  );
}