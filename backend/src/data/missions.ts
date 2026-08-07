import type { Mission } from "../types/mission.js";

export const MISSIONS: Mission[] = [
  {
    id: "kopfgeld-anfaenger",
    worldId: "ozeanwelt",
    title: "Erstes Kopfgeld",
    description: "Verfolge einen kleinen Kopfgeldjäger-Auftrag in der Goldbucht.",
    minKampfkraft: 0,
    rewardComponents: { erfahrung: 15, erfolge: 5 },
  },
  {
    id: "insel-verteidigen",
    worldId: "ozeanwelt",
    title: "Insel verteidigen",
    description: "Wehre einen Angriff auf die Sturmklippe ab.",
    minKampfkraft: 40,
    rewardComponents: { erfahrung: 30, erfolge: 15 },
    rewardItemId: "reliktverstaerkte-klinge",
  },
  {
    id: "seelenbezirk-reinigen",
    worldId: "soul_society",
    title: "Seelenbezirk reinigen",
    description: "Reinige Seelenbezirk 1 von umherirrenden Seelen.",
    minKampfkraft: 0,
    rewardComponents: { erfahrung: 15, systemBeherrschung: 5 },
  },
  {
    id: "hollow-jagd",
    worldId: "soul_society",
    title: "Hollow-Jagd",
    description: "Jage einen Hollow in Seelenbezirk 2.",
    minKampfkraft: 40,
    rewardComponents: { erfahrung: 25, faehigkeiten: 10 },
  },
  {
    id: "magie-erlernen",
    worldId: "avalon",
    title: "Erste Technik am Blitzgipfel",
    description: "Erlerne die Grundtechnik am Ort der Macht.",
    minKampfkraft: 0,
    rewardComponents: { faehigkeiten: 15, systemBeherrschung: 5 },
  },
  {
    id: "dimensionsriss-schliessen",
    worldId: "avalon",
    title: "Dimensionsriss schließen",
    description: "Stabilisiere einen instabilen Dimensionsriss nahe der Zeitruinen.",
    minKampfkraft: 40,
    rewardComponents: { erfahrung: 20, systemBeherrschung: 15 },
    rewardItemId: "amulett-der-konzentration",
  },
];
