import type { EventType } from "#shared/types/event";

/** An event as returned by the `/api/events` endpoints. */
export interface ApiEvent {
  id: string;
  type: EventType;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  createdAt: string;
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  dig: "Dig day",
  ride: "Ride",
  meeting: "Meeting",
};

/** Convert an ISO date string into a `datetime-local` input value. */
export function toDatetimeLocal(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Convert a `datetime-local` input value to an ISO string, `null` if empty. */
export function fromDatetimeLocal(value: string): string | null {
  return value ? new Date(value).toISOString() : null;
}

/** Format an ISO date for display, e.g. "Sat 14 Jun 2026, 10:00". */
export function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
