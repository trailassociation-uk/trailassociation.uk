import type { ObjectId } from "mongodb";

export type MembershipRole = "admin" | "member";
export type MembershipStatus = "active" | "pending";

export interface Membership {
  _id: ObjectId;
  userId: ObjectId;
  associationId: ObjectId;
  role: MembershipRole;
  status: MembershipStatus;
  createdAt: Date;
}

declare module "h3" {
  interface H3EventContext {
    membership: Membership | null;
  }
}

export {};
