import type { Event } from "#shared/types/event";
import type { WithoutId } from "#shared/types/utils";
import { getDb } from "../../db";
import {
  eventBodySchema,
  requireEventForAssociation,
  serializeEvent,
} from "../../utils/event";
import { requireAdmin } from "../../utils/membership";
import { parseBody } from "../../utils/validation";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  requireAdmin(event);
  const existing = await requireEventForAssociation(event);

  const body = await parseBody(event, eventBodySchema);

  const replacement: WithoutId<Event> = {
    associationId: existing.associationId,
    type: body.type,
    title: body.title,
    startsAt: body.startsAt,
    createdAt: existing.createdAt,
    createdBy: existing.createdBy,
  };
  if (body.description) replacement.description = body.description;
  if (body.endsAt) replacement.endsAt = body.endsAt;
  if (body.location) replacement.location = body.location;

  const db = await getDb();
  await db
    .collection<Event>("events")
    .replaceOne({ _id: existing._id }, replacement);

  return { event: serializeEvent({ _id: existing._id, ...replacement }) };
});
