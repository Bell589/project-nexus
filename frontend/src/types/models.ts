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
  inventory: { itemId: string; quantity: number }[];
  equipped: { waffe: string | null; ruestung: string | null; accessoire: string | null };
  skills: { name: string; level: number }[];
  completedMissionIds: string[];
  activeDomainRuleId: string | null;
  fusedInto: string | null;
  createdAt: string;
  kampfkraft?: number;
}

export type ItemSlot = "waffe" | "ruestung" | "accessoire";

export interface Item {
  id: string;
  name: string;
  slot: ItemSlot | "verbrauchsgut";
  description: string;
  statBonuses: Record<string, number>;
}

export interface GameLocation {
  id: string;
  worldId: WorldId;
  name: string;
  type: string;
  description: string;
  x: number;
  y: number;
}

export interface Mission {
  id: string;
  worldId: WorldId;
  title: string;
  description: string;
  minKampfkraft: number;
  rewardComponents: Record<string, number>;
  rewardItemId?: string;
}

export interface Enemy {
  id: string;
  worldId: WorldId;
  name: string;
  description: string;
  kampfkraft: number;
  rewardComponents: Record<string, number>;
}

export type CombatAction = "angriff" | "verteidigung" | "spezialfaehigkeit" | "flucht";
export type CombatStatus = "laufend" | "gewonnen" | "verloren" | "geflohen";

export interface CombatRoundLog {
  round: number;
  characterAction: CombatAction;
  enemyAction: CombatAction;
  damageToEnemy: number;
  damageToCharacter: number;
  note: string;
}

export interface CombatSession {
  id: string;
  characterId: string;
  enemyId: string;
  characterHp: number;
  characterMaxHp: number;
  enemyHp: number;
  enemyMaxHp: number;
  comboCount: number;
  round: number;
  status: CombatStatus;
  log: CombatRoundLog[];
  createdAt: string;
}

export interface DomainRule {
  id: string;
  name: string;
  description: string;
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
