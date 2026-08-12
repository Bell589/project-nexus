import type { Spektralritter } from "../types/spektralritter.js";
import type { Ability } from "../types/ability.js";

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

// Stufen: Vertrag, Resonanz, Rüstung (=Kraft-Teilung, Shikai-Äquivalent),
// Teilverschmelzung, Vollständige Verschmelzung (=vollständiges Erwachen), Unbegrenzt

export const SPEKTRALRITTER: Spektralritter[] = [
  {
    id: "ritter-des-morgengrauens",
    name: "Ritter des Morgengrauens",
    description: "Ein Spektralritter, dessen Licht Illusionen und Täuschung durchdringt.",
    abilitiesByStage: [
      [angriff("Lichtklinge", "Grundlegender Klingenangriff, verstärkt durch das Licht des Ritters.")],
      [technik("Aufdeckender Schein", "Deckt versteckte Schwächen des Gegners auf.")],
      [
        powerup(
          "Kraft-Teilung: Morgengrauen-Rüstung",
          "Der Magier teilt sich die Kraft des Ritters - eine erste Stufe der Verschmelzung, vergleichbar mit einem ersten Release.",
          2,
          0.3,
          0.25
        ),
        technik("Flügel des Lichts", "Neue Technik durch die geteilte Kraft - kurzer Flug und Fernangriff."),
      ],
      [angriff("Teilverschmelzung: Lichtsturm", "Verstärkter Angriff durch tiefere Verschmelzung.")],
      [
        powerup(
          "Vollständige Verschmelzung: Herold der Dämmerung",
          "Magier und Ritter werden eins - extrem starke, verheerende Fähigkeiten werden freigesetzt.",
          3,
          0.8,
          0.5,
          "+Tempo-Vorteil"
        ),
      ],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },
  {
    id: "ritter-der-tiefen-stille",
    name: "Ritter der Tiefen Stille",
    description: "Ein Spektralritter, der Geräusche und Bewegung des Gegners auslöscht.",
    abilitiesByStage: [
      [angriff("Stillklinge", "Grundlegender, lautloser Klingenangriff.")],
      [technik("Lautloser Schritt", "Bewegung ohne jedes Geräusch.")],
      [
        powerup(
          "Kraft-Teilung: Stille-Rüstung",
          "Der Magier teilt sich die Kraft des Ritters - eine erste Stufe der Verschmelzung.",
          2,
          0.25,
          0.35
        ),
        technik("Schatten der Stille", "Neue Technik durch die geteilte Kraft - kurzzeitige Unsichtbarkeit."),
      ],
      [angriff("Teilverschmelzung: Stillklingensturm", "Verstärkter Angriff durch tiefere Verschmelzung.")],
      [
        powerup(
          "Vollständige Verschmelzung: Herr der Leere",
          "Magier und Ritter werden eins - extrem starke, verheerende Fähigkeiten werden freigesetzt.",
          3,
          0.7,
          0.6
        ),
      ],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },
  {
    id: "ritter-der-eisernen-treue",
    name: "Ritter der Eisernen Treue",
    description: "Ein Spektralritter, dessen Rüstung Verbündete schützt.",
    abilitiesByStage: [
      [angriff("Schildschlag", "Wuchtiger Angriff mit dem Schild des Ritters.")],
      [technik("Bannkreis", "Errichtet einen kurzzeitigen Schutzkreis.")],
      [
        powerup(
          "Kraft-Teilung: Eiserne Rüstung",
          "Der Magier teilt sich die Kraft des Ritters - eine erste Stufe der Verschmelzung.",
          2,
          0.2,
          0.45
        ),
        technik("Wall der Treue", "Neue Technik durch die geteilte Kraft - massiver Schadensblock."),
      ],
      [angriff("Teilverschmelzung: Rammstoß", "Verstärkter Angriff durch tiefere Verschmelzung.")],
      [
        powerup(
          "Vollständige Verschmelzung: Unbeugsamer Wächter",
          "Magier und Ritter werden eins - extrem starke, verheerende Fähigkeiten werden freigesetzt.",
          3,
          0.6,
          0.7
        ),
      ],
      [technik("Freie Weiterentwicklung", "Keine feste Obergrenze mehr - neue Techniken entstehen im Spiel.")],
    ],
  },
];
