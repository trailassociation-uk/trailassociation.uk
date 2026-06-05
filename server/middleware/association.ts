import { isReservedSubdomain } from "#shared/reserved-subdomains";
import {
  extractSubdomain,
  getAssociationBySubdomain,
} from "../utils/association";

export default defineEventHandler(async (event) => {
  event.context.association = null;

  const { host: appHost } = useRuntimeConfig(event);
  const host = getRequestHost(event, { xForwardedHost: true });
  const subdomain = extractSubdomain(host, appHost);

  // Apex host — no association context.
  if (!subdomain) return;

  // Platform-reserved subdomains (`api`, `app`, …) belong to the platform, not
  // an association — leave the association context empty rather than treating
  // them as an unknown association (404). A reserved slug can never be claimed
  // (see `validateSubdomain`), so this also short-circuits the DB lookup.
  if (isReservedSubdomain(subdomain)) return;

  const association = await getAssociationBySubdomain(subdomain);

  // Unknown subdomain — there is no association behind this host.
  if (!association) {
    throw createError({
      statusCode: 404,
      statusMessage: "Association not found",
    });
  }

  event.context.association = association;
});
