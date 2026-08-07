import { nanoid } from "nanoid";
import { CrewStore } from "../db/crewStore.js";
import { FleetStore } from "../db/fleetStore.js";
import { ValidationError } from "./characterService.js";
import type { Fleet } from "../types/fleet.js";
import type { CrewRole } from "../types/crew.js";

function requireCaptainOf(crewId: string, characterId: string) {
  const crew = CrewStore.get(crewId);
  if (!crew) throw new ValidationError(`Crew "${crewId}" nicht gefunden`);
  const member = crew.members.find((m) => m.characterId === characterId);
  if (!member || (member.role as CrewRole) !== "Captain") {
    throw new ValidationError("Nur der Captain einer Crew darf sie in eine Flotte einbringen");
  }
  return crew;
}

export function createFleet(founderCrewId: string, founderCharacterId: string, name: string): Fleet {
  const crew = requireCaptainOf(founderCrewId, founderCharacterId);
  if (crew.fleetId) throw new ValidationError("Crew ist bereits Teil einer Flotte");
  if (!name?.trim()) throw new ValidationError("name darf nicht leer sein");

  const fleet: Fleet = {
    id: nanoid(),
    name: name.trim(),
    worldId: "ozeanwelt",
    memberCrewIds: [crew.id],
    createdAt: new Date().toISOString(),
  };

  crew.fleetId = fleet.id;
  CrewStore.save(crew);
  return FleetStore.save(fleet);
}

export function joinFleet(fleetId: string, crewId: string, characterId: string): Fleet {
  const fleet = FleetStore.get(fleetId);
  if (!fleet) throw new ValidationError(`Flotte "${fleetId}" nicht gefunden`);

  const crew = requireCaptainOf(crewId, characterId);
  if (crew.fleetId) throw new ValidationError("Crew ist bereits Teil einer Flotte");

  fleet.memberCrewIds.push(crew.id);
  crew.fleetId = fleet.id;
  CrewStore.save(crew);
  return FleetStore.save(fleet);
}

export function listFleets(): Fleet[] {
  return FleetStore.all();
}

export function getFleet(id: string): Fleet {
  const fleet = FleetStore.get(id);
  if (!fleet) throw new ValidationError(`Flotte "${id}" nicht gefunden`);
  return fleet;
}
