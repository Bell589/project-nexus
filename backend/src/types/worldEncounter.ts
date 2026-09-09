import type { WorldId } from "./world.js";

export type EncounterEntityType = "bijuu" | "otsutsuki" | "esper" | "pact_creature" | "master_npc" | "legendary_entity";
export type EncounterRarity = "uncommon" | "rare" | "legendary" | "mythic";

export interface WorldEncounterDefinition {
  id: string;
  worldId: WorldId;
  entityType: EncounterEntityType;
  entityId: string;
  possibleLocationIds: string[];
  rarity: EncounterRarity;
  /** null = noch nicht final gebalanced; automatische Spawn-Rolls bleiben aus. */
  spawnChance: number | null;
  spawnConditions: string[];
  despawnConditions: string[];
  respawnRule: "unique_until_released" | "can_return" | "consumed_on_success" | "manual_tuning_pending";
  globalAnnouncement: boolean;
  uniqueOwnershipRule: "none" | "single_active_owner" | "single_world_instance";
}

export interface ActiveWorldEncounter {
  definitionId: string;
  activeLocationId: string;
  spawnedAt: string;
  participantCharacterIds: string[];
}
