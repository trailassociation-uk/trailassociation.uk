import { MongoServerError } from "mongodb";
import { z } from "zod";
import type { User } from "#shared/types/user";
import type { WithoutId } from "#shared/types/utils";
import { getDb } from "../../db";

const bodySchema = z
  .object({
    name: z.string().trim().min(1),
    email: z.email(),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export default defineEventHandler(async (event) => {
  const { name, email, password } = await parseBody(event, bodySchema);

  const passwordHash = await hashPassword(password);
  const db = await getDb();

  try {
    const result = await db
      .collection<WithoutId<User>>("users")
      .insertOne({ name, email, passwordHash });

    await setUserSession(event, {
      user: { id: result.insertedId.toString(), email, name },
    });

    return { success: true };
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      throw createError({ statusCode: 409, message: "Email already in use" });
    }
    throw createError({ statusCode: 500, message: "Something went wrong" });
  }
});
