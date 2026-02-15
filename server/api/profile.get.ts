import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const [profile] = await db
    .select({ id: usersTable.id, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.id, user.id))
    .limit(1);

  if (!profile) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }

  return profile;
});
