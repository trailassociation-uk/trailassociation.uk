export const up = async (db) => {
  // A user has at most one membership per association.
  await db
    .collection("memberships")
    .createIndex({ associationId: 1, userId: 1 }, { unique: true });

  // Look up a user's memberships (e.g. "my associations").
  await db.collection("memberships").createIndex({ userId: 1 });
};

export const down = async (db) => {
  await db.collection("memberships").dropIndex("associationId_1_userId_1");
  await db.collection("memberships").dropIndex("userId_1");
};
