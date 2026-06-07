import { ObjectId } from "mongodb";
import { z } from "zod";
import type { User } from "#shared/types/user";
import { getDb } from "../db";

const bodySchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.email().optional(),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { name, email } = await parseBody(event, bodySchema);

  const db = await getDb();

  if (email) {
    const existing = await db
      .collection<User>("users")
      .findOne({ email, _id: { $ne: new ObjectId(user.id) } });

    if (existing) {
      throw createError({
        statusCode: 409,
        message: "Email already in use",
      });
    }
  }

  const updates: Partial<Pick<User, "name" | "email">> = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;

  if (Object.keys(updates).length > 0) {
    const result = await db
      .collection<User>("users")
      .updateOne({ _id: new ObjectId(user.id) }, { $set: updates });

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 500,
        message: "Failed to update profile",
      });
    }

    await setUserSession(event, {
      user: { ...user, ...updates },
    });
  }

  return { success: true };
});
