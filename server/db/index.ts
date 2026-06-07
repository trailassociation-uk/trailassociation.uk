import "dotenv/config";
import { type Db, MongoClient } from "mongodb";

let client: MongoClient | null = null;
let _db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (_db) return _db;

  const uri = process.env.MONGO_CONNECTION_STRING;
  if (!uri) {
    throw new Error("MONGO_CONNECTION_STRING is not set");
  }

  client ??= new MongoClient(uri);
  await client.connect();
  const dbName = process.env.MONGO_DB_NAME ?? "trailassociation";
  _db = client.db(dbName);
  return _db;
}
