import { VILLAGE_TEMPLATES } from "../data/villages.js";
import type { Village } from "../types/village.js";

const villages = new Map<string, Village>(
  VILLAGE_TEMPLATES.map((t) => [
    t.id,
    { id: t.id, name: t.name, kageTitle: t.kageTitle, members: [], createdAt: new Date().toISOString() },
  ])
);

export const VillageStore = {
  all(): Village[] {
    return Array.from(villages.values());
  },
  get(id: string): Village | undefined {
    return villages.get(id);
  },
  save(village: Village): Village {
    villages.set(village.id, village);
    return village;
  },
};
