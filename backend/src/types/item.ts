import type { KampfkraftComponents } from "./kampfkraft.js";

export type ItemSlot = "waffe" | "ruestung" | "accessoire";

export interface Item {
  id: string;
  name: string;
  slot: ItemSlot | "verbrauchsgut";
  description: string;
  /** Bonus auf Kampfkraft-Komponenten, wird bei Ausrüstung addiert */
  statBonuses: Partial<KampfkraftComponents>;
}
