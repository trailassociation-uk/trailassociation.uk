import { MongoServerError } from "mongodb";
import { z } from "zod";
import { getDb } from "../../db";

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
  const db = await getDb();

  try {
    const result = await db
      .collection("users")
      .insertOne({ email, passwordHash });

    await setUserSession(event, {
      user: { id: result.insertedId.toString(), email },
    });

    return { success: true };
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      throw createError({ statusCode: 409, message: "Email already in use" });
    }
    throw createError({ statusCode: 500, message: "Something went wrong" });
  }
});
