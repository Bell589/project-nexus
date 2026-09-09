export type WorldId = "ozeanwelt" | "soul_society" | "avalon" | "ninja_welt";

export interface World {
  id: WorldId;
  name: string;
  description: string;
  factionIds: string[];
}
