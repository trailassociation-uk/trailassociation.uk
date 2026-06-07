import "dotenv/config";

export default {
  mongodb: {
    url: process.env.MONGO_CONNECTION_STRING,
    databaseName: process.env.MONGO_DB_NAME ?? "trailassociation",
  },
  migrationsDir: "server/db/migrations",
  changelogCollectionName: "migrations",
  moduleSystem: "esm",
};
