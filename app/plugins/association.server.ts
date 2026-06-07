export default defineNuxtPlugin(() => {
  const event = useRequestEvent();
  const assoc = event?.context.association ?? null;

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
});
