import { isReservedSubdomain } from "#shared/reserved-subdomains";
import {
  buildApexUrl,
  extractSubdomain,
  getAssociationBySubdomain,
} from "../utils/association";

export default defineEventHandler(async (event) => {
  event.context.association = null;

  const appHost = useRuntimeConfig(event).public.host;
  const host = getRequestHost(event, { xForwardedHost: true });
  const subdomain = extractSubdomain(host, appHost);

  // Apex host — no association context.
  if (!subdomain) return;

  const redirectToApex = () => sendRedirect(event, buildApexUrl(event, appHost), 302);

  // Platform-reserved subdomains (`api`, `app`, …) can never be claimed, so
  // redirect rather than serving the apex page on a non-apex host.
  if (isReservedSubdomain(subdomain)) {
    return redirectToApex();
  }

  const association = await getAssociationBySubdomain(subdomain);

  // Unknown subdomain — redirect to the apex rather than serving a 404.
  if (!association) {
    return redirectToApex();
  }

  event.context.association = association;
});
