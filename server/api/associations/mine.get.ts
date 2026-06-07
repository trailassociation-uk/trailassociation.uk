import type { Association } from "#shared/types/association";
import { getDb } from "../../db";
import { buildAssociationUrl } from "../../utils/association";
import { getUserMemberships } from "../../utils/membership";

/**
 * List every association the current user belongs to, along with their role
 * and status in each. Returned associations are sorted by name.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const appHost = useRuntimeConfig(event).public.host;

  const memberships = await getUserMemberships(user.id);
  if (memberships.length === 0) return { associations: [] };

  const db = await getDb();
  const associations = await db
    .collection<Association>("associations")
    .find({ _id: { $in: memberships.map((m) => m.associationId) } })
    .toArray();

  // Index associations by id so we can pair each membership with its
  // association without an extra round trip per row.
  const byId = new Map(associations.map((a) => [a._id.toString(), a]));

  return {
    associations: memberships
      .flatMap((membership) => {
        const association = byId.get(membership.associationId.toString());
        // Skip memberships whose association has since been removed.
        if (!association) return [];
        return [
          {
            id: association._id.toString(),
            name: association.name,
            subdomain: association.slug,
            role: membership.role,
            status: membership.status,
            url: buildAssociationUrl(event, association.slug, appHost),
          },
        ];
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
});
