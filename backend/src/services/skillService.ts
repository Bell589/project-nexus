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
  const hakiSkills=["Wahrnehmung (Kenbunshoku)","Verstärkung (Busoshoku)","Dominanz (Haoshoku)"];
  const isHaki=hakiSkills.includes(skillName);
  if (isHaki) {
    if(character.worldId!=="ozeanwelt" || character.origin.status!=="completed") throw new ValidationError("Haki-Training wird erst nach dem Insel-Ursprung verfügbar.");
    if(!["insel-goldbucht","marine-hq"].includes(character.currentLocationId??"")) throw new ValidationError("Du musst einen bekannten Haki-Trainingsort aufsuchen (Goldbucht oder Marine-HQ).");
    if(skillName==="Dominanz (Haoshoku)" && character.kampfkraftComponents.erfolge < 20) throw new ValidationError("Haoshoku ist selten: Du brauchst zuerst mindestens 20 Erfolge-Kampfkraft.");
  } else if (!faction.baseSkills.includes(skillName)) {
    throw new ValidationError(
      `"${skillName}" ist keine Grundfähigkeit von ${faction.name}. Verfügbar: ${faction.baseSkills.join(", ")}`
    );
  }

  const maxLevel = Math.max(character.origin.status === "completed" ? 1 : 0, Math.floor(character.kampfkraftComponents.faehigkeiten / KAMPFKRAFT_PER_SKILL_LEVEL));
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
