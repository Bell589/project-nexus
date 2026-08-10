import type { Location } from "../types/location.js";

export const LOCATIONS: Location[] = [
  // Ozeanwelt
  { id: "insel-sturmklippe", worldId: "ozeanwelt", name: "Sturmklippe", type: "insel", description: "Umkämpfte Insel an gefährlicher Strömung.", x: 20, y: 30 },
  { id: "insel-goldbucht", worldId: "ozeanwelt", name: "Goldbucht", type: "insel", description: "Reiche Handelsinsel, oft Ziel von Kopfgeldjägern.", x: 55, y: 60 },
  { id: "marine-hq", worldId: "ozeanwelt", name: "Marine-Hauptquartier", type: "hauptquartier", description: "Sitz der Weltregierung und der Fünf Weisen.", x: 80, y: 25 },

  // Soul Society
  { id: "seelenbezirk-1", worldId: "soul_society", name: "Seelenbezirk 1", type: "seelenbezirk", description: "Kann gereinigt, verteidigt, korrumpiert oder zurückerobert werden.", x: 30, y: 40 },
  { id: "seelenbezirk-2", worldId: "soul_society", name: "Seelenbezirk 2", type: "seelenbezirk", description: "Von Hollow-Aktivität bedroht.", x: 60, y: 20 },
  { id: "seelenbezirk-3", worldId: "soul_society", name: "Seelenbezirk 3", type: "seelenbezirk", description: "Grenzgebiet mit Quincy-Präsenz.", x: 75, y: 65 },

  // Avalon
  { id: "blitzgipfel", worldId: "avalon", name: "Blitzgipfel", type: "ort_der_macht", description: "Ort der Macht — hier kann Blitzmagie erlernt werden.", x: 15, y: 20 },
  { id: "blutaltar", worldId: "avalon", name: "Blutaltar", type: "ort_der_macht", description: "Uralter Ort der Macht mit dunkler Geschichte.", x: 40, y: 75 },
  { id: "spiegelsee", worldId: "avalon", name: "Spiegelsee", type: "ort_der_macht", description: "Ort der Macht, verbunden mit Illusionsmagie.", x: 65, y: 50 },
  { id: "zeitruinen", worldId: "avalon", name: "Zeitruinen", type: "ort_der_macht", description: "Ort der Macht, verzerrter Zeitfluss.", x: 25, y: 55 },
  { id: "sternenturm", worldId: "avalon", name: "Sternenturm", type: "ort_der_macht", description: "Observatorium und Ort der Macht zugleich.", x: 80, y: 30 },
  { id: "leerenkathedrale", worldId: "avalon", name: "Leerenkathedrale", type: "ort_der_macht", description: "Ort der Macht nahe der Spektralwelt.", x: 50, y: 15 },
  { id: "arkaner-knoten-1", worldId: "avalon", name: "Ley-Linien-Knoten Nord", type: "arkaner_knoten", description: "Teil des Arkanen Netzwerks. Kontrolle stärkt die Magie der eigenen Gemeinschaft.", x: 45, y: 35 },
  { id: "arkaner-knoten-2", worldId: "avalon", name: "Ley-Linien-Knoten Süd", type: "arkaner_knoten", description: "Teil des Arkanen Netzwerks.", x: 60, y: 80 },
  { id: "arkaner-knoten-3", worldId: "avalon", name: "Ley-Linien-Knoten Ost", type: "arkaner_knoten", description: "Teil des Arkanen Netzwerks.", x: 85, y: 60 },
];
