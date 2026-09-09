import type { ActiveWorldEncounter } from "../types/worldEncounter.js";
const active = new Map<string, ActiveWorldEncounter>();
export const WorldEncounterStore = {
  all: () => Array.from(active.values()),
  get: (definitionId: string) => active.get(definitionId),
  save: (encounter: ActiveWorldEncounter) => { active.set(encounter.definitionId, encounter); return encounter; },
  delete: (definitionId: string) => active.delete(definitionId),
};
