import { dateInRange, daysBetween, formatDateLabel, formatDateRange, inclusiveDays, parseDateOnly, startOfDay } from "@/lib/dateUtils";

export type EventStatus = "UPCOMING" | "TODAY" | "ONGOING" | "COMPLETED";

export interface ChurchEvent {
  id: string;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  venue: string;
  participants: string;
  speakers: string[];
  churches: string[];
  description?: string;
  bannerUrl?: string;
  pdfUrl?: string;
  createdAt?: Date | null;
}

type EventLike = Partial<ChurchEvent> & {
  [key: string]: unknown;
};

export function normalizeEvent(input: EventLike, fallbackId = ""): ChurchEvent {
  const startDate = normalizeDateInput(input.startDate);
  const endDate = normalizeDateInput(input.endDate) || startDate;

  return {
    id: asText(input.id) || fallbackId,
    title: asText(input.title),
    type: asText(input.type) || "GENERAL",
    startDate,
    endDate,
    venue: asText(input.venue),
    participants: asText(input.participants),
    speakers: toStringArray(input.speakers),
    churches: toStringArray(input.churches),
    description: cleanOptional(asText(input.description)),
    bannerUrl: cleanOptional(asText(input.bannerUrl)),
    pdfUrl: cleanOptional(asText(input.pdfUrl)),
    createdAt: normalizeCreatedAt(input.createdAt),
  };
}

export function getEventStatus(event: ChurchEvent, referenceDate = new Date()): EventStatus {
  const start = parseDateOnly(event.startDate);
  const end = parseDateOnly(event.endDate);

  if (!start || !end) return "UPCOMING";

  const today = startOfDay(referenceDate).getTime();
  const startMs = start.getTime();
  const endMs = end.getTime();

  if (today < startMs) return "UPCOMING";
  if (today > endMs) return "COMPLETED";

  if (startMs === endMs) {
    return "TODAY";
  }

  return "ONGOING";
}

export function getTotalProgramDays(event: ChurchEvent): number {
  const start = parseDateOnly(event.startDate);
  const end = parseDateOnly(event.endDate);
  if (!start || !end) return 1;
  return inclusiveDays(start, end);
}

export function getCurrentProgramDay(event: ChurchEvent, referenceDate = new Date()): number | null {
  const start = parseDateOnly(event.startDate);
  const end = parseDateOnly(event.endDate);
  if (!start || !end) return null;

  const today = startOfDay(referenceDate);
  if (today < start || today > end) return null;

  return daysBetween(start, today) + 1;
}

export function getEventsForDate(events: ChurchEvent[], date: Date): ChurchEvent[] {
  return events.filter((event) => dateInRange(date, event.startDate, event.endDate));
}

export function buildSmartAnnouncement(event: ChurchEvent, referenceDate = new Date()): string {
  const status = getEventStatus(event, referenceDate);
  const start = parseDateOnly(event.startDate);
  const totalDays = getTotalProgramDays(event);

  if (!start) {
    return `Upcoming: ${event.title}.`;
  }

  const locationPart = event.venue ? ` in ${event.venue}` : "";
  const churchesPart = buildChurchesLine(event.churches);

  if (status === "UPCOMING") {
    const remainingDays = daysBetween(referenceDate, start);

    if (isLikelySabbath(event) && remainingDays <= 7) {
      return appendChurches(
        `This coming Sabbath is ${event.title}${locationPart}. Kindly attend.`,
        churchesPart,
      );
    }

    if (remainingDays >= 7 && remainingDays % 7 === 0) {
      const weeks = remainingDays / 7;
      const weekLabel = weeks === 1 ? "One week" : `${weeks} weeks`;
      const programLabel = totalDays > 1 ? ` (${totalDays}-day program)` : "";
      return appendChurches(
        `${weekLabel} remaining to ${event.title}${programLabel}.`,
        churchesPart,
      );
    }

    if (remainingDays === 1) {
      return appendChurches(
        `Tomorrow we begin ${event.title}${locationPart}. Kindly prepare to attend.`,
        churchesPart,
      );
    }

    return appendChurches(
      `Upcoming: ${event.title} starts ${formatDateLabel(start)}${locationPart}.`,
      churchesPart,
    );
  }

  if (status === "TODAY") {
    return appendChurches(
      `Today is ${event.title}${locationPart}. Kindly attend.`,
      churchesPart,
    );
  }

  if (status === "ONGOING") {
    const currentDay = getCurrentProgramDay(event, referenceDate);

    if (currentDay && totalDays > 1) {
      if (currentDay === 1) {
        return appendChurches(
          `Day 1 of ${event.title}${locationPart} has begun. Kindly attend.`,
          churchesPart,
        );
      }

      return appendChurches(
        `Day ${currentDay} of ${event.title}${locationPart} is ongoing. Kindly attend.`,
        churchesPart,
      );
    }

    return appendChurches(
      `Ongoing: ${event.title}${locationPart} - spiritual sessions in progress.`,
      churchesPart,
    );
  }

  return appendChurches(
    `Completed: ${event.title} concluded on ${formatDateLabel(event.endDate)}.`,
    churchesPart,
  );
}

export function sortEvents(events: ChurchEvent[]): ChurchEvent[] {
  return [...events].sort((a, b) => {
    const left = parseDateOnly(a.startDate)?.getTime() ?? 0;
    const right = parseDateOnly(b.startDate)?.getTime() ?? 0;
    return left - right;
  });
}

export function buildExportLines(events: ChurchEvent[], header: string): string[] {
  const lines: string[] = [header, "", `Generated: ${new Date().toLocaleString("en-US")}`, ""];

  if (events.length === 0) {
    lines.push("No events found for the selected range.");
    return lines;
  }

  sortEvents(events).forEach((event, index) => {
    lines.push(`${index + 1}. ${event.title} [${event.type}]`);
    lines.push(`Dates: ${formatDateRange(event.startDate, event.endDate)}`);
    lines.push(`Venue: ${event.venue || "Not specified"}`);
    lines.push(`Participants: ${event.participants || "Not specified"}`);

    if (event.speakers.length > 0) {
      lines.push(`Speakers: ${event.speakers.join(", ")}`);
    }

    if (event.churches.length > 0) {
      lines.push(`Churches: ${event.churches.join(", ")}`);
    }

    if (event.description) {
      lines.push(`Description: ${stripLineBreaks(event.description)}`);
    }

    lines.push("");
  });

  return lines;
}

export function buildPdfBlob(lines: string[]): Blob {
  const chunks = chunkLines(lines, 46);

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

  const highestObject = fontObjectNumber;

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  for (let i = 1; i <= highestObject; i += 1) {
    offsets[i] = pdf.length;
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${highestObject + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let i = 1; i <= highestObject; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${highestObject + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

function buildPdfStream(lines: string[]): string {
  const startX = 48;
  const startY = 760;
  const lineHeight = 15;

  let stream = "BT\n/F1 11 Tf\n";
  stream += `${startX} ${startY} Td\n`;

  lines.forEach((line, index) => {
    if (index > 0) {
      stream += `0 -${lineHeight} Td\n`;
    }
    stream += `(${escapePdfText(line)}) Tj\n`;
  });

  stream += "ET";
  return stream;
}

function escapePdfText(value: string): string {
  return value
    .replace(/[^\x00-\x7F]/g, "?")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\r?\n/g, " ");
}

function chunkLines(lines: string[], maxLines: number): string[][] {
  const chunks: string[][] = [];

  for (let i = 0; i < lines.length; i += maxLines) {
    chunks.push(lines.slice(i, i + maxLines));
  }

  return chunks.length > 0 ? chunks : [["No content"]];
}

function normalizeDateInput(value: unknown): string {
  if (typeof value === "string" && parseDateOnly(value)) {
    return value;
  }

  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return "";
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return splitList(value);
  }

  return [];
}

export function splitList(value: string): string[] {
  return value
    .split(/[\n,]/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeCreatedAt(value: unknown): Date | null {
  if (value instanceof Date) return value;

  if (isTimestampLike(value)) {
    return value.toDate();
  }

  return null;
}

function isTimestampLike(value: unknown): value is { toDate: () => Date } {
  return Boolean(value && typeof value === "object" && "toDate" in value && typeof (value as { toDate?: unknown }).toDate === "function");
}

function cleanOptional(value: string): string | undefined {
  return value ? value : undefined;
}

function isLikelySabbath(event: ChurchEvent): boolean {
  return event.title.toUpperCase().includes("SABBATH") || event.type.toUpperCase().includes("SABBATH");
}

function buildChurchesLine(churches: string[]): string {
  if (churches.length === 0) return "";
  if (churches.length === 1) return `Church in ${churches[0]} is participating.`;
  return `Churches in ${churches.join(", ")} are participating.`;
}

function appendChurches(base: string, churchesLine: string): string {
  return churchesLine ? `${base} ${churchesLine}` : base;
}

function stripLineBreaks(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}
