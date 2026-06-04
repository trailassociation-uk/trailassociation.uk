import "dotenv/config";
import { MongoClient, type Db } from "mongodb";

if (!process.env.MONGO_CONNECTION_STRING) {
  throw new Error("MONGO_CONNECTION_STRING is not set");
}

const client = new MongoClient(process.env.MONGO_CONNECTION_STRING);
let _db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (_db) return _db;
  await client.connect();
  _db = client.db("trailassociation");
  return _db;
}
