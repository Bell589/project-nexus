import type { WorldId } from "./world.js";
import type { KampfkraftComponents } from "./kampfkraft.js";
import type { Ability } from "./ability.js";

/**
 * Konkrete Instanz der Kernmacht eines Charakters (Relikt, Seelenwaffe,
 * Resurrección, Complete, einzigartige Magie, Spektralritter, Esper...).
 * stageIndex zeigt auf world.corePowerStages[stageIndex].
 */
export interface CorePower {
  name: string; // fester Eigenname aus dem Katalog, z.B. "Raiun" - NICHT vom Spieler wählbar
  typeLabel: string; // Kategorie, z.B. "Elementar-Relikt: Blitz"
  archetypeId: string; // Referenz auf CorePowerArchetype.id
  stageIndex: number;
  unlockedAbilities: Ability[];
}

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
  corePower: CorePower | null; // null bis Charakter die Kernmacht erhalten/gefunden hat
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
