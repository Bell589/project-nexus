import type { Location } from "../types/location.js";

export const LOCATIONS: Location[] = [
  // Ozeanwelt
  { id: "insel-sturmklippe", worldId: "ozeanwelt", name: "Sturmklippe", type: "insel", description: "Umkämpfte Insel an gefährlicher Strömung." },
  { id: "insel-goldbucht", worldId: "ozeanwelt", name: "Goldbucht", type: "insel", description: "Reiche Handelsinsel, oft Ziel von Kopfgeldjägern." },
  { id: "marine-hq", worldId: "ozeanwelt", name: "Marine-Hauptquartier", type: "hauptquartier", description: "Sitz der Weltregierung und der Fünf Weisen." },

  // Soul Society
  { id: "seelenbezirk-1", worldId: "soul_society", name: "Seelenbezirk 1", type: "seelenbezirk", description: "Kann gereinigt, verteidigt, korrumpiert oder zurückerobert werden." },
  { id: "seelenbezirk-2", worldId: "soul_society", name: "Seelenbezirk 2", type: "seelenbezirk", description: "Von Hollow-Aktivität bedroht." },
  { id: "seelenbezirk-3", worldId: "soul_society", name: "Seelenbezirk 3", type: "seelenbezirk", description: "Grenzgebiet mit Quincy-Präsenz." },

  // Avalon
  { id: "blitzgipfel", worldId: "avalon", name: "Blitzgipfel", type: "ort_der_macht", description: "Ort der Macht — hier kann Blitzmagie erlernt werden." },
  { id: "blutaltar", worldId: "avalon", name: "Blutaltar", type: "ort_der_macht", description: "Uralter Ort der Macht mit dunkler Geschichte." },
  { id: "spiegelsee", worldId: "avalon", name: "Spiegelsee", type: "ort_der_macht", description: "Ort der Macht, verbunden mit Illusionsmagie." },
  { id: "zeitruinen", worldId: "avalon", name: "Zeitruinen", type: "ort_der_macht", description: "Ort der Macht, verzerrter Zeitfluss." },
  { id: "sternenturm", worldId: "avalon", name: "Sternenturm", type: "ort_der_macht", description: "Observatorium und Ort der Macht zugleich." },
  { id: "leerenkathedrale", worldId: "avalon", name: "Leerenkathedrale", type: "ort_der_macht", description: "Ort der Macht nahe der Spektralwelt." },
  { id: "arkaner-knoten-1", worldId: "avalon", name: "Ley-Linien-Knoten Nord", type: "arkaner_knoten", description: "Teil des Arkanen Netzwerks." },
];
