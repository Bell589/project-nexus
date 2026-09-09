import type { Character } from "../types/character.js";

const characters = new Map<string, Character>();

export const CharacterStore = {
  all(): Character[] {
    return Array.from(characters.values());
  },
  get(id: string): Character | undefined {
    return characters.get(id);
  },
  save(character: Character): Character {
    characters.set(character.id, character);
    return character;
  },
  delete(id: string): boolean {
    return characters.delete(id);
  },
};
