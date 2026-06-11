import { ObjectId } from "mongodb";
import { z } from "zod";
import type { Membership } from "#shared/types/membership";
import { getDb } from "../../../../db";
import { requireAssociation } from "../../../../utils/association";
import { requireAdmin } from "../../../../utils/membership";
import { parseBody } from "../../../../utils/validation";

const bodySchema = z.object({
  status: z.literal("active"),
});

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const association = requireAssociation(event);
  requireAdmin(event);

  const { userId } = event.context.params as { userId: string };
  const { status } = await parseBody(event, bodySchema);

  const db = await getDb();

  const existing = await db
    .collection<Membership>("memberships")
    .findOne({ userId: new ObjectId(userId), associationId: association._id });

  if (!existing) {
    throw createError({ statusCode: 404, message: "Member not found" });
  }

  if (existing.status === "active") {
    throw createError({ statusCode: 400, message: "Member is already active" });
  }

  await db
    .collection<Membership>("memberships")
    .updateOne(
      { userId: new ObjectId(userId), associationId: association._id },
      { $set: { status } },
    );

  return { success: true };
});
