import type { Signup } from "#shared/types/signup";
import { getDb } from "../../../db";
import { requireEventForAssociation } from "../../../utils/event";
import { requireActiveMember } from "../../../utils/membership";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const membership = requireActiveMember(event);
  const found = await requireEventForAssociation(event);

  const db = await getDb();
  await db.collection<Signup>("signups").deleteOne({
    eventId: found._id,
    userId: membership.userId,
  });

  return { success: true };
});
