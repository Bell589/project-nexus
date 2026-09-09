import { CLANS } from "../data/clans.js";
import { UNIQUE_POWER_ORIGINS } from "../data/uniquePowerOrigins.js";
import { CharacterStore } from "../db/memoryStore.js";
import { ValidationError } from "./characterService.js";
import { generateUniquePower } from "./uniquePowerGenerationService.js";
import type { Character } from "../types/character.js";
import type { WorldId } from "../types/world.js";
import type { UniquePowerInstance } from "../types/uniquePower.js";

function requireCharacter(characterId: string): Character {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  return character;
}
export function listClans(worldId?: WorldId) { return worldId ? CLANS.filter((c) => c.worldId === worldId) : CLANS; }
export function joinClan(characterId: string, clanId: string): Character {
  const character = requireCharacter(characterId);
  if (character.clanId) throw new ValidationError("Charakter gehört bereits einem dauerhaften Clan an");
  const clan = CLANS.find((c) => c.id === clanId);
  if (!clan || clan.worldId !== character.worldId) throw new ValidationError(`Clan "${clanId}" ist für diese Welt nicht verfügbar`);
  if (clan.accessMode !== "character_creation" && clan.accessMode !== "training_unlock") throw new ValidationError("Dieser Clan kann nicht frei beigetreten werden; er benötigt ein besonderes Ereignis/Reward-System");
  if (clan.allowedRaceIds && !clan.allowedRaceIds.includes(character.raceId)) throw new ValidationError("Rasse ist für diesen Clan nicht zugelassen");
  if (clan.allowedFactionIds && !clan.allowedFactionIds.includes(character.factionId)) throw new ValidationError("Fraktion ist für diesen Clan nicht zugelassen");
  character.clanId = clanId;
  return CharacterStore.save(character);
}
/** Clan beeinflusst nur das Potenzial/den Variantenpool. Clan-Fähigkeiten werden NICHT automatisch vergeben. */
export function searchNinjutsuWithClanBonus(characterId: string): UniquePowerInstance {
  const character = requireCharacter(characterId);
  if (character.worldId !== "ninja_welt") throw new ValidationError("Ninjutsu-Suche ist nur in der Ninja-Welt verfügbar");
  const origin = UNIQUE_POWER_ORIGINS.find((o) => o.id === "origin-ninjutsu-stil");
  if (!origin) throw new ValidationError("Ninjutsu-Origin nicht gefunden");
  const clan = character.clanId ? CLANS.find((c) => c.id === character.clanId) : undefined;
  const variants = clan?.favoredVariants ?? [];
  const preferredVariant = variants.length ? variants[Math.floor(Math.random() * variants.length)] : undefined;
  const instance = generateUniquePower(origin, preferredVariant);
  if (clan) instance.developmentLog.push(`Clan ${clan.name} beeinflusst nur das Trainingspotenzial; Clan-Techniken müssen separat durch CLAN_TRAINING erlernt werden.`);
  return instance;
}
