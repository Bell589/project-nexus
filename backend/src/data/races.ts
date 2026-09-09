import type { RaceDefinition } from "../types/affiliation.js";

export const RACES: RaceDefinition[] = [
  { id: "ocean-human", worldId: "ozeanwelt", name: "Mensch", description: "Mensch der Ozeanwelt.", allowedFactionIds: ["piraten", "marine"] },
  { id: "ocean-fishman", worldId: "ozeanwelt", name: "Fischmensch", description: "Fischmensch der Ozeanwelt.", allowedFactionIds: ["piraten", "marine"] },
  { id: "ocean-giant", worldId: "ozeanwelt", name: "Riese", description: "Riese der Ozeanwelt.", allowedFactionIds: ["piraten", "marine"] },
  { id: "soul-shinigami", worldId: "soul_society", name: "Shinigami", description: "Seelenwesen auf dem Shinigami-Pfad.", allowedFactionIds: ["shinigami"] },
  { id: "soul-hollow", worldId: "soul_society", name: "Hollow", description: "Hollow-Seite der Soul Society.", allowedFactionIds: ["hollow"] },
  { id: "ninja-human", worldId: "ninja_welt", name: "Mensch", description: "Mensch der Ninjawelt.", allowedFactionIds: ["shinobi"] },
  { id: "mage-divine-descendant", worldId: "avalon", name: "Magier (Arbeitsname)", description: "Antikes Volk göttlicher Nachfahren. Der endgültige Rassenname ist noch offen.", allowedFactionIds: ["magier"], placeholderName: true },
];
