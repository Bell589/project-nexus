import type { World, Faction, Character, Crew, Fleet } from "../types/models";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request fehlgeschlagen: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getWorlds: () => request<World[]>("/worlds"),
  getFactions: (worldId: string) => request<Faction[]>(`/worlds/${worldId}/factions`),
  createCharacter: (input: {
    ownerName: string;
    characterName: string;
    worldId: string;
    factionId: string;
  }) =>
    request<Character>("/characters", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getCharacter: (id: string) => request<Character>(`/characters/${id}`),

  trainComponent: (characterId: string, component: string, amount: number) =>
    request<Character>(`/characters/${characterId}/train`, {
      method: "POST",
      body: JSON.stringify({ component, amount }),
    }),

  acquireCorePower: (characterId: string, archetype: string, name: string) =>
    request<Character>(`/characters/${characterId}/core-power/acquire`, {
      method: "POST",
      body: JSON.stringify({ archetype, name }),
    }),

  advanceCorePower: (characterId: string) =>
    request<Character>(`/characters/${characterId}/core-power/advance`, {
      method: "POST",
    }),

  listCrews: () => request<Crew[]>("/crews"),
  getCrew: (id: string) => request<Crew>(`/crews/${id}`),
  createCrew: (founderCharacterId: string, name: string) =>
    request<Crew>("/crews", {
      method: "POST",
      body: JSON.stringify({ founderCharacterId, name }),
    }),
  joinCrew: (crewId: string, characterId: string) =>
    request<Crew>(`/crews/${crewId}/join`, {
      method: "POST",
      body: JSON.stringify({ characterId }),
    }),
  assignCrewRole: (crewId: string, actingCharacterId: string, targetCharacterId: string, role: string) =>
    request<Crew>(`/crews/${crewId}/roles`, {
      method: "POST",
      body: JSON.stringify({ actingCharacterId, targetCharacterId, role }),
    }),

  listFleets: () => request<Fleet[]>("/fleets"),
  createFleet: (founderCrewId: string, founderCharacterId: string, name: string) =>
    request<Fleet>("/fleets", {
      method: "POST",
      body: JSON.stringify({ founderCrewId, founderCharacterId, name }),
    }),
  joinFleet: (fleetId: string, crewId: string, characterId: string) =>
    request<Fleet>(`/fleets/${fleetId}/join`, {
      method: "POST",
      body: JSON.stringify({ crewId, characterId }),
    }),
};
