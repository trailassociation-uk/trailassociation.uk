import type { Association } from "#shared/types/association";
import { getDb } from "../../db";
import { buildAssociationUrl } from "../../utils/association";

export default defineEventHandler(async (event) => {
  const { region } = getQuery(event);
  const appHost = useRuntimeConfig(event).public.host;

  const filter: Record<string, unknown> = {};
  if (typeof region === "string" && region.trim()) {
    filter.region = { $regex: region.trim(), $options: "i" };
  }

  const db = await getDb();
  const associations = await db
    .collection<Association>("associations")
    .find(filter, { sort: { name: 1 } })
    .toArray();

  return {
    associations: associations.map((a) => ({
      id: a._id.toString(),
      name: a.name,
      slug: a.slug,
      region: a.region ?? null,
      description: a.description ?? null,
      url: buildAssociationUrl(event, a.slug, appHost),
    })),
  };
});
