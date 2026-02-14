import { z } from "zod";
import { db } from "../../db";
import { usersTable } from "../../db/schema";

const bodySchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse);

  const passwordHash = await hashPassword(password);

  try {
    const [user] = await db
      .insert(usersTable)
      .values({ email, passwordHash })
      .returning({ id: usersTable.id, email: usersTable.email });

    if (!user) {
      throw createError({ statusCode: 500, message: "Failed to create user" });
    }

    await setUserSession(event, {
      user: { id: user.id, email: user.email },
    });

    return { success: true };
  } catch {
    throw createError({
      statusCode: 500,
      message: "Something went wrong",
    });
  }
});
