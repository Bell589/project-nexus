import type { World } from "../types/world.js";

export const WORLDS: World[] = [
  {
    id: "ozeanwelt",
    name: "Die Ozeanwelt",
    description:
      "Welt der Piraten und der Marine. Freiheit, Politik, Territorien und Kriege stehen im Mittelpunkt.",
    factionIds: ["piraten", "marine"],
  },
  {
    id: "soul_society",
    name: "Soul Society",
    description:
      "Welt der Seelen. Shinigami und Hollow stehen im Zentrum; Zanpakutō, Fluchtechniken, Evolution und individuelle Machtpfade prägen die Progression.",
    factionIds: ["shinigami", "hollow"],
  },
  {
    id: "avalon",
    name: "Avalon",
    description:
      "Ägyptisch geprägte Magierwelt und Spektralwelt. Ein antikes Volk göttlicher Nachfahren entwickelt Magie, Blutlinien, Pakte und seltene legendäre Begegnungen.",
    factionIds: ["magier"],
  },
  {
    id: "ninja_welt",
    name: "Ninja-Welt",
    description:
      "Eine eigenständige Welt aus Ninja-Dörfern, Clans und Chakra. Bijū und Otsutsuki durchstreifen ihre Karte.",
    factionIds: ["shinobi"],
  },
];
