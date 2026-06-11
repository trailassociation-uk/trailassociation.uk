import type { Signup } from "#shared/types/signup";
import { getDb } from "../../db";
import { requireEventForAssociation, serializeEvent } from "../../utils/event";

export default defineEventHandler(async (event) => {
  const found = await requireEventForAssociation(event);

  const db = await getDb();
  const signups = await db
    .collection<Signup>("signups")
    .find({ eventId: found._id })
    .project<Pick<Signup, "userId">>({ userId: 1 })
    .toArray();

  const session = await getUserSession(event);
  const currentUserId = session.user?.id ?? null;

  return {
    event: serializeEvent(found),
    attendeeCount: signups.length,
    attending: currentUserId
      ? signups.some((s) => s.userId.toString() === currentUserId)
      : false,
  };
});
