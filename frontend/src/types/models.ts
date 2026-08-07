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
  crewId: string | null;
  createdAt: string;
  kampfkraft?: number;
}

export type CrewRole = "Captain" | "Offizier" | "Kommandant" | "Stellvertreter" | "Mitglied";

export interface CrewMember {
  characterId: string;
  role: CrewRole;
}

export interface Crew {
  id: string;
  name: string;
  worldId: "ozeanwelt";
  factionId: "piraten" | "marine";
  members: CrewMember[];
  fleetId: string | null;
  createdAt: string;
}

export interface Fleet {
  id: string;
  name: string;
  worldId: "ozeanwelt";
  memberCrewIds: string[];
  createdAt: string;
}
