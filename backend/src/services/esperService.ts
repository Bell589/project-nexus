import { ESPERS } from "../data/espers.js";
import { ESPER_STAGES } from "../types/esper.js";
import { CharacterStore } from "../db/memoryStore.js";
import { GlobalUniquenessRegistry } from "../db/globalUniquenessRegistry.js";
import { getKampfkraft, ValidationError } from "./characterService.js";
import { stageThresholdFor } from "../types/corePowerThresholds.js";
import { despawnEntityEncounter, isEntityEncounterActive } from "./worldEncounterService.js";
import type { Character } from "../types/character.js";
import type { EsperOrigin } from "../types/esper.js";

const CATEGORY = "esper";
const ESPER_TRIAL_MIN_KAMPFKRAFT = 200; // Esper sind gottähnlich - deutlich höhere Hürde als normale Unique Power

function requireMagier(characterId: string): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (character.worldId !== "avalon" || character.factionId !== "magier") {
    throw new ValidationError("Nur Magier in Avalon können einen Esper-Pakt anstreben");
  }
  return character;
}

/** Liefert alle Esper, die aktuell an niemanden gebunden sind ("auf der Weltkarte" verfügbar). */
export function listAvailableEspers(): EsperOrigin[] {
  return ESPERS.filter((e) => isEntityEncounterActive("esper", e.id) && !GlobalUniquenessRegistry.getBoundTo(CATEGORY, e.id));
}

/**
 * Prüfung bestehen und Pakt schließen. Erfolgschance hängt von der eigenen
 * Kampfkraft ab. Bei Misserfolg bleibt der Esper frei (kein Verbrauch).
 * Bei Erfolg wird die Bindung ATOMAR geprüft - falls in der Zwischenzeit ein
 * anderer Charakter denselben Esper gebunden hat, schlägt die Aktion fehl.
 */
export function attemptEsperPact(characterId: string, esperId: string): Character {
  const character = requireMagier(characterId);
  if (character.esperPact) {
    throw new ValidationError("Charakter hat bereits einen Esper-Pakt");
  }

  const esper = ESPERS.find((e) => e.id === esperId);
  if (!esper) throw new ValidationError(`Esper "${esperId}" nicht gefunden`);
  if (!isEntityEncounterActive("esper", esperId)) throw new ValidationError(`${esper.name} ist aktuell nicht als Weltbegegnung erschienen.`);

  const existingBinding = GlobalUniquenessRegistry.getBoundTo(CATEGORY, esperId);
  if (existingBinding) {
    throw new ValidationError(
      `${esper.name} ist bereits an einen anderen Charakter gebunden - jeder Esper existiert weltweit nur einmal.`
    );
  }

  const kampfkraft = getKampfkraft(character);
  if (kampfkraft < ESPER_TRIAL_MIN_KAMPFKRAFT) {
    throw new ValidationError(
      `Kampfkraft zu niedrig für eine Esper-Prüfung (${kampfkraft.toFixed(0)}/${ESPER_TRIAL_MIN_KAMPFKRAFT}).`
    );
  }

  const trialChance = Math.min(0.85, kampfkraft / (kampfkraft + 300));
  if (Math.random() >= trialChance) {
    throw new ValidationError(
      `Die Prüfung von ${esper.name} wurde nicht bestanden. Der Esper bleibt frei - ein erneuter Versuch ist möglich.`
    );
  }

  // Doppelte Prüfung direkt vor dem Binden (schützt gegen Race Conditions)
  if (GlobalUniquenessRegistry.getBoundTo(CATEGORY, esperId)) {
    throw new ValidationError(`${esper.name} wurde soeben von einem anderen Charakter gebunden.`);
  }
  GlobalUniquenessRegistry.bind(CATEGORY, esperId, character.id);
  despawnEntityEncounter("esper", esperId);

  const stage0Abilities = esper.abilityPool.filter((a) => a.tier === "pakt").map((a) => ({
    name: a.name,
    kind: a.kind,
    description: a.description,
    powerup: a.powerup,
    resourceCost: a.resourceCost,
    requiresActivePowerup: a.requiresActivePowerup,
  }));

  character.esperPact = {
    esperId: esper.id,
    esperName: esper.name,
    stageIndex: 0,
    individualAbilities: stage0Abilities,
    developmentLog: [`Pakt mit ${esper.name} (${esper.element}) geschlossen nach bestandener Prüfung.`],
  };

  return CharacterStore.save(character);
}

const TIER_BY_STAGE = ["pakt", "resonanz", "manifestation", "verschmelzung", "finale_form"];

export function advanceEsperPact(characterId: string): Character {
  const character = requireMagier(characterId);
  if (!character.esperPact) throw new ValidationError("Charakter hat noch keinen Esper-Pakt");

  const esper = ESPERS.find((e) => e.id === character.esperPact!.esperId);
  if (!esper) throw new ValidationError("Esper nicht mehr im System gefunden");

  const maxStageIndex = ESPER_STAGES.length - 1;
  if (character.esperPact.stageIndex >= maxStageIndex) {
    throw new ValidationError("Esper-Verschmelzung hat bereits die finale Form erreicht.");
  }

  const nextStageIndex = character.esperPact.stageIndex + 1;
  const kampfkraft = getKampfkraft(character);
  const required = stageThresholdFor(nextStageIndex) * 3; // Esper-Fortschritt ist deutlich anspruchsvoller
  if (kampfkraft < required) {
    throw new ValidationError(
      `Kampfkraft zu niedrig für die nächste Esper-Stufe (${kampfkraft.toFixed(0)}/${required}).`
    );
  }

  const tier = TIER_BY_STAGE[nextStageIndex];
  const owned = character.esperPact.individualAbilities.map((a) => a.name);
  const newAbilities = esper.abilityPool
    .filter((a) => a.tier === tier && !owned.includes(a.name))
    .map((a) => ({
      name: a.name,
      kind: a.kind,
      description: a.description,
      powerup: a.powerup,
      resourceCost: a.resourceCost,
      requiresActivePowerup: a.requiresActivePowerup,
    }));

  character.esperPact.stageIndex = nextStageIndex;
  character.esperPact.individualAbilities.push(...newAbilities);
  character.esperPact.developmentLog.push(
    `Stufe "${ESPER_STAGES[nextStageIndex]}" erreicht${newAbilities.length ? ` - neu: ${newAbilities.map((a) => a.name).join(", ")}` : ""}`
  );

  return CharacterStore.save(character);
}
