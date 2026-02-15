import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { usersTable } from "../../db/schema";

const bodySchema = z.object({
  email: z.email(),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { email } = await readValidatedBody(event, bodySchema.parse);

  const [existing] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(and(eq(usersTable.email, email), ne(usersTable.id, user.id)))
    .limit(1);

  if (existing) {
    throw createError({
      statusCode: 409,
      message: "Email already in use",
    });
  }

  const [updated] = await db
    .update(usersTable)
    .set({ email })
    .where(eq(usersTable.id, user.id))
    .returning({ id: usersTable.id, email: usersTable.email });

  if (!updated) {
    throw createError({
      statusCode: 500,
      message: "Failed to update email",
    });
  }

  await setUserSession(event, {
    user: { id: updated.id, email: updated.email },
  });

  return { success: true };
});
