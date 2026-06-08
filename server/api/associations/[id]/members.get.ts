import { ObjectId } from "mongodb";
import type { Membership } from "#shared/types/membership";
import type { User } from "#shared/types/user";
import { getDb } from "../../../db";
import { requireAdmin } from "../../../utils/membership";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const association = event.context.association;
  if (!association) {
    throw createError({ statusCode: 404, message: "Association not found" });
  }

  requireAdmin(event);

  const db = await getDb();

  const memberships = await db
    .collection<Membership>("memberships")
    .find({ associationId: association._id })
    .toArray();

  if (memberships.length === 0) return { members: [] };

  const userIds = memberships.map((m) => m.userId);
  const users = await db
    .collection<User>("users")
    .find({ _id: { $in: userIds } })
    .toArray();

  const usersById = new Map(users.map((u) => [u._id.toString(), u]));

  const members = memberships
    .flatMap((m) => {
      const user = usersById.get(m.userId.toString());
      if (!user) return [];
      return [
        {
          id: m._id.toString(),
          userId: m.userId.toString(),
          name: user.name ?? null,
          email: user.email,
          role: m.role,
          status: m.status,
          joinedAt: m.joinedAt,
        },
      ];
    })
    .sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "pending" ? -1 : 1;
      }
      return (a.name ?? a.email).localeCompare(b.name ?? b.email);
    });

  return { members };
});
