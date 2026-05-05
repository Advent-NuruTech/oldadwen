import { EventStatus } from "@/lib/eventEngine";

const badgeStyles: Record<EventStatus, string> = {
  UPCOMING: "bg-blue-100 text-blue-800 border-blue-200",
  TODAY: "bg-amber-100 text-amber-800 border-amber-200",
  ONGOING: "bg-green-100 text-green-800 border-green-200",
  COMPLETED: "bg-slate-100 text-slate-700 border-slate-200",
};

interface EventStatusBadgeProps {
  status: EventStatus;
}

export default function EventStatusBadge({ status }: EventStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${badgeStyles[status]}`}
    >
      {status}
    </span>
  );
}
