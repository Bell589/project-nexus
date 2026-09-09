import { UNIQUE_POWER_ORIGINS } from "../data/uniquePowerOrigins.js";
import { CharacterStore } from "../db/memoryStore.js";
import { getKampfkraft, ValidationError } from "./characterService.js";
import { stageThresholdFor } from "../types/corePowerThresholds.js";
import { generateUniquePower, advanceUniquePower } from "./uniquePowerGenerationService.js";
import type { Character } from "../types/character.js";
import type { UniquePowerInstance } from "../types/uniquePower.js";

function requireShinobi(characterId: string): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (character.worldId !== "ninja_welt") {
    throw new ValidationError("Dōjutsu ist nur in der Ninja-Welt verfügbar");
  }
  return character;
}

function doujutsuOrigin() {
  const origin = UNIQUE_POWER_ORIGINS.find((o) => o.id === "origin-doujutsu");
  if (!origin) throw new ValidationError("Dōjutsu-Origin nicht gefunden");
  return origin;
}

export function searchForDoujutsu(characterId: string): UniquePowerInstance {
  const character = requireShinobi(characterId);
  if (character.doujutsu) {
    throw new ValidationError("Charakter besitzt bereits ein Dōjutsu");
  }
  return generateUniquePower(doujutsuOrigin());
}

export function acquireDoujutsu(characterId: string, instance: UniquePowerInstance): Character {
  const character = requireShinobi(characterId);
  if (character.doujutsu) {
    throw new ValidationError("Charakter besitzt bereits ein Dōjutsu");
  }
  if (!instance?.originId || instance.originId !== "origin-doujutsu") {
    throw new ValidationError("Ungültige Dōjutsu-Instanz");
  }

  character.doujutsu = {
    originId: instance.originId,
    category: instance.category,
    variant: instance.variant,
    generatedName: instance.generatedName,
    stageIndex: 0,
    individualAbilities: instance.individualAbilities,
    developmentLog: instance.developmentLog,
  };
  return CharacterStore.save(character);
}

export function advanceDoujutsu(characterId: string): Character {
  const character = requireShinobi(characterId);
  if (!character.doujutsu) throw new ValidationError("Charakter besitzt noch kein Dōjutsu");

  const origin = doujutsuOrigin();
  const maxStageIndex = origin.stageDefinitions.length - 1;
  if (character.doujutsu.stageIndex >= maxStageIndex) {
    throw new ValidationError("Dōjutsu ist bereits in unbegrenzter Weiterentwicklung.");
  }

  const nextStageIndex = character.doujutsu.stageIndex + 1;
  const kampfkraft = getKampfkraft(character);
  const required = stageThresholdFor(nextStageIndex);
  if (kampfkraft < required) {
    throw new ValidationError(`Kampfkraft zu niedrig für nächste Dōjutsu-Stufe (${kampfkraft.toFixed(0)}/${required}).`);
  }

  character.doujutsu = advanceUniquePower(character.doujutsu, origin);
  return CharacterStore.save(character);
}
