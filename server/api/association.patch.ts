import { ObjectId } from "mongodb";
import { z } from "zod";
import type { Association } from "#shared/types/association";
import { getDb } from "../db";
import { requireAdmin } from "../utils/membership";
import { parseBody } from "../utils/validation";

const bodySchema = z.object({
  name: z.string().trim().min(1).optional(),
  region: z.string().trim().optional(),
  description: z.string().trim().max(1000).optional(),
});

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const association = event.context.association;
  if (!association) {
    throw createError({ statusCode: 404, message: "Association not found" });
  }

  requireAdmin(event);

  const body = await parseBody(event, bodySchema);

  const updates: Partial<Pick<Association, "name" | "region" | "description">> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.region !== undefined) updates.region = body.region;
  if (body.description !== undefined) updates.description = body.description;

  if (Object.keys(updates).length === 0) {
    return { success: true };
  }

  const db = await getDb();

  await db
    .collection<Association>("associations")
    .updateOne({ _id: association._id }, { $set: updates });

  return { success: true };
});
