"use client";

import { useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import EventStatusBadge from "@/components/EventStatusBadge";
import { generateSmartMessage } from "@/components/SmartMessageEngine";
import { useEvents } from "@/hooks/useEvents";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { formatDateRange } from "@/lib/dateUtils";
import { db } from "@/lib/firebase";
import { ChurchEvent, getEventStatus, splitList } from "@/lib/eventEngine";

interface EventFormState {
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  venue: string;
  participants: string;
  speakersText: string;
  churchesText: string;
  description: string;
  bannerUrl: string;
  pdfUrl: string;
}

const emptyForm: EventFormState = {
  title: "",
  type: "",
  startDate: "",
  endDate: "",
  venue: "",
  participants: "",
  speakersText: "",
  churchesText: "",
  description: "",
  bannerUrl: "",
  pdfUrl: "",
};

export default function AdminEventsPage() {
  const { events, loading, error } = useEvents();

  const [form, setForm] = useState<EventFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const typeSuggestions = useMemo(() => {
    return Array.from(
      new Set(events.map((event) => event.type).filter((type) => type.trim().length > 0)),
    );
  }, [events]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const setField = <K extends keyof EventFormState>(field: K, value: EventFormState[K]) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const startEdit = (event: ChurchEvent) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      type: event.type,
      startDate: event.startDate,
      endDate: event.endDate,
      venue: event.venue,
      participants: event.participants,
      speakersText: event.speakers.join("\n"),
      churchesText: event.churches.join("\n"),
      description: event.description ?? "",
      bannerUrl: event.bannerUrl ?? "",
      pdfUrl: event.pdfUrl ?? "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpload = async (file: File | null, target: "banner" | "pdf") => {
    if (!file) return;

    const isPdf = file.type === "application/pdf";
    if (target === "banner" && isPdf) {
      setMessage("Banner upload expects an image file.");
      return;
    }

    if (target === "pdf" && !isPdf) {
      setMessage("PDF upload expects a PDF file.");
      return;
    }

    try {
      setMessage(null);
      if (target === "banner") setUploadingBanner(true);
      if (target === "pdf") setUploadingPdf(true);

      const secureUrl = await uploadToCloudinary(file);

      if (target === "banner") {
        setField("bannerUrl", secureUrl);
      } else {
        setField("pdfUrl", secureUrl);
      }
    } catch (uploadError) {
      const text = uploadError instanceof Error ? uploadError.message : "Upload failed.";
      setMessage(text);
    } finally {
      if (target === "banner") setUploadingBanner(false);
      if (target === "pdf") setUploadingPdf(false);
    }
  };

  const validateForm = (): string | null => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.type.trim()) return "Type is required.";
    if (!form.startDate) return "Start date is required.";
    if (!form.endDate) return "End date is required.";
    if (form.endDate < form.startDate) return "End date cannot be before start date.";
    return null;
  };

  const buildPayload = () => ({
    title: form.title.trim(),
    type: form.type.trim().toUpperCase(),
    startDate: form.startDate,
    endDate: form.endDate,
    venue: form.venue.trim(),
    participants: form.participants.trim(),
    speakers: splitList(form.speakersText),
    churches: splitList(form.churchesText),
    description: form.description.trim() || null,
    bannerUrl: form.bannerUrl.trim() || null,
    pdfUrl: form.pdfUrl.trim() || null,
  });

  const submitCreate = async () => {
    const validation = validateForm();
    if (validation) {
      setMessage(validation);
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);
      await addDoc(collection(db, "events"), {
        ...buildPayload(),
        createdAt: serverTimestamp(),
      });
      resetForm();
      setMessage("Event created.");
    } catch (submitError) {
      const text = submitError instanceof Error ? submitError.message : "Failed to create event.";
      setMessage(text);
    } finally {
      setSubmitting(false);
    }
  };

  const submitUpdate = async () => {
    if (!editingId) return;

    const validation = validateForm();
    if (validation) {
      setMessage(validation);
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);
      await updateDoc(doc(db, "events", editingId), buildPayload());
      resetForm();
      setMessage("Event updated.");
    } catch (submitError) {
      const text = submitError instanceof Error ? submitError.message : "Failed to update event.";
      setMessage(text);
    } finally {
      setSubmitting(false);
    }
  };

  const removeEvent = async (id: string) => {
    const shouldDelete = window.confirm("Delete this event?");
    if (!shouldDelete) return;

    try {
      await deleteDoc(doc(db, "events", id));
      if (editingId === id) resetForm();
      setMessage("Event deleted.");
    } catch (removeError) {
      const text = removeError instanceof Error ? removeError.message : "Failed to delete event.";
      setMessage(text);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Admin Event Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Add, edit, delete, and publish real-time church events with optional Cloudinary banner and PDF attachments.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">{editingId ? "Edit Event" : "Create Event"}</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormInput label="Title" value={form.title} onChange={(value) => setField("title", value)} />

            <div>
              <FormInput
                label="Type (admin-defined)"
                value={form.type}
                onChange={(value) => setField("type", value)}
                listId="event-type-options"
              />
              <datalist id="event-type-options">
                {typeSuggestions.map((type) => (
                  <option key={type} value={type} />
                ))}
              </datalist>
            </div>

            <FormInput
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(value) => setField("startDate", value)}
            />
            <FormInput
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(value) => setField("endDate", value)}
            />

            <FormInput label="Venue" value={form.venue} onChange={(value) => setField("venue", value)} />
            <FormInput
              label="Participants"
              value={form.participants}
              onChange={(value) => setField("participants", value)}
            />

            <FormTextarea
              label="Speakers (one per line or comma-separated)"
              value={form.speakersText}
              onChange={(value) => setField("speakersText", value)}
            />

            <FormTextarea
              label="Churches (one per line or comma-separated)"
              value={form.churchesText}
              onChange={(value) => setField("churchesText", value)}
            />

            <div className="md:col-span-2">
              <FormTextarea
                label="Description"
                value={form.description}
                rows={4}
                onChange={(value) => setField("description", value)}
              />
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <UploadField
              label="Banner Image (optional)"
              accept="image/*"
              busy={uploadingBanner}
              url={form.bannerUrl}
              onFile={(file) => handleUpload(file, "banner")}
            />
            <UploadField
              label="Attachment PDF (optional)"
              accept="application/pdf"
              busy={uploadingPdf}
              url={form.pdfUrl}
              onFile={(file) => handleUpload(file, "pdf")}
            />
          </div>

          {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}

          <div className="mt-5 flex flex-wrap gap-2">
            {editingId ? (
              <button
                type="button"
                onClick={submitUpdate}
                disabled={submitting}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                {submitting ? "Updating..." : "Update Event"}
              </button>
            ) : (
              <button
                type="button"
                onClick={submitCreate}
                disabled={submitting}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
              >
                {submitting ? "Creating..." : "Add Event"}
              </button>
            )}

            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Clear Form
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900">Live Events ({events.length})</h2>
          {loading && <p className="text-sm text-slate-600">Loading events...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="grid gap-3">
            {events.map((event) => {
              const status = getEventStatus(event);

              return (
                <article key={event.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
                      <p className="text-sm text-slate-600">{formatDateRange(event.startDate, event.endDate)}</p>
                    </div>
                    <EventStatusBadge status={status} />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">{event.type}</span>
                    {event.venue && (
                      <span className="rounded-full bg-sky-50 px-3 py-1 font-medium text-sky-700">{event.venue}</span>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-slate-700">{generateSmartMessage(event)}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(event)}
                      className="rounded-lg border border-amber-300 px-3 py-1.5 text-sm font-semibold text-amber-700 hover:bg-amber-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeEvent(event.id)}
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                    {event.pdfUrl && (
                      <a
                        href={event.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-emerald-300 px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                      >
                        Open PDF
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  listId?: string;
}

function FormInput({ label, value, onChange, type = "text", listId }: FormInputProps) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        list={listId}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
      />
    </label>
  );
}

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

function FormTextarea({ label, value, onChange, rows = 3 }: FormTextareaProps) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
      />
    </label>
  );
}

interface UploadFieldProps {
  label: string;
  accept: string;
  busy: boolean;
  url: string;
  onFile: (file: File | null) => void;
}

function UploadField({ label, accept, busy, url, onFile }: UploadFieldProps) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        type="file"
        accept={accept}
        onChange={(event) => onFile(event.target.files?.[0] ?? null)}
        className="mt-2 block w-full text-sm"
      />

      {busy && <p className="mt-2 text-xs text-slate-500">Uploading...</p>}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:underline"
        >
          Open uploaded file
        </a>
      )}
    </div>
  );
}
