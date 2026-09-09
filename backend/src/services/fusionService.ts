import { nanoid } from "nanoid";
import { CharacterStore } from "../db/memoryStore.js";
import { FusionStateStore } from "../db/fusionStateStore.js";
import { ValidationError } from "./characterService.js";
import type { KampfkraftComponents } from "../types/kampfkraft.js";
import type { FusionState } from "../types/fusionState.js";

/**
 * Magierfusion (nicht zu verwechseln mit Ritterverschmelzung oder
 * Esperverschmelzung - technisch komplett getrennte Systeme). Erzeugt
 * einen TEMPORÄREN Fusionszustand statt eines dauerhaften neuen Charakters.
 * Beide Ausgangscharaktere bleiben unverändert und eigenständig bestehen.
 */
export function fuseCharacters(characterAId: string, characterBId: string, fusedName: string): FusionState {
  if (characterAId === characterBId) {
    throw new ValidationError("Ein Charakter kann nicht mit sich selbst fusionieren");
  }

  const a = CharacterStore.get(characterAId);
  const b = CharacterStore.get(characterBId);
  if (!a) throw new ValidationError(`Charakter "${characterAId}" nicht gefunden`);
  if (!b) throw new ValidationError(`Charakter "${characterBId}" nicht gefunden`);

  if (a.worldId !== "avalon" || b.worldId !== "avalon") {
    throw new ValidationError("Magierfusion ist nur in Avalon möglich");
  }
  if (a.factionId !== "magier" || b.factionId !== "magier") {
    throw new ValidationError("Nur Magier können fusionieren");
  }
  if (!fusedName?.trim()) {
    throw new ValidationError("fusedName darf nicht leer sein");
  }

  const combinedComponents = {} as KampfkraftComponents;
  for (const key of Object.keys(a.kampfkraftComponents) as (keyof KampfkraftComponents)[]) {
    combinedComponents[key] = a.kampfkraftComponents[key] + b.kampfkraftComponents[key];
  }

  const combinedAbilities = [
    ...(a.uniquePower?.individualAbilities ?? []),
    ...(b.uniquePower?.individualAbilities ?? []),
    ...(a.spektralritterPact?.individualAbilities ?? []),
    ...(b.spektralritterPact?.individualAbilities ?? []),
  ];

  const state: FusionState = {
    id: nanoid(),
    characterAId,
    characterBId,
    fusedName: fusedName.trim(),
    combinedKampfkraftComponents: combinedComponents,
    combinedAbilities,
    active: true,
    createdAt: new Date().toISOString(),
  };

  return FusionStateStore.save(state);
}

export function getFusionState(id: string): FusionState {
  const state = FusionStateStore.get(id);
  if (!state) throw new ValidationError(`Fusionszustand "${id}" nicht gefunden`);
  return state;
}

/** Löst die Fusion auf - danach kämpfen/handeln beide Charaktere wieder unabhängig. */
export function dissolveFusion(id: string): FusionState {
  const state = getFusionState(id);
  state.active = false;
  return FusionStateStore.save(state);
}
