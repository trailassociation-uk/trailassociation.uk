import { MongoServerError, ObjectId } from "mongodb";
import { z } from "zod";
import type { Association } from "#shared/types/association";
import type { Membership } from "#shared/types/membership";
import { getDb } from "../db";
import { normalizeSubdomain, validateSubdomain } from "../utils/association";

const bodySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  subdomain: z.string(),
});

/**
 * Build the absolute URL of an association's subdomain.
 *
 * The base is always the configured apex (`appHost`), never the host the
 * request arrived on — otherwise a request to `www.<apex>` would produce
 * `<subdomain>.www.<apex>`. We only borrow the port from the incoming host so
 * local development (e.g. `:3000`) keeps working.
 */
function buildAssociationUrl(
  event: Parameters<typeof getRequestHost>[0],
  subdomain: string,
  appHost: string,
): string {
  const protocol = getRequestProtocol(event, { xForwardedProto: true });
  const host = getRequestHost(event, { xForwardedHost: true });

  const port = host.split(":")[1];
  const authority = port ? `${appHost}:${port}` : appHost;
  return `${protocol}://${subdomain}.${authority}`;
}

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { host: appHost } = useRuntimeConfig(event);

  const body = await readValidatedBody(event, bodySchema.parse);
  const name = body.name.trim();
  const subdomain = normalizeSubdomain(body.subdomain);

  const subdomainError = validateSubdomain(subdomain);
  if (subdomainError) {
    throw createError({
      statusCode: 422,
      message: subdomainError,
      data: { field: "subdomain" },
    });
  }

  const db = await getDb();

  // Fail fast with a friendly message if the subdomain is already claimed; the
  // unique index below is still the source of truth against races.
  const existing = await db
    .collection<Association>("associations")
    .findOne({ slug: subdomain }, { projection: { _id: 1 } });
  if (existing) {
    throw createError({
      statusCode: 409,
      message: "That subdomain is already taken.",
      data: { field: "subdomain" },
    });
  }

  const createdBy = new ObjectId(user.id);
  const now = new Date();

  let associationId: ObjectId;
  try {
    const result = await db
      .collection<Omit<Association, "_id">>("associations")
      .insertOne({ slug: subdomain, name, createdBy, createdAt: now });
    associationId = result.insertedId;
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      throw createError({
        statusCode: 409,
        message: "That subdomain is already taken.",
        data: { field: "subdomain" },
      });
    }
    throw createError({ statusCode: 500, message: "Something went wrong" });
  }

  // Make the creator the first admin (TRAIL-22 Membership model).
  await db.collection<Omit<Membership, "_id">>("memberships").insertOne({
    associationId,
    userId: createdBy,
    role: "admin",
    status: "active",
    joinedAt: now,
  });

  return {
    success: true,
    association: { id: associationId.toString(), subdomain, name },
    url: buildAssociationUrl(event, subdomain, appHost),
  };
});
