export interface Spektralritter {
  id: string;
  name: string;
  description: string;
  /** abilitiesByStage[stageIndex] passend zu SPEKTRALRITTER_STAGES */
  abilitiesByStage: string[][];
}

export const SPEKTRALRITTER_STAGES = [
  "Vertrag",
  "Resonanz",
  "Rüstung",
  "Teilverschmelzung",
  "Vollständige Verschmelzung",
  "Unbegrenzte Weiterentwicklung",
];
