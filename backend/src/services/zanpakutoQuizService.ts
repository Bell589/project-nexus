import { resolveQuizVariant } from "../data/zanpakutoQuiz.js";
import { UNIQUE_POWER_ORIGINS } from "../data/uniquePowerOrigins.js";
import { CharacterStore } from "../db/memoryStore.js";
import { getKampfkraft, ValidationError } from "./characterService.js";
import { stageThresholdFor } from "../types/corePowerThresholds.js";
import { generateUniquePower } from "./uniquePowerGenerationService.js";
import type { UniquePowerInstance } from "../types/uniquePower.js";

/**
 * Wertet das Persönlichkeits-/Kampfstil-Quiz aus und generiert eine Zanpakutō
 * mit der dazu passenden, gewichteten Variante statt komplettem Zufall.
 * Bindet noch nichts - Ergebnis geht wie bei searchForUniquePower über
 * acquireUniquePower zurück an den Server.
 */
export function generateZanpakutoFromQuiz(characterId: string, answerIndices: number[]): UniquePowerInstance {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (character.worldId !== "soul_society" || character.factionId !== "shinigami") {
    throw new ValidationError("Das Zanpakutō-Quiz ist nur für Shinigami verfügbar");
  }
  if (character.uniquePower) {
    throw new ValidationError("Charakter besitzt bereits eine Unique Power");
  }

  const kampfkraft = getKampfkraft(character);
  const requiredMin = stageThresholdFor(0);
  if (kampfkraft < requiredMin) {
    throw new ValidationError(`Kampfkraft zu niedrig (${kampfkraft.toFixed(0)}/${requiredMin}). Trainiere erst weiter.`);
  }

  const origin = UNIQUE_POWER_ORIGINS.find((o) => o.id === "origin-zanpakutou");
  if (!origin) throw new ValidationError("Zanpakutō-Origin nicht gefunden");

  const preferredVariant = resolveQuizVariant(answerIndices);
  return generateUniquePower(origin, preferredVariant);
}
