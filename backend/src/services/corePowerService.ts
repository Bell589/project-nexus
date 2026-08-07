import { FACTIONS } from "../data/factions.js";
import { CharacterStore } from "../db/memoryStore.js";
import { getKampfkraft } from "./characterService.js";
import { stageThresholdFor } from "../types/corePowerThresholds.js";
import { ValidationError } from "./characterService.js";
import type { Character } from "../types/character.js";

interface AcquireInput {
  characterId: string;
  archetype: string; // z.B. "Relikt des Blitzes"
  name: string; // z.B. "Donner des Himmels"
}

export function acquireCorePower(input: AcquireInput): Character {
  const character = CharacterStore.get(input.characterId);
  if (!character) throw new ValidationError(`Charakter "${input.characterId}" nicht gefunden`);
  if (character.corePower) {
    throw new ValidationError("Charakter besitzt bereits eine Kernmacht");
  }

  const kampfkraft = getKampfkraft(character);
  const requiredMin = stageThresholdFor(0);
  if (kampfkraft < requiredMin) {
    throw new ValidationError(
      `Kampfkraft zu niedrig (${kampfkraft.toFixed(0)}/${requiredMin}). Trainiere erst weiter.`
    );
  }

  if (!input.archetype?.trim() || !input.name?.trim()) {
    throw new ValidationError("archetype und name dürfen nicht leer sein");
  }

  character.corePower = {
    archetype: input.archetype.trim(),
    name: input.name.trim(),
    stageIndex: 0,
    unlockedAbilities: [],
  };

  return CharacterStore.save(character);
}

export function advanceCorePowerStage(characterId: string): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (!character.corePower) {
    throw new ValidationError("Charakter besitzt noch keine Kernmacht");
  }

  const faction = FACTIONS.find((f) => f.id === character.factionId);
  if (!faction) throw new ValidationError("Fraktion nicht gefunden");

  const nextStageIndex = character.corePower.stageIndex + 1;
  const isFinalStage = nextStageIndex >= faction.corePowerStages.length - 1;
  const maxStageIndex = faction.corePowerStages.length - 1;

  if (character.corePower.stageIndex >= maxStageIndex) {
    // Letzte Stufe = "Unbegrenzte Weiterentwicklung" - kein Deckel mehr,
    // aber es gibt keine weitere benannte Stufe zum Freischalten.
    throw new ValidationError(
      "Kernmacht ist bereits in unbegrenzter Weiterentwicklung - keine weitere Stufe zum Freischalten."
    );
  }

  const kampfkraft = getKampfkraft(character);
  const required = stageThresholdFor(nextStageIndex);
  if (kampfkraft < required) {
    throw new ValidationError(
      `Kampfkraft zu niedrig für nächste Stufe (${kampfkraft.toFixed(0)}/${required}).`
    );
  }

  character.corePower.stageIndex = nextStageIndex;
  const stageName = faction.corePowerStages[nextStageIndex];
  character.corePower.unlockedAbilities.push(
    isFinalStage ? `${stageName} erreicht` : `Stufe erreicht: ${stageName}`
  );

  return CharacterStore.save(character);
}
