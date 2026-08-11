import type { WorldId } from "./world.js";

export interface CorePowerArchetype {
  id: string;
  worldId: WorldId;
  factionIds: string[]; // z.B. ["piraten","marine"] wenn mehrere Fraktionen dasselbe System teilen
  typeLabel: string; // Kategorie, z.B. "Elementar-Relikt: Blitz", "Tier-Relikt: Drache"
  properName: string; // fester, eindeutiger Name, z.B. "Raiun", "Long" - NICHT vom Spieler wählbar
  description: string;
  /** abilitiesByStage[stageIndex] = Fähigkeiten, die beim Erreichen dieser Stufe freigeschaltet werden */
  abilitiesByStage: string[][];
}
