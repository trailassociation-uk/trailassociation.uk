export default defineEventHandler((event) => {
  const association = event.context.association;
  if (!association) return null;

  return {
    id: association._id.toString(),
    name: association.name,
    slug: association.slug,
    region: association.region ?? null,
    description: association.description ?? null,
  };
});
