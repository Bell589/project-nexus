export type WorldId = "ozeanwelt" | "soul_society" | "avalon" | "ninja_welt";

export interface Account { id: string; username: string; displayName: string; createdAt: string; }

export interface World {
  id: WorldId;
  name: string;
  description: string;
  factionIds: string[];
}

export interface Faction {
  id: string;
  worldId: WorldId;
  name: string;
  description: string;
  playerAssignedRanks: string[];
  baseSkills: string[];
  corePowerLabel: string;
  corePowerStages: string[];
}


export interface RaceDefinition { id: string; worldId: WorldId; name: string; description: string; allowedFactionIds?: string[]; placeholderName?: boolean; }
export interface ClanAbilityPath { id: string; name: string; category: string; description: string; acquisitionMethod: "CLAN_TRAINING"; stages: string[]; placeholder?: boolean; }
export interface ClanDefinition { id: string; worldId: WorldId; name: string; description: string; accessMode: string; allowedRaceIds?: string[]; allowedFactionIds?: string[]; favoredVariants?: string[]; abilityPaths: ClanAbilityPath[]; placeholder?: boolean; }

export interface Character {
  id: string;
  ownerId: string | null;
  ownerName: string;
  characterName: string;
  worldId: WorldId;
  raceId: string;
  clanId: string | null;
  factionId: string;
  organizationMemberships: { organizationId: string; roleId: string | null; joinedAt: string }[];
  rankTitles: string[];
  temporaryLineages: { id: string; sourceType: string; sourceId: string; clanId: string; active: boolean; progressPct?: number; grantedAbilityIds: string[]; acquiredAt: string }[];
  abilityProgress: { abilityId: string; sourceType: string; sourceId: string; acquisitionMethod: string; stageIndex: number; unlockedStageIds: string[]; active: boolean; developmentLog: string[]; mastery?: number }[];
  pacts: { id: string; kind: string; worldId: WorldId; entityId: string; entityName: string; status: string; stageIndex: number; abilityIds: string[]; formedAt: string | null; developmentLog: string[]; mastery?: number }[];
  stats: { kraft:number; verteidigung:number; lp:number; geschwindigkeit:number; genauigkeit:number; power:number };
  energy: { current:number; max:number; label:string };
  currentHp: number;
  maxHp: number;
  skillPoints: number;
  statPoints: number;
  gold: number;
  currentLocationId: string | null;
  origin: { originId:string; status:"not_started"|"in_progress"|"completed"; stepIndex:number; completedStepIds:string[] };
  wanted: { value:number; dangerRank:string|null; reasons:string[] };
  kampfkraftComponents: {
    erfahrung: number;
    ausruestung: number;
    faehigkeiten: number;
    systemBeherrschung: number;
    erfolge: number;
    training: number;
  };
  uniquePower: {
    originId: string;
    category: string;
    variant: string;
    generatedName: string;
    stageIndex: number;
    individualAbilities: Ability[];
    developmentLog: string[];
  } | null;
  selfAssignedRank: string | null;
  crewId: string | null;
  inventory: { itemId: string; quantity: number }[];
  equipped: { waffe: string | null; ruestung: string | null; accessoire: string | null };
  skills: { name: string; level: number }[];
  completedMissionIds: string[];
  activeDomainRuleId: string | null;
  fusedInto: string | null;
  spektralritterPact: UniquePowerInstance | null;
  doujutsu: UniquePowerInstance | null;
  dojutsuState: {definitionId:"sharingan"|"byakugan";name:string;awakened:boolean;stageIndex:number;mastery:number;activeOutsideCombat:boolean;personalAbilityIds:string[];developmentLog:string[]} | null;
  ninjaTechniques: {techniqueId:string;mastery:number;learned:boolean;analysisPct:number;seenCount:number;copied:boolean}[];
  chakraNatures: string[];
  esperPact: { esperId: string; esperName: string; stageIndex: number; individualAbilities: Ability[]; developmentLog: string[] } | null;
  jinchuriki: { bijuuId: string; bijuuName: string; stageIndex: number; individualAbilities: Ability[]; developmentLog: string[] } | null;
  karmaStates: { otsutsukiId: string; progressPct: number; active: boolean; lineageId: string; unlockedAbilityIds: string[]; developmentLog: string[]; mastery?: number }[];
  karmaPct: number;
  defeatedOtsutsukiIds: string[];
  createdAt: string;
  kampfkraft?: number;
}

export interface UniquePowerInstance {
  originId: string;
  category: string;
  variant: string;
  generatedName: string;
  stageIndex: number;
  individualAbilities: Ability[];
  developmentLog: string[];
}

export interface UniquePowerOrigin {
  id: string;
  worldId: WorldId;
  factionIds: string[];
  category: string;
  variantPool: string[];
  namePrefixPool: string[];
  nameSuffixPool: string[];
  description: string;
  stageDefinitions: { name: string; tier: string; abilityCount: number; isPowerupStage: boolean }[];
  abilityPool: (Ability & { tier: string; variant?: string })[];
}

export interface Spektralritter {
  id: string;
  name: string;
  description: string;
  abilitiesByStage: Ability[][];
}

export type AbilityKind = "angriff" | "technik" | "powerup";

export interface PowerupEffect {
  rounds: number;
  damageBonusPct: number;
  incomingReductionPct: number;
  speedNote?: string;
}

export interface Ability {
  name: string;
  kind: AbilityKind;
  description: string;
  powerup?: PowerupEffect;
  resourceCost?: number;
  requiresActivePowerup?: string;
  baseEnergyCost?: number; scalable?: boolean; scalingType?: string; scalingConfig?: Record<string,number>;
  maximumControlledInvestment?: number; masteryRequirement?: number; requiredStateId?: string;
}

export interface ActivePowerup {
  name: string;
  roundsRemaining: number;
  damageBonusPct: number;
  incomingReductionPct: number;
  upkeepCost?: number;
}

export type ItemSlot = "waffe" | "ruestung" | "accessoire";

export interface Item {
  id: string;
  name: string;
  slot: ItemSlot | "verbrauchsgut";
  description: string;
  statBonuses: Record<string, number>;
  price?: number; tradeable?: boolean; marketplaceAllowed?: boolean; bound?: boolean; unique?: boolean;
  organizationStorageAllowed?: boolean; worldId?: string; rarity?: string; category?: string; healHp?: number; restoreEnergy?: number;
}

export interface GameLocation {
  id: string;
  worldId: WorldId;
  name: string;
  type: string;
  description: string;
  x: number;
  y: number;
}

export interface Mission {
  id: string;
  worldId: WorldId;
  title: string;
  description: string;
  minKampfkraft: number;
  rewardComponents: Record<string, number>;
  rewardItemId?: string;
  rewardGold?: number;
  requiredLocationId?: string; factionIds?: string[];
}

export interface Enemy {
  id: string;
  worldId: WorldId;
  name: string;
  description: string;
  kampfkraft: number;
  rewardComponents: Record<string, number>;
}

export type CombatAction = "angriff" | "verteidigung" | "spezialfaehigkeit" | "flucht" | "grundfertigkeit" | "ritter_beschwoeren" | "ausweichen" | "dojutsu_aktivieren" | "jutsu" | "item" | "powerup_deaktivieren" | "clan_power_aktivieren" | "ritter_angriff" | "ritter_technik" | "ritter_teilfusion" | "ritter_vollfusion";
export type CombatStatus = "laufend" | "gewonnen" | "verloren" | "geflohen";

export interface CombatRoundLog {
  round: number;
  characterAction: CombatAction;
  enemyAction: CombatAction;
  damageToEnemy: number;
  damageToCharacter: number;
  abilityUsed: string | null;
  note: string;
}

export interface CombatSession {
  id: string;
  characterId: string;
  enemyId: string;
  characterHp: number;
  characterMaxHp: number;
  enemyHp: number;
  enemyMaxHp: number;
  resourceLabel: string;
  characterResource: number;
  characterResourceMax: number;
  round: number;
  status: CombatStatus;
  log: CombatRoundLog[];
  activePowerup: ActivePowerup | null;
  ritterSummoned?: boolean; ritterHp?: number; ritterMaxHp?: number; ritterEnergy?: number; ritterEnergyMax?: number; ritterDefeated?: boolean; ritterFusionMode?: "partial"|"full"|null;
  activeDojutsu?: {id:string;name:string;stageIndex:number;upkeepCost:number}|null;
  dodgePrepared?: boolean; enemyAccuracyDebuffRounds?: number;
  createdAt: string;
}

export interface DomainRule {
  id: string;
  name: string;
  description: string;
}

export type CrewRole = "Captain" | "Offizier" | "Kommandant" | "Stellvertreter" | "Mitglied";

export interface CrewMember {
  characterId: string;
  role: CrewRole;
}

export interface Crew {
  id: string;
  name: string;
  worldId: "ozeanwelt";
  factionId: "piraten" | "marine";
  members: CrewMember[];
  fleetId: string | null;
  createdAt: string;
}

export interface Fleet {
  id: string;
  name: string;
  worldId: "ozeanwelt";
  memberCrewIds: string[];
  createdAt: string;
}


export interface OrganizationDefinition { id: string; worldId: WorldId; type: string; name: string; description: string; factionIds: string[]; rankIds: string[]; }
export interface MasterTrainerDefinition { id: string; worldId: WorldId; name: string; description: string; possibleLocationIds: string[]; spawnChance: number | null; abilityIds: string[]; requirements: { minKampfkraft?: number; requiredItemIds?: string[]; requiredMissionIds?: string[]; clanIds?: string[]; factionIds?: string[] }; placeholder?: boolean; }
export interface DiscoveryDefinition { id: string; worldId: WorldId; targetType: string; targetId: string; acquisitionMethod: string; hiddenLocationIds: string[]; discoveryHints: string[]; requiredConditions: string[]; rarity: string; uniqueOwnership: boolean; spawnRule: string; }
export interface WorldEncounterDefinition { id: string; worldId: WorldId; entityType: string; entityId: string; possibleLocationIds: string[]; rarity: string; spawnChance: number | null; spawnConditions: string[]; despawnConditions: string[]; respawnRule: string; globalAnnouncement: boolean; uniqueOwnershipRule: string; }
export interface ActiveWorldEncounter { definitionId: string; activeLocationId: string; spawnedAt: string; participantCharacterIds: string[]; }
export interface RegionControl { locationId: string; rulerCharacterId: string | null; rulerPresent: boolean; siegeProgress: number; defenderCharacterIds: string[]; eventLog: { timestamp: string; message: string }[]; }
export interface RegionEntry { location: GameLocation; control: RegionControl; }
export type VillageRank = "Genin" | "Chūnin" | "Jōnin" | "Kage";
export interface Village { id: string; name: string; kageTitle: string; members: { characterId: string; rank: VillageRank }[]; createdAt: string; }
export interface WorldCrystal { id: string; worldId: WorldId; name: string; stability: number; connectedCrystalIds: string[]; }
export interface LegendaryEntity { id: string; name: string; description?: string; [key: string]: unknown; }

export interface QuizQuestion { id: string; question: string; options: { label: string }[]; }

export interface OriginDefinition { id:string; worldId:WorldId; raceIds:string[]; factionIds?:string[]; name:string; description:string; steps:{id:string;title:string;description:string;rewardStatPoints?:number;rewardSkillPoints?:number;rewardGold?:number}[]; }
export interface TravelResult { characterId:string; fromLocationId:string|null; toLocationId:string; encounter:{kind:"enemy"|"trainer"|"event"|"none";id?:string;message:string}; }
export interface MarketplaceListing { id:string;sellerCharacterId:string;itemId:string;quantity:number;pricePerItem:number;createdAt:string; }
export interface PlayerOrganization { id:string;worldId:WorldId;type:string;name:string;founderCharacterId:string;leaderCharacterId:string;viceLeaderCharacterId:string|null;members:{characterId:string;role:string;permissions:string[]}[];treasuryGold:number;storage:{itemId:string;quantity:number}[];diplomacy:{organizationId:string;state:string}[];createdAt:string; }

export interface NinjaTrainingEntry { id:string;name:string;description:string;category:string;element?:string;baseCost:number;copyable:boolean;trainable:boolean;state:{techniqueId:string;mastery:number;learned:boolean;analysisPct:number;seenCount:number;copied:boolean};available:boolean;lockedReason:string|null;requiredStateId?:string;requiredDojutsuStage?:number;}
