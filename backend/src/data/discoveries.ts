import type { DiscoveryDefinition } from "../types/discovery.js";

export const DISCOVERIES: DiscoveryDefinition[] = [
  { id: "discovery-ocean-relics", worldId: "ozeanwelt", targetType: "relic", targetId: "relic-pool", acquisitionMethod: "SEARCH", hiddenLocationIds: [], discoveryHints: ["NPCs", "Gerüchte", "Bücher", "Ruinen", "Quests"], requiredConditions: [], rarity: "legendary", uniqueOwnership: true, spawnRule: "dynamic" },
  { id: "discovery-hollow-resurreccion", worldId: "soul_society", targetType: "resurreccion_path", targetId: "resurreccion-path", acquisitionMethod: "SEARCH", hiddenLocationIds: [], discoveryHints: ["Weltinformationen", "Begegnungen", "Story-Hinweise"], requiredConditions: [], rarity: "rare", uniqueOwnership: false, spawnRule: "manual_tuning_pending" },
  { id: "discovery-ancient-magic", worldId: "avalon", targetType: "ancient_magic", targetId: "ancient-magic-pool", acquisitionMethod: "SEARCH", hiddenLocationIds: [], discoveryHints: ["Bücher", "Schriftrollen", "Ruinen", "Tempel", "Weltinformationen"], requiredConditions: [], rarity: "legendary", uniqueOwnership: false, spawnRule: "dynamic" },
];
