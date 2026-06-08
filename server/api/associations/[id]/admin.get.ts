import type { Membership } from "#shared/types/membership";
import { getDb } from "../../../db";
import { requireAdmin } from "../../../utils/membership";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const association = event.context.association;
  if (!association) {
    throw createError({ statusCode: 404, message: "Association not found" });
  }

  requireAdmin(event);

  const db = await getDb();

  const [activeCount, pendingCount] = await Promise.all([
    db
      .collection<Membership>("memberships")
      .countDocuments({ associationId: association._id, status: "active" }),
    db
      .collection<Membership>("memberships")
      .countDocuments({ associationId: association._id, status: "pending" }),
  ]);

  return { activeCount, pendingCount };
});
