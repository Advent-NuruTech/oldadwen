"use client";

import { useEffect, useMemo, useState } from "react";

type ReportLink = { title: string; url: string };

type Report = {
  id: string;
  title: string;
  content: string;
  images: string[];
  links: ReportLink[];
  donationLinks?: string;
  authorName?: string;
 authorTitle?: string;
  publishedDate?: string | null;
  createdAt: string | null;
};

function toReadableDate(value?: string | null): string {
  if (!value) return "";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function splitParagraphs(content: string): string[] {
  return content
    .split(/\n\s*\n/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // IMAGE MODAL
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/reports", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load reports");
        }

        const payload = (await response.json()) as Report[];

        setReports(payload);
      } catch (err) {
        console.error(err);
        setError("Unable to load reports right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(
    () =>
      reports.filter((r) =>
        `${r.title} ${r.content}`
          .toLowerCase()
          .includes(filter.toLowerCase()),
      ),
    [reports, filter],
  );

  const perPage = 4;

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / perPage),
  );

  const safePage = Math.min(page, totalPages);

  const paginated = filtered.slice(
    (safePage - 1) * perPage,
    safePage * perPage,
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <main
      className="relative min-h-screen text-slate-100 pt-24 pb-16 px-4 overflow-hidden"
      style={{
        backgroundImage: "url('/images/background.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-0" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-8">
        {/* HEADER */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Missionary Reports
          </h1>

          <p className="text-slate-200 max-w-3xl mx-auto text-lg leading-8">
            Transparent, structured, and up-to-date missionary,
            financial, and project reports for members and
            stakeholders.
          </p>
        </section>

        {/* SEARCH */}
        <section className="rounded-3xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-md p-4 shadow-2xl">
          <input
            className="w-full border border-slate-600 bg-slate-950/80 p-4 rounded-xl outline-none focus:border-cyan-500"
            placeholder="Search reports by title or content..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          />
        </section>

        {/* STATES */}
        {loading && (
          <p className="text-center text-slate-300">
            Loading reports...
          </p>
        )}

        {error && (
          <p className="text-center text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && paginated.length === 0 && (
          <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-8 text-center">
            <p className="text-slate-300">
              No reports found for your search.
            </p>
          </section>
        )}

        {/* REPORTS */}
        {!loading &&
          !error &&
          paginated.map((report) => {
            const published = toReadableDate(
              report.publishedDate || report.createdAt,
            );

            const paragraphs = splitParagraphs(report.content);

            return (
              <article
                key={report.id}
                className="rounded-3xl border border-slate-700/70 bg-slate-900/75 backdrop-blur-md shadow-2xl overflow-hidden"
              >
                {/* FIRST IMAGE LARGE TOP */}
                {report.images.length > 0 && (
                  <div className="w-full">
                    <img
                      src={report.images[0]}
                      alt={report.title}
                      onClick={() =>
                        setSelectedImage(report.images[0])
                      }
                      className="w-full h-[420px] object-cover cursor-pointer hover:scale-[1.01] transition duration-300"
                    />
                  </div>
                )}

                <div className="p-6 md:p-8 space-y-8">
                  {/* TITLE */}
                  <div className="space-y-3 border-b border-slate-700 pb-5">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      {report.title}
                    </h2>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                      {published && (
                        <span>
                          Published: {published}
                        </span>
                      )}

                      {report.authorName && (
                        <span>
                          By: {report.authorName}
                          {report.authorTitle
                            ? ` (${report.authorTitle})`
                            : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="space-y-5 text-slate-100 leading-8 text-[1.08rem]">
                    {(paragraphs.length > 0
                      ? paragraphs
                      : [report.content]
                    ).map((paragraph, index) => (
                      <p
                        key={`${report.id}-p-${index}`}
                        className="whitespace-pre-line"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* GALLERY */}
                  {report.images.length > 1 && (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-cyan-300">
                        Report Gallery
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {report.images
                          .slice(1)
                          .map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt={`${report.title} image ${i + 2}`}
                              onClick={() =>
                                setSelectedImage(img)
                              }
                              className="rounded-2xl w-full h-60 object-cover border border-slate-700 cursor-pointer hover:scale-[1.02] transition duration-300"
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  {/* LINKS */}
                  {report.links.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                        Reference Links
                      </h3>

                      <div className="flex flex-wrap gap-3">
                        {report.links.map((link, idx) => (
                          <a
                            key={`${link.url}-${idx}`}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-xl border border-cyan-500/50 px-4 py-3 text-sm text-cyan-200 hover:bg-cyan-500/10 transition"
                          >
                            {link.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* COMMENT FORM */}
                  <CommentForm reportId={report.id} />
                </div>
              </article>
            );
          })}

        {/* PAGINATION */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() =>
                setPage((p) => Math.max(1, p - 1))
              }
              disabled={safePage === 1}
              className="px-5 py-3 rounded-xl border border-slate-600 bg-slate-900/70 disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-slate-300">
              Page {safePage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setPage((p) =>
                  Math.min(totalPages, p + 1),
                )
              }
              disabled={safePage === totalPages}
              className="px-5 py-3 rounded-xl border border-slate-600 bg-slate-900/70 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl w-full"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-14 right-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
            >
              Close
            </button>

            <img
              src={selectedImage}
              alt="Preview"
              className="w-full max-h-[90vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </main>
  );
}

function CommentForm({
  reportId,
}: {
  reportId: string;
}) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitting, setSubmitting] =
    useState(false);

  const [status, setStatus] = useState<string | null>(
    null,
  );

  const submit = async () => {
    if (
      !form.name.trim() ||
      !form.message.trim()
    ) {
      setStatus("Name and comment are required.");
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(
        "/api/comments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reportId,
            ...form,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed");
      }

      setStatus(
        "Comment submitted successfully.",
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      setOpen(false);
    } catch {
      setStatus(
        "Could not submit comment. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-slate-700 pt-6">
      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-xl transition"
      >
        {open
          ? "Close Comment Form"
          : "Leave a Comment"}
      </button>

      {/* FORM */}
      {open && (
        <div className="mt-5 space-y-4 rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
          <h3 className="font-semibold text-2xl">
            Leave a Comment
          </h3>

          <div className="grid gap-3 md:grid-cols-3">
            <input
              placeholder="Name"
              className="border border-slate-600 bg-slate-950 p-3 rounded-xl w-full"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <input
              placeholder="Email"
              className="border border-slate-600 bg-slate-950 p-3 rounded-xl w-full"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <input
              placeholder="Phone"
              className="border border-slate-600 bg-slate-950 p-3 rounded-xl w-full"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />
          </div>

          <textarea
            placeholder="Comment"
            className="border border-slate-600 bg-slate-950 p-3 rounded-xl w-full h-32"
            value={form.message}
            onChange={(e) =>
              setForm({
                ...form,
                message: e.target.value,
              })
            }
          />

          <button
            onClick={submit}
            disabled={submitting}
            className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white px-5 py-3 rounded-xl"
          >
            {submitting
              ? "Submitting..."
              : "Submit Comment"}
          </button>

          {status && (
            <p className="text-sm text-slate-300">
              {status}
            </p>
          )}
        </div>
      )}
    </div>
  );
}