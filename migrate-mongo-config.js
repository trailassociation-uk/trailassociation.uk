import "dotenv/config";

export default {
  mongodb: {
    url: process.env.MONGO_CONNECTION_STRING,
    databaseName: "trailassociation",
  },
  migrationsDir: "server/db/migrations",
  changelogCollectionName: "migrations",
  moduleSystem: "esm",
};
