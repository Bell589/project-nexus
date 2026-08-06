export type WorldId = "ozeanwelt" | "soul_society" | "avalon";

export interface World {
  id: WorldId;
  name: string;
  description: string;
  factionIds: string[];
}
