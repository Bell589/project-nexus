import type { WorldId } from "./world.js";
import type { KampfkraftComponents } from "./kampfkraft.js";
import type { Ability, AbilityProgressState } from "./ability.js";
import type { UniquePowerInstance } from "./uniquePower.js";
import type { OrganizationMembership, TemporaryLineageState } from "./affiliation.js";
import type { PactState } from "./pact.js";
import type { DojutsuState, NinjaTechniqueState } from "./ninjaTechnique.js";

export interface JinchurikiState {
  bijuuId: string;
  bijuuName: string;
  stageIndex: number;
  individualAbilities: Ability[];
  developmentLog: string[];
}
export interface KarmaState {
  otsutsukiId: string;
  progressPct: number;
  active: boolean;
  lineageId: string;
  unlockedAbilityIds: string[];
  developmentLog: string[];
}
export interface InventorySlot { itemId: string; quantity: number; }
export interface EquippedItems { waffe: string | null; ruestung: string | null; accessoire: string | null; }
export interface CharacterSkill { name: string; level: number; }
export interface CharacterStats {
  kraft: number; verteidigung: number; lp: number; geschwindigkeit: number; genauigkeit: number; power: number;
}
export interface CharacterEnergy { current: number; max: number; label: string; }
export type OriginStatus = "not_started" | "in_progress" | "completed";
export interface OriginProgress { originId: string; status: OriginStatus; stepIndex: number; completedStepIds: string[]; }

export interface Character {
  id: string;
  ownerId: string | null;
  ownerName: string;
  characterName: string;
  worldId: WorldId;
  raceId: string;
  /** Hauptclan / dauerhafte Blutlinie. Unabhängig von Fraktion und Organisation. */
  clanId: string | null;
  factionId: string;
  organizationMemberships: OrganizationMembership[];
  rankTitles: string[];
  temporaryLineages: TemporaryLineageState[];
  abilityProgress: AbilityProgressState[];
  pacts: PactState[];
  kampfkraftComponents: KampfkraftComponents;
  stats: CharacterStats;
  energy: CharacterEnergy;
  currentHp: number;
  skillPoints: number;
  statPoints: number;
  gold: number;
  currentLocationId: string | null;
  origin: OriginProgress;
  wanted: { value: number; dangerRank: string | null; reasons: string[] };
  uniquePower: UniquePowerInstance | null;
  doujutsu: UniquePowerInstance | null;
  dojutsuState: DojutsuState | null;
  ninjaTechniques: NinjaTechniqueState[];
  selfAssignedRank: string | null;
  crewId: string | null;
  inventory: InventorySlot[];
  equipped: EquippedItems;
  skills: CharacterSkill[];
  completedMissionIds: string[];
  activeDomainRuleId: string | null;
  fusedInto: string | null;
  spektralritterPact: UniquePowerInstance | null;
  esperPact: import("./esper.js").EsperPact | null;
  jinchuriki: JinchurikiState | null;
  /** Neue, quellenspezifische Karma-Struktur. */
  karmaStates: KarmaState[];
  /** Legacy-Spiegel für bestehendes Frontend; wird aus aktivem Karma synchronisiert. */
  karmaPct: number;
  defeatedOtsutsukiIds: string[];
  createdAt: string;
}
