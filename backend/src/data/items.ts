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
    statBonuses: {},
    price: 80,
    category: "healing",
    healHp: 40,
  },

  // --- Ninja-Waffen ---
  {
    id: "kunai",
    name: "Kunai",
    slot: "waffe",
    description: "Vielseitiges Wurfmesser, Standardausrüstung jedes Shinobi.",
    statBonuses: { ausruestung: 6 },
  },
  {
    id: "shuriken-set",
    name: "Shuriken-Set",
    slot: "waffe",
    description: "Ein Set scharfer Wurfsterne für Fernangriffe.",
    statBonuses: { ausruestung: 5, faehigkeiten: 3 },
  },
  {
    id: "ninja-schwert",
    name: "Ninja-Schwert",
    slot: "waffe",
    description: "Ein leichtes, gebogenes Schwert für schnelle Schnitte.",
    statBonuses: { ausruestung: 12 },
  },
  {
    id: "kriegssense",
    name: "Kriegssense",
    slot: "waffe",
    description: "Schwere Sense, ungewöhnlich aber verheerend im Nahkampf.",
    statBonuses: { ausruestung: 18, training: -3 },
  },
  {
    id: "energie-essenz", name: "Energie-Essenz", slot: "verbrauchsgut",
    description: "Stellt einen Teil der weltabhängigen Kampfenergie wieder her.", statBonuses: {}, price: 90,
    category: "energy", restoreEnergy: 40,
  },
];
