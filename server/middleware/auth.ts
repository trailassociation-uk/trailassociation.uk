export default defineEventHandler(async (event) => {
  if (import.meta.prerender) {
    event.context.auth = { user: null };
    return;
  }
  const session = await getUserSession(event);
  event.context.auth = { user: session?.user ?? null };
});
