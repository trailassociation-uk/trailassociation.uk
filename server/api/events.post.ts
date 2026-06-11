import { ObjectId } from "mongodb";
import type { Event } from "#shared/types/event";
import type { WithoutId } from "#shared/types/utils";
import { getDb } from "../db";
import { requireAssociation } from "../utils/association";
import { eventBodySchema, serializeEvent } from "../utils/event";
import { requireAdmin } from "../utils/membership";
import { parseBody } from "../utils/validation";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const association = requireAssociation(event);
  requireAdmin(event);

  const body = await parseBody(event, eventBodySchema);

  const doc: WithoutId<Event> = {
    associationId: association._id,
    type: body.type,
    title: body.title,
    startsAt: body.startsAt,
    createdAt: new Date(),
    createdBy: new ObjectId(user.id),
  };
  if (body.description) doc.description = body.description;
  if (body.endsAt) doc.endsAt = body.endsAt;
  if (body.location) doc.location = body.location;

  const db = await getDb();
  const { insertedId } = await db
    .collection<WithoutId<Event>>("events")
    .insertOne(doc);

  return { event: serializeEvent({ _id: insertedId, ...doc }) };
});
