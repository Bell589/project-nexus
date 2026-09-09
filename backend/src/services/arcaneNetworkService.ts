import { LOCATIONS } from "../data/locations.js";
import { CharacterStore } from "../db/memoryStore.js";
import { ArcaneNodeStore } from "../db/arcaneNodeStore.js";
import { getKampfkraft, ValidationError } from "./characterService.js";

export function claimArcaneNode(characterId: string, locationId: string): Record<string, string> {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (character.worldId !== "avalon") {
    throw new ValidationError("Nur Magier in Avalon können arkane Knoten beanspruchen");
  }

  const location = LOCATIONS.find((l) => l.id === locationId);
  if (!location || location.type !== "arkaner_knoten") {
    throw new ValidationError(`"${locationId}" ist kein arkaner Knoten`);
  }

  const currentController = ArcaneNodeStore.getController(locationId);
  if (currentController) {
    const holder = CharacterStore.get(currentController);
    if (holder && getKampfkraft(holder) >= getKampfkraft(character)) {
      throw new ValidationError(
        `Knoten wird bereits von einem stärkeren oder gleich starken Magier kontrolliert (${holder.characterName})`
      );
    }
  }

  ArcaneNodeStore.setController(locationId, characterId);
  return ArcaneNodeStore.allControllers();
}

export function getArcaneNodeControllers(): Record<string, string> {
  return ArcaneNodeStore.allControllers();
}
