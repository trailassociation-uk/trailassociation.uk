import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { usersTable } from "../../db/schema";

const bodySchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse);

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user || !(await verifyPassword(user.passwordHash, password))) {
    throw createError({
      statusCode: 401,
      message: "Invalid email or password",
    });
  }

  await setUserSession(event, {
    user: { id: user.id, email: user.email },
  });

  return { success: true };
});
