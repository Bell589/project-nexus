import { ITEMS } from "../data/items.js";
import { CharacterStore } from "../db/memoryStore.js";
import { ValidationError } from "./characterService.js";
import type { Character } from "../types/character.js";
import type { ItemSlot } from "../types/item.js";

function requireCharacter(characterId: string): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  return character;
}

function requireItem(itemId: string) {
  const item = ITEMS.find((i) => i.id === itemId);
  if (!item) throw new ValidationError(`Item "${itemId}" nicht gefunden`);
  return item;
}

export function addItem(characterId: string, itemId: string, quantity = 1): Character {
  const character = requireCharacter(characterId);
  requireItem(itemId);
  if (quantity <= 0) throw new ValidationError("quantity muss positiv sein");

  const slot = character.inventory.find((s) => s.itemId === itemId);
  if (slot) {
    slot.quantity += quantity;
  } else {
    character.inventory.push({ itemId, quantity });
  }
  return CharacterStore.save(character);
}

export function equipItem(characterId: string, itemId: string): Character {
  const character = requireCharacter(characterId);
  const item = requireItem(itemId);

  if (item.slot === "verbrauchsgut") {
    throw new ValidationError("Verbrauchsgüter können nicht ausgerüstet werden, nur benutzt");
  }
  const inSlot = character.inventory.find((s) => s.itemId === itemId);
  if (!inSlot || inSlot.quantity < 1) {
    throw new ValidationError("Item nicht im Inventar");
  }

  character.equipped[item.slot as ItemSlot] = itemId;
  return CharacterStore.save(character);
}

export function unequipItem(characterId: string, slot: ItemSlot): Character {
  const character = requireCharacter(characterId);
  character.equipped[slot] = null;
  return CharacterStore.save(character);
}

export function useConsumable(characterId: string, itemId: string): Character {
  const character = requireCharacter(characterId);
  const item = requireItem(itemId);
  if (item.slot !== "verbrauchsgut") {
    throw new ValidationError("Item ist kein Verbrauchsgut");
  }
  const inSlot = character.inventory.find((s) => s.itemId === itemId);
  if (!inSlot || inSlot.quantity < 1) {
    throw new ValidationError("Item nicht im Inventar");
  }

  for (const [key, bonus] of Object.entries(item.statBonuses)) {
    const k = key as keyof Character["kampfkraftComponents"];
    character.kampfkraftComponents[k] += bonus ?? 0;
  }

  inSlot.quantity -= 1;
  character.inventory = character.inventory.filter((s) => s.quantity > 0);
  return CharacterStore.save(character);
}
