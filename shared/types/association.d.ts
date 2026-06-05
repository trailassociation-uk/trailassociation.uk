import type { ObjectId } from "mongodb";

export interface Association {
  _id: ObjectId;
  /** The subdomain ("bardon") — unique, lowercase. */
  slug: string;
  name: string;
  region?: string;
  description?: string;
  logoUrl?: string;
  createdAt: Date;
  createdBy: ObjectId;
}

declare module "h3" {
  interface H3EventContext {
    association: Association | null;
  }
}

export {};
