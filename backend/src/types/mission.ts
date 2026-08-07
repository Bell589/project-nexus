import type { WorldId } from "./world.js";
import type { KampfkraftComponents } from "./kampfkraft.js";

export interface Mission {
  id: string;
  worldId: WorldId;
  title: string;
  description: string;
  minKampfkraft: number;
  rewardComponents: Partial<KampfkraftComponents>;
  rewardItemId?: string;
}
