/**
 * Kampfkraft ist keine "Levelzahl", sondern ein aggregierter Wert aus mehreren
 * Quellen. Es gibt keine feste Obergrenze (siehe DIE PHILOSOPHIE).
 */
export interface KampfkraftComponents {
  erfahrung: number;
  ausruestung: number;
  faehigkeiten: number;
  systemBeherrschung: number;
  erfolge: number;
  training: number;
}

export const KAMPFKRAFT_WEIGHTS: Record<keyof KampfkraftComponents, number> = {
  erfahrung: 1.0,
  ausruestung: 1.0,
  faehigkeiten: 1.2,
  systemBeherrschung: 1.5, // Beherrschung der Kernmacht zählt am stärksten
  erfolge: 0.8,
  training: 1.0,
};

export function calculateKampfkraft(c: KampfkraftComponents): number {
  return Object.entries(c).reduce((sum, [key, value]) => {
    const weight = KAMPFKRAFT_WEIGHTS[key as keyof KampfkraftComponents];
    return sum + value * weight;
  }, 0);
}
