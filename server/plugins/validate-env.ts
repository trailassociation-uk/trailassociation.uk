/**
 * Fail fast at server startup if required environment is missing.
 *
 * `getDb()` is lazy and only throws when a request first touches Mongo, so this
 * plugin surfaces misconfiguration immediately on boot instead of on the first
 * DB-backed request.
 */
const REQUIRED_ENV = ["MONGO_CONNECTION_STRING"] as const;

export default defineNitroPlugin(() => {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}`,
    );
  }
});
