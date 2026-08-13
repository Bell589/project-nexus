import type { CorePowerArchetype } from "../types/corePowerArchetype.js";
import type { Ability } from "../types/ability.js";

// --- Hilfsfunktionen für wiederkehrende Fähigkeitsmuster ---

function angriff(name: string, description: string, opts?: Partial<Ability>): Ability {
  return { name, kind: "angriff", description, ...opts };
}
function technik(name: string, description: string, opts?: Partial<Ability>): Ability {
  return { name, kind: "technik", description, ...opts };
}
function powerup(
  name: string,
  description: string,
  rounds: number,
  damageBonusPct: number,
  incomingReductionPct: number,
  extra?: { speedNote?: string; hpBonusFlat?: number; resourceCost?: number }
): Ability {
  return {
    name,
    kind: "powerup",
    description,
    resourceCost: extra?.resourceCost,
    powerup: {
      rounds,
      damageBonusPct,
      incomingReductionPct,
      speedNote: extra?.speedNote,
      hpBonusFlat: extra?.hpBonusFlat,
    },
  };
}

export const CORE_POWER_ARCHETYPES: CorePowerArchetype[] = [
  // ============ OZEANWELT: ELEMENTAR-RELIKTE (Logia-artig) ============
  // Stufen: Relikt, Synchronisation, Resonanz, Erwachen (=Bankai-Äquivalent, dauerhafte Verwandlung), Mythische Manifestation, Unbegrenzt
  {
    id: "raiun",
    worldId: "ozeanwelt",
    factionIds: ["piraten", "marine"],
    typeLabel: "Elementar-Relikt: Blitz",
    properName: "Raiun",
    description: "Ein Relikt, durchzogen von rohem Blitz. Kann leicht das Wetter beeinflussen.",
    abilitiesByStage: [
      [angriff("Blitzschlag", "Ein scharfer Blitzstoß direkt auf den Gegner.")],
      [angriff("Blitzsprint", "Blitzschneller Nahkampfangriff aus der Bewegung.")],
      [
        technik("Donnerklinge", "Verstärkt die Waffe mit Blitzenergie für höheren Schaden."),
        technik("Gewitterwolke", "Zieht leicht Gewitterwolken heran - verschafft einen taktischen Vorteil durch schlechte Sicht für den Gegner."),
      ],
      [
        powerup(
          "Elementform: Raiun",
          "Der Träger verwandelt sich dauerhaft in reinen Blitz - deutlich mehr Kraft, Tempo und Widerstandsfähigkeit. Das Gegenstück zum Bankai für Relikte. Schaltet neue Techniken frei.",
          3,
          0.35,
          0.5,
          { speedNote: "+Tempo-Vorteil (Blitzgeschwindigkeit)", hpBonusFlat: 25 }
        ),
        angriff("Entladungssturm", "Nur in Elementform wirkbar - eine Kettenreaktion aus Blitzen.", {
          requiresActivePowerup: "Elementform: Raiun",
        }),
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
    description: "Ein Relikt, das brennende Entschlossenheit in physische Macht verwandelt. Kann leicht das Wetter beeinflussen.",
    abilitiesByStage: [
      [angriff("Feuerstoß", "Ein Stoß konzentrierter Flammen.")],
      [angriff("Flammensprint", "Rascher Angriff, von Flammen angetrieben.")],
      [
        technik("Aschewirbel", "Wirbelnde Glut, die Fläche und Sicht des Gegners einschränkt."),
        technik("Hitzewelle", "Erhitzt die umgebende Luft leicht - verschafft einen taktischen Vorteil, indem der Gegner ermüdet."),
      ],
      [
        powerup(
          "Elementform: Enja",
          "Der Träger verwandelt sich dauerhaft in reines Feuer - deutlich mehr Kraft, Tempo und Widerstandsfähigkeit. Das Gegenstück zum Bankai für Relikte. Schaltet neue Techniken frei.",
          3,
          0.35,
          0.5,
          { hpBonusFlat: 25 }
        ),
        angriff("Feuersbrunst", "Nur in Elementform wirkbar - eine alles verzehrende Flammenwoge.", {
          requiresActivePowerup: "Elementform: Enja",
        }),
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
          "Vollständige, dauerhafte Verwandlung in den Drachen - mehr Leben, Kraft und Tempo als die Mensch-Form.",
          4,
          0.3,
          0.3,
          { hpBonusFlat: 20 }
        ),
      ],
      [
        powerup(
          "Hybrid-Form: Long",
          "Verschmelzung von Mensch und Drache - das Gegenstück zum Bankai. Volle Kontrolle bei maximaler Kraft, deutlich mehr Leben, Tempo und Stärke. Schaltet neue Techniken frei.",
          4,
          0.55,
          0.45,
          { speedNote: "+Tempo-Vorteil (Flug)", hpBonusFlat: 35 }
        ),
        angriff("Drachenzorn", "Nur in Hybrid-Form wirkbar - ein verheerender Klauenhieb mit Feueratem kombiniert.", {
          requiresActivePowerup: "Hybrid-Form: Long",
        }),
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
          "Vollständige, dauerhafte Verwandlung in den Feuervogel - mehr Leben, Kraft und Tempo als die Mensch-Form.",
          4,
          0.3,
          0.3,
          { hpBonusFlat: 20 }
        ),
      ],
      [
        powerup(
          "Hybrid-Form: Suzaku",
          "Verschmelzung von Mensch und Phönix - das Gegenstück zum Bankai. Schaltet neue Techniken frei.",
          4,
          0.55,
          0.45,
          { speedNote: "+Tempo-Vorteil (Flug)", hpBonusFlat: 35 }
        ),
        angriff("Aschewiedergeburt-Sturm", "Nur in Hybrid-Form wirkbar - Heilung und Flächenangriff zugleich.", {
          requiresActivePowerup: "Hybrid-Form: Suzaku",
        }),
      ],
      [angriff("Ewige Flamme", "Verheerende Feuersäule in der Hybrid-Form.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },

  // ============ OZEANWELT: ÜBERMENSCHLICHE RELIKTE (Paramecia-artig) ============
  // Keine Verwandlung als Powerup - extrem starke Finisher, wirken auch auf anorganische Gegenstände.
  {
    id: "kalypso",
    worldId: "ozeanwelt",
    factionIds: ["piraten", "marine"],
    typeLabel: "Übermenschliches Relikt: Schwerkraft",
    properName: "Kalypso",
    description:
      "Ein Relikt, das die Schwerkraft manipuliert - nicht nur am eigenen Körper, sondern auch an anorganischen Gegenständen im Umfeld.",
    abilitiesByStage: [
      [angriff("Schweredruck", "Erhöht lokal die Schwerkraft und drückt den Gegner nieder.")],
      [technik("Schwerelosigkeit", "Hebt kurzzeitig die Schwerkraft um sich selbst auf.")],
      [technik("Objektbindung", "Hebt Gegenstände in der Umgebung an und schleudert sie als Waffen.")],
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
    description:
      "Ein Relikt, das unsichtbare Ketten aus reiner Energie erschafft - auch um anorganische Gegenstände zu binden und zu kontrollieren.",
    abilitiesByStage: [
      [angriff("Kettenschlag", "Peitschenartiger Schlag aus Energieketten.")],
      [technik("Fesselgriff", "Bindet die Bewegung des Gegners kurzzeitig.")],
      [technik("Materiefesseln", "Bindet Gegenstände in der Umgebung und lenkt sie als Geschosse um.")],
      [angriff("Erwachen: Kettensturm", "Das Gegenstück zum Bankai - ein Sturm aus tausend Ketten.")],
      [angriff("Verurteilung von Aetherion", "Krasser Finisher: alle Ketten schließen sich gleichzeitig um den Gegner.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },

  // ============ SOUL SOCIETY: SHINIGAMI-SEELENWAFFEN (Zanpakutō) ============
  // Stufen: Versiegelt, Manifestation (=erste Freisetzung), Resonanz, Domäne (=höchste Form/volles Release), Domänen-Meisterschaft (nur noch Domänen-Techniken), Unbegrenzt
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
          3,
          0.25,
          0.2
        ),
      ],
      [technik("Flammenresonanz", "Vertiefte Verbindung zur Waffe, präzisere Feuertechniken.")],
      [
        powerup(
          "Domäne: Aschefeld",
          "Die höchste Form der Zanpakutō - erschafft eine Sphäre, in der eine feste Regel herrscht (hier: alle Heileffekte sind deaktiviert). Danach folgen nur noch weitere Techniken für diese Domäne, keine erneute Freisetzung.",
          3,
          0.45,
          0.35,
          { hpBonusFlat: 20 }
        ),
        technik("Domänen-Finisher: Ascheklinge", "Nur innerhalb der Domäne wirkbar - durchschneidet jede Deckung.", {
          requiresActivePowerup: "Domäne: Aschefeld",
        }),
      ],
      [
        angriff("Domänen-Technik: Vulkanausbruch", "Weitere, noch stärkere Technik innerhalb der bereits aktiven Domäne - keine neue Freisetzung.", {
          requiresActivePowerup: "Domäne: Aschefeld",
        }),
      ],
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
          3,
          0.25,
          0.2
        ),
      ],
      [technik("Eisresonanz", "Vertiefte Verbindung zur Waffe, präzisere Eistechniken.")],
      [
        powerup(
          "Domäne: Ewiger Winter",
          "Die höchste Form der Zanpakutō - erschafft eine Sphäre, in der eine feste Regel herrscht (hier: Fliehen ist unmöglich). Danach folgen nur noch weitere Techniken für diese Domäne.",
          3,
          0.45,
          0.35,
          { hpBonusFlat: 20 }
        ),
        technik("Domänen-Finisher: Frostsplitter", "Nur innerhalb der Domäne wirkbar.", {
          requiresActivePowerup: "Domäne: Ewiger Winter",
        }),
      ],
      [
        angriff("Domänen-Technik: Gletschersturz", "Weitere, noch stärkere Technik innerhalb der bereits aktiven Domäne - keine neue Freisetzung.", {
          requiresActivePowerup: "Domäne: Ewiger Winter",
        }),
      ],
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
          3,
          0.25,
          0.2,
          { speedNote: "+Tempo-Vorteil" }
        ),
      ],
      [technik("Sturmresonanz", "Vertiefte Verbindung zur Waffe, präzisere Windtechniken.")],
      [
        powerup(
          "Domäne: Wirbelfeld",
          "Die höchste Form der Zanpakutō - erschafft eine Sphäre, in der eine feste Regel herrscht (hier: Fernangriffe werden abgelenkt). Danach folgen nur noch weitere Techniken für diese Domäne.",
          3,
          0.45,
          0.35,
          { hpBonusFlat: 20 }
        ),
        technik("Domänen-Finisher: Schneidender Sturm", "Nur innerhalb der Domäne wirkbar.", {
          requiresActivePowerup: "Domäne: Wirbelfeld",
        }),
      ],
      [
        angriff("Domänen-Technik: Tornadowand", "Weitere, noch stärkere Technik innerhalb der bereits aktiven Domäne - keine neue Freisetzung.", {
          requiresActivePowerup: "Domäne: Wirbelfeld",
        }),
      ],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },

  // ============ SOUL SOCIETY: HOLLOW RESURRECCIÓN ============
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
          "Die dauerhafte Transformation in die einzigartige Form - reißende Geschwindigkeit und Instinkt, mehr Leben.",
          4,
          0.4,
          0.35,
          { speedNote: "+Tempo-Vorteil", hpBonusFlat: 30 }
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
          "Die dauerhafte Transformation in die einzigartige Form - gepanzerter Chitinkörper, mehr Leben.",
          4,
          0.3,
          0.5,
          { hpBonusFlat: 35 }
        ),
      ],
      [angriff("Zweite Form: Giftschwarm", "Optionale zweite Form - eine Welle giftiger Stachel.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },

  // ============ SOUL SOCIETY: QUINCY COMPLETE ============
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
          "Die Waffe erreicht ihre vollständige, dauerhafte Form - der Träger wird von Licht umhüllt, mehr Leben.",
          4,
          0.35,
          0.35,
          { hpBonusFlat: 25 }
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
          "Die Waffe erreicht ihre vollständige, dauerhafte Form - der Träger wird lautlos und schnell, mehr Leben.",
          4,
          0.3,
          0.35,
          { speedNote: "+Tempo-Vorteil", hpBonusFlat: 25 }
        ),
      ],
      [technik("Lautloser Pfeil", "Neue Fähigkeit - ein Pfeil, der nicht wahrgenommen werden kann.")],
      [angriff("Schattenkranz", "Neue Form - mehrere lautlose Pfeile gleichzeitig.")],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },

  // ============ AVALON: EINZIGARTIGE MAGIE ============
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
          3,
          0.5,
          0.4,
          { speedNote: "+Tempo-Vorteil (Blitzgeschwindigkeit)", hpBonusFlat: 20 }
        ),
        angriff("Blitzkaiser", "Neue, extrem starke Technik - nur in Magia Erebea wirkbar.", {
          requiresActivePowerup: "Magia Erebea: Blitzform",
        }),
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
          3,
          0.4,
          0.55,
          { hpBonusFlat: 15 }
        ),
        angriff("Realitätsriss", "Neue, extrem starke Technik - nur in Magia Erebea wirkbar.", {
          requiresActivePowerup: "Magia Erebea: Illusionsform",
        }),
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
          3,
          0.4,
          0.45,
          { speedNote: "+Tempo-Vorteil (subjektive Zeitdehnung)", hpBonusFlat: 20 }
        ),
        angriff("Zeitstillstand", "Neue, extrem starke Technik - nur in Magia Erebea wirkbar.", {
          requiresActivePowerup: "Magia Erebea: Zeitform",
        }),
      ],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },
];
