import type { WorldId } from "./world.js";
import type { KampfkraftComponents } from "./kampfkraft.js";
import type { Ability } from "./ability.js";
import type { UniquePowerInstance } from "./uniquePower.js";

/**
 * DEPRECATED - abgelöst durch UniquePowerInstance (individuell generiert
 * statt Fixliste, siehe ANALYSE_UND_UMBAUPLAN.md Abschnitt 3.1). Bleibt hier
 * nur als Kommentar-Hinweis für spätere Leser, wird nicht mehr verwendet.
 */

export interface SpektralritterPact {
  ritterId: string;
  name: string;
  stageIndex: number;
  unlockedAbilities: Ability[];
}

export interface InventorySlot {
  itemId: string;
  quantity: number;
}

export interface EquippedItems {
  waffe: string | null;
  ruestung: string | null;
  accessoire: string | null;
}

export interface CharacterSkill {
  name: string;
  level: number;
}

export interface Character {
  id: string;
  ownerName: string;
  characterName: string;
  worldId: WorldId;
  factionId: string;
  kampfkraftComponents: KampfkraftComponents;
  uniquePower: UniquePowerInstance | null; // individuell generiert, siehe uniquePowerGenerationService
  selfAssignedRank: string | null; // z.B. "Captain" - von Spielern vergeben, nicht vom System
  crewId: string | null; // nur relevant in der Ozeanwelt
  inventory: InventorySlot[];
  equipped: EquippedItems;
  skills: CharacterSkill[];
  completedMissionIds: string[];
  activeDomainRuleId: string | null; // nur Shinigami ab Stufe "Domäne"
  fusedInto: string | null; // gesetzt wenn Charakter per Fusion in einen neuen Charakter aufgegangen ist
  spektralritterPact: SpektralritterPact | null; // nur Avalon/Magier
  createdAt: string;
}
