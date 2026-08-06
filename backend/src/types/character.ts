import type { WorldId } from "./world.js";
import type { KampfkraftComponents } from "./kampfkraft.js";

/**
 * Konkrete Instanz der Kernmacht eines Charakters (Relikt, Seelenwaffe,
 * Resurrección, Complete, einzigartige Magie, Spektralritter, Esper...).
 * stageIndex zeigt auf world.corePowerStages[stageIndex].
 */
export interface CorePower {
  name: string; // z.B. "Donner des Himmels"
  archetype: string; // z.B. "Relikt des Blitzes"
  stageIndex: number;
  unlockedAbilities: string[];
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
  createdAt: string;
}
