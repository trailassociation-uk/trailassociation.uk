import type { Association } from "#shared/types/association";
import { getDb } from "../db";

/**
 * Extract the association subdomain from a request host.
 *
 * - Strips the port and lowercases the host.
 * - Returns `null` for the apex host, a `www` subdomain, or any host that does
 *   not sit under the configured apex (e.g. an IP address or internal hostname).
 */
export function extractSubdomain(host: string, appHost: string): string | null {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";

  const apex = appHost.toLowerCase();

  if (hostname === apex) return null;
  if (!hostname.endsWith(`.${apex}`)) return null;

  const subdomain = hostname.slice(0, -(apex.length + 1));

  if (!subdomain || subdomain === "www") return null;

  return subdomain;
}

/**
 * Resolve a subdomain to an `Association`. Returns `null` for unknown
 * subdomains.
 */
export async function getAssociationBySubdomain(
  subdomain: string,
): Promise<Association | null> {
  const db = await getDb();
  return db.collection<Association>("associations").findOne({ slug: subdomain });
}
