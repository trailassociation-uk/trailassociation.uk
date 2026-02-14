export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  event.context.auth = { user: session?.user ?? null };
});
