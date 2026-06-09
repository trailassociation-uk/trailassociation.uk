export default defineNuxtPlugin(() => {
  const event = useRequestEvent();
  const assoc = event?.context.association ?? null;
  const membershipCtx = event?.context.membership ?? null;

  const association = useAssociation();
  association.value = assoc
    ? {
        id: assoc._id.toString(),
        name: assoc.name,
        slug: assoc.slug,
        region: assoc.region ?? null,
        description: assoc.description ?? null,
      }
    : null;

  const membership = useMembership();
  membership.value = membershipCtx
    ? { status: membershipCtx.status, role: membershipCtx.role }
    : null;
});
