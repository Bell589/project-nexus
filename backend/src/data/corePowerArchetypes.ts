import type { CorePowerArchetype } from "../types/corePowerArchetype.js";

export const CORE_POWER_ARCHETYPES: CorePowerArchetype[] = [
  // --- Ozeanwelt: Relikte (Piraten & Marine teilen das System) ---
  // Stufen: Relikt, Synchronisation, Resonanz, Erwachen, Mythische Manifestation, Unbegrenzte Weiterentwicklung
  {
    id: "relikt-des-blitzes",
    worldId: "ozeanwelt",
    factionIds: ["piraten", "marine"],
    name: "Relikt des Blitzes",
    description: "Durchzogen von rohem Blitz. Formt sich zu einer einzigartigen Donner-Macht.",
    abilitiesByStage: [
      ["Blitzschlag", "Elektrische Aura"],
      ["Blitzsprint"],
      ["Donnerklinge"],
      ["Sturmform"],
      ["Donner des Himmels (mythische Form)"],
      ["Freie Weiterentwicklung"],
    ],
  },
  {
    id: "relikt-der-tiefe",
    worldId: "ozeanwelt",
    factionIds: ["piraten", "marine"],
    name: "Relikt der Tiefe",
    description: "Verbindet den Träger mit den Strömungen und Kreaturen der Tiefsee.",
    abilitiesByStage: [
      ["Wasserpeitsche", "Strömungsgespür"],
      ["Tiefenatmung"],
      ["Rufe der Tiefe"],
      ["Flutform"],
      ["Herrschaft der sieben Meere (mythische Form)"],
      ["Freie Weiterentwicklung"],
    ],
  },
  {
    id: "relikt-der-flamme",
    worldId: "ozeanwelt",
    factionIds: ["piraten", "marine"],
    name: "Relikt der Flamme",
    description: "Ein Relikt, das brennende Entschlossenheit in physische Macht verwandelt.",
    abilitiesByStage: [
      ["Feuerstoß", "Hitzeschild"],
      ["Flammensprint"],
      ["Aschewirbel"],
      ["Infernoform"],
      ["Phönixflamme (mythische Form)"],
      ["Freie Weiterentwicklung"],
    ],
  },

  // --- Soul Society: Shinigami-Seelenwaffen (Zanpakutō) ---
  // Stufen: Versiegelt, Erweckt, Resonanz, Domäne, Absolute Manifestation, Unbegrenzte Weiterentwicklung
  {
    id: "zanpakutou-des-feuers",
    worldId: "soul_society",
    factionIds: ["shinigami"],
    name: "Zanpakutō des Feuers",
    description: "Eine Seelenwaffe, die den Willen ihres Trägers als Flamme manifestiert.",
    abilitiesByStage: [
      ["Grundschnitt"],
      ["Feuerentfesselung"],
      ["Flammenresonanz"],
      ["Domäne: Aschefeld"],
      ["Absolute Feuermanifestation"],
      ["Freie Weiterentwicklung"],
    ],
  },
  {
    id: "zanpakutou-des-eises",
    worldId: "soul_society",
    factionIds: ["shinigami"],
    name: "Zanpakutō des Eises",
    description: "Eine Seelenwaffe, geboren aus eisiger Disziplin.",
    abilitiesByStage: [
      ["Grundschnitt"],
      ["Frostentfesselung"],
      ["Eisresonanz"],
      ["Domäne: Ewiger Winter"],
      ["Absolute Eismanifestation"],
      ["Freie Weiterentwicklung"],
    ],
  },

  // --- Soul Society: Hollow Resurrección-Formen ---
  // Stufen: Hollow, Gillian, Adjuchas, Vasto Lorde, Resurrección: Einzigartige Form, Optionale zweite Form, Unbegrenzte Weiterentwicklung
  {
    id: "resurreccion-des-schakals",
    worldId: "soul_society",
    factionIds: ["hollow"],
    name: "Resurrección des Schakals",
    description: "Entfesselt Geschwindigkeit und Raubtierinstinkt.",
    abilitiesByStage: [
      ["Cero (Grundform)"],
      ["Gillian-Masse"],
      ["Adjuchas-Bewusstsein"],
      ["Vasto-Lorde-Kraft"],
      ["Resurrección: Schakalform"],
      ["Zweite Form: Rudelfrenzy"],
      ["Freie Weiterentwicklung"],
    ],
  },
  {
    id: "resurreccion-des-skorpions",
    worldId: "soul_society",
    factionIds: ["hollow"],
    name: "Resurrección des Skorpions",
    description: "Entfesselt Gift und gepanzerte Verteidigung.",
    abilitiesByStage: [
      ["Cero (Grundform)"],
      ["Gillian-Masse"],
      ["Adjuchas-Bewusstsein"],
      ["Vasto-Lorde-Kraft"],
      ["Resurrección: Skorpionform"],
      ["Zweite Form: Giftschwarm"],
      ["Freie Weiterentwicklung"],
    ],
  },

  // --- Soul Society: Quincy Complete-Typen ---
  // Stufen: Einzigartige Waffe, Complete, Neue Fähigkeiten, Neue Formen, Unbegrenzte Weiterentwicklung
  {
    id: "complete-des-lichts",
    worldId: "soul_society",
    factionIds: ["quincy"],
    name: "Complete des Lichts",
    description: "Verdichtet Reishi zu reinem, durchdringendem Licht.",
    abilitiesByStage: [
      ["Reishi-Bogen"],
      ["Complete: Lichtform"],
      ["Photonenschuss"],
      ["Strahlenkranz"],
      ["Freie Weiterentwicklung"],
    ],
  },
  {
    id: "complete-der-stille",
    worldId: "soul_society",
    factionIds: ["quincy"],
    name: "Complete der Stille",
    description: "Verdichtet Reishi zu lautlosen, präzisen Attacken.",
    abilitiesByStage: [
      ["Reishi-Bogen"],
      ["Complete: Stilleform"],
      ["Lautloser Pfeil"],
      ["Schattenkranz"],
      ["Freie Weiterentwicklung"],
    ],
  },

  // --- Avalon: Einzigartige Magie-Schulen ---
  // Stufen: Grundfähigkeiten, Vertiefte Technik, Erweiterte Technik, Meisterschaft, Unbegrenzte Weiterentwicklung
  {
    id: "blitzmagie",
    worldId: "avalon",
    factionIds: ["magier"],
    name: "Blitzmagie",
    description: "Am Blitzgipfel erlernbare Magie, die Raiten-Techniken hervorbringt.",
    abilitiesByStage: [
      ["Blitzschlag", "Blitzbewegung"],
      ["Raiten Hoho"],
      ["Raiten Sōsō"],
      ["Meisterschaft: Blitzverschmelzung"],
      ["Freie Weiterentwicklung"],
    ],
  },
  {
    id: "illusionsmagie",
    worldId: "avalon",
    factionIds: ["magier"],
    name: "Illusionsmagie",
    description: "Am Spiegelsee erlernbare Magie, die Wahrnehmung verzerrt.",
    abilitiesByStage: [
      ["Trugbild", "Stimmenwurf"],
      ["Spiegelschritt"],
      ["Doppelgänger-Konstrukt"],
      ["Meisterschaft: Realitätsriss"],
      ["Freie Weiterentwicklung"],
    ],
  },
  {
    id: "zeitmagie",
    worldId: "avalon",
    factionIds: ["magier"],
    name: "Zeitmagie",
    description: "An den Zeitruinen erlernbare Magie, die den Zeitfluss verzerrt.",
    abilitiesByStage: [
      ["Zeitlupenfeld", "Kurzer Rückspul"],
      ["Zeitsprung"],
      ["Zeitschleife"],
      ["Meisterschaft: Zeitstillstand"],
      ["Freie Weiterentwicklung"],
    ],
  },
];
