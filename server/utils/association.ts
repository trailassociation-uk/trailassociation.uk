import type { H3Event } from "h3";
import { isReservedSubdomain } from "#shared/reserved-subdomains";
import type { Association } from "#shared/types/association";
import { getDb } from "../db";

/** Min/max length for an association subdomain label. */
export const SUBDOMAIN_MIN_LENGTH = 3;
export const SUBDOMAIN_MAX_LENGTH = 63;

// Lowercase, URL-safe label: starts/ends with an alphanumeric and may contain
// hyphens in between. No consecutive constraints beyond a single contiguous
// label (no dots — a single subdomain level only).
const SUBDOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

/**
 * Validate a candidate association subdomain. Returns `null` when valid, or a
 * human-readable error message describing the first failing rule.
 *
 * The value is expected to already be trimmed and lowercased by the caller (see
 * {@link normalizeSubdomain}).
 */
export function validateSubdomain(subdomain: string): string | null {
  if (subdomain.length < SUBDOMAIN_MIN_LENGTH) {
    return `Subdomain must be at least ${SUBDOMAIN_MIN_LENGTH} characters.`;
  }
  if (subdomain.length > SUBDOMAIN_MAX_LENGTH) {
    return `Subdomain must be at most ${SUBDOMAIN_MAX_LENGTH} characters.`;
  }
  if (!SUBDOMAIN_PATTERN.test(subdomain)) {
    return "Subdomain may only contain lowercase letters, numbers, and hyphens, and must start and end with a letter or number.";
  }
  if (isReservedSubdomain(subdomain)) {
    return "That subdomain is reserved.";
  }
  return null;
}

/** Trim and lowercase a raw subdomain input into a candidate value. */
export function normalizeSubdomain(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Extract the association subdomain from a request host.
 *
 * - Strips the port and lowercases the host.
 * - Returns `null` for the apex host or any host that does not sit under the
 *   configured apex (e.g. an IP address or internal hostname).
 */
export function extractSubdomain(host: string, appHost: string): string | null {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";

  const apex = appHost.toLowerCase();

  if (hostname === apex) return null;
  if (!hostname.endsWith(`.${apex}`)) return null;

  const subdomain = hostname.slice(0, -(apex.length + 1));

  if (!subdomain) return null;

  return subdomain;
}

/**
 * Build the absolute URL of an association's subdomain.
 *
 * The base is always the configured apex (`appHost`), never the host the
 * request arrived on — otherwise a request to `www.<apex>` would produce
 * `<subdomain>.www.<apex>`. We only borrow the port from the incoming host so
 * local development (e.g. `:3000`) keeps working.
 */
export function buildAssociationUrl(
  event: H3Event,
  subdomain: string,
  appHost: string,
): string {
  const protocol = getRequestProtocol(event, { xForwardedProto: true });
  const host = getRequestHost(event, { xForwardedHost: true });

  const port = host.split(":")[1];
  const authority = port ? `${appHost}:${port}` : appHost;
  return `${protocol}://${subdomain}.${authority}`;
}

/**
 * Resolve a subdomain to an `Association`. Returns `null` for unknown
 * subdomains.
 */
export async function getAssociationBySubdomain(
  subdomain: string,
): Promise<Association | null> {
  const db = await getDb();
  return db
    .collection<Association>("associations")
    .findOne({ slug: subdomain });
}
