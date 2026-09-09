import { FACTIONS } from "../data/factions.js";
import { CharacterStore } from "../db/memoryStore.js";
import { ValidationError } from "./characterService.js";
import type { Character } from "../types/character.js";

const KAMPFKRAFT_PER_SKILL_LEVEL = 10;

export function trainSkill(characterId: string, skillName: string): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);

  const faction = FACTIONS.find((f) => f.id === character.factionId);
  if (!faction) throw new ValidationError("Fraktion nicht gefunden");
  if (!faction.baseSkills.includes(skillName)) {
    throw new ValidationError(
      `"${skillName}" ist keine Grundfähigkeit von ${faction.name}. Verfügbar: ${faction.baseSkills.join(", ")}`
    );
  }

  const maxLevel = Math.floor(character.kampfkraftComponents.faehigkeiten / KAMPFKRAFT_PER_SKILL_LEVEL);
  const existing = character.skills.find((s) => s.name === skillName);
  const currentLevel = existing?.level ?? 0;

  if (currentLevel >= maxLevel) {
    throw new ValidationError(
      `Nicht genug Fähigkeiten-Kampfkraft für nächste Stufe (benötigt: ${(currentLevel + 1) * KAMPFKRAFT_PER_SKILL_LEVEL}, vorhanden: ${character.kampfkraftComponents.faehigkeiten})`
    );
  }

  if (existing) {
    existing.level += 1;
  } else {
    character.skills.push({ name: skillName, level: 1 });
  }
  return CharacterStore.save(character);
}
