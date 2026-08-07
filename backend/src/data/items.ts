import type { Item } from "../types/item.js";

export const ITEMS: Item[] = [
  {
    id: "kurzschwert",
    name: "Kurzschwert",
    slot: "waffe",
    description: "Einfache, verlässliche Klinge für den Nahkampf.",
    statBonuses: { ausruestung: 5 },
  },
  {
    id: "reliktverstaerkte-klinge",
    name: "Reliktverstärkte Klinge",
    slot: "waffe",
    description: "Klinge, die mit Relikt-Energie durchzogen ist.",
    statBonuses: { ausruestung: 15, faehigkeiten: 5 },
  },
  {
    id: "lederruestung",
    name: "Lederrüstung",
    slot: "ruestung",
    description: "Leichter Schutz, kaum Bewegungseinschränkung.",
    statBonuses: { ausruestung: 8 },
  },
  {
    id: "spektralpanzer",
    name: "Spektralpanzer",
    slot: "ruestung",
    description: "Rüstung mit Fragmenten aus der Spektralwelt.",
    statBonuses: { ausruestung: 20, training: 5 },
  },
  {
    id: "amulett-der-konzentration",
    name: "Amulett der Konzentration",
    slot: "accessoire",
    description: "Stärkt die Beherrschung der eigenen Kernmacht.",
    statBonuses: { systemBeherrschung: 10 },
  },
  {
    id: "heiltrank",
    name: "Heiltrank",
    slot: "verbrauchsgut",
    description: "Stellt Kraft nach anstrengendem Training wieder her.",
    statBonuses: { training: 5 },
  },
];
