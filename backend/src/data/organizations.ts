import type { OrganizationDefinition } from "../types/affiliation.js";

export const ORGANIZATION_DEFINITIONS: OrganizationDefinition[] = [
  { id: "org-type-pirate-crew", worldId: "ozeanwelt", type: "crew", name: "Piraten-Crew", description: "Spielergeführte Piratenbande.", factionIds: ["piraten"], rankIds: ["vice-captain", "captain"] },
  { id: "org-type-pirate-fleet", worldId: "ozeanwelt", type: "fleet", name: "Piraten-Flotte", description: "Zusammenschluss mehrerer Crews.", factionIds: ["piraten"], rankIds: [] },
  { id: "org-type-marine-unit", worldId: "ozeanwelt", type: "marine_unit", name: "Marine-Einheit", description: "Spielergeführte Marine-Einheit.", factionIds: ["marine"], rankIds: ["vice-captain", "captain", "vice-admiral", "admiral"] },
  { id: "org-type-shinigami-unit", worldId: "soul_society", type: "shinigami_unit", name: "Shinigami-Einheit", description: "Einheit der Shinigami.", factionIds: ["shinigami"], rankIds: ["vice-captain", "captain"] },
  { id: "org-type-hollow", worldId: "soul_society", type: "hollow_organization", name: "Hollow-Organisation", description: "Flexible Grundlage für eine spätere Hollow-Hierarchie.", factionIds: ["hollow"], rankIds: ["espada"] },
  { id: "org-type-mage-order", worldId: "avalon", type: "mage_order", name: "Magierorden", description: "Orden der Magierwelt.", factionIds: ["magier"], rankIds: [] },
  { id: "org-type-ninja-team", worldId: "ninja_welt", type: "ninja_team", name: "Ninja-Team", description: "Kleine Ninja-Einheit.", factionIds: ["shinobi"], rankIds: [] },
  { id: "org-type-ninja-village", worldId: "ninja_welt", type: "ninja_village", name: "Ninja-Dorf", description: "Politische und militärische Dorforganisation.", factionIds: ["shinobi"], rankIds: ["kage"] },
  { id: "org-type-ninja-large", worldId: "ninja_welt", type: "ninja_organization", name: "Ninja-Organisation", description: "Größere Ninja-Organisation.", factionIds: ["shinobi"], rankIds: [] },
  { id: "org-type-rogue-ninja", worldId: "ninja_welt", type: "rogue_ninja_organization", name: "Abtrünnige Ninja", description: "Organisation abtrünniger Ninja; Gefahrenrang wird separat geführt.", factionIds: ["shinobi"], rankIds: ["danger-d", "danger-c", "danger-b", "danger-a", "danger-s"] },
];
