import { ObjectId } from "mongodb";
import { z } from "zod";
import type { User } from "#shared/types/user";
import { getDb } from "../../db";

const bodySchema = z.object({
  email: z.email(),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { email } = await parseBody(event, bodySchema);

  const db = await getDb();

  const existing = await db
    .collection<User>("users")
    .findOne({ email, _id: { $ne: new ObjectId(user.id) } });

  if (existing) {
    throw createError({
      statusCode: 409,
      message: "Email already in use",
    });
  }

  const result = await db
    .collection<User>("users")
    .updateOne({ _id: new ObjectId(user.id) }, { $set: { email } });

  if (result.matchedCount === 0) {
    throw createError({
      statusCode: 500,
      message: "Failed to update email",
    });
  }

  await setUserSession(event, {
    user: { ...user, email },
  });

  return { success: true };
});
