import type { ObjectId } from "mongodb";

export interface Signup {
  _id: ObjectId;
  eventId: ObjectId;
  userId: ObjectId;
  signedUpAt: Date;
}

export {};
