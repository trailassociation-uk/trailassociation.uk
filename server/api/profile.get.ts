import { ObjectId } from "mongodb";
import { getDb } from "../db";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const db = await getDb();
  const profile = await db
    .collection("users")
    .findOne(
      { _id: new ObjectId(user.id) },
      { projection: { _id: 1, email: 1, name: 1 } },
    );

  if (!profile) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }

  return {
    id: profile._id.toString(),
    email: profile.email,
    name: profile.name ?? "",
  };
});
