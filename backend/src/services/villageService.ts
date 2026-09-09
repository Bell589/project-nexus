import { VillageStore } from "../db/villageStore.js";
import { CharacterStore } from "../db/memoryStore.js";
import { ValidationError } from "./characterService.js";
import type { Village, VillageRank } from "../types/village.js";

const PROMOTABLE_RANKS: VillageRank[] = ["Genin", "Chūnin", "Jōnin", "Kage"];

function requireShinobi(characterId: string) {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (character.worldId !== "ninja_welt") throw new ValidationError("Nur Shinobi können einem Dorf beitreten");
  return character;
}

export function listVillages(): Village[] {
  return VillageStore.all();
}

export function joinVillage(villageId: string, characterId: string): Village {
  const village = VillageStore.get(villageId);
  if (!village) throw new ValidationError(`Dorf "${villageId}" nicht gefunden`);

  const character = requireShinobi(characterId);
  if (village.members.some((m) => m.characterId === characterId)) {
    throw new ValidationError("Charakter ist bereits Mitglied dieses Dorfes");
  }

  village.members.push({ characterId, rank: "Genin" });
  character.selfAssignedRank = "Genin";
  CharacterStore.save(character);
  return VillageStore.save(village);
}

/**
 * Rang wird durch den amtierenden Kage vergeben (oder, falls noch kein Kage
 * existiert, kann sich ein Jōnin selbst zum Kage erklären lassen - so
 * entsteht die erste Führung). Rang bleibt technisch von Kampfkraft getrennt.
 */
export function promote(villageId: string, actingCharacterId: string, targetCharacterId: string, rank: VillageRank): Village {
  const village = VillageStore.get(villageId);
  if (!village) throw new ValidationError(`Dorf "${villageId}" nicht gefunden`);
  if (!PROMOTABLE_RANKS.includes(rank)) throw new ValidationError(`Ungültiger Rang. Erlaubt: ${PROMOTABLE_RANKS.join(", ")}`);

  const target = village.members.find((m) => m.characterId === targetCharacterId);
  if (!target) throw new ValidationError("Zielcharakter ist nicht Mitglied dieses Dorfes");

  const currentKage = village.members.find((m) => m.rank === "Kage");

  if (rank === "Kage") {
    if (currentKage && currentKage.characterId !== actingCharacterId) {
      throw new ValidationError(`Es gibt bereits einen amtierenden ${village.kageTitle} - nur dieser kann den Titel weitergeben`);
    }
    if (!currentKage && actingCharacterId !== targetCharacterId) {
      throw new ValidationError(`Ohne amtierenden ${village.kageTitle} kann sich nur ein Jōnin selbst zum ${village.kageTitle} erklären lassen`);
    }
    if (!currentKage && target.rank !== "Jōnin") {
      throw new ValidationError(`Nur ein Jōnin kann erster ${village.kageTitle} werden`);
    }
    if (currentKage) currentKage.rank = "Jōnin"; // alter Kage tritt zurück auf Jōnin
  } else if (!currentKage) {
    // Ohne amtierenden Kage gibt es niemanden, der befördern könnte - also
    // darf sich jedes Mitglied selbst schrittweise hocharbeiten (Genin->
    // Chūnin->Jōnin), bis irgendwann ein erster Kage benannt wird.
    if (actingCharacterId !== targetCharacterId) {
      throw new ValidationError(`Ohne amtierenden ${village.kageTitle} kann sich nur jeder selbst befördern`);
    }
    const currentIndex = PROMOTABLE_RANKS.indexOf(target.rank);
    const nextIndex = PROMOTABLE_RANKS.indexOf(rank);
    if (nextIndex !== currentIndex + 1) {
      throw new ValidationError(`Ohne amtierenden ${village.kageTitle} sind nur Beförderungen um genau eine Stufe möglich (aktuell: ${target.rank})`);
    }
  } else {
    const acting = village.members.find((m) => m.characterId === actingCharacterId);
    if (!acting || acting.rank !== "Kage") {
      throw new ValidationError(`Nur der amtierende ${village.kageTitle} kann Ränge unterhalb von Kage vergeben`);
    }
  }

  target.rank = rank;
  const targetCharacter = CharacterStore.get(targetCharacterId);
  if (targetCharacter) {
    targetCharacter.selfAssignedRank = rank === "Kage" ? village.kageTitle : rank;
    CharacterStore.save(targetCharacter);
  }

  return VillageStore.save(village);
}
