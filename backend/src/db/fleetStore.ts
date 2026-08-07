import type { Fleet } from "../types/fleet.js";

const fleets = new Map<string, Fleet>();

export const FleetStore = {
  all(): Fleet[] {
    return Array.from(fleets.values());
  },
  get(id: string): Fleet | undefined {
    return fleets.get(id);
  },
  save(fleet: Fleet): Fleet {
    fleets.set(fleet.id, fleet);
    return fleet;
  },
};
