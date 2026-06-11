import type { H3Event } from "h3";
import { ObjectId } from "mongodb";
import type { Membership } from "#shared/types/membership";
import { getDb } from "../db";

export function requireAdmin(event: H3Event): void {
  const membership = event.context.membership;
  if (
    !membership ||
    membership.status !== "active" ||
    membership.role !== "admin"
  ) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }
}

/** Throw a 403 unless the current user is an `active` member. */
export function requireActiveMember(event: H3Event): Membership {
  const membership = event.context.membership;
  if (!membership || membership.status !== "active") {
    throw createError({
      statusCode: 403,
      message: "You must be an active member to do this.",
    });
  }
  return membership;
}

/**
 * Load the current user's membership for the active association.
 *
 * Returns `null` when there is no active association on the request, when the
 * request is unauthenticated, or when the user has no membership for that
 * association.
 */
export async function getCurrentMembership(
  event: H3Event,
): Promise<Membership | null> {
  const association = event.context.association;
  if (!association) return null;

  const session = await getUserSession(event);
  const userId = session.user?.id;
  if (!userId) return null;

  const db = await getDb();
  return db.collection<Membership>("memberships").findOne({
    userId: new ObjectId(userId),
    associationId: association._id,
  });
}

/**
 * Load every membership belonging to a user, across all associations.
 *
 * Backed by the `(userId, associationId)` index — `userId` is the leading key,
 * so this query is covered without a dedicated index.
 */
export async function getUserMemberships(
  userId: string,
): Promise<Membership[]> {
  const db = await getDb();
  return db
    .collection<Membership>("memberships")
    .find({ userId: new ObjectId(userId) })
    .toArray();
}
