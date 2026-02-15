import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { usersTable } from "../../db/schema";

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

  const [dbUser] = await db
    .select({ passwordHash: usersTable.passwordHash })
    .from(usersTable)
    .where(eq(usersTable.id, user.id))
    .limit(1);

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
    .update(usersTable)
    .set({ passwordHash })
    .where(eq(usersTable.id, user.id));

  return { success: true };
});
