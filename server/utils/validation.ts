import type { H3Event } from "h3";
import type { ZodSchema } from "zod";

export async function parseBody<T>(
  event: H3Event,
  schema: ZodSchema<T>,
): Promise<T> {
  const body = await readBody(event);
  const result = schema.safeParse(body);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.issues[0]?.message ?? "Validation error",
    });
  }
  return result.data;
}
