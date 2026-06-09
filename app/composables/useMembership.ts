export type MembershipRole = "admin" | "member";
export type MembershipStatus = "active" | "pending";

export interface MembershipState {
  status: MembershipStatus;
  role: MembershipRole;
}

export function useMembership() {
  return useState<MembershipState | null>("association-membership", () => null);
}
