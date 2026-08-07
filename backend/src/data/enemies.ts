import type { Enemy } from "../types/enemy.js";

export const ENEMIES: Enemy[] = [
  {
    id: "kleiner-pirat",
    worldId: "ozeanwelt",
    name: "Streunender Pirat",
    description: "Schwacher Gegner, gut zum Einstieg.",
    kampfkraft: 15,
    rewardComponents: { erfahrung: 10 },
  },
  {
    id: "weltboss-krake",
    worldId: "ozeanwelt",
    name: "Weltboss: Tiefsee-Krake",
    description: "Mächtiger Weltboss der Ozeanwelt.",
    kampfkraft: 150,
    rewardComponents: { erfahrung: 60, erfolge: 30 },
  },
  {
    id: "gillian-hollow",
    worldId: "soul_society",
    name: "Gillian",
    description: "Verschmolzene Hollow-Masse, mittlere Bedrohung.",
    kampfkraft: 45,
    rewardComponents: { erfahrung: 20, faehigkeiten: 10 },
  },
  {
    id: "korrumpierter-ritter",
    worldId: "avalon",
    name: "Korrumpierter Spektralritter",
    description: "Einst edler Ritter, nun von dunkler Magie verzerrt.",
    kampfkraft: 80,
    rewardComponents: { erfahrung: 30, systemBeherrschung: 20 },
  },
];
