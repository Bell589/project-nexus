import type { WorldId } from "./world.js";
import type { AbilityAcquisitionMethod } from "./ability.js";

export interface DiscoveryDefinition {
  id: string;
  worldId: WorldId;
  targetType: "relic" | "ancient_magic" | "resurreccion_path" | "pact_entity" | "legendary_entity" | "other";
  targetId: string;
  acquisitionMethod: AbilityAcquisitionMethod;
  hiddenLocationIds: string[];
  discoveryHints: string[];
  requiredConditions: string[];
  rarity: "uncommon" | "rare" | "legendary" | "mythic";
  uniqueOwnership: boolean;
  spawnRule: "fixed_hidden" | "dynamic" | "world_event" | "manual_tuning_pending";
}
