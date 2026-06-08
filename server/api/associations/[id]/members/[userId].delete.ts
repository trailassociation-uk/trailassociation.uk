import { ObjectId } from "mongodb";
import type { Membership } from "#shared/types/membership";
import { getDb } from "../../../../db";
import { requireAdmin } from "../../../../utils/membership";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const association = event.context.association;
  if (!association) {
    throw createError({ statusCode: 404, message: "Association not found" });
  }

  requireAdmin(event);

  const { userId } = event.context.params as { userId: string };

  if (userId === user.id) {
    throw createError({ statusCode: 400, message: "You cannot remove yourself" });
  }

  const db = await getDb();

  const result = await db
    .collection<Membership>("memberships")
    .deleteOne({ userId: new ObjectId(userId), associationId: association._id });

  if (result.deletedCount === 0) {
    throw createError({ statusCode: 404, message: "Member not found" });
  }

  return { success: true };
});
