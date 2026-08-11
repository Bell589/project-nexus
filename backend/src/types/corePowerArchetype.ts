import type { WorldId } from "./world.js";

export interface CorePowerArchetype {
  id: string;
  worldId: WorldId;
  factionIds: string[]; // z.B. ["piraten","marine"] wenn mehrere Fraktionen dasselbe System teilen
  name: string; // z.B. "Relikt des Blitzes", "Zanpakutō des Feuers", "Blitzmagie"
  description: string;
  /** abilitiesByStage[stageIndex] = Fähigkeiten, die beim Erreichen dieser Stufe freigeschaltet werden */
  abilitiesByStage: string[][];
}
