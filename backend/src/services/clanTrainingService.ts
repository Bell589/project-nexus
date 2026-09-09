import { CLANS } from "../data/clans.js";
import { CharacterStore } from "../db/memoryStore.js";
import { ValidationError } from "./characterService.js";
import type { Character } from "../types/character.js";

export function advanceClanTraining(characterId: string, pathId: string): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (!character.clanId) throw new ValidationError("Charakter besitzt keinen dauerhaften Clan für dieses Training");
  const clan = CLANS.find((c) => c.id === character.clanId);
  if (!clan) throw new ValidationError("Clan ist nicht mehr im Datenkatalog vorhanden");
  const path = clan.abilityPaths.find((p) => p.id === pathId);
  if (!path) throw new ValidationError("Dieser Trainingspfad gehört nicht zum Clan des Charakters");

  let state = character.abilityProgress.find((p) => p.abilityId === path.id && p.sourceType === "clan" && p.sourceId === clan.id);
  if (!state) {
    state = { abilityId: path.id, sourceType: "clan", sourceId: clan.id, acquisitionMethod: "CLAN_TRAINING", stageIndex: 0, unlockedStageIds: [path.stages[0]], active: true, developmentLog: [`Clantraining begonnen: ${path.name} – ${path.stages[0]}`] };
    character.abilityProgress.push(state);
  } else {
    if (state.stageIndex >= path.stages.length - 1) throw new ValidationError("Dieser Clan-Trainingspfad hat bereits seine aktuell definierte höchste Stufe erreicht");
    state.stageIndex += 1;
    state.unlockedStageIds.push(path.stages[state.stageIndex]);
    state.developmentLog.push(`Clantraining fortgesetzt: ${path.stages[state.stageIndex]}`);
  }
  return CharacterStore.save(character);
}
