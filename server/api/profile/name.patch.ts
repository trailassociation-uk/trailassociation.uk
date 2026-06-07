import { ObjectId } from "mongodb";
import { z } from "zod";
import { getDb } from "../../db";

const bodySchema = z.object({
  name: z.string().trim().min(1),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { name } = await readValidatedBody(event, bodySchema.parse);

  const db = await getDb();

  const result = await db
    .collection("users")
    .updateOne({ _id: new ObjectId(user.id) }, { $set: { name } });

  if (result.matchedCount === 0) {
    throw createError({
      statusCode: 500,
      message: "Failed to update name",
    });
  }

  await setUserSession(event, {
    user: { ...user, name },
  });

  return { success: true };
});
