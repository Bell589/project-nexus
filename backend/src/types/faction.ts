import type { WorldId } from "./world.js";

export interface Faction {
  id: string;
  worldId: WorldId;
  name: string;
  description: string;
  /** Titel, die Spieler sich intern selbst vergeben (keine System-Level) */
  playerAssignedRanks: string[];
  baseSkills: string[];
  /** Generischer Name der Kernmacht dieser Fraktion, z.B. "Relikt", "Resurrección", "Complete" */
  corePowerLabel: string;
  /** Reihenfolge der Entwicklungsstufen der Kernmacht */
  corePowerStages: string[];
}
