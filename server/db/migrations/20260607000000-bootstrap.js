export const up = async (db) => {
  await db.collection("users").createIndex({ email: 1 }, { unique: true });

  await db.collection("associations").createIndex({ slug: 1 }, { unique: true });

  await db.collection("memberships").createIndex({ userId: 1, associationId: 1 }, { unique: true });

  // Primary lookup by association, secondary lookup by user's memberships.
  await db.collection("memberships").createIndex({ associationId: 1, userId: 1 }, { unique: true });
  await db.collection("memberships").createIndex({ userId: 1 });
};

export const down = async (db) => {
  await db.collection("users").dropIndex("email_1");
  await db.collection("associations").dropIndex("slug_1");
  await db.collection("memberships").dropIndex("userId_1_associationId_1");
  await db.collection("memberships").dropIndex("associationId_1_userId_1");
  await db.collection("memberships").dropIndex("userId_1");
};
