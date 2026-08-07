import type { WorldId } from "./world.js";

export type LocationType =
  | "insel"
  | "hauptquartier"
  | "seelenbezirk"
  | "ort_der_macht"
  | "arkaner_knoten"
  | "dungeon";

export interface Location {
  id: string;
  worldId: WorldId;
  name: string;
  type: LocationType;
  description: string;
}
