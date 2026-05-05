"use client";

import { useMemo, useState } from "react";

import { useFinanceRealtimeData } from "@/hooks/useFinanceRealtimeData";
import { buildFinancePdf, downloadPdfReport, ReportScope } from "@/lib/pdfGenerator";

export default function FinanceReportsView() {
  const { conferences, regions, churches, transactions } = useFinanceRealtimeData();

  const [scope, setScope] = useState<ReportScope>("annual");
  const [conferenceId, setConferenceId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [churchId, setChurchId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">Reports</h2>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
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
