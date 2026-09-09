import type { WorldId } from "./world.js";

export interface TrainerRequirement {
  minKampfkraft?: number;
  requiredItemIds?: string[];
  requiredMissionIds?: string[];
  clanIds?: string[];
  factionIds?: string[];
}

export interface MasterTrainerDefinition {
  id: string;
  worldId: WorldId;
  name: string;
  description: string;
  possibleLocationIds: string[];
  /** null = Spawnchance noch nicht final gebalanced. */
  spawnChance: number | null;
  abilityIds: string[];
  requirements: TrainerRequirement;
  placeholder?: boolean;
}
