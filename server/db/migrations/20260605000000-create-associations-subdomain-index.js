export const up = async (db) => {
  await db
    .collection("associations")
    .createIndex({ subdomain: 1 }, { unique: true });
};

export const down = async (db) => {
  await db.collection("associations").dropIndex("subdomain_1");
};
