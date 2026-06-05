import {
  extractSubdomain,
  getAssociationBySubdomain,
} from "../utils/association";

export default defineEventHandler(async (event) => {
  event.context.association = null;

  const { host: appHost } = useRuntimeConfig(event);
  const host = getRequestHost(event, { xForwardedHost: true });
  const subdomain = extractSubdomain(host, appHost);

  // Apex host (or `www`) — no association context.
  if (!subdomain) return;

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
