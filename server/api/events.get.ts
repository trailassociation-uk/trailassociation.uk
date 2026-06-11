import type { Event } from "#shared/types/event";
import { getDb } from "../db";
import { requireAssociation } from "../utils/association";
import { serializeEvent } from "../utils/event";
import { requireAdmin } from "../utils/membership";

export default defineEventHandler(async (event) => {
  const association = requireAssociation(event);

  // Upcoming events are public; the full history is admin-only (used by the
  // event management page).
  const includePast = getQuery(event).all !== undefined;
  if (includePast) requireAdmin(event);

  const db = await getDb();
  const events = await db
    .collection<Event>("events")
    .find({
      associationId: association._id,
      ...(includePast ? {} : { startsAt: { $gte: new Date() } }),
    })
    .sort({ startsAt: includePast ? -1 : 1 })
    .toArray();

  return { events: events.map(serializeEvent) };
});
