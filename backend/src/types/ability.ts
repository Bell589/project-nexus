export type AbilityKind = "angriff" | "technik" | "powerup";

export type AbilityAcquisitionMethod =
  | "SEARCH"
  | "MASTER_TRAINING"
  | "CLAN_TRAINING"
  | "PACT"
  | "WORLD_ENCOUNTER"
  | "PROGRESSION"
  | "EVENT"
  | "STORY"
  | "SPECIAL_REWARD";

export type AbilitySourceType = "core_power" | "clan" | "trainer" | "pact" | "karma" | "bijuu" | "esper" | "item" | "story" | "event";

export interface PowerupEffect {
  rounds: number;
  damageBonusPct: number;
  incomingReductionPct: number;
  speedNote?: string;
  hpBonusFlat?: number;
}

export interface Ability {
  /** stabile ID für neue datengetriebene Systeme; alte Daten dürfen vorerst nur name besitzen */
  id?: string;
  name: string;
  kind: AbilityKind;
  description: string;
  powerup?: PowerupEffect;
  resourceCost?: number;
  requiresActivePowerup?: string;
  acquisitionMethod?: AbilityAcquisitionMethod;
  sourceType?: AbilitySourceType;
  sourceId?: string;
  stageId?: string;
  /** Fähigkeit bleibt im Besitz, ist aber nur aktiv solange die Quelle aktiv ist (z.B. Karma). */
  requiresActiveSource?: boolean;
  baseEnergyCost?: number;
  scalable?: boolean;
  scalingType?: "damage" | "range" | "duration" | "aoe" | "count" | "barrier" | "summon_size";
  scalingConfig?: Record<string, number>;
  maximumControlledInvestment?: number;
  masteryRequirement?: number;
  requiredStateId?: string;
}

export interface AbilityProgressState {
  abilityId: string;
  sourceType: AbilitySourceType;
  sourceId: string;
  acquisitionMethod: AbilityAcquisitionMethod;
  stageIndex: number;
  unlockedStageIds: string[];
  active: boolean;
  developmentLog: string[];
  mastery?: number;
}
