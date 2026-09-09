import type { ClanDefinition } from "../types/affiliation.js";

const path = (
  id: string,
  name: string,
  category: ClanDefinition["abilityPaths"][number]["category"],
  description: string,
  stages: string[],
  placeholder = false,
): ClanDefinition["abilityPaths"][number] => ({ id, name, category, description, acquisitionMethod: "CLAN_TRAINING", stages, placeholder });

export const CLANS: ClanDefinition[] = [
  // Ozeanwelt: nicht frei wählbar; spätere besondere Belohnung/Ereignisse.
  { id: "ocean-noble-lineage", worldId: "ozeanwelt", name: "Adliger Clan", description: "Besondere adlige Abstammung. Wird nicht bei der normalen Charaktererstellung gewählt.", accessMode: "special_reward", abilityPaths: [], placeholder: true },
  { id: "ocean-d-lineage", worldId: "ozeanwelt", name: "D-Clan", description: "Seltene besondere Abstammung. Erwerb nur über außergewöhnliche Leistungen oder Story/Ereignisse.", accessMode: "special_reward", abilityPaths: [], placeholder: true },

  // Soul Society: optionale adlige Linien als Grundlage, bewusst noch nicht final ausgestaltet.
  { id: "soul-noble-lineage", worldId: "soul_society", name: "Adliger Shinigami-Clan", description: "Platzhalter für seltene adlige Shinigami-Blutlinien.", accessMode: "special_reward", allowedFactionIds: ["shinigami"], abilityPaths: [], placeholder: true },

  // Ninja-Welt: bekannte Namen dienen nur als Entwicklungs-Platzhalter und bleiben datengetrieben.
  {
    id: "clan-uchiha", worldId: "ninja_welt", name: "Uchiha", description: "Entwicklungs-Platzhalter für eine Ninja-Blutlinie mit Feuer- und Augenpotenzial.", accessMode: "character_creation", allowedRaceIds: ["ninja-human"], allowedFactionIds: ["shinobi"], favoredVariants: ["Katon (Feuer)"], placeholder: true,
    abilityPaths: [
      path("uchiha-fire-path", "Clan-Feuertraining", "clan_jutsu", "Clantraining eröffnet den Zugang zu spezialisierten Feuertechniken.", ["Grundtraining", "Fortgeschritten", "Meisterschaft"], true),
      path("uchiha-eye-path", "Dōjutsu-Training", "dojutsu", "Augenpotenzial wird nur durch spezielles Clantraining entwickelt.", ["Potenzial", "Grundform", "Entwickelte Form", "Hohe Form"], true),
    ],
  },
  {
    id: "clan-senju", worldId: "ninja_welt", name: "Senju", description: "Entwicklungs-Platzhalter für eine ausdauernde Ninja-Blutlinie.", accessMode: "character_creation", allowedRaceIds: ["ninja-human"], allowedFactionIds: ["shinobi"], favoredVariants: ["Doton (Erde)"], placeholder: true,
    abilityPaths: [path("senju-clan-path", "Senju-Spezialtraining", "clan_jutsu", "Eröffnet clanbezogene Spezialtechniken, ohne sie automatisch zu verleihen.", ["Grundtraining", "Fortgeschritten", "Meisterschaft"], true)],
  },
  {
    id: "clan-uzumaki", worldId: "ninja_welt", name: "Uzumaki", description: "Entwicklungs-Platzhalter für Chakra- und Siegelpotenzial.", accessMode: "character_creation", allowedRaceIds: ["ninja-human"], allowedFactionIds: ["shinobi"], favoredVariants: ["Suiton (Wasser)", "Fuuton (Wind)"], placeholder: true,
    abilityPaths: [path("uzumaki-seal-path", "Siegelkunst-Training", "clan_jutsu", "Eröffnet spezialisiertes Fuinjutsu-Training.", ["Grundsiegel", "Fortgeschrittene Siegel", "Meisterschaft"], true)],
  },
  {
    id: "clan-hyuga", worldId: "ninja_welt", name: "Hyūga", description: "Entwicklungs-Platzhalter für eine Ninja-Blutlinie mit Augen- und Präzisionspotenzial.", accessMode: "character_creation", allowedRaceIds: ["ninja-human"], allowedFactionIds: ["shinobi"], favoredVariants: [], placeholder: true,
    abilityPaths: [path("hyuga-eye-path", "Dōjutsu-Training", "dojutsu", "Clantraining entwickelt die besondere Augenfähigkeit stufenweise.", ["Potenzial", "Grundform", "Erweiterte Wahrnehmung", "Meisterschaft"], true)],
  },

  // Magierwelt: Arbeitsnamen, ausdrücklich nicht final.
  ...[
    ["horus", "Horus", "divine_eye", "Augen des Horus", "Wahrnehmung, Äther-/Magieanalyse und Durchschauen verborgener Strukturen."],
    ["ra", "Ra", "divine_magic", "Sonnenmagie", "Arbeitsrichtung Sonne, Licht, Hitze und offensive Magie."],
    ["anubis", "Anubis", "divine_magic", "Seelenmagie", "Arbeitsrichtung Seelen, Tod und Unterwelt."],
    ["seth", "Seth", "divine_magic", "Chaosmagie", "Arbeitsrichtung Chaos, Sturm und Zerstörung."],
    ["isis", "Isis", "divine_magic", "Schutzmagie", "Arbeitsrichtung Schutz, Heilung und Rituale."],
    ["osiris", "Osiris", "divine_magic", "Lebens-/Unterweltmagie", "Arbeitsrichtung Leben, Tod, Wiederherstellung und Unterwelt."],
    ["thot", "Thot", "divine_magic", "Schriftmagie", "Arbeitsrichtung Wissen, magische Schrift, Runen und Analyse."],
  ].map(([key, name, category, magicName, desc]) => ({
    id: `mage-${key}-lineage`, worldId: "avalon" as const, name: `${name}-Clan`, description: `Arbeitsname für eine göttliche Magier-Blutlinie. Nicht final.`, accessMode: "disabled" as const, allowedRaceIds: ["mage-divine-descendant"], allowedFactionIds: ["magier"], placeholder: true,
    abilityPaths: [
      path(`mage-${key}-eye`, name === "Horus" ? "Augen des Horus" : `Göttliche Augenlinie: ${name}`, "divine_eye", name === "Horus" ? desc : "Göttliche Augenfähigkeit; konkrete Effekte werden später finalisiert.", ["Potenzial", "Grundform", "Verbesserte Form", "Hohe Form", "Offene Endstufe"], true),
      path(`mage-${key}-magic`, magicName, "divine_magic", desc, ["Potenzial", "Grundtechnik", "Vertiefung", "Meisterschaft", "Offene Endstufe"], true),
    ],
  })),
];
