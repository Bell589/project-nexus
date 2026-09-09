import { CharacterStore } from "../db/memoryStore.js";
import { ValidationError } from "./characterService.js";
import type { KampfkraftComponents } from "../types/kampfkraft.js";
import type { Character } from "../types/character.js";

const VALID_COMPONENTS: (keyof KampfkraftComponents)[] = [
  "erfahrung",
  "ausruestung",
  "faehigkeiten",
  "systemBeherrschung",
  "erfolge",
  "training",
];

export function trainComponent(
  characterId: string,
  component: string,
  amount: number
): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);

  if (!VALID_COMPONENTS.includes(component as keyof KampfkraftComponents)) {
    throw new ValidationError(
      `Ungültige Komponente "${component}". Erlaubt: ${VALID_COMPONENTS.join(", ")}`
    );
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new ValidationError("amount muss eine positive Zahl sein");
  }

  const key = component as keyof KampfkraftComponents;
  character.kampfkraftComponents[key] += amount;

  return CharacterStore.save(character);
}
