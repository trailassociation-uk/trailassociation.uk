import type { Event } from "#shared/types/event";
import type { Membership } from "#shared/types/membership";
import { getDb } from "../../../db";
import { requireAssociation } from "../../../utils/association";
import { requireAdmin } from "../../../utils/membership";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  requireAssociation(event);
  requireAdmin(event);

  const db = await getDb();

  const [activeCount, pendingCount, upcomingEventCount] = await Promise.all([
    db
      .collection<Membership>("memberships")
      .countDocuments({ associationId: association._id, status: "active" }),
    db
      .collection<Membership>("memberships")
      .countDocuments({ associationId: association._id, status: "pending" }),
    db.collection<Event>("events").countDocuments({
      associationId: association._id,
      startsAt: { $gte: new Date() },
    }),
  ]);

  return { activeCount, pendingCount, upcomingEventCount };
});
