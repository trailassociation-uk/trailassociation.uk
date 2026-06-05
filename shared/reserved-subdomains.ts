/**
 * Central list of subdomains that are reserved for the platform and may never
 * be claimed by an association.
 *
 * This is the single source of truth shared between:
 * - association creation validation (`validateSubdomain`), and
 * - the subdomain-resolution middleware,
 *
 * so a reserved slug can never be registered, and an incoming request for one
 * is never resolved to an association.
 *
 * Keep `www` here in sync with the dev hosts script (`scripts/hosts.ts`).
 */
export const RESERVED_SUBDOMAINS = new Set([
  "www",
  "api",
  "app",
  "admin",
  "dashboard",
  "account",
  "accounts",
  "auth",
  "login",
  "signup",
  "logout",
  "profile",
  "settings",
  "mail",
  "email",
  "smtp",
  "imap",
  "ftp",
  "ns",
  "ns1",
  "ns2",
  "dns",
  "blog",
  "docs",
  "doc",
  "help",
  "support",
  "status",
  "about",
  "contact",
  "billing",
  "static",
  "assets",
  "cdn",
  "img",
  "images",
  "media",
  "files",
  "test",
  "staging",
  "dev",
  "demo",
  "internal",
  "system",
  "trailassociation",
]);

/** Whether a subdomain label is reserved for the platform. */
export function isReservedSubdomain(subdomain: string): boolean {
  return RESERVED_SUBDOMAINS.has(subdomain.trim().toLowerCase());
}
