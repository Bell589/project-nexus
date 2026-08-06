export type WorldId = "ozeanwelt" | "soul_society" | "avalon";

export interface World {
  id: WorldId;
  name: string;
  description: string;
  factionIds: string[];
}

export interface Faction {
  id: string;
  worldId: WorldId;
  name: string;
  description: string;
  playerAssignedRanks: string[];
  baseSkills: string[];
  corePowerLabel: string;
  corePowerStages: string[];
}

export interface Character {
  id: string;
  ownerName: string;
  characterName: string;
  worldId: WorldId;
  factionId: string;
  kampfkraftComponents: {
    erfahrung: number;
    ausruestung: number;
    faehigkeiten: number;
    systemBeherrschung: number;
    erfolge: number;
    training: number;
  };
  corePower: { name: string; archetype: string; stageIndex: number; unlockedAbilities: string[] } | null;
  selfAssignedRank: string | null;
  createdAt: string;
  kampfkraft?: number;
}
