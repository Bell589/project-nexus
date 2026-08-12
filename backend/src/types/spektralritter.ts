import type { Ability } from "./ability.js";

export interface Spektralritter {
  id: string;
  name: string;
  description: string;
  /** abilitiesByStage[stageIndex] passend zu SPEKTRALRITTER_STAGES */
  abilitiesByStage: Ability[][];
}

export const SPEKTRALRITTER_STAGES = [
  "Vertrag",
  "Resonanz",
  "Rüstung",
  "Teilverschmelzung",
  "Vollständige Verschmelzung",
  "Unbegrenzte Weiterentwicklung",
];
