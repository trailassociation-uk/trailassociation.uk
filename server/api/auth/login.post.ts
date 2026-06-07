import { z } from "zod";
import { getDb } from "../../db";

const bodySchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse);

  const db = await getDb();
  const user = await db.collection("users").findOne({ email });

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
