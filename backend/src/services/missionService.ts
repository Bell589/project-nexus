import { MISSIONS } from "../data/missions.js";
import { CharacterStore } from "../db/memoryStore.js";
import { ValidationError } from "./characterService.js";
import { getKampfkraft } from "./characterService.js";
import { addItem } from "./inventoryService.js";
import type { Character } from "../types/character.js";
import type { Mission } from "../types/mission.js";

export function listMissionsForCharacter(characterId: string): Mission[] {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  return MISSIONS.filter((m) => m.worldId === character.worldId && (!m.factionIds || m.factionIds.includes(character.factionId)));
}

export function completeMission(characterId: string, missionId: string): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);

  const mission = MISSIONS.find((m) => m.id === missionId);
  if (!mission) throw new ValidationError(`Mission "${missionId}" nicht gefunden`);
  if (mission.worldId !== character.worldId) {
    throw new ValidationError("Mission gehört nicht zur Welt des Charakters");
  }
  if (character.completedMissionIds.includes(missionId)) {
    throw new ValidationError("Mission bereits abgeschlossen");
  }

  if(character.origin.status!=="completed") throw new ValidationError("Schließe zuerst deinen Welt-Ursprung ab.");
  if(mission.requiredLocationId && character.currentLocationId!==mission.requiredLocationId) throw new ValidationError("Du bist nicht am Missionsort. Reise zuerst zum angegebenen Ziel.");
  if(mission.factionIds && !mission.factionIds.includes(character.factionId)) throw new ValidationError("Diese Mission gehört nicht zu deiner Fraktion.");

  const kampfkraft = getKampfkraft(character);
  if (kampfkraft < mission.minKampfkraft) {
    throw new ValidationError(
      `Kampfkraft zu niedrig (${kampfkraft.toFixed(0)}/${mission.minKampfkraft})`
    );
  }

  for (const [key, value] of Object.entries(mission.rewardComponents)) {
    const k = key as keyof Character["kampfkraftComponents"];
    character.kampfkraftComponents[k] += value ?? 0;
  }
  character.gold += mission.rewardGold ?? 100;
  character.completedMissionIds.push(missionId);
  CharacterStore.save(character);

  if (mission.rewardItemId) {
    return addItem(characterId, mission.rewardItemId, 1);
  }
  return character;
}
