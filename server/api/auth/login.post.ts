import { z } from "zod";
import type { User } from "#shared/types/user";
import { getDb } from "../../db";

const bodySchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  const { email, password } = await parseBody(event, bodySchema);

  const db = await getDb();
  const user = await db.collection<User>("users").findOne({ email });

  if (!user || !(await verifyPassword(user.passwordHash, password))) {
    throw createError({
      statusCode: 401,
      message: "Invalid email or password",
    });
  }

  await setUserSession(event, {
    user: { id: user._id.toString(), email: user.email, name: user.name ?? "" },
  });

  return { success: true };
});
