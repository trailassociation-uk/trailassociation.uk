export interface AssociationState {
  id: string;
  name: string;
  slug: string;
  region: string | null;
  description: string | null;
}

export function useAssociation() {
  return useState<AssociationState | null>("association", () => null);
}
