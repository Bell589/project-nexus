import { SPEKTRALRITTER } from "../data/spektralritter.js";
import { SPEKTRALRITTER_STAGES } from "../types/spektralritter.js";
import { CharacterStore } from "../db/memoryStore.js";
import { getKampfkraft, ValidationError } from "./characterService.js";
import { stageThresholdFor } from "../types/corePowerThresholds.js";
import type { Character } from "../types/character.js";
import type { Spektralritter } from "../types/spektralritter.js";

function requireMagier(characterId: string): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (character.worldId !== "avalon" || character.factionId !== "magier") {
    throw new ValidationError("Nur Magier in Avalon können einen Pakt mit einem Spektralritter schließen");
  }
  return character;
}

export function searchForSpektralritter(characterId: string): Spektralritter {
  const character = requireMagier(characterId);
  if (character.spektralritterPact) {
    throw new ValidationError("Charakter hat bereits einen Pakt mit einem Spektralritter");
  }
  return SPEKTRALRITTER[Math.floor(Math.random() * SPEKTRALRITTER.length)];
}

export function formPact(characterId: string, ritterId: string): Character {
  const character = requireMagier(characterId);
  if (character.spektralritterPact) {
    throw new ValidationError("Charakter hat bereits einen Pakt mit einem Spektralritter");
  }

  const ritter = SPEKTRALRITTER.find((r) => r.id === ritterId);
  if (!ritter) throw new ValidationError(`Spektralritter "${ritterId}" nicht im Katalog`);

  character.spektralritterPact = {
    ritterId: ritter.id,
    name: ritter.name,
    stageIndex: 0,
    unlockedAbilities: [...ritter.abilitiesByStage[0]],
  };

  return CharacterStore.save(character);
}

export function advancePactStage(characterId: string): Character {
  const character = requireMagier(characterId);
  if (!character.spektralritterPact) {
    throw new ValidationError("Charakter hat noch keinen Pakt geschlossen");
  }

  const ritter = SPEKTRALRITTER.find((r) => r.id === character.spektralritterPact!.ritterId);
  if (!ritter) throw new ValidationError("Spektralritter nicht mehr im Katalog gefunden");

  const maxStageIndex = SPEKTRALRITTER_STAGES.length - 1;
  if (character.spektralritterPact.stageIndex >= maxStageIndex) {
    throw new ValidationError("Pakt ist bereits in unbegrenzter Weiterentwicklung.");
  }

  const nextStageIndex = character.spektralritterPact.stageIndex + 1;
  const kampfkraft = getKampfkraft(character);
  const required = stageThresholdFor(nextStageIndex);
  if (kampfkraft < required) {
    throw new ValidationError(
      `Kampfkraft zu niedrig für nächste Stufe (${kampfkraft.toFixed(0)}/${required}).`
    );
  }

  character.spektralritterPact.stageIndex = nextStageIndex;
  character.spektralritterPact.unlockedAbilities.push(...(ritter.abilitiesByStage[nextStageIndex] ?? []));

  return CharacterStore.save(character);
}
