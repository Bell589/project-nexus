import type { Spektralritter } from "../types/spektralritter.js";

export const SPEKTRALRITTER: Spektralritter[] = [
  {
    id: "ritter-des-morgengrauens",
    name: "Ritter des Morgengrauens",
    description: "Ein Spektralritter, dessen Licht Illusionen und Täuschung durchdringt.",
    abilitiesByStage: [
      ["Lichtklinge"],
      ["Aufdeckender Schein"],
      ["Morgengrauen-Rüstung"],
      ["Teilverschmelzung: Flügel des Lichts"],
      ["Vollständige Verschmelzung: Herold der Dämmerung"],
      ["Freie Weiterentwicklung"],
    ],
  },
  {
    id: "ritter-der-tiefen-stille",
    name: "Ritter der Tiefen Stille",
    description: "Ein Spektralritter, der Geräusche und Bewegung des Gegners auslöscht.",
    abilitiesByStage: [
      ["Stillklinge"],
      ["Lautloser Schritt"],
      ["Stille-Rüstung"],
      ["Teilverschmelzung: Schatten der Stille"],
      ["Vollständige Verschmelzung: Herr der Leere"],
      ["Freie Weiterentwicklung"],
    ],
  },
  {
    id: "ritter-der-eisernen-treue",
    name: "Ritter der Eisernen Treue",
    description: "Ein Spektralritter, dessen Rüstung Verbündete schützt.",
    abilitiesByStage: [
      ["Schildschlag"],
      ["Bannkreis"],
      ["Eiserne Rüstung"],
      ["Teilverschmelzung: Wall der Treue"],
      ["Vollständige Verschmelzung: Unbeugsamer Wächter"],
      ["Freie Weiterentwicklung"],
    ],
  },
];
