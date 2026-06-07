import { ObjectId } from "mongodb";
import { z } from "zod";
import type { User } from "#shared/types/user";
import { getDb } from "../../db";

const bodySchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { currentPassword, newPassword } = await readValidatedBody(
    event,
    bodySchema.parse,
  );

  const db = await getDb();
  const dbUser = await db
    .collection<User>("users")
    .findOne(
      { _id: new ObjectId(user.id) },
      { projection: { passwordHash: 1 } },
    );

  if (
    !dbUser ||
    !(await verifyPassword(dbUser.passwordHash, currentPassword))
  ) {
    throw createError({
      statusCode: 401,
      message: "Current password is incorrect",
    });
  }

  const passwordHash = await hashPassword(newPassword);

  await db
    .collection<User>("users")
    .updateOne({ _id: new ObjectId(user.id) }, { $set: { passwordHash } });

  return { success: true };
});
