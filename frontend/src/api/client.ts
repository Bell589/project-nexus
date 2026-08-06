import type { World, Faction, Character } from "../types/models";

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
};
