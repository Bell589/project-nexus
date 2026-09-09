import type { RegionControl } from "../types/region.js";

const controls = new Map<string, RegionControl>();

export const RegionControlStore = {
  get(locationId: string): RegionControl | undefined {
    return controls.get(locationId);
  },
  getOrCreate(locationId: string): RegionControl {
    let control = controls.get(locationId);
    if (!control) {
      control = {
        locationId,
        rulerCharacterId: null,
        rulerPresent: false,
        siegeProgress: 0,
        defenderCharacterIds: [],
        eventLog: [],
      };
      controls.set(locationId, control);
    }
    return control;
  },
  save(control: RegionControl): RegionControl {
    controls.set(control.locationId, control);
    return control;
  },
  all(): RegionControl[] {
    return Array.from(controls.values());
  },
};
