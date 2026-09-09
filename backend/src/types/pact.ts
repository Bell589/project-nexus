import type { WorldId } from "./world.js";

export type PactKind = "summoning" | "magical_knight" | "other";
export type PactStatus = "discovered" | "trial" | "active" | "inactive" | "broken";

export interface PactState {
  id: string;
  kind: PactKind;
  worldId: WorldId;
  entityId: string;
  entityName: string;
  status: PactStatus;
  stageIndex: number;
  abilityIds: string[];
  formedAt: string | null;
  developmentLog: string[];
}
