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
      "Welt der Seelen. Shinigami, Hollow und Quincy kämpfen um das Gleichgewicht zwischen Leben und Tod.",
    factionIds: ["shinigami", "hollow", "quincy"],
  },
  {
    id: "avalon",
    name: "Avalon",
    description:
      "Welt der Magie. Magier bewahren den Fluss der Magie und schützen alle Welten vor magischen Katastrophen.",
    factionIds: ["magier"],
  },
];
