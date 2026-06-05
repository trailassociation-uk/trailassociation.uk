export const up = async (db) => {
  await db
    .collection("memberships")
    .createIndex({ userId: 1, associationId: 1 }, { unique: true });
};

export const down = async (db) => {
  await db.collection("memberships").dropIndex("userId_1_associationId_1");
};
