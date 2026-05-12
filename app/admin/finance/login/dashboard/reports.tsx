"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

import { useFinanceRealtimeData } from "@/hooks/useFinanceRealtimeData";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { buildFinancePdf, downloadPdfReport, ReportScope } from "@/lib/pdfGenerator";

type ReportLink = {
  title: string;
  url: string;
};

type PublicReport = {
  id: string;
  title: string;
  content: string;
  images: string[];
  links: ReportLink[];
  donationLinks?: string;
  authorName?: string;
  authorTitle?: string;
  publishedDate?: string | null;
  createdAt?: string | null;
};

const MAX_REPORT_IMAGES = 6;

function toInputDate(value?: string | null): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function serializeLinks(links: ReportLink[]): string {
  return links.map((link) => `${link.title}|${link.url}`).join("\n");
}

function parseLinks(raw: string): ReportLink[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...urlParts] = line.split("|");
      return {
        title: (title || "").trim(),
        url: urlParts.join("|").trim(),
      };
    })
    .filter((entry) => entry.title && entry.url);
}

export default function FinanceReportsView() {
  const { conferences, regions, churches, transactions } = useFinanceRealtimeData({ includeReceipts: false });

  const [scope, setScope] = useState<ReportScope>("annual");
  const [conferenceId, setConferenceId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [churchId, setChurchId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [reports, setReports] = useState<PublicReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorTitle, setAuthorTitle] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [donationLinks, setDonationLinks] = useState("");
  const [linksInput, setLinksInput] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (scope === "conference" && conferenceId && tx.conferenceId !== conferenceId) return false;
      if (scope === "region" && regionId && tx.regionId !== regionId) return false;
      if (scope === "church" && churchId && tx.churchId !== churchId) return false;

      if (startDate && tx.createdAt && tx.createdAt < new Date(`${startDate}T00:00:00`)) return false;
      if (endDate && tx.createdAt && tx.createdAt > new Date(`${endDate}T23:59:59`)) return false;

      return true;
    });
  }, [transactions, scope, conferenceId, regionId, churchId, startDate, endDate]);

  const summary = useMemo(() => {
    const confirmed = filtered.filter((tx) => tx.status === "confirmed");
    const pending = filtered.filter((tx) => tx.status === "pending");

    const result = {
      tithe1: 0,
      tithe2: 0,
      offering: 0,
      donation: 0,
      campaign: 0,
      total: 0,
      confirmedCount: confirmed.length,
      pendingCount: pending.length,
      onlineTotal: 0,
      manualTotal: 0,
    };

    confirmed.forEach((tx) => {
      result[tx.type] += tx.amount;
      result.total += tx.amount;
      if (tx.source === "online") result.onlineTotal += tx.amount;
      if (tx.source === "manual") result.manualTotal += tx.amount;
    });

    return result;
  }, [filtered]);

  const rows = useMemo(() => {
    const grouped = new Map<string, typeof summary>();

    filtered
      .filter((tx) => tx.status === "confirmed")
      .forEach((tx) => {
        const label =
          scope === "church"
            ? churches.find((church) => church.id === tx.churchId)?.name || "Visitor / Other"
            : scope === "region"
              ? regions.find((region) => region.id === tx.regionId)?.name || "Visitor / Other"
              : scope === "conference"
                ? conferences.find((conference) => conference.id === tx.conferenceId)?.name || "Visitor / Other"
                : tx.createdAt?.toLocaleDateString("en-KE") || "Unknown";

        const seed = grouped.get(label) || {
          tithe1: 0,
          tithe2: 0,
          offering: 0,
          donation: 0,
          campaign: 0,
          total: 0,
          confirmedCount: 0,
          pendingCount: 0,
          onlineTotal: 0,
          manualTotal: 0,
        };

        seed[tx.type] += tx.amount;
        seed.total += tx.amount;
        grouped.set(label, seed);
      });

    return Array.from(grouped.entries()).map(([label, value]) => ({
      label,
      tithe1: value.tithe1,
      tithe2: value.tithe2,
      offering: value.offering,
      donation: value.donation,
      campaign: value.campaign,
      total: value.total,
    }));
  }, [filtered, scope, churches, regions, conferences]);

  const exportPdf = () => {
    const blob = buildFinancePdf({
      title: "Church Financial Report",
      scope,
      subtitle: `${scope.toUpperCase()} | ${startDate || "All time"} - ${endDate || "Now"}`,
      summary,
      rows,
      confirmedCount: summary.confirmedCount,
      pendingCount: summary.pendingCount,
      onlineTotal: summary.onlineTotal,
      manualTotal: summary.manualTotal,
    });

    downloadPdfReport(blob, `finance-report-${scope}.pdf`);
  };

  const loadReports = async () => {
    setReportsLoading(true);
    setReportsError(null);

    try {
      const response = await fetch("/api/reports", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load reports");
      const payload = (await response.json()) as PublicReport[];
      setReports(payload);
    } catch (error) {
      console.error(error);
      setReportsError("Failed to load public reports.");
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setAuthorName("");
    setAuthorTitle("");
    setPublishedDate("");
    setDonationLinks("");
    setLinksInput("");
    setImageUrls([]);
    setStatusMessage(null);
  };

  const editReport = (report: PublicReport) => {
    setEditingId(report.id);
    setTitle(report.title || "");
    setContent(report.content || "");
    setAuthorName(report.authorName || "");
    setAuthorTitle(report.authorTitle || "");
    setPublishedDate(toInputDate(report.publishedDate || report.createdAt || null));
    setDonationLinks(report.donationLinks || "");
    setLinksInput(serializeLinks(report.links || []));
    setImageUrls(Array.isArray(report.images) ? report.images.slice(0, MAX_REPORT_IMAGES) : []);
    setStatusMessage(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteReport = async (report: PublicReport) => {
    const confirmed = window.confirm(`Delete report \"${report.title}\"?`);
    if (!confirmed) return;

    try {
      const params = new URLSearchParams({ id: report.id });
      (report.images || []).forEach((image) => {
        params.append("image", image);
      });

      const response = await fetch(`/api/reports?${params.toString()}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete report");

      if (editingId === report.id) resetForm();
      await loadReports();
      setStatusMessage("Report deleted.");
    } catch (error) {
      console.error(error);
      setStatusMessage("Unable to delete report.");
    }
  };

  const saveReport = async () => {
    if (!title.trim() || !content.trim()) {
      setStatusMessage("Title and report content are required.");
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    try {
      const body = {
        id: editingId || undefined,
        title: title.trim(),
        content: content.trim(),
        authorName: authorName.trim(),
        authorTitle: authorTitle.trim(),
        publishedDate: publishedDate || undefined,
        donationLinks: donationLinks.trim(),
        links: parseLinks(linksInput),
        images: imageUrls.slice(0, MAX_REPORT_IMAGES),
      };

      const response = await fetch("/api/reports", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to save report");

      await loadReports();
      resetForm();
      setStatusMessage(editingId ? "Report updated successfully." : "Report published successfully.");
    } catch (error) {
      console.error(error);
      setStatusMessage("Unable to save report.");
    } finally {
      setSaving(false);
    }
  };

  const handleImagesSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (imageUrls.length >= MAX_REPORT_IMAGES) {
      setStatusMessage(`Only ${MAX_REPORT_IMAGES} images are allowed per report.`);
      event.target.value = "";
      return;
    }

    const availableSlots = MAX_REPORT_IMAGES - imageUrls.length;
    const fileBatch = Array.from(files).slice(0, availableSlots);

    setUploadingImages(true);
    setStatusMessage(null);

    try {
      const uploaded = await Promise.all(fileBatch.map((file) => uploadToCloudinary(file)));
      setImageUrls((prev) => [...prev, ...uploaded].slice(0, MAX_REPORT_IMAGES));
      if (files.length > availableSlots) {
        setStatusMessage(`Only ${MAX_REPORT_IMAGES} images are allowed. Extra files were ignored.`);
      }
    } catch (error) {
      console.error(error);
      setStatusMessage("One or more images failed to upload.");
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  };

  const removeImage = (url: string) => {
    setImageUrls((prev) => prev.filter((entry) => entry !== url));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Reports</h2>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Financial PDF Reports</h3>

        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          <label className="block text-sm font-medium text-slate-700">
            <span>Scope</span>
            <select value={scope} onChange={(event) => setScope(event.target.value as ReportScope)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
              <option value="church">Church report</option>
              <option value="region">Region report</option>
              <option value="conference">Conference report</option>
              <option value="annual">Full annual report</option>
            </select>
          </label>

          <FilterSelect label="Conference" value={conferenceId} onChange={setConferenceId} options={conferences.map((conference) => ({ id: conference.id, label: conference.name }))} />
          <FilterSelect label="Region" value={regionId} onChange={setRegionId} options={regions.map((region) => ({ id: region.id, label: region.name }))} />
          <FilterSelect label="Church" value={churchId} onChange={setChurchId} options={churches.map((church) => ({ id: church.id, label: church.name }))} />

          <label className="block text-sm font-medium text-slate-700"><span>From</span><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
          <label className="block text-sm font-medium text-slate-700"><span>To</span><input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        </div>

        <button type="button" onClick={exportPdf} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Export PDF</button>
      </section>

      {rows.length > 0 && (
        <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-2">Label</th>
                <th className="px-3 py-2">Tithe1</th>
                <th className="px-3 py-2">Tithe2</th>
                <th className="px-3 py-2">Offering</th>
                <th className="px-3 py-2">Donation</th>
                <th className="px-3 py-2">Campaign</th>
                <th className="px-3 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.label}</td>
                  <td className="px-3 py-2">{format(row.tithe1)}</td>
                  <td className="px-3 py-2">{format(row.tithe2)}</td>
                  <td className="px-3 py-2">{format(row.offering)}</td>
                  <td className="px-3 py-2">{format(row.donation)}</td>
                  <td className="px-3 py-2">{format(row.campaign)}</td>
                  <td className="px-3 py-2 font-semibold">{format(row.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Public Written Reports</h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
            >
              Cancel Editing
            </button>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            <span>Report Title</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Quarterly Mission Progress Report" />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            <span>Publish Date</span>
            <input type="date" value={publishedDate} onChange={(event) => setPublishedDate(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            <span>Published By (Name)</span>
            <input value={authorName} onChange={(event) => setAuthorName(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Elder John Doe" />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            <span>Publisher Title</span>
            <input value={authorTitle} onChange={(event) => setAuthorTitle(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Finance Director" />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          <span>Report Body</span>
          <textarea value={content} onChange={(event) => setContent(event.target.value)} className="mt-1 h-56 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Write the full report here..." />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            <span>Reference Links (one per line as: title|url)</span>
            <textarea value={linksInput} onChange={(event) => setLinksInput(event.target.value)} className="mt-1 h-24 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Mission Album|https://example.com/album" />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            <span>Donation / CTA Links (optional)</span>
            <textarea value={donationLinks} onChange={(event) => setDonationLinks(event.target.value)} className="mt-1 h-24 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Any extra giving info or links" />
          </label>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-700">Images ({imageUrls.length}/{MAX_REPORT_IMAGES})</p>
            <label className="inline-flex cursor-pointer rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
              {uploadingImages ? "Uploading..." : "Add Images"}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesSelected}
                className="hidden"
                disabled={uploadingImages || imageUrls.length >= MAX_REPORT_IMAGES}
              />
            </label>
          </div>

          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {imageUrls.map((image) => (
                <div key={image} className="space-y-2 rounded-lg border border-slate-200 p-2">
                  <img src={image} alt="Report upload" className="h-24 w-full rounded object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    className="w-full rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveReport}
            disabled={saving || uploadingImages}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update Report" : "Publish Report"}
          </button>
        </div>

        {statusMessage && <p className="text-sm text-slate-600">{statusMessage}</p>}
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Published Reports</h3>

        {reportsLoading && <p className="text-sm text-slate-600">Loading reports...</p>}
        {reportsError && <p className="text-sm text-red-600">{reportsError}</p>}

        {!reportsLoading && !reportsError && reports.length === 0 && (
          <p className="text-sm text-slate-500">No reports published yet.</p>
        )}

        {!reportsLoading && !reportsError && reports.length > 0 && (
          <div className="space-y-3">
            {reports.map((report) => (
              <article key={report.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">{report.title}</h4>
                    <p className="text-xs text-slate-500">
                      {report.authorName || "Unknown publisher"}
                      {report.authorTitle ? ` (${report.authorTitle})` : ""}
                      {report.publishedDate ? ` • ${new Date(report.publishedDate).toLocaleDateString("en-KE")}` : ""}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editReport(report)}
                      className="rounded border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteReport(report)}
                      className="rounded border border-red-200 px-3 py-1 text-xs font-medium text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{report.content}</p>

                {report.images.length > 0 && (
                  <p className="mt-2 text-xs text-slate-500">{report.images.length} image(s)</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ id: string; label: string }>;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function format(value: number): string {
  return `KES ${value.toLocaleString("en-KE")}`;
}
