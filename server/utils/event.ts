import type { H3Event } from "h3";
import { ObjectId } from "mongodb";
import { z } from "zod";
import type { Event } from "#shared/types/event";
import { getDb } from "../db";
import { requireAssociation } from "./association";

/**
 * Request body for creating or replacing an event. Optional fields arrive as
 * empty strings from the admin form; treat those as "unset".
 */
export const eventBodySchema = z
  .object({
    type: z.enum(["dig", "ride", "meeting"]),
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(2000).optional(),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date().nullable().optional(),
    location: z.string().trim().max(200).optional(),
  })
  .refine((body) => !body.endsAt || body.endsAt > body.startsAt, {
    message: "End time must be after the start time.",
  });

/**
 * Load the event referenced by the `id` route param, scoped to the active
 * association. Throws a 404 when the id is malformed, the event doesn't
 * exist, or it belongs to a different association.
 */
export async function requireEventForAssociation(
  event: H3Event,
): Promise<Event> {
  const association = requireAssociation(event);

  const { id } = event.context.params as { id: string };
  if (!ObjectId.isValid(id)) {
    throw createError({ statusCode: 404, message: "Event not found" });
  }

  const db = await getDb();
  const found = await db.collection<Event>("events").findOne({
    _id: new ObjectId(id),
    associationId: association._id,
  });

  if (!found) {
    throw createError({ statusCode: 404, message: "Event not found" });
  }

  return found;
}

/** Shape an `Event` document for API responses. */
export function serializeEvent(doc: Event) {
  return {
    id: doc._id.toString(),
    type: doc.type,
    title: doc.title,
    description: doc.description ?? null,
    startsAt: doc.startsAt,
    endsAt: doc.endsAt ?? null,
    location: doc.location ?? null,
    createdAt: doc.createdAt,
  };
}
