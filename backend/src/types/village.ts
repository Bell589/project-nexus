export type VillageRank = "Genin" | "Chūnin" | "Jōnin" | "Kage";

export interface VillageMember {
  characterId: string;
  rank: VillageRank;
}

export interface Village {
  id: string;
  name: string;
  kageTitle: string; // z.B. "Hokage", "Kazekage", "Mizukage"
  members: VillageMember[];
  createdAt: string;
}
