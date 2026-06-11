import { MongoServerError } from "mongodb";
import type { Signup } from "#shared/types/signup";
import type { WithoutId } from "#shared/types/utils";
import { getDb } from "../../../db";
import { requireEventForAssociation } from "../../../utils/event";
import { requireActiveMember } from "../../../utils/membership";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const membership = requireActiveMember(event);
  const found = await requireEventForAssociation(event);

  const db = await getDb();

  try {
    await db.collection<WithoutId<Signup>>("signups").insertOne({
      eventId: found._id,
      userId: membership.userId,
      createdAt: new Date(),
    });
  } catch (err) {
    // Unique index on (eventId, userId) — already signed up is a no-op.
    if (!(err instanceof MongoServerError && err.code === 11000)) {
      throw err;
    }
  }

  return { success: true };
});
