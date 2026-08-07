import { nanoid } from "nanoid";
import { CharacterStore } from "../db/memoryStore.js";
import { CrewStore } from "../db/crewStore.js";
import { ValidationError } from "./characterService.js";
import type { Crew, CrewRole } from "../types/crew.js";

const ASSIGNABLE_ROLES: CrewRole[] = ["Offizier", "Kommandant", "Stellvertreter", "Mitglied"];

function requireOzeanweltCharacter(characterId: string) {
  const character = CharacterStore.get(characterId);
  if (!character) throw new ValidationError(`Charakter "${characterId}" nicht gefunden`);
  if (character.worldId !== "ozeanwelt") {
    throw new ValidationError("Crews gibt es nur in der Ozeanwelt");
  }
  return character;
}

export function createCrew(founderCharacterId: string, name: string): Crew {
  const founder = requireOzeanweltCharacter(founderCharacterId);
  if (founder.crewId) throw new ValidationError("Charakter ist bereits in einer Crew");
  if (!name?.trim()) throw new ValidationError("name darf nicht leer sein");

  const crew: Crew = {
    id: nanoid(),
    name: name.trim(),
    worldId: "ozeanwelt",
    factionId: founder.factionId as "piraten" | "marine",
    members: [{ characterId: founder.id, role: "Captain" }],
    fleetId: null,
    createdAt: new Date().toISOString(),
  };

  founder.crewId = crew.id;
  founder.selfAssignedRank = "Captain";
  CharacterStore.save(founder);
  return CrewStore.save(crew);
}

export function joinCrew(crewId: string, characterId: string): Crew {
  const crew = CrewStore.get(crewId);
  if (!crew) throw new ValidationError(`Crew "${crewId}" nicht gefunden`);

  const character = requireOzeanweltCharacter(characterId);
  if (character.crewId) throw new ValidationError("Charakter ist bereits in einer Crew");
  if (character.factionId !== crew.factionId) {
    throw new ValidationError("Charakter gehört nicht zur selben Fraktion wie die Crew");
  }

  crew.members.push({ characterId, role: "Mitglied" });
  character.crewId = crew.id;
  CharacterStore.save(character);
  return CrewStore.save(crew);
}

export function assignCrewRole(
  crewId: string,
  actingCharacterId: string,
  targetCharacterId: string,
  role: CrewRole
): Crew {
  const crew = CrewStore.get(crewId);
  if (!crew) throw new ValidationError(`Crew "${crewId}" nicht gefunden`);

  const actingMember = crew.members.find((m) => m.characterId === actingCharacterId);
  if (!actingMember || actingMember.role !== "Captain") {
    throw new ValidationError("Nur der Captain darf Rollen vergeben");
  }

  if (!ASSIGNABLE_ROLES.includes(role)) {
    throw new ValidationError(`Ungültige Rolle. Erlaubt: ${ASSIGNABLE_ROLES.join(", ")}`);
  }

  const targetMember = crew.members.find((m) => m.characterId === targetCharacterId);
  if (!targetMember) throw new ValidationError("Zielcharakter ist nicht Mitglied dieser Crew");
  if (targetMember.role === "Captain") {
    throw new ValidationError("Der Captain kann sich selbst keine andere Rolle geben");
  }

  targetMember.role = role;

  const targetCharacter = CharacterStore.get(targetCharacterId);
  if (targetCharacter) {
    targetCharacter.selfAssignedRank = role;
    CharacterStore.save(targetCharacter);
  }

  return CrewStore.save(crew);
}

export function listCrews(): Crew[] {
  return CrewStore.all();
}

export function getCrew(id: string): Crew {
  const crew = CrewStore.get(id);
  if (!crew) throw new ValidationError(`Crew "${id}" nicht gefunden`);
  return crew;
}
