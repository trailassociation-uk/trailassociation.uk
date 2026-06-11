import { MongoServerError, ObjectId } from "mongodb";
import type { Membership } from "#shared/types/membership";
import type { WithoutId } from "#shared/types/utils";
import { getDb } from "../../../db";
import { requireAssociation } from "../../../utils/association";
import { getCurrentMembership } from "../../../utils/membership";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const association = requireAssociation(event);

  const existing = await getCurrentMembership(event);
  if (existing) {
    throw createError({
      statusCode: 409,
      message:
        existing.status === "pending"
          ? "You already have a pending request to join this association."
          : "You are already a member of this association.",
    });
  }

  const db = await getDb();
  const now = new Date();

  try {
    await db.collection<WithoutId<Membership>>("memberships").insertOne({
      associationId: association._id,
      userId: new ObjectId(user.id),
      role: "member",
      status: "pending",
      createdAt: now,
    });
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      throw createError({
        statusCode: 409,
        message: "You already have a request to join this association.",
      });
    }
    throw createError({ statusCode: 500, message: "Something went wrong" });
  }

  return { success: true };
});
