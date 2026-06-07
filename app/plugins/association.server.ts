export default defineNuxtPlugin(() => {
  const event = useRequestEvent();
  const assoc = event?.context.association ?? null;
  const membershipCtx = event?.context.membership ?? null;

  const association = useState<{
    id: string;
    name: string;
    slug: string;
    region: string | null;
    description: string | null;
  } | null>("association", () => null);

  association.value = assoc
    ? {
        id: assoc._id.toString(),
        name: assoc.name,
        slug: assoc.slug,
        region: assoc.region ?? null,
        description: assoc.description ?? null,
      }
    : null;

  const membership = useState<{ status: string; role: string } | null>("association-membership", () => null);
  membership.value = membershipCtx
    ? { status: membershipCtx.status, role: membershipCtx.role }
    : null;
});
