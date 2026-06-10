import type { ObjectId } from "mongodb";

export type EventType = "dig" | "ride" | "meeting";

export interface Event {
  _id: ObjectId;
  associationId: ObjectId;
  type: EventType;
  title: string;
  description?: string;
  date: Date;
  location?: string;
  createdAt: Date;
  createdBy: ObjectId;
}

export {};
