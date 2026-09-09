import { BIJUU } from "./bijuu.js";
import { OTSUTSUKI } from "./otsutsuki.js";
import { ESPERS } from "./espers.js";
import type { WorldEncounterDefinition } from "../types/worldEncounter.js";

export const WORLD_ENCOUNTERS: WorldEncounterDefinition[] = [
  { id: "encounter-spektralritter-wandering", worldId: "avalon", entityType: "pact_creature", entityId: "origin-spektralritter", possibleLocationIds: [], rarity: "rare", spawnChance: null, spawnConditions: [], despawnConditions: ["Pakt erfolgreich geschlossen"], respawnRule: "can_return", globalAnnouncement: false, uniqueOwnershipRule: "none" },
  ...BIJUU.map((b) => ({
    id: `encounter-${b.id}`, worldId: "ninja_welt" as const, entityType: "bijuu" as const, entityId: b.id,
    possibleLocationIds: [], rarity: "legendary" as const, spawnChance: null, spawnConditions: [], despawnConditions: [],
    respawnRule: "unique_until_released" as const, globalAnnouncement: true, uniqueOwnershipRule: "single_active_owner" as const,
  })),
  ...OTSUTSUKI.map((o) => ({
    id: `encounter-${o.id}`, worldId: "ninja_welt" as const, entityType: "otsutsuki" as const, entityId: o.id,
    possibleLocationIds: [], rarity: "mythic" as const, spawnChance: null, spawnConditions: [], despawnConditions: [],
    respawnRule: "consumed_on_success" as const, globalAnnouncement: true, uniqueOwnershipRule: "single_world_instance" as const,
  })),
  ...ESPERS.map((e) => ({
    id: `encounter-${e.id}`, worldId: "avalon" as const, entityType: "esper" as const, entityId: e.id,
    possibleLocationIds: [], rarity: "mythic" as const, spawnChance: null, spawnConditions: [], despawnConditions: [],
    respawnRule: "unique_until_released" as const, globalAnnouncement: true, uniqueOwnershipRule: "single_active_owner" as const,
  })),
];
