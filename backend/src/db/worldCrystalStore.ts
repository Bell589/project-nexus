import { WORLD_CRYSTALS, type WorldCrystal } from "../data/worldCrystals.js";
import type { CrossWorldEvent } from "../types/crossWorldEvent.js";

const crystals = new Map<string, WorldCrystal>(WORLD_CRYSTALS.map((c) => [c.id, { ...c }]));
const events: CrossWorldEvent[] = [];

export const WorldCrystalStore = {
  all(): WorldCrystal[] {
    return Array.from(crystals.values());
  },
  get(id: string): WorldCrystal | undefined {
    return crystals.get(id);
  },
  save(crystal: WorldCrystal): WorldCrystal {
    crystals.set(crystal.id, crystal);
    return crystal;
  },
  addEvent(event: CrossWorldEvent) {
    events.push(event);
  },
  allEvents(): CrossWorldEvent[] {
    return events;
  },
};
