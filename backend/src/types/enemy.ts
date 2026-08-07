import type { WorldId } from "./world.js";
import type { KampfkraftComponents } from "./kampfkraft.js";

export interface Enemy {
  id: string;
  worldId: WorldId;
  name: string;
  description: string;
  kampfkraft: number;
  rewardComponents: Partial<KampfkraftComponents>;
}
