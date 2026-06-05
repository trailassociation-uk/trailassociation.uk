export const up = async (db) => {
  await db.collection("associations").createIndex({ slug: 1 }, { unique: true });
};

export const down = async (db) => {
  await db.collection("associations").dropIndex("slug_1");
};
