import type { Faction } from "../types/faction.js";

export const FACTIONS: Faction[] = [
  {
    id: "neutral_ocean",
    worldId: "ozeanwelt",
    name: "Neutral",
    description: "Neutraler Start auf einer Insel. Die Entscheidung zwischen Piraten und Marine fällt während der Origin.",
    playerAssignedRanks: [],
    baseSkills: ["Kampfgrundlagen", "Navigation-Grundlagen"],
    corePowerLabel: "Relikt",
    corePowerStages: [],
  },
  // --- Ozeanwelt: identisches Kampfsystem für beide Fraktionen ---
  {
    id: "piraten",
    worldId: "ozeanwelt",
    name: "Piraten",
    description: "Freie Crews ohne NPCs. Gründer wird Captain, Crew organisiert sich selbst.",
    playerAssignedRanks: ["Vize-Captain", "Captain", "König eines kontrollierten Gebietes", "Kaiser der Meere"],
    baseSkills: ["Waffenkampf", "Seefahrt", "Schiffssystem"],
    corePowerLabel: "Relikt",
    corePowerStages: [
      "Relikt",
      "Synchronisation",
      "Resonanz",
      "Erwachen",
      "Mythische Manifestation",
      "Unbegrenzte Weiterentwicklung",
    ],
  },
  {
    id: "marine",
    worldId: "ozeanwelt",
    name: "Marine",
    description: "Weltregierung (anfangs Administrator-geführt) mit Fünf Weisen, Marine, CP.",
    playerAssignedRanks: ["Vize-Captain", "Captain", "Vizeadmiral", "Admiral"],
    baseSkills: ["Waffenkampf", "Seefahrt", "Schiffssystem"],
    corePowerLabel: "Relikt",
    corePowerStages: [
      "Relikt",
      "Synchronisation",
      "Resonanz",
      "Erwachen",
      "Mythische Manifestation",
      "Unbegrenzte Weiterentwicklung",
    ],
  },

  // --- Soul Society: jede Fraktion eigener Kernmacht-Pfad ---
  {
    id: "shinigami",
    worldId: "soul_society",
    name: "Shinigami",
    description: "Shinigami entwickeln Zanpakutō, Fluchtechnik, Shikai, Bankai und später Sphäre/Domäne. Erwerb und Entwicklung werden getrennt modelliert.",
    playerAssignedRanks: ["Vize-Captain", "Captain"],
    baseSkills: ["Schwertkampf", "Kido", "Hohō"],
    corePowerLabel: "Seelenwaffe",
    corePowerStages: [
      "Versiegelt",
      "Shikai",
      "Shikai-Meisterschaft",
      "Bankai",
      "Sphäre / Domänen-Meisterschaft",
      "Unbegrenzte Weiterentwicklung",
    ],
  },
  {
    id: "hollow",
    worldId: "soul_society",
    name: "Hollow",
    description: "Evolution von Hollow über Gillian, Adjuchas bis Vasto Lorde. Ab Adjuchas: Resurrección.",
    playerAssignedRanks: ["Espada", "Fracción", "Kommandant"],
    baseSkills: ["Cero", "Hierro", "Sonído"],
    corePowerLabel: "Resurrección",
    corePowerStages: [
      "Hollow",
      "Gillian",
      "Adjuchas",
      "Vasto Lorde",
      "Resurrección: Einzigartige Form",
      "Optionale zweite Form",
      "Unbegrenzte Weiterentwicklung",
    ],
  },

  // --- Avalon: eine Fraktion, Kernmacht = einzigartige Magie ---
  {
    id: "magier",
    worldId: "avalon",
    name: "Magier",
    description: "Ägyptisch-magisch geprägte Hochkultur mit Pyramiden, Tempeln und Obelisken. Bewahren Magie, Ley-Linien, Spektralwelt. Kämpfen um das Arkane Netzwerk. Höchster Herrschertitel: Pharao.",
    playerAssignedRanks: ["Pharao", "King of Kings"],
    baseSkills: ["Mana-Kontrolle", "Waffenkampf", "Magische Verstärkung", "Beschwörungsgrundlagen", "Runen", "Barrieren"],
    corePowerLabel: "Einzigartige Magie",
    corePowerStages: [
      "Grundfähigkeiten (Ort der Macht gefunden)",
      "Vertiefte Technik",
      "Erweiterte Technik",
      "Meisterschaft",
      "Unbegrenzte Weiterentwicklung",
    ],
  },

  // --- Ninja-Welt: eine Fraktion, Kernmacht = individueller Kampfstil (Ninjutsu/Genjutsu/Taijutsu) ---
  {
    id: "shinobi",
    worldId: "ninja_welt",
    name: "Shinobi",
    description: "Ninja aus verschiedenen Dörfern und Clans. Ränge (Genin/Chūnin/Jōnin/Kage) entstehen durch Spielerorganisation.",
    playerAssignedRanks: ["Genin", "Chūnin", "Jōnin", "Kage"],
    baseSkills: ["Chakra-Kontrolle", "Taijutsu-Grundlagen", "Ninjutsu-Grundlagen", "Genjutsu-Grundlagen"],
    corePowerLabel: "Individueller Kampfstil",
    corePowerStages: [
      "Grundtechnik",
      "Vertiefte Technik",
      "Erweiterte Technik",
      "Erwachen",
      "Meisterschaft",
      "Unbegrenzte Weiterentwicklung",
    ],
  },
];
