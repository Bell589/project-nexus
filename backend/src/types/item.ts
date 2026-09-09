import type { KampfkraftComponents } from "./kampfkraft.js";

export type ItemSlot = "waffe" | "ruestung" | "accessoire";

export interface Item {
  id: string;
  name: string;
  slot: ItemSlot | "verbrauchsgut";
  description: string;
  /** Bonus auf Kampfkraft-Komponenten, wird bei Ausrüstung addiert */
  statBonuses: Partial<KampfkraftComponents>;
  price?: number;
  tradeable?: boolean;
  marketplaceAllowed?: boolean;
  bound?: boolean;
  unique?: boolean;
  organizationStorageAllowed?: boolean;
  worldId?: string;
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
  healHp?: number;
  restoreEnergy?: number;
  category?: "weapon" | "equipment" | "healing" | "energy" | "consumable" | "mission" | "rare" | "hint" | "relic";
}
