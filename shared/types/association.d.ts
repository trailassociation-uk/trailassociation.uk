import type { ObjectId } from "mongodb";

export interface Association {
  _id: ObjectId;
  subdomain: string;
  name: string;
}

declare module "h3" {
  interface H3EventContext {
    association: Association | null;
  }
}

export {};
