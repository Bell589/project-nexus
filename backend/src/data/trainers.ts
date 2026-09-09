import type { MasterTrainerDefinition } from "../types/trainer.js";

export const MASTER_TRAINERS: MasterTrainerDefinition[] = [
  {
    id: "master-haki-placeholder", worldId: "ozeanwelt", name: "Seltener Haki-Meister", description: "Datengetriebener Platzhalter für wandernde Haki-Meister.", possibleLocationIds: [], spawnChance: null,
    abilityIds: ["haki-observation", "haki-armament", "haki-conqueror"], requirements: { minKampfkraft: 0 }, placeholder: true,
  },
  {
    id: "master-unique-jutsu-placeholder", worldId: "ninja_welt", name: "Seltener Jutsu-Meister", description: "Platzhalter für dynamisch auftauchende Meister einzigartiger Jutsu.", possibleLocationIds: [], spawnChance: null,
    abilityIds: [], requirements: {}, placeholder: true,
  },
  {
    id: "master-unique-magic-placeholder", worldId: "avalon", name: "Seltener Magie-Meister", description: "Platzhalter für Meister besonderer Magien. Keine finale Lore-Zuordnung.", possibleLocationIds: [], spawnChance: null,
    abilityIds: [], requirements: {}, placeholder: true,
  },
];
