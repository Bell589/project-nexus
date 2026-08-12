import type { CorePowerArchetype } from "../types/corePowerArchetype.js";
import type { Ability } from "../types/ability.js";

// --- Hilfsfunktionen für wiederkehrende Fähigkeitsmuster ---

function angriff(name: string, description: string): Ability {
  return { name, kind: "angriff", description };
}
function technik(name: string, description: string): Ability {
  return { name, kind: "technik", description };
}
function powerup(
  name: string,
  description: string,
  rounds: number,
  damageBonusPct: number,
  incomingReductionPct: number,
  speedNote?: string
): Ability {
  return { name, kind: "powerup", description, powerup: { rounds, damageBonusPct, incomingReductionPct, speedNote } };
}

export const CORE_POWER_ARCHETYPES: CorePowerArchetype[] = [
  // ============ OZEANWELT: ELEMENTAR-RELIKTE (Logia-artig) ============
  // Stufen: Relikt, Synchronisation, Resonanz, Erwachen (=Bankai-Äquivalent), Mythische Manifestation, Unbegrenzt
  {
    id: "raiun",
    worldId: "ozeanwelt",
    factionIds: ["piraten", "marine"],
    typeLabel: "Elementar-Relikt: Blitz",
    properName: "Raiun",
    description: "Ein Relikt, durchzogen von rohem Blitz.",
    abilitiesByStage: [
      [angriff("Blitzschlag", "Ein scharfer Blitzstoß direkt auf den Gegner.")],
      [angriff("Blitzsprint", "Blitzschneller Nahkampfangriff aus der Bewegung.")],
      [technik("Donnerklinge", "Verstärkt die Waffe mit Blitzenergie für höheren Schaden.")],
      [
        powerup(
          "Elementform: Raiun",
          "Der Träger verwandelt sich in reinen Blitz - für eine Runde unantastbar, dazu ein Tempo-Vorteil. Das Gegenstück zum Bankai für Relikte.",
          1,
          0.3,
          1.0,
          "+Tempo-Vorteil (Blitzgeschwindigkeit)"
        ),
      ],
      [angriff("Zorn des Raiun", "Verheerender Blitzsturm in mythischer Form.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },
  {
    id: "enja",
    worldId: "ozeanwelt",
    factionIds: ["piraten", "marine"],
    typeLabel: "Elementar-Relikt: Feuer",
    properName: "Enja",
    description: "Ein Relikt, das brennende Entschlossenheit in physische Macht verwandelt.",
    abilitiesByStage: [
      [angriff("Feuerstoß", "Ein Stoß konzentrierter Flammen.")],
      [angriff("Flammensprint", "Rascher Angriff, von Flammen angetrieben.")],
      [technik("Aschewirbel", "Wirbelnde Glut, die Fläche und Sicht des Gegners einschränkt.")],
      [
        powerup(
          "Elementform: Enja",
          "Der Träger verwandelt sich in reines Feuer - für eine Runde unantastbar. Das Gegenstück zum Bankai für Relikte.",
          1,
          0.3,
          1.0
        ),
      ],
      [angriff("Herz des Enja", "Explosive Entladung in mythischer Flammenform.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },

  // ============ OZEANWELT: TIER-RELIKTE (Zoan-artig) ============
  // Mensch-Form -> Tier-Form -> Hybrid-Form, aufsteigend stärker.
  {
    id: "modell-long",
    worldId: "ozeanwelt",
    factionIds: ["piraten", "marine"],
    typeLabel: "Tier-Relikt: Drache",
    properName: "Long",
    description: "Ein Relikt, das den Träger in einen uralten Drachen verwandeln kann.",
    abilitiesByStage: [
      [angriff("Klauenhieb (Mensch-Form)", "Verstärkter Nahkampfschlag, noch in menschlicher Gestalt.")],
      [technik("Schuppenpanzer (Mensch-Form)", "Teilverhärtung der Haut zu Drachenschuppen.")],
      [
        powerup(
          "Tier-Form: Long",
          "Vollständige Verwandlung in den Drachen - stärker als die Mensch-Form, aber weniger kontrolliert.",
          2,
          0.25,
          0.2
        ),
      ],
      [
        powerup(
          "Hybrid-Form: Long",
          "Verschmelzung von Mensch und Drache - das Gegenstück zum Bankai. Volle Kontrolle bei maximaler Kraft.",
          2,
          0.5,
          0.4,
          "+Tempo-Vorteil (Flug)"
        ),
      ],
      [angriff("Himmelsdrache", "Verheerender Atemangriff in der Hybrid-Form.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },
  {
    id: "modell-suzaku",
    worldId: "ozeanwelt",
    factionIds: ["piraten", "marine"],
    typeLabel: "Tier-Relikt: Phönix",
    properName: "Suzaku",
    description: "Ein Relikt, das den Träger in einen Feuervogel verwandeln kann.",
    abilitiesByStage: [
      [angriff("Federklinge (Mensch-Form)", "Scharfe, glühende Federn als Wurfwaffen.")],
      [technik("Selbstheilende Wunde (Mensch-Form)", "Leichte Regeneration durch Phönixasche.")],
      [
        powerup(
          "Tier-Form: Suzaku",
          "Vollständige Verwandlung in den Feuervogel - stärker als die Mensch-Form.",
          2,
          0.25,
          0.2
        ),
      ],
      [
        powerup(
          "Hybrid-Form: Suzaku",
          "Verschmelzung von Mensch und Phönix - das Gegenstück zum Bankai.",
          2,
          0.5,
          0.4,
          "+Tempo-Vorteil (Flug)"
        ),
      ],
      [angriff("Ewige Flamme", "Verheerende Feuersäule in der Hybrid-Form.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },

  // ============ OZEANWELT: ÜBERMENSCHLICHE RELIKTE (Paramecia-artig) ============
  // Keine Verwandlung als Powerup - stattdessen extrem starke Finisher-Angriffe.
  {
    id: "kalypso",
    worldId: "ozeanwelt",
    factionIds: ["piraten", "marine"],
    typeLabel: "Übermenschliches Relikt: Schwerkraft",
    properName: "Kalypso",
    description: "Ein Relikt, das die Schwerkraft im Umfeld des Trägers manipuliert.",
    abilitiesByStage: [
      [angriff("Schweredruck", "Erhöht lokal die Schwerkraft und drückt den Gegner nieder.")],
      [technik("Schwerelosigkeit", "Hebt kurzzeitig die Schwerkraft um sich selbst auf.")],
      [technik("Gravitationswirbel", "Zieht Gegner und Gegenstände zu einem Punkt.")],
      [angriff("Erwachen: Schwerefeld", "Das Gegenstück zum Bankai - ein Feld, das jeden Angriff in der Nähe verlangsamt und verstärkt trifft.")],
      [angriff("Kollaps von Kalypso", "Krasser Finisher: kollabierendes Gravitationsfeld, das massiven Flächenschaden verursacht.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },
  {
    id: "aetherion",
    worldId: "ozeanwelt",
    factionIds: ["piraten", "marine"],
    typeLabel: "Übermenschliches Relikt: Bindung",
    properName: "Aetherion",
    description: "Ein Relikt, das unsichtbare Ketten aus reiner Energie erschafft.",
    abilitiesByStage: [
      [angriff("Kettenschlag", "Peitschenartiger Schlag aus Energieketten.")],
      [technik("Fesselgriff", "Bindet die Bewegung des Gegners kurzzeitig.")],
      [technik("Kettengeflecht", "Errichtet ein Netz aus Ketten um das Kampffeld.")],
      [angriff("Erwachen: Kettensturm", "Das Gegenstück zum Bankai - ein Sturm aus tausend Ketten.")],
      [angriff("Verurteilung von Aetherion", "Krasser Finisher: alle Ketten schließen sich gleichzeitig um den Gegner.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },

  // ============ SOUL SOCIETY: SHINIGAMI-SEELENWAFFEN (Zanpakutō) ============
  // Stufen: Versiegelt, Manifestation (=erste Freisetzung), Resonanz, Domäne (=volles Release), Absolute Manifestation, Unbegrenzt
  {
    id: "enraku",
    worldId: "soul_society",
    factionIds: ["shinigami"],
    typeLabel: "Zanpakutō: Feuer",
    properName: "Enraku",
    description: "Eine Seelenwaffe, die den Willen ihres Trägers als Flamme manifestiert.",
    abilitiesByStage: [
      [angriff("Grundschnitt", "Einfacher, versiegelter Klingenhieb.")],
      [
        powerup(
          "Manifestation: Enraku entfesselt",
          "Erste Freisetzung der Zanpakutō - die Klinge entflammt. Vergleichbar mit einem ersten Release.",
          2,
          0.25,
          0.15
        ),
      ],
      [technik("Flammenresonanz", "Vertiefte Verbindung zur Waffe, präzisere Feuertechniken.")],
      [
        powerup(
          "Domäne: Aschefeld",
          "Volles Release - erschafft eine Sphäre, in der eine feste Regel herrscht (hier: alle Heileffekte sind deaktiviert). Schaltet neue Techniken frei.",
          3,
          0.4,
          0.25
        ),
        technik("Domänen-Finisher: Ascheklinge", "Neue Technik, nur innerhalb der Domäne wirkbar - durchschneidet jede Deckung."),
      ],
      [angriff("Absolute Manifestation: Enraku", "Die Zanpakutō in ihrer höchsten, reinsten Feuerform.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },
  {
    id: "hyouga",
    worldId: "soul_society",
    factionIds: ["shinigami"],
    typeLabel: "Zanpakutō: Eis",
    properName: "Hyouga",
    description: "Eine Seelenwaffe, geboren aus eisiger Disziplin.",
    abilitiesByStage: [
      [angriff("Grundschnitt", "Einfacher, versiegelter Klingenhieb.")],
      [
        powerup(
          "Manifestation: Hyouga entfesselt",
          "Erste Freisetzung der Zanpakutō - die Klinge vereist. Vergleichbar mit einem ersten Release.",
          2,
          0.25,
          0.15
        ),
      ],
      [technik("Eisresonanz", "Vertiefte Verbindung zur Waffe, präzisere Eistechniken.")],
      [
        powerup(
          "Domäne: Ewiger Winter",
          "Volles Release - erschafft eine Sphäre, in der eine feste Regel herrscht (hier: Fliehen ist unmöglich). Schaltet neue Techniken frei.",
          3,
          0.4,
          0.25
        ),
        technik("Domänen-Finisher: Frostsplitter", "Neue Technik, nur innerhalb der Domäne wirkbar."),
      ],
      [angriff("Absolute Manifestation: Hyouga", "Die Zanpakutō in ihrer höchsten, reinsten Eisform.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },
  {
    id: "kazetsuki",
    worldId: "soul_society",
    factionIds: ["shinigami"],
    typeLabel: "Zanpakutō: Wind",
    properName: "Kazetsuki",
    description: "Eine Seelenwaffe, die den Wind gehorchen lässt.",
    abilitiesByStage: [
      [angriff("Grundschnitt", "Einfacher, versiegelter Klingenhieb.")],
      [
        powerup(
          "Manifestation: Kazetsuki entfesselt",
          "Erste Freisetzung der Zanpakutō - Wind umgibt die Klinge. Vergleichbar mit einem ersten Release.",
          2,
          0.25,
          0.15,
          "+Tempo-Vorteil"
        ),
      ],
      [technik("Sturmresonanz", "Vertiefte Verbindung zur Waffe, präzisere Windtechniken.")],
      [
        powerup(
          "Domäne: Wirbelfeld",
          "Volles Release - erschafft eine Sphäre, in der eine feste Regel herrscht (hier: Fernangriffe werden abgelenkt). Schaltet neue Techniken frei.",
          3,
          0.4,
          0.25
        ),
        technik("Domänen-Finisher: Schneidender Sturm", "Neue Technik, nur innerhalb der Domäne wirkbar."),
      ],
      [angriff("Absolute Manifestation: Kazetsuki", "Die Zanpakutō in ihrer höchsten, reinsten Windform.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },

  // ============ SOUL SOCIETY: HOLLOW RESURRECCIÓN ============
  // Stufen: Hollow, Gillian, Adjuchas, Vasto Lorde, Resurrección (=Transformation), Zweite Form, Unbegrenzt
  {
    id: "lobo-sombrio",
    worldId: "soul_society",
    factionIds: ["hollow"],
    typeLabel: "Resurrección: Schakal",
    properName: "Lobo Sombrío",
    description: "Entfesselt Geschwindigkeit und Raubtierinstinkt.",
    abilitiesByStage: [
      [angriff("Cero (Grundform)", "Ein Energiestrahl aus konzentriertem Hollow-Reiatsu.")],
      [technik("Gillian-Masse", "Rohe, ungerichtete Kraftentladung.")],
      [technik("Adjuchas-Bewusstsein", "Klarerer Verstand erlaubt gezieltere Angriffe.")],
      [angriff("Vasto-Lorde-Kraft", "Massiv gesteigerte körperliche Wucht.")],
      [
        powerup(
          "Resurrección: Lobo Sombrío",
          "Die Transformation in die einzigartige Form - reißende Geschwindigkeit und Instinkt.",
          2,
          0.4,
          0.3,
          "+Tempo-Vorteil"
        ),
      ],
      [angriff("Zweite Form: Rudelfrenzy", "Optionale zweite Form - eine Serie unaufhaltsamer Angriffe.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },
  {
    id: "escorpion-de-sangre",
    worldId: "soul_society",
    factionIds: ["hollow"],
    typeLabel: "Resurrección: Skorpion",
    properName: "Escorpión de Sangre",
    description: "Entfesselt Gift und gepanzerte Verteidigung.",
    abilitiesByStage: [
      [angriff("Cero (Grundform)", "Ein Energiestrahl aus konzentriertem Hollow-Reiatsu.")],
      [technik("Gillian-Masse", "Rohe, ungerichtete Kraftentladung.")],
      [technik("Adjuchas-Bewusstsein", "Klarerer Verstand erlaubt gezieltere Angriffe.")],
      [angriff("Vasto-Lorde-Kraft", "Massiv gesteigerte körperliche Wucht.")],
      [
        powerup(
          "Resurrección: Escorpión de Sangre",
          "Die Transformation in die einzigartige Form - gepanzerter Chitinkörper.",
          2,
          0.3,
          0.45
        ),
      ],
      [angriff("Zweite Form: Giftschwarm", "Optionale zweite Form - eine Welle giftiger Stachel.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },

  // ============ SOUL SOCIETY: QUINCY COMPLETE ============
  // Stufen: Einzigartige Waffe, Complete (=Transformation), Neue Fähigkeiten, Neue Formen, Unbegrenzt
  {
    id: "lichtvollender",
    worldId: "soul_society",
    factionIds: ["quincy"],
    typeLabel: "Complete: Licht",
    properName: "Lichtvollender",
    description: "Verdichtet Reishi zu reinem, durchdringendem Licht.",
    abilitiesByStage: [
      [angriff("Reishi-Bogen", "Grundlegender Pfeilschuss aus verdichtetem Reishi.")],
      [
        powerup(
          "Complete: Lichtform",
          "Die Waffe erreicht ihre vollständige Form - der Träger wird von Licht umhüllt.",
          2,
          0.35,
          0.3
        ),
      ],
      [technik("Photonenschuss", "Neue Fähigkeit - ein durchdringender Lichtstrahl.")],
      [angriff("Strahlenkranz", "Neue Form - ein Kranz aus Lichtklingen umkreist den Träger.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },
  {
    id: "stillbringer",
    worldId: "soul_society",
    factionIds: ["quincy"],
    typeLabel: "Complete: Stille",
    properName: "Stillbringer",
    description: "Verdichtet Reishi zu lautlosen, präzisen Attacken.",
    abilitiesByStage: [
      [angriff("Reishi-Bogen", "Grundlegender Pfeilschuss aus verdichtetem Reishi.")],
      [
        powerup(
          "Complete: Stilleform",
          "Die Waffe erreicht ihre vollständige Form - der Träger wird lautlos und schnell.",
          2,
          0.3,
          0.3,
          "+Tempo-Vorteil"
        ),
      ],
      [technik("Lautloser Pfeil", "Neue Fähigkeit - ein Pfeil, der nicht wahrgenommen werden kann.")],
      [angriff("Schattenkranz", "Neue Form - mehrere lautlose Pfeile gleichzeitig.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },

  // ============ AVALON: EINZIGARTIGE MAGIE ============
  // Stufen: Grundfähigkeiten, Vertiefte Technik, Erweiterte Technik, Meisterschaft (=+ Magia Erebea), Unbegrenzt
  {
    id: "raiten",
    worldId: "avalon",
    factionIds: ["magier"],
    typeLabel: "Magie: Blitz",
    properName: "Raiten",
    description: "Am Blitzgipfel erlernbare Magie.",
    abilitiesByStage: [
      [angriff("Blitzschlag", "Ein gezielter Blitzstrahl."), technik("Blitzbewegung", "Kurzzeitige Blitzgeschwindigkeit zur Fortbewegung.")],
      [technik("Raiten Hoho", "Vertiefte Bewegungstechnik mit Blitzenergie.")],
      [angriff("Raiten Sōsō", "Erweiterte Angriffstechnik - mehrere Blitze gleichzeitig.")],
      [
        powerup(
          "Magia Erebea: Blitzform",
          "Verbotene Verstärkung - der Anwender wird von Blitzmagie umhüllt und durchdrungen und nimmt alle Eigenschaften eines Blitzes an.",
          2,
          0.5,
          0.35,
          "+Tempo-Vorteil (Blitzgeschwindigkeit)"
        ),
        angriff("Blitzkaiser", "Neue, extrem starke Technik - nur in Magia Erebea wirkbar."),
      ],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },
  {
    id: "kagami-jutsu",
    worldId: "avalon",
    factionIds: ["magier"],
    typeLabel: "Magie: Illusion",
    properName: "Kagami-Jutsu",
    description: "Am Spiegelsee erlernbare Magie, die Wahrnehmung verzerrt.",
    abilitiesByStage: [
      [angriff("Trugbild", "Erschafft ein täuschendes Abbild als Angriffsablenkung."), technik("Stimmenwurf", "Wirft die eigene Stimme, um zu verwirren.")],
      [technik("Spiegelschritt", "Teleportartige Bewegung durch Spiegelillusionen.")],
      [angriff("Doppelgänger-Konstrukt", "Erschafft einen kämpfenden Doppelgänger.")],
      [
        powerup(
          "Magia Erebea: Illusionsform",
          "Verbotene Verstärkung - der Anwender verschmilzt mit der Illusion selbst, kaum noch greifbar.",
          2,
          0.4,
          0.5
        ),
        angriff("Realitätsriss", "Neue, extrem starke Technik - nur in Magia Erebea wirkbar."),
      ],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },
  {
    id: "chronos-magie",
    worldId: "avalon",
    factionIds: ["magier"],
    typeLabel: "Magie: Zeit",
    properName: "Chronos-Magie",
    description: "An den Zeitruinen erlernbare Magie, die den Zeitfluss verzerrt.",
    abilitiesByStage: [
      [angriff("Zeitlupenfeld", "Verlangsamt den Gegner spürbar."), technik("Kurzer Rückspul", "Setzt die letzten Sekunden der Bewegung zurück.")],
      [technik("Zeitsprung", "Kurzer, unvorhersehbarer Ortswechsel in der Zeit.")],
      [angriff("Zeitschleife", "Wiederholt einen Angriff mehrfach in Folge.")],
      [
        powerup(
          "Magia Erebea: Zeitform",
          "Verbotene Verstärkung - der Anwender existiert leicht außerhalb des normalen Zeitflusses.",
          2,
          0.4,
          0.4,
          "+Tempo-Vorteil (subjektive Zeitdehnung)"
        ),
        angriff("Zeitstillstand", "Neue, extrem starke Technik - nur in Magia Erebea wirkbar."),
      ],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },
];
