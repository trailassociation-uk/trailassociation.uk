import { getCurrentMembership } from "../utils/membership";

export default defineEventHandler(async (event) => {
  event.context.membership = null;

  // Only resolve a membership when the request is in an association context.
  // Runs after the `association` middleware has populated the context.
  if (!event.context.association) return;

  event.context.membership = await getCurrentMembership(event);
});
