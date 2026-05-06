"use client";

import { useMemo } from "react";

import { useFinanceRealtimeData } from "@/hooks/useFinanceRealtimeData";
import { summarizeTransactions } from "@/lib/financeEngine";

export default function FinanceDashboardView() {
  const { transactions, churches, regions, conferences, loading, error } = useFinanceRealtimeData({ includeReceipts: false });

  const confirmed = useMemo(() => transactions.filter((tx) => tx.status === "confirmed"), [transactions]);
  const summary = useMemo(() => summarizeTransactions(confirmed), [confirmed]);

  const byChurch = useMemo(() => {
    return churches
      .map((church) => {
        const records = confirmed.filter((tx) => tx.churchId === church.id);
        const row = summarizeTransactions(records);
        return {
          church: church.name,
          tithe: row.tithe1 + row.tithe2,
          offering: row.offering,
          donation: row.donation,
          campaign: row.campaign,
          total: row.total,
        };
      })
      .filter((row) => row.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [churches, confirmed]);

  const byRegion = useMemo(() => {
    return regions
      .map((region) => {
        const regionChurchIds = churches.filter((church) => church.regionId === region.id).map((church) => church.id);
        const records = confirmed.filter((tx) => tx.regionId === region.id);
        const row = summarizeTransactions(records);
        return {
          region: region.name,
          total: row.total,
          churchCount: regionChurchIds.length,
        };
      })
      .filter((row) => row.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [regions, churches, confirmed]);

  const byConference = useMemo(() => {
    return conferences
      .map((conference) => {
        const records = confirmed.filter((tx) => tx.conferenceId === conference.id);
        const row = summarizeTransactions(records);
        return {
          conference: conference.name,
          total: row.total,
        };
      })
      .filter((row) => row.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [conferences, confirmed]);

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">Finance Dashboard</h2>

      {loading && <p className="text-sm text-slate-600">Loading finance data...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card label="First Tithe" value={summary.tithe1} />
        <Card label="Second Tithe" value={summary.tithe2} />
        <Card label="Offering" value={summary.offering} />
        <Card label="Donations" value={summary.donation} />
        <Card label="Campaign Funds" value={summary.campaign} />
        <Card label="Grand Total" value={summary.total} emphasized />
      </section>

      {byChurch.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">By Church</h3>
          <SimpleTable
            headers={["Church", "Tithe", "Offering", "Donation", "Campaign", "Total"]}
            rows={byChurch.map((row) => [
              row.church,
              currency(row.tithe),
              currency(row.offering),
              currency(row.donation),
              currency(row.campaign),
              currency(row.total),
            ])}
          />
        </section>
      )}

      {byRegion.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">By Region</h3>
          <SimpleTable
            headers={["Region", "Total Income", "# Churches"]}
            rows={byRegion.map((row) => [row.region, currency(row.total), String(row.churchCount)])}
          />
        </section>
      )}

      {byConference.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">By Conference</h3>
          <SimpleTable
            headers={["Conference", "Total Income"]}
            rows={byConference.map((row) => [row.conference, currency(row.total)])}
          />
        </section>
      )}
    </div>
  );
}

function Card({ label, value, emphasized = false }: { label: string; value: number; emphasized?: boolean }) {
  return (
    <article className={`rounded-2xl border p-4 ${emphasized ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"}`}>
      <p className={`text-sm ${emphasized ? "text-slate-200" : "text-slate-500"}`}>{label}</p>
      <p className="mt-2 text-2xl font-bold">KES {value.toLocaleString("en-KE")}</p>
    </article>
  );
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-100">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-3 py-2 font-semibold text-slate-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-slate-200">
              {row.map((cell, cellIndex) => (
                <td key={`${index}-${cellIndex}`} className="px-3 py-2 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function currency(value: number): string {
  return `KES ${value.toLocaleString("en-KE")}`;
}

