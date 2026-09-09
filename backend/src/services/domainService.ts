import { DOMAIN_RULES } from "../data/domainRules.js";
import { FACTIONS } from "../data/factions.js";
import { CharacterStore } from "../db/memoryStore.js";
import { ValidationError } from "./characterService.js";
import type { Character } from "../types/character.js";

export function selectDomainRule(characterId: string, ruleId: string): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (character.factionId !== "shinigami") {
    throw new ValidationError("Nur Shinigami können eine Domäne manifestieren");
  }

  const faction = FACTIONS.find((f) => f.id === "shinigami")!;
  const domaenStageIndex = faction.corePowerStages.indexOf("Domäne");

  if (!character.uniquePower || character.uniquePower.stageIndex < domaenStageIndex) {
    throw new ValidationError(
      `Seelenwaffe muss erst die Stufe "Domäne" erreichen (aktuell: ${
        character.uniquePower ? faction.corePowerStages[character.uniquePower.stageIndex] : "keine Unique Power"
      })`
    );
  }

  const rule = DOMAIN_RULES.find((r) => r.id === ruleId);
  if (!rule) throw new ValidationError(`Domänen-Regel "${ruleId}" nicht gefunden`);

  character.activeDomainRuleId = ruleId;
  return CharacterStore.save(character);
}
