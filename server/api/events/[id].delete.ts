import type { Event } from "#shared/types/event";
import type { Signup } from "#shared/types/signup";
import { getDb } from "../../db";
import { requireEventForAssociation } from "../../utils/event";
import { requireAdmin } from "../../utils/membership";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  requireAdmin(event);
  const existing = await requireEventForAssociation(event);

  const db = await getDb();
  await db.collection<Signup>("signups").deleteMany({ eventId: existing._id });
  await db.collection<Event>("events").deleteOne({ _id: existing._id });

  return { success: true };
});
