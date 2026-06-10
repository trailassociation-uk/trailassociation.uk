export const up = async (db) => {
  await db.collection("events").createIndex({ associationId: 1, startsAt: 1 });

  await db.collection("signups").createIndex({ eventId: 1, userId: 1 }, { unique: true });
  await db.collection("signups").createIndex({ eventId: 1 });
  await db.collection("signups").createIndex({ userId: 1 });
};

export const down = async (db) => {
  await db.collection("events").dropIndex("associationId_1_startsAt_1");

  await db.collection("signups").dropIndex("eventId_1_userId_1");
  await db.collection("signups").dropIndex("eventId_1");
  await db.collection("signups").dropIndex("userId_1");
};
