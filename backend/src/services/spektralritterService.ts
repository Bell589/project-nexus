import { UNIQUE_POWER_ORIGINS } from "../data/uniquePowerOrigins.js";
import { CharacterStore } from "../db/memoryStore.js";
import { getKampfkraft, ValidationError } from "./characterService.js";
import { stageThresholdFor } from "../types/corePowerThresholds.js";
import { generateUniquePower, advanceUniquePower } from "./uniquePowerGenerationService.js";
import type { Character } from "../types/character.js";
import type { UniquePowerInstance } from "../types/uniquePower.js";
import { despawnEntityEncounter, isEntityEncounterActive } from "./worldEncounterService.js";
import { nanoid } from "nanoid";

function requireMagier(characterId: string): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (character.worldId !== "avalon" || character.factionId !== "magier") {
    throw new ValidationError("Nur Magier in Avalon können einen Pakt mit einem Spektralritter schließen");
  }
  return character;
}

function ritterOrigin() {
  const origin = UNIQUE_POWER_ORIGINS.find((o) => o.id === "origin-spektralritter");
  if (!origin) throw new ValidationError("Spektralritter-Origin nicht gefunden");
  return origin;
}

/** Sucht einen individuellen Spektralritter (Rolle + Name + Startfähigkeiten). Bindet noch nichts. */
export function searchForSpektralritter(characterId: string): UniquePowerInstance {
  const character = requireMagier(characterId);
  if (character.spektralritterPact) {
    throw new ValidationError("Charakter hat bereits einen Pakt mit einem Spektralritter");
  }
  if (!isEntityEncounterActive("pact_creature", "origin-spektralritter")) throw new ValidationError("Aktuell ist kein Magical Knight / Spektralritter als Weltbegegnung auffindbar.");
  return generateUniquePower(ritterOrigin());
}

/** Bindet exakt den zuvor gefundenen Ritter (kein erneutes Würfeln). */
export function formPact(characterId: string, instance: UniquePowerInstance): Character {
  const character = requireMagier(characterId);
  if (character.spektralritterPact) {
    throw new ValidationError("Charakter hat bereits einen Pakt mit einem Spektralritter");
  }
  if (!instance?.originId || instance.originId !== "origin-spektralritter") {
    throw new ValidationError("Ungültige Spektralritter-Instanz");
  }

  character.spektralritterPact = {
    originId: instance.originId, category: instance.category, variant: instance.variant, generatedName: instance.generatedName, stageIndex: 0, individualAbilities: instance.individualAbilities, developmentLog: instance.developmentLog,
  };
  character.pacts.push({ id: nanoid(), kind: "magical_knight", worldId: "avalon", entityId: instance.originId, entityName: instance.generatedName, status: "active", stageIndex: 0, abilityIds: instance.individualAbilities.map((a) => a.id ?? a.name), formedAt: new Date().toISOString(), developmentLog: [...instance.developmentLog] });
  despawnEntityEncounter("pact_creature", "origin-spektralritter");
  return CharacterStore.save(character);
}

export function advancePactStage(characterId: string): Character {
  const character = requireMagier(characterId);
  if (!character.spektralritterPact) {
    throw new ValidationError("Charakter hat noch keinen Pakt geschlossen");
  }

  const origin = ritterOrigin();
  const maxStageIndex = origin.stageDefinitions.length - 1;
  if (character.spektralritterPact.stageIndex >= maxStageIndex) {
    throw new ValidationError("Pakt ist bereits in unbegrenzter Weiterentwicklung.");
  }

  const nextStageIndex = character.spektralritterPact.stageIndex + 1;
  const kampfkraft = getKampfkraft(character);
  const required = stageThresholdFor(nextStageIndex);
  if (kampfkraft < required) {
    throw new ValidationError(`Kampfkraft zu niedrig für nächste Stufe (${kampfkraft.toFixed(0)}/${required}).`);
  }

  character.spektralritterPact = advanceUniquePower(character.spektralritterPact, origin);
  return CharacterStore.save(character);
}
