"use client";

import { useEffect, useMemo, useState } from "react";

type ReportComment = {
  id: string;
  reportId?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  createdAt?: { seconds?: number } | string | null;
};

type ReportSummary = {
  id: string;
  title: string;
};

function formatDate(value: ReportComment["createdAt"]): string {
  if (!value) return "-";

  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" });
    }
  }

  if (typeof value === "object" && typeof value.seconds === "number") {
    return new Date(value.seconds * 1000).toLocaleString("en-KE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return "-";
}

export default function FinanceReportCommentsView() {
  const [comments, setComments] = useState<ReportComment[]>([]);
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const [commentsRes, reportsRes] = await Promise.all([
          fetch("/api/comments", { cache: "no-store" }),
          fetch("/api/reports", { cache: "no-store" }),
        ]);

        if (!commentsRes.ok) throw new Error("Failed to load report comments.");
        if (!reportsRes.ok) throw new Error("Failed to load reports.");

        const commentsPayload = (await commentsRes.json()) as ReportComment[];
        const reportsPayload = (await reportsRes.json()) as ReportSummary[];

        setComments(commentsPayload);
        setReports(reportsPayload);
      } catch (loadError) {
        console.error(loadError);
        setError("Unable to load report comments.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const reportMap = useMemo(() => {
    const map = new Map<string, string>();
    reports.forEach((report) => {
      map.set(report.id, report.title);
    });
    return map;
  }, [reports]);

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">Report Comments</h2>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Loading comments...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && comments.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          No report comments received yet.
        </div>
      )}

      {!loading && !error && comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <article key={comment.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">{comment.name || "Anonymous"}</h3>
                <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
              </div>

              <p className="mt-2 text-sm text-slate-600">
                Report:{" "}
                <span className="font-medium text-slate-800">
                  {comment.reportId ? reportMap.get(comment.reportId) || "Unknown report" : "Unknown report"}
                </span>
              </p>

              <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-600">
                <span>Email: {comment.email?.trim() || "-"}</span>
                <span>Phone: {comment.phone?.trim() || "-"}</span>
              </div>

              <p className="mt-4 whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">
                {comment.message || ""}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
