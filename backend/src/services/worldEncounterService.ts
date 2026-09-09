import { WORLD_ENCOUNTERS } from "../data/worldEncounters.js";
import { WorldEncounterStore } from "../db/worldEncounterStore.js";
import { LOCATIONS } from "../data/locations.js";
import { ValidationError } from "./characterService.js";
import type { WorldId } from "../types/world.js";

export function listEncounterDefinitions(worldId?: WorldId) {
  return worldId ? WORLD_ENCOUNTERS.filter((e) => e.worldId === worldId) : WORLD_ENCOUNTERS;
}
export function listActiveEncounters(worldId?: WorldId) {
  const active = WorldEncounterStore.all();
  if (!worldId) return active;
  const ids = new Set(WORLD_ENCOUNTERS.filter((d) => d.worldId === worldId).map((d) => d.id));
  return active.filter((e) => ids.has(e.definitionId));
}
export function activateEncounter(definitionId: string, locationId?: string) {
  const def = WORLD_ENCOUNTERS.find((e) => e.id === definitionId);
  if (!def) throw new ValidationError(`Encounter "${definitionId}" nicht gefunden`);
  if (WorldEncounterStore.get(definitionId)) throw new ValidationError("Encounter ist bereits aktiv");
  const candidates = def.possibleLocationIds.length ? def.possibleLocationIds : LOCATIONS.filter((l) => l.worldId === def.worldId).map((l) => l.id);
  const chosen = locationId ?? candidates[Math.floor(Math.random() * candidates.length)];
  if (!chosen || !candidates.includes(chosen)) throw new ValidationError("Kein gültiger Spawnort für diesen Encounter verfügbar");
  return WorldEncounterStore.save({ definitionId, activeLocationId: chosen, spawnedAt: new Date().toISOString(), participantCharacterIds: [] });
}
export function despawnEncounter(definitionId: string) {
  if (!WorldEncounterStore.delete(definitionId)) throw new ValidationError("Encounter ist nicht aktiv");
}

export function isEntityEncounterActive(entityType: string, entityId: string): boolean {
  const def = WORLD_ENCOUNTERS.find((e) => e.entityType === entityType && e.entityId === entityId);
  return !!def && !!WorldEncounterStore.get(def.id);
}
export function despawnEntityEncounter(entityType: string, entityId: string): void {
  const def = WORLD_ENCOUNTERS.find((e) => e.entityType === entityType && e.entityId === entityId);
  if (def) WorldEncounterStore.delete(def.id);
}
