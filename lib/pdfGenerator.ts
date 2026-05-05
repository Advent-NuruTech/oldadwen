import { FinanceSummary, FinanceTransactionRecord } from "@/lib/financeTypes";

export type ReportScope = "church" | "region" | "conference" | "annual";

interface ReportBuildInput {
  title: string;
  scope: ReportScope;
  subtitle?: string;
  generatedAt?: Date;
  summary: FinanceSummary;
  rows: Array<{
    label: string;
    tithe1: number;
    tithe2: number;
    offering: number;
    donation: number;
    campaign: number;
    total: number;
  }>;
  confirmedCount: number;
  pendingCount: number;
  manualTotal: number;
  onlineTotal: number;
}

export function buildFinancePdf(input: ReportBuildInput): Blob {
  const generatedAt = (input.generatedAt || new Date()).toLocaleString("en-KE");

  const lines: string[] = [
    input.title,
    input.subtitle || `Scope: ${input.scope.toUpperCase()}`,
    `Generated: ${generatedAt}`,
    "",
    "Financial Summary",
    `First Tithe: KES ${formatAmount(input.summary.tithe1)}`,
    `Second Tithe: KES ${formatAmount(input.summary.tithe2)}`,
    `Offering: KES ${formatAmount(input.summary.offering)}`,
    `Donations: KES ${formatAmount(input.summary.donation)}`,
    `Campaign: KES ${formatAmount(input.summary.campaign)}`,
    `Grand Total (Confirmed): KES ${formatAmount(input.summary.total)}`,
    `Confirmed Transactions: ${input.confirmedCount}`,
    `Pending Transactions: ${input.pendingCount}`,
    `Online Total: KES ${formatAmount(input.onlineTotal)}`,
    `Manual Total: KES ${formatAmount(input.manualTotal)}`,
    "",
    "Breakdown",
    "Label | Tithe1 | Tithe2 | Offering | Donation | Campaign | Total",
  ];

  input.rows.forEach((row) => {
    lines.push(
      `${row.label} | ${formatAmount(row.tithe1)} | ${formatAmount(row.tithe2)} | ${formatAmount(row.offering)} | ${formatAmount(row.donation)} | ${formatAmount(row.campaign)} | ${formatAmount(row.total)}`,
    );
  });

  return buildPdfBlob(lines);
}

export function downloadPdfReport(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function summarizeReportRows(transactions: FinanceTransactionRecord[]) {
  const confirmed = transactions.filter((tx) => tx.status === "confirmed");
  const pending = transactions.length - confirmed.length;

  const summary = {
    tithe1: 0,
    tithe2: 0,
    offering: 0,
    donation: 0,
    campaign: 0,
    total: 0,
    confirmedCount: confirmed.length,
    pendingCount: pending,
    onlineTotal: 0,
    manualTotal: 0,
  };

  confirmed.forEach((tx) => {
    const amount = Number(tx.amount || 0);
    summary[tx.type] += amount;
    summary.total += amount;
    if (tx.source === "online") summary.onlineTotal += amount;
    if (tx.source === "manual") summary.manualTotal += amount;
  });

  return summary;
}

function buildPdfBlob(lines: string[]): Blob {
  const sanitized = lines.map((line) =>
    line
      .replace(/[^\x00-\x7F]/g, "?")
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
      .replace(/\r?\n/g, " "),
  );

  const chunks = chunkLines(sanitized, 46);
  const pageObjectStart = 3;
  const fontObjectNumber = pageObjectStart + chunks.length * 2;
  const objects: string[] = [];

  const pageRefs = chunks.map((_, index) => `${pageObjectStart + index * 2} 0 R`);

  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = `<< /Type /Pages /Kids [${pageRefs.join(" ")}] /Count ${chunks.length} >>`;

  chunks.forEach((pageLines, pageIndex) => {
    const pageObj = pageObjectStart + pageIndex * 2;
    const contentObj = pageObj + 1;
    const stream = buildPdfStream(pageLines);

    objects[pageObj] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontObjectNumber} 0 R >> >> /Contents ${contentObj} 0 R >>`;
    objects[contentObj] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });

  objects[fontObjectNumber] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

  const maxObject = fontObjectNumber;
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  for (let i = 1; i <= maxObject; i += 1) {
    offsets[i] = pdf.length;
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${maxObject + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let i = 1; i <= maxObject; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${maxObject + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

function buildPdfStream(lines: string[]): string {
  let stream = "BT\n/F1 10 Tf\n48 760 Td\n";

  lines.forEach((line, index) => {
    if (index > 0) stream += "0 -14 Td\n";
    stream += `(${line}) Tj\n`;
  });

  stream += "ET";
  return stream;
}

function chunkLines(lines: string[], maxLines: number): string[][] {
  if (lines.length === 0) return [["No data"]];
  const chunks: string[][] = [];
  for (let i = 0; i < lines.length; i += maxLines) {
    chunks.push(lines.slice(i, i + maxLines));
  }
  return chunks;
}

function formatAmount(value: number): string {
  return value.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
