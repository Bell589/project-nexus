import { nanoid } from "nanoid";
import { WORLDS } from "../data/worlds.js";
import { FACTIONS } from "../data/factions.js";
import { ITEMS } from "../data/items.js";
import { RACES } from "../data/races.js";
import { CLANS } from "../data/clans.js";
import { ORIGINS } from "../data/origins.js";
import { CharacterStore } from "../db/memoryStore.js";
import { calculateKampfkraft } from "../types/kampfkraft.js";
import type { Character } from "../types/character.js";
import type { WorldId } from "../types/world.js";
import type { KampfkraftComponents } from "../types/kampfkraft.js";

export class ValidationError extends Error {}

interface CreateCharacterInput {
  ownerId?: string | null;
  ownerName: string;
  characterName: string;
  worldId: WorldId;
  factionId?: string;
  raceId?: string;
  clanId?: string | null;
}

export function createCharacter(input: CreateCharacterInput): Character {
  const world = WORLDS.find((w) => w.id === input.worldId);
  if (!world) throw new ValidationError(`Unbekannte Welt: ${input.worldId}`);

  const derivedFactionId = input.factionId ?? (
    input.worldId === "ozeanwelt" ? "neutral_ocean" :
    input.worldId === "avalon" ? "magier" :
    input.worldId === "ninja_welt" ? "shinobi" : null
  );

  if (!input.characterName?.trim()) throw new ValidationError("characterName darf nicht leer sein");
  if (CharacterStore.all().some((c) => c.characterName.toLowerCase() === input.characterName.trim().toLowerCase())) {
    throw new ValidationError("Dieser Charaktername ist bereits vergeben");
  }

  const raceCandidates = RACES.filter((r) => r.worldId === input.worldId);
  const race = input.raceId ? raceCandidates.find((r) => r.id === input.raceId) : raceCandidates.length === 1 ? raceCandidates[0] : undefined;
  if (!race) throw new ValidationError("Für diesen Charakter muss eine gültige Rasse gewählt werden");
  const factionId: string = input.worldId === "soul_society"
    ? (race.id === "soul-hollow" ? "hollow" : "shinigami")
    : (derivedFactionId ?? "shinobi");
  const faction = factionId ? FACTIONS.find((f) => f.id === factionId) : undefined;
  if (!faction || faction.worldId !== input.worldId) throw new ValidationError("Keine gültige Startzugehörigkeit für diese Welt");

  let clanId: string | null = input.clanId ?? null;
  if (clanId) {
    const clan = CLANS.find((c) => c.id === clanId);
    if (!clan || clan.worldId !== input.worldId || clan.accessMode !== "character_creation") throw new ValidationError("Dieser Clan kann nicht bei der Charaktererstellung gewählt werden");
    if (clan.allowedRaceIds && !clan.allowedRaceIds.includes(race.id)) throw new ValidationError("Clan und Rasse sind nicht kompatibel");
    if (clan.allowedFactionIds && factionId !== "neutral_ocean" && !clan.allowedFactionIds.includes(factionId)) throw new ValidationError("Clan und Fraktion sind nicht kompatibel");
  }

  const character: Character = {
    id: nanoid(),
    ownerId: input.ownerId ?? null,
    ownerName: input.ownerName,
    characterName: input.characterName.trim(),
    worldId: input.worldId,
    raceId: race.id,
    clanId,
    factionId,
    organizationMemberships: [],
    rankTitles: [],
    temporaryLineages: [],
    abilityProgress: [],
    pacts: [],
    kampfkraftComponents: {
      erfahrung: 0,
      ausruestung: 0,
      faehigkeiten: 0,
      systemBeherrschung: 0,
      erfolge: 0,
      training: 0,
    },
    stats: { kraft: 10, verteidigung: 10, lp: 10, geschwindigkeit: 10, genauigkeit: 10, power: 10 },
    currentHp: 100,
    maxHp: 100,
    energy: { current: 100, max: 100, label: input.worldId === "ninja_welt" ? "Chakra" : input.worldId === "avalon" ? "Äther" : input.worldId === "soul_society" ? "Fluchenergie" : "Willenskraft" },
    skillPoints: 0,
    statPoints: 0,
    gold: 500,
    currentLocationId: input.worldId === "ozeanwelt" ? "insel-goldbucht" : input.worldId === "soul_society" ? "seelenbezirk-1" : input.worldId === "avalon" ? "alexandria" : "dorf-konohagakure",
    origin: { originId: ORIGINS.find(o => o.worldId === input.worldId && o.raceIds.includes(race.id))?.id ?? `origin_${input.worldId}`, status: "not_started", stepIndex: 0, completedStepIds: [] },
    wanted: { value: 0, dangerRank: null, reasons: [] },
    uniquePower: null, // wird erst freigeschaltet, sobald genug Kampfkraft erreicht ist
    selfAssignedRank: null,
    crewId: null,
    inventory: [],
    equipped: { waffe: null, ruestung: null, accessoire: null },
    skills: [],
    completedMissionIds: [],
    activeDomainRuleId: null,
    fusedInto: null,
    spektralritterPact: null,
    doujutsu: null,
    dojutsuState: null,
    ninjaTechniques: [],
    chakraNatures: [],
    esperPact: null,
    jinchuriki: null,
    karmaStates: [],
    karmaPct: 0,
    defeatedOtsutsukiIds: [],
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
