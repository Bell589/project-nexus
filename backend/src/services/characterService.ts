import { nanoid } from "nanoid";
import { WORLDS } from "../data/worlds.js";
import { FACTIONS } from "../data/factions.js";
import { ITEMS } from "../data/items.js";
import { CharacterStore } from "../db/memoryStore.js";
import { calculateKampfkraft } from "../types/kampfkraft.js";
import type { Character } from "../types/character.js";
import type { WorldId } from "../types/world.js";
import type { KampfkraftComponents } from "../types/kampfkraft.js";

export class ValidationError extends Error {}

interface CreateCharacterInput {
  ownerName: string;
  characterName: string;
  worldId: WorldId;
  factionId: string;
}

export function createCharacter(input: CreateCharacterInput): Character {
  const world = WORLDS.find((w) => w.id === input.worldId);
  if (!world) throw new ValidationError(`Unbekannte Welt: ${input.worldId}`);

  const faction = FACTIONS.find((f) => f.id === input.factionId);
  if (!faction || faction.worldId !== input.worldId) {
    throw new ValidationError(
      `Fraktion "${input.factionId}" gehört nicht zu Welt "${input.worldId}"`
    );
  }

  if (!input.characterName?.trim()) {
    throw new ValidationError("characterName darf nicht leer sein");
  }

  const character: Character = {
    id: nanoid(),
    ownerName: input.ownerName,
    characterName: input.characterName.trim(),
    worldId: input.worldId,
    factionId: input.factionId,
    kampfkraftComponents: {
      erfahrung: 0,
      ausruestung: 0,
      faehigkeiten: 0,
      systemBeherrschung: 0,
      erfolge: 0,
      training: 0,
    },
    corePower: null, // wird erst freigeschaltet, sobald genug Kampfkraft erreicht ist
    selfAssignedRank: null,
    crewId: null,
    inventory: [],
    equipped: { waffe: null, ruestung: null, accessoire: null },
    skills: [],
    completedMissionIds: [],
    activeDomainRuleId: null,
    fusedInto: null,
    createdAt: new Date().toISOString(),
  };

  return CharacterStore.save(character);
}

export function getCharacter(id: string): Character {
  const character = CharacterStore.get(id);
  if (!character) throw new ValidationError(`Charakter "${id}" nicht gefunden`);
  return character;
}

export function listCharacters(): Character[] {
  return CharacterStore.all();
}

export function getKampfkraft(character: Character): number {
  return calculateKampfkraft(effectiveKampfkraftComponents(character));
}

/** Basis-Kampfkraftkomponenten + Boni ausgerüsteter Items */
export function effectiveKampfkraftComponents(character: Character): KampfkraftComponents {
  const result: KampfkraftComponents = { ...character.kampfkraftComponents };
  const equippedItemIds = Object.values(character.equipped).filter(
    (id): id is string => id !== null
  );
  for (const itemId of equippedItemIds) {
    const item = ITEMS.find((i) => i.id === itemId);
    if (!item) continue;
    for (const [key, bonus] of Object.entries(item.statBonuses)) {
      const k = key as keyof KampfkraftComponents;
      result[k] += bonus ?? 0;
    }
  }
  return result;
}
