import type { WorldId } from "../types/world.js";

export interface WorldCrystal {
  id: string;
  worldId: WorldId;
  name: string;
  stability: number; // 0-100
  connectedCrystalIds: string[];
}

export const WORLD_CRYSTALS: WorldCrystal[] = [
  { id: "kristall-ozean", worldId: "ozeanwelt", name: "Tiefenkristall", stability: 70, connectedCrystalIds: ["kristall-soul", "kristall-avalon"] },
  { id: "kristall-soul", worldId: "soul_society", name: "Seelenkristall", stability: 65, connectedCrystalIds: ["kristall-ozean", "kristall-avalon", "kristall-ninja"] },
  { id: "kristall-avalon", worldId: "avalon", name: "Ätherkristall", stability: 80, connectedCrystalIds: ["kristall-ozean", "kristall-soul", "kristall-ninja"] },
  { id: "kristall-ninja", worldId: "ninja_welt", name: "Chakrakristall", stability: 60, connectedCrystalIds: ["kristall-soul", "kristall-avalon"] },
];
