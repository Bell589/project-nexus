import type { WorldId } from "./world.js";

export type ClanAccessMode = "character_creation" | "special_reward" | "training_unlock" | "temporary_lineage" | "disabled";

export interface RaceDefinition {
  id: string;
  worldId: WorldId;
  name: string;
  description: string;
  allowedFactionIds?: string[];
  placeholderName?: boolean;
}

export interface ClanAbilityPath {
  id: string;
  name: string;
  category: "clan_jutsu" | "dojutsu" | "curse_technique" | "divine_eye" | "divine_magic" | "passive";
  description: string;
  acquisitionMethod: "CLAN_TRAINING";
  stages: string[];
  placeholder?: boolean;
}

export interface ClanDefinition {
  id: string;
  worldId: WorldId;
  name: string;
  description: string;
  accessMode: ClanAccessMode;
  allowedRaceIds?: string[];
  allowedFactionIds?: string[];
  favoredVariants?: string[];
  abilityPaths: ClanAbilityPath[];
  placeholder?: boolean;
}

export type OrganizationType =
  | "crew" | "fleet" | "marine_unit" | "shinigami_unit" | "hollow_organization"
  | "mage_order" | "ninja_team" | "ninja_village" | "ninja_organization" | "rogue_ninja_organization";

export interface OrganizationDefinition {
  id: string;
  worldId: WorldId;
  type: OrganizationType;
  name: string;
  description: string;
  factionIds: string[];
  rankIds: string[];
}

export interface OrganizationMembership {
  organizationId: string;
  roleId: string | null;
  joinedAt: string;
}

export interface TemporaryLineageState {
  id: string;
  sourceType: "karma" | "event" | "story" | "special_reward";
  sourceId: string;
  clanId: string;
  active: boolean;
  progressPct?: number;
  grantedAbilityIds: string[];
  acquiredAt: string;
}
