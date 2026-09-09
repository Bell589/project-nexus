import type { KampfkraftComponents } from "./kampfkraft.js";
import type { Ability } from "./ability.js";

export interface FusionState {
  id: string;
  characterAId: string;
  characterBId: string;
  fusedName: string;
  combinedKampfkraftComponents: KampfkraftComponents;
  combinedAbilities: Ability[];
  active: boolean;
  createdAt: string;
}
